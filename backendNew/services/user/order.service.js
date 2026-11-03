import { prisma } from "../../config/prisma.js";
import ErrorWithStatus from "../../config/ErrorWithStatus.js";
import { HTTP_RES } from "../../utils/CONSTANTS.js";

export const createOrderService = async (currentUserEmail, orderData) => {
    // 1. Resolve User
    const user = await prisma.user.findUnique({
        where: { email: currentUserEmail },
    });
    if (!user) {
        throw new ErrorWithStatus("User not authenticated", HTTP_RES.UNAUTHORIZED);
    }

    // 2. Resolve Shipping Address
    let addressId = orderData.shipping_address_id;
    if (!addressId) {
        // Look for user's existing address or create a default one
        const existingAddress = await prisma.address.findFirst({
            where: { user_id: user.id },
            orderBy: { is_primary: "desc" },
        });

        if (existingAddress) {
            addressId = existingAddress.id;
        } else {
            const ship = orderData.shipping_address || {};
            const newAddress = await prisma.address.create({
                data: {
                    user_id:      user.id,
                    first_name:   ship.name?.split(" ")[0] || user.first_name || "Customer",
                    last_name:    ship.name?.split(" ")[1] || user.last_name || "Name",
                    phone:        ship.phone || user.phone || "+91 9999999999",
                    address:      ship.addressLine1 || ship.address || "123 Toy Street",
                    place:        ship.city || "Bangalore",
                    pincode:      ship.pin || ship.pincode || "560001",
                    state:        ship.state || "Karnataka",
                    address_type: ship.type || "Home",
                    is_primary:   true,
                },
            });
            addressId = newAddress.id;
        }
    }

    // 3. Process Order Items & Calculate Totals
    const itemDetails = [];
    let subtotal = 0;

    for (const item of orderData.order_items) {
        const pId = item.product_id || item.id || item.variant_id;
        const qty = Number(item.quantity) || 1;

        // Try finding Product directly
        let product = await prisma.product.findUnique({ where: { id: pId } });

        // If not product, try finding by variant
        let variant = null;
        if (!product) {
            variant = await prisma.productVariant.findUnique({
                where:   { id: pId },
                include: { product: true },
            });
            if (variant) {
                product = variant.product;
            }
        }

        if (!product || !product.is_active || product.deletedAt) {
            throw new ErrorWithStatus(`Product ${pId} not available`, HTTP_RES.BAD_REQUEST);
        }

        const effectivePrice = product.sellingPrice ?? product.price;
        const lineTotal = effectivePrice * qty;
        subtotal += lineTotal;

        const rawImages = Array.isArray(product.images) ? product.images : [];
        const firstImg = rawImages[0];
        const imageUrl = typeof firstImg === "string" ? firstImg : firstImg?.url || "";

        itemDetails.push({
            productId:    product.id,
            variantId:    variant?.id || null,
            productName:  product.name,
            productImage: imageUrl,
            price:        effectivePrice,
            quantity:     qty,
            total:        lineTotal,
        });
    }

    // 4. Validate Coupon
    let couponRecord = null;
    let discountAmount = 0;
    if (orderData.coupon_code) {
        const coupon = await prisma.coupon.findUnique({
            where: { code: orderData.coupon_code.trim().toUpperCase() },
        });

        if (coupon && coupon.is_active && new Date(coupon.valid_until) > new Date()) {
            if (subtotal >= coupon.min_order_amount) {
                if (coupon.type === "PERCENTAGE") {
                    discountAmount = (subtotal * coupon.value) / 100;
                    if (coupon.max_discount) {
                        discountAmount = Math.min(discountAmount, coupon.max_discount);
                    }
                } else {
                    discountAmount = coupon.value;
                }
                couponRecord = coupon;
            }
        }
    }

    const deliveryFee = subtotal >= 1000 ? 0 : 50;
    const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

    // Normalize payment method to enum (COD, RAZORPAY, WALLET)
    let paymentMethodEnum = "COD";
    if (orderData.payment_method === "WALLET") paymentMethodEnum = "WALLET";
    else if (["RAZORPAY", "UPI", "CARD", "ONLINE"].includes(orderData.payment_method?.toUpperCase())) {
        paymentMethodEnum = "RAZORPAY";
    }

    // 5. Execute Order Placement in Atomic Transaction
    const newOrder = await prisma.$transaction(async (tx) => {
        // If WALLET payment, verify and deduct balance
        if (paymentMethodEnum === "WALLET") {
            const wallet = await tx.wallet.findUnique({ where: { user_id: user.id } });
            if (!wallet || wallet.balance < finalTotal) {
                throw new ErrorWithStatus("Insufficient wallet balance", HTTP_RES.BAD_REQUEST);
            }
            await tx.wallet.update({
                where: { user_id: user.id },
                data:  { balance: wallet.balance - finalTotal },
            });
            await tx.transaction.create({
                data: {
                    wallet_id:    wallet.id,
                    type:         "DEBIT",
                    reason:       "ORDER_PAYMENT",
                    amount:       finalTotal,
                    balanceAfter: wallet.balance - finalTotal,
                    description:  `Payment for order`,
                },
            });
        }

        // Deduct product stock
        for (const item of itemDetails) {
            await tx.product.update({
                where: { id: item.productId },
                data:  { stockQTY: { decrement: item.quantity } },
            });
            if (item.variantId) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data:  { stock: { decrement: item.quantity } },
                });
            }
        }

        // Create Order
        const createdOrder = await tx.order.create({
            data: {
                user_id:             user.id,
                shipping_address_id: addressId,
                coupon_id:           couponRecord?.id || null,
                total_amount:        finalTotal,
                delivery_fee:        deliveryFee,
                payment_method:      paymentMethodEnum,
                payment_status:      paymentMethodEnum === "WALLET" ? "PAID" : "PENDING",
                status:              "PLACED",
                status_history: [
                    { status: "PLACED", timestamp: new Date().toISOString(), note: "Order placed successfully" },
                ],
                items: {
                    create: itemDetails.map((item) => ({
                        product_id:    item.productId,
                        variant_id:    item.variantId,
                        product_name:  item.productName,
                        product_image: item.productImage,
                        price:         item.price,
                        quantity:      item.quantity,
                        total:         item.total,
                    })),
                },
            },
            include: {
                items:            true,
                shipping_address: true,
                coupon:           true,
            },
        });

        // Record coupon usage
        if (couponRecord) {
            await tx.coupon.update({
                where: { id: couponRecord.id },
                data:  { used_count: { increment: 1 } },
            });
            await tx.couponUsage.create({
                data: {
                    coupon_id: couponRecord.id,
                    user_id:   user.id,
                    order_id:  createdOrder.id,
                },
            });
        }

        return createdOrder;
    });

    return newOrder;
};
