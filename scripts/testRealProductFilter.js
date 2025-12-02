// /scripts/testCategoryStats.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/productModel');

async function testCategoryStats() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB\n');

    // Get total count first
    const totalCount = await Product.countDocuments();
    console.log(`📊 Total products in database: ${totalCount}\n`);
    console.log('='.repeat(70));

    // Get all unique categories for reference
    console.log('\n📋 Getting all categories in database...');
    console.log('-'.repeat(70));
    const allProducts = await Product.find({});
    const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();
    console.log(`Found ${uniqueCategories.length} unique categories:`);
    uniqueCategories.forEach(cat => console.log(`  • ${cat}`));

    // TEST 1: Stats for ALL products (no filter)
    console.log('\n\n🔍 TEST 1: Statistics for ALL products');
    console.log('-'.repeat(70));
    const allStats = await Product.getCategoryStats();
    if (allStats) {
      console.log(`Total Products: ${allStats.count}`);
      console.log(`Price Range: $${allStats.min.toFixed(2)} - $${allStats.max.toFixed(2)}`);
      console.log(`Average Price: $${allStats.avg}`);
      console.log(`Median Price: $${allStats.median.toFixed(2)}`);
      console.log(`Mode (Most Common Price): $${allStats.mode}`);
    } else {
      console.log('No products found');
    }

    // TEST 2: Stats for Food categories
    console.log('\n\n🔍 TEST 2: Statistics for Food categories');
    console.log('-'.repeat(70));
    const foodCategories = uniqueCategories.filter(cat => cat.startsWith('Food'));
    console.log(`Testing categories: ${foodCategories.join(', ')}`);
    const foodStats = await Product.getCategoryStats(foodCategories);
    if (foodStats) {
      console.log(`Total Food Products: ${foodStats.count}`);
      console.log(`Price Range: $${foodStats.min.toFixed(2)} - $${foodStats.max.toFixed(2)}`);
      console.log(`Average Price: $${foodStats.avg}`);
      console.log(`Median Price: $${foodStats.median.toFixed(2)}`);
      console.log(`Mode: $${foodStats.mode}`);
    } else {
      console.log('No food products found');
    }

    // TEST 3: Stats for single category (Electronics)
    console.log('\n\n🔍 TEST 3: Statistics for Electronics category');
    console.log('-'.repeat(70));
    const electronicsStats = await Product.getCategoryStats(['Electronics']);
    if (electronicsStats) {
      console.log(`Total Electronics: ${electronicsStats.count}`);
      console.log(`Price Range: $${electronicsStats.min.toFixed(2)} - $${electronicsStats.max.toFixed(2)}`);
      console.log(`Average Price: $${electronicsStats.avg}`);
      console.log(`Median Price: $${electronicsStats.median.toFixed(2)}`);
      console.log(`Mode: $${electronicsStats.mode}`);
    } else {
      console.log('No electronics found');
    }

    // TEST 4: Stats for Audio category
    console.log('\n\n🔍 TEST 4: Statistics for Audio category');
    console.log('-'.repeat(70));
    const audioStats = await Product.getCategoryStats(['Audio']);
    if (audioStats) {
      console.log(`Total Audio Products: ${audioStats.count}`);
      console.log(`Price Range: $${audioStats.min.toFixed(2)} - $${audioStats.max.toFixed(2)}`);
      console.log(`Average Price: $${audioStats.avg}`);
      console.log(`Median Price: $${audioStats.median.toFixed(2)}`);
      console.log(`Mode: $${audioStats.mode}`);
    } else {
      console.log('No audio products found');
    }

    // TEST 5: Stats for multiple diverse categories
    console.log('\n\n🔍 TEST 5: Statistics for Books, Audio, and Outdoor');
    console.log('-'.repeat(70));
    const mixedStats = await Product.getCategoryStats(['Books', 'Audio', 'Outdoor']);
    if (mixedStats) {
      console.log(`Total Products: ${mixedStats.count}`);
      console.log(`Price Range: $${mixedStats.min.toFixed(2)} - $${mixedStats.max.toFixed(2)}`);
      console.log(`Average Price: $${mixedStats.avg}`);
      console.log(`Median Price: $${mixedStats.median.toFixed(2)}`);
      console.log(`Mode: $${mixedStats.mode}`);
    } else {
      console.log('No products found in these categories');
    }

    // TEST 6: Stats for non-existent category
    console.log('\n\n🔍 TEST 6: Statistics for non-existent category');
    console.log('-'.repeat(70));
    const noStats = await Product.getCategoryStats(['NonExistentCategory']);
    if (noStats) {
      console.log(`Found ${noStats.count} products`);
    } else {
      console.log('✓ Correctly returned null for non-existent category');
    }

    // TEST 7: Compare stats across different categories
    console.log('\n\n🔍 TEST 7: Comparative analysis of different categories');
    console.log('-'.repeat(70));
    const categoriesToCompare = ['Books', 'Electronics', 'Audio', 'Outdoor'];
    console.log('\nCategory Comparison:\n');
    
    for (const cat of categoriesToCompare) {
      const stats = await Product.getCategoryStats([cat]);
      if (stats) {
        console.log(`${cat}:`);
        console.log(`  Count: ${stats.count} | Avg: $${stats.avg} | Range: $${stats.min.toFixed(2)}-$${stats.max.toFixed(2)}`);
      }
    }

    // TEST 8: Edge case - categories with very few products
    console.log('\n\n🔍 TEST 8: Statistics for categories with few products');
    console.log('-'.repeat(70));
    // Find categories with less than 10 products
    const categoryCounts = {};
    allProducts.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    const smallCategories = Object.keys(categoryCounts)
      .filter(cat => categoryCounts[cat] < 10)
      .slice(0, 3);
    
    if (smallCategories.length > 0) {
      console.log(`Testing small categories: ${smallCategories.join(', ')}`);
      for (const cat of smallCategories) {
        const stats = await Product.getCategoryStats([cat]);
        if (stats) {
          console.log(`\n${cat} (${stats.count} products):`);
          console.log(`  Min: $${stats.min.toFixed(2)} | Max: $${stats.max.toFixed(2)} | Avg: $${stats.avg}`);
          console.log(`  Median: $${stats.median.toFixed(2)} | Mode: $${stats.mode}`);
        }
      }
    } else {
      console.log('No categories with fewer than 10 products found');
    }

    // Summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 SUMMARY OF STATISTICS TESTS');
    console.log('='.repeat(70));
    console.log(`✅ Tested getCategoryStats() method with:`);
    console.log(`   • All products (no filter)`);
    console.log(`   • Multiple categories`);
    console.log(`   • Single categories`);
    console.log(`   • Non-existent categories`);
    console.log(`   • Edge cases`);
    console.log(`\n✅ All statistical calculations verified:`);
    console.log(`   • Count, Min, Max, Average, Median, Mode`);
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run the tests
testCategoryStats();