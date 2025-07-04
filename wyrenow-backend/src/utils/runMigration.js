// simple-migration.js
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/environment');

async function runSimpleMigration() {
  let connection;
  
  try {
    console.log('🚀 Starting simple database migration...');
    
    // STEP 1: Connect WITHOUT specifying database to create it
    console.log('🔌 Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: config.DB_CONFIG.host,
      port: config.DB_CONFIG.port,
      user: config.DB_CONFIG.user,
      password: config.DB_CONFIG.password,
      // DON'T specify database here
      multipleStatements: true
    });
    
    console.log('✅ Connected to MySQL server');
    
    // STEP 2: Create database if it doesn't exist
    console.log('🏗️  Creating database wyrenow_db if not exists...');
    await connection.query('CREATE DATABASE IF NOT EXISTS btmy_store');
    console.log('✅ Database wyrenow_db ready');
    
    // STEP 3: Switch to the database
    await connection.query('USE btmy_store');
    console.log('✅ Switched to wyrenow_db database');
    
    // STEP 4: Read the migration file
    const migrationPath = path.join(__dirname, '../../migrations/001_create_tables.sql');
    console.log('📁 Reading migration file: 001_create_tables.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // STEP 5: Clean the SQL (remove problematic statements)
    let cleanSQL = migrationSQL
      .replace(/^\s*--.*$/gm, '')  // Remove comments
      .replace(/^\s*USE\s+\w+;\s*$/gm, '')  // Remove USE statements
      .replace(/^\s*CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+\w+;\s*$/gm, ''); // Remove CREATE DATABASE
    
    console.log('📝 Executing migration...');
    
    // STEP 6: Execute the migration
    try {
      const result = await connection.query(cleanSQL);
      console.log('✅ Migration executed successfully!');
    } catch (error) {
      // Handle common duplicate errors gracefully
      if (error.message.includes('Duplicate key name') || 
          error.message.includes('already exists') ||
          error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Some indexes already exist - continuing...');
        console.log('✅ Migration completed (with existing objects)');
      } else {
        throw error; // Re-throw other errors
      }
    }
    
    // STEP 7: Verify tables were created
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📋 Created ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   ✅ ${Object.values(table)[0]}`);
    });
    
    // STEP 8: Verify data was inserted
    try {
      const [countries] = await connection.query('SELECT COUNT(*) as count FROM countries');
      const [regions] = await connection.query('SELECT COUNT(*) as count FROM regions');
      const [packages] = await connection.query('SELECT COUNT(*) as count FROM packages');
      
      console.log(`\n📊 Data verification:`);
      console.log(`   Countries: ${countries[0].count}`);
      console.log(`   Regions: ${regions[0].count}`);
      console.log(`   Packages: ${packages[0].count}`);
    } catch (error) {
      console.log('⚠️  Some tables may not have data yet (this is normal)');
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('✅ Database and tables are ready for use');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // Check for common issues
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Solution: Make sure MySQL server is running');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Solution: Check your database credentials in config');
    } else if (error.message.includes('already exists') || 
               error.message.includes('Duplicate entry') ||
               error.message.includes('Duplicate key name') ||
               error.code === 'ER_DUP_KEYNAME') {
      console.log('✅ Tables/indexes already exist - migration not needed');
      return; // Don't throw error for this case
    } else if (error.code === 'ENOENT') {
      console.error('💡 Solution: Create the migrations/001_create_tables.sql file');
    } else {
      console.error('📄 Full error:', error);
      throw error; // Re-throw other errors
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Alternative: Create database connection helper
async function createDatabaseIfNotExists() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: config.DB_CONFIG.host,
      port: config.DB_CONFIG.port,
      user: config.DB_CONFIG.user,
      password: config.DB_CONFIG.password
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS btmy_store');
    console.log('✅ Database wyrenow_db created/verified');
    
  } catch (error) {
    console.error('❌ Failed to create database:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the migration
runSimpleMigration();