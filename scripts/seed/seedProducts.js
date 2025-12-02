// /scripts/importProducts.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Product = require('../../models/productModel');

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const filePath = process.argv[2] || 'data/products.json';
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(jsonData);

    const transformedProducts = products.map(product => {
      let paymentMethod = product.payment_Method;
      if (typeof paymentMethod === 'string') {
        paymentMethod = [paymentMethod];
      }

      let photos = product.photos || [];
      if (photos.length > 0 && photos[0].item) {
        photos = photos.map(p => p.item);
      }

      const created_at = product.created_at ? new Date(product.created_at) : new Date();
      const update_at = product.update_at ? new Date(product.update_at) : new Date();

      return {
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description || '',
        condition: product.condition || 'new',
        location: product.location,
        payment_Method: paymentMethod,
        contact_info: product.contact_info,
        is_sold: product.is_sold || false,
        created_at: created_at,
        update_at: update_at,
        photos: photos,
        seller_id: String(product.seller_id)
      };
    });

    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    console.log('✓ Cleared\n');

    // Insert products
    console.log('📥 Importing products...');
    console.log(`   Attempting to insert ${transformedProducts.length} transformed products...`);
    
    // Debug: Show first product
    console.log('\n🔍 Sample transformed product:');
    console.log(JSON.stringify(transformedProducts[0], null, 2));
    
    const result = await Product.insertMany(transformedProducts, { ordered: false });
    console.log(`\n✅ Successfully imported ${result.length} products!\n`);

    // Show sample of imported data
    console.log('Sample of imported products:');
    const sample = await Product.find().limit(5);
    sample.forEach(p => {
      console.log(`  • ${p.name} - $${p.price} (${p.category})`);
    });

    // Show summary statistics
    console.log('\n📊 Import Summary:');
    console.log(`  Total products: ${result.length}`);
    console.log(`  Sold items: ${transformedProducts.filter(p => p.is_sold).length}`);
    console.log(`  Available items: ${transformedProducts.filter(p => !p.is_sold).length}`);

  } catch (error) {
    console.error('❌ Error importing products:', error.message);
    console.error('\nFull error:', error);
    if (error.writeErrors) {
      console.error('\nWrite errors:');
      error.writeErrors.slice(0, 3).forEach(err => {
        console.error(`  - ${err.err.errmsg}`);
      });
    }
    if (error.errors) {
      console.error('\nValidation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

module.exports = seedProducts;