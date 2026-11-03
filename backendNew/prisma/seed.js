import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting ToyCulture Database Seeding...");

    // 1. Seed Admin User
    const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
    const admin = await prisma.user.upsert({
        where:  { email: "admin@toyculture.com" },
        update: { password: adminPasswordHash, role: "ADMIN", active: true, is_verified: true },
        create: {
            first_name:  "Admin",
            last_name:   "ToyCulture",
            email:       "admin@toyculture.com",
            password:    adminPasswordHash,
            role:        "ADMIN",
            active:      true,
            is_verified: true,
        },
    });
    console.log(`✅ Admin user seeded: ${admin.email}`);

    // 2. Seed Customer User & Wallet
    const customerPasswordHash = await bcrypt.hash("Customer@123", 10);
    const customer = await prisma.user.upsert({
        where:  { email: "customer@toyculture.com" },
        update: { active: true, is_verified: true },
        create: {
            first_name:  "John",
            last_name:   "Doe",
            email:       "customer@toyculture.com",
            password:    customerPasswordHash,
            role:        "USER",
            phone:       "+91 9876543210",
            active:      true,
            is_verified: true,
        },
    });

    await prisma.wallet.upsert({
        where:  { user_id: customer.id },
        update: {},
        create: {
            user_id: customer.id,
            balance: 1500,
        },
    });
    console.log(`✅ Customer user seeded: ${customer.email} (Wallet: ₹1,500)`);

    // 3. Seed Brands
    const brandNames = ["LEGO", "Hot Wheels", "Maisto", "Hasbro", "Mattel", "Funko"];
    const brandsMap = {};
    for (const name of brandNames) {
        const brand = await prisma.brand.upsert({
            where:  { name },
            update: { is_active: true },
            create: { name, is_active: true, seo_title: `${name} Toys Collection` },
        });
        brandsMap[name] = brand.id;
    }
    console.log(`✅ Seeded ${brandNames.length} brands`);

    // 4. Seed Categories with dynamic spec templates
    const categoriesData = [
        {
            name: "Diecast Cars",
            attributes: [
                { name: "Scale", options: ["1:18", "1:24", "1:32", "1:43", "1:64"] },
                { name: "Material", options: ["Die-cast Metal & Plastic", "Zinc Alloy"] },
                { name: "Opening Parts", options: ["Doors & Hood", "Doors Only", "None"] },
            ],
        },
        {
            name: "RC Toys",
            attributes: [
                { name: "Remote Frequency", options: ["2.4 GHz", "40 MHz"] },
                { name: "Battery Life", options: ["20-30 mins", "45 mins", "60 mins"] },
                { name: "Control Range", options: ["30 meters", "50 meters", "100 meters"] },
            ],
        },
        {
            name: "Building Blocks",
            attributes: [
                { name: "Piece Count", options: ["100-300", "500-1000", "1500+"] },
                { name: "Recommended Age", options: ["4+", "8+", "12+", "18+"] },
            ],
        },
        {
            name: "Board Games",
            attributes: [
                { name: "Players", options: ["2-4 Players", "2-6 Players", "4+ Players"] },
                { name: "Play Time", options: ["30 mins", "60 mins", "90+ mins"] },
            ],
        },
        {
            name: "Action Figures",
            attributes: [
                { name: "Character Theme", options: ["Marvel", "DC", "Anime", "Sci-Fi"] },
                { name: "Height", options: ["6 inch", "7 inch", "12 inch"] },
            ],
        },
    ];

    const categoriesMap = {};
    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where:  { name: cat.name },
            update: { attributes: cat.attributes, is_active: true },
            create: {
                name:       cat.name,
                attributes: cat.attributes,
                is_active:  true,
            },
        });
        categoriesMap[cat.name] = category.id;
    }
    console.log(`✅ Seeded ${categoriesData.length} categories with specs`);

    // 5. Seed Initial Products
    const productsData = [
        {
            name: "LEGO Technic Bugatti Chiron",
            title: "Super Sports Car Building Set",
            description: "High speed racing car building blocks set with working W16 engine pistons, paddle gearshift and detailed cockpit.",
            price: 4299,
            mrp: 4999,
            sellingPrice: 4299,
            discount: 14,
            stockQTY: 25,
            ageGroup: "16+ years",
            brandId: brandsMap["LEGO"],
            categoryId: categoriesMap["Building Blocks"],
            images: ["https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=800"],
            attributes: [
                { attributeName: "Scale", attributeValue: "1:8" },
                { attributeName: "Piece Count", attributeValue: "3599 pieces" },
            ],
        },
        {
            name: "Hot Wheels Fast & Furious Skyline GT-R",
            title: "1:64 Scale Diecast Collector Vehicle",
            description: "Iconic silver and blue street racer with real rider rubber tires, metal body and premium collector blister card.",
            price: 399,
            mrp: 499,
            sellingPrice: 399,
            discount: 20,
            stockQTY: 80,
            ageGroup: "3+ years",
            brandId: brandsMap["Hot Wheels"],
            categoryId: categoriesMap["Diecast Cars"],
            images: ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=800"],
            attributes: [
                { attributeName: "Scale", attributeValue: "1:64" },
                { attributeName: "Material", attributeValue: "Die-cast Metal & Plastic" },
            ],
        },
        {
            name: "Maisto 1:18 Special Edition Ford Mustang",
            title: "Classic Muscle Car Diecast Model",
            description: "Precision engineered 1:18 scale metal replica with opening hood, doors, trunk and four-wheel spring suspension.",
            price: 1999,
            mrp: 2499,
            sellingPrice: 1999,
            discount: 20,
            stockQTY: 18,
            ageGroup: "8+ years",
            brandId: brandsMap["Maisto"],
            categoryId: categoriesMap["Diecast Cars"],
            images: ["https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=800"],
            attributes: [
                { attributeName: "Scale", attributeValue: "1:18" },
                { attributeName: "Opening Parts", attributeValue: "Doors & Hood" },
            ],
        },
        {
            name: "Hasbro Monopoly Classic Board Game",
            title: "Fast-Dealing Property Trading Board Game",
            description: "The classic game of buying, selling, and scheming to get rich! Features 8 classic tokens and community chest cards.",
            price: 999,
            mrp: 1299,
            sellingPrice: 999,
            discount: 23,
            stockQTY: 35,
            ageGroup: "8+ years",
            brandId: brandsMap["Hasbro"],
            categoryId: categoriesMap["Board Games"],
            images: ["https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800"],
            attributes: [
                { attributeName: "Players", attributeValue: "2-6 Players" },
                { attributeName: "Play Time", attributeValue: "60 mins" },
            ],
        },
        {
            name: "Hasbro Marvel Legends Spider-Man",
            title: "6-Inch Collectible Action Figure",
            description: "Classic red and blue Spidey suit with premium articulation, alternate hands, and web-slinging accessories.",
            price: 1499,
            mrp: 1899,
            sellingPrice: 1499,
            discount: 21,
            stockQTY: 40,
            ageGroup: "4+ years",
            brandId: brandsMap["Hasbro"],
            categoryId: categoriesMap["Action Figures"],
            images: ["https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&q=80&w=800"],
            attributes: [
                { attributeName: "Height", attributeValue: "6 inch" },
                { attributeName: "Character Theme", attributeValue: "Marvel" },
            ],
        },
        {
            name: "Maisto Tech Rock Crawler RC 4WD",
            title: "Off-Road Remote Control Monster Truck",
            description: "Tri-channel transmitter, articulated front and rear suspension, and low gear crawling capabilities for tough terrains.",
            price: 2799,
            mrp: 3499,
            sellingPrice: 2799,
            discount: 20,
            stockQTY: 22,
            ageGroup: "8+ years",
            brandId: brandsMap["Maisto"],
            categoryId: categoriesMap["RC Toys"],
            images: ["https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80&w=800"],
            attributes: [
                { attributeName: "Remote Frequency", attributeValue: "2.4 GHz" },
                { attributeName: "Control Range", attributeValue: "50 meters" },
            ],
        },
    ];

    for (const p of productsData) {
        const { attributes, brandId, categoryId, ...prodData } = p;
        const existing = await prisma.product.findFirst({ where: { name: prodData.name } });
        if (!existing) {
            await prisma.product.create({
                data: {
                    ...prodData,
                    brand_id:    brandId,
                    category_id: categoryId,
                    attributes: {
                        create: attributes,
                    },
                },
            });
        }
    }
    console.log(`✅ Seeded ${productsData.length} initial products with specs and pricing`);

    // 6. Seed Sample Coupon
    await prisma.coupon.upsert({
        where:  { code: "TOY10" },
        update: {},
        create: {
            code:             "TOY10",
            description:      "Flat 10% discount on all orders",
            type:             "PERCENTAGE",
            value:            10,
            min_order_amount: 500,
            max_discount:     500,
            usage_limit:      1000,
            valid_from:       new Date(),
            valid_until:      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            is_active:        true,
        },
    });
    console.log("✅ Seeded sample coupon: TOY10 (10% off)");

    console.log("✨ Seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
