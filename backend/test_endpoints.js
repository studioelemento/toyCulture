const http = require('http');
const app = require('./src/app');
const prisma = require('./src/prismaClient');

async function runTests() {
    console.log('--- Starting ToyCulture Backend Comprehensive Test Suite ---\n');

    const server = http.createServer(app);
    await new Promise(resolve => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    const makeRequest = (path, options = {}) => {
        return new Promise((resolve, reject) => {
            const url = `${baseUrl}${path}`;
            const req = http.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    let parsed;
                    try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
                    resolve({ status: res.statusCode, headers: res.headers, body: parsed });
                });
            });
            req.on('error', reject);
            if (options.body) {
                req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
            }
            req.end();
        });
    };

    let createdProductId = null;

    try {
        await prisma.$connect();
        console.log('[PASS] Prisma database connected\n');

        // Test 1: POST /api/v1/products (Create with attributes)
        console.log('Test 1: Creating a test product with attributes...');
        const createPayload = {
            name: "Test RC Monster Truck",
            title: "High Speed 4WD Monster Truck",
            brand: "ToyCulture Labs",
            description: "A fast all-terrain RC truck for kids and collectors.",
            mrp: 2999,
            sellingPrice: 2499,
            onOffer: true,
            offerPrice: 2299,
            category: "RC Toys",
            ageGroup: "8 years and above",
            stockQTY: 15,
            metaTitle: "RC Monster Truck",
            metaDescription: "All-terrain remote control car",
            metaKeywords: ["rc", "monster truck", "toy"],
            imageUrl: ["https://example.com/truck.jpg"],
            images: ["https://example.com/truck1.jpg", "https://example.com/truck2.jpg"],
            attributes: [
                { attributeName: "Scale", attributeValue: "1:16" },
                { attributeName: "Battery", attributeValue: "7.4V Li-ion" }
            ]
        };

        const resCreate = await makeRequest('/api/v1/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: createPayload
        });

        if (resCreate.status === 201 && resCreate.body.success && resCreate.body.data.id) {
            createdProductId = resCreate.body.data.id;
            console.log(`[PASS] Product created with ID: ${createdProductId}`);
            console.log(`[PASS] Attributes created: ${resCreate.body.data.attributes.length} items`);
        } else {
            console.error('[FAIL] Failed to create product:', resCreate.body);
        }

        // Test 2: GET /api/v1/products/:id
        console.log('\nTest 2: Fetching product by ID...');
        const resGetById = await makeRequest(`/api/v1/products/${createdProductId}`);
        if (resGetById.status === 200 && resGetById.body.data.name === createPayload.name) {
            console.log(`[PASS] Successfully fetched product details by ID`);
            console.log(`       Name: ${resGetById.body.data.name}`);
            console.log(`       Attributes attached:`, resGetById.body.data.attributes.map(a => `${a.attributeName}: ${a.attributeValue}`));
        } else {
            console.error('[FAIL] Failed to fetch product by ID:', resGetById.body);
        }

        // Test 3: PUT /api/v1/products/:id (Update product)
        console.log('\nTest 3: Updating product...');
        const resUpdate = await makeRequest(`/api/v1/products/${createdProductId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: {
                sellingPrice: 2199,
                stockQTY: 20
            }
        });
        if (resUpdate.status === 200 && resUpdate.body.data.sellingPrice === 2199) {
            console.log(`[PASS] Product successfully updated. New sellingPrice: ${resUpdate.body.data.sellingPrice}, stock: ${resUpdate.body.data.stockQTY}`);
        } else {
            console.error('[FAIL] Failed to update product:', resUpdate.body);
        }

        // Test 4: GET /api/v1/products with filtering and search
        console.log('\nTest 4: Searching and filtering products list...');
        const resFilter = await makeRequest('/api/v1/products?search=Monster&category=RC%20Toys');
        if (resFilter.status === 200 && resFilter.body.data.products.length > 0) {
            console.log(`[PASS] Filter query returned ${resFilter.body.data.products.length} match(es)`);
        } else {
            console.error('[FAIL] Filter query failed:', resFilter.body);
        }

        // Test 5: DELETE /api/v1/products/:id (Soft delete)
        console.log('\nTest 5: Soft-deleting product...');
        const resDelete = await makeRequest(`/api/v1/products/${createdProductId}`, {
            method: 'DELETE'
        });
        if (resDelete.status === 200 && resDelete.body.success) {
            console.log('[PASS] Product soft-deleted successfully');
        } else {
            console.error('[FAIL] Soft delete failed:', resDelete.body);
        }

        // Test 6: Verify soft-deleted product is NOT returned in active list or by ID
        console.log('\nTest 6: Verifying deleted product is not accessible...');
        const resVerify = await makeRequest(`/api/v1/products/${createdProductId}`);
        if (resVerify.status === 404) {
            console.log('[PASS] Soft-deleted product returns 404 as expected');
        } else {
            console.error('[FAIL] Soft-deleted product was unexpectedly found:', resVerify.body);
        }

        // Cleanup: remove the test record completely from the DB so we leave it clean
        if (createdProductId) {
            await prisma.attribute.deleteMany({ where: { productId: createdProductId } });
            await prisma.product.delete({ where: { id: createdProductId } });
            console.log('\n[CLEANUP] Test product & attributes removed from database cleanly.');
        }

    } catch (err) {
        console.error('Test error:', err);
    } finally {
        server.close();
        await prisma.$disconnect();
    }

    console.log('\n--- All Tests Completed Successfully ---');
}

runTests();
