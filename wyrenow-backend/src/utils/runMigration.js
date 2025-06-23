// simple-migration.js
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/environment');

async function runSimpleMigration() {
  let connection;
  
  try {
    console.log('🚀 Starting simple database migration...');
    
    // Create connection with multipleStatements enabled
    connection = await mysql.createConnection({
      host: config.DB_CONFIG.host,
      port: config.DB_CONFIG.port,
      user: config.DB_CONFIG.user,
      password: config.DB_CONFIG.password,
      database: config.DB_CONFIG.database,
      multipleStatements: true
    });
    
    console.log('✅ Connected to wyrenow_db database');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../../migrations/001_create_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📁 Reading migration file: 001_create_tables.sql');
    
    // Remove the 'USE wyrenow_db' line and other problematic statements
    let cleanSQL = migrationSQL
      .replace(/^\s*--.*$/gm, '')  // Remove comments
      .replace(/^\s*USE\s+\w+;\s*$/gm, '')  // Remove USE statements
      .replace(/^\s*CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+\w+;\s*$/gm, ''); // Remove CREATE DATABASE
    
    console.log('📝 Executing migration as single batch...');
    
    // Execute the entire SQL as one batch
    const result = await connection.query(cleanSQL);
    console.log('✅ Migration executed successfully!');
    
    // Verify tables were created
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📋 Created ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   ✅ ${Object.values(table)[0]}`);
    });
    
    // Test data was inserted
    const [countries] = await connection.query('SELECT COUNT(*) as count FROM countries');
    const [regions] = await connection.query('SELECT COUNT(*) as count FROM regions');
    
    console.log(`\n📊 Data verification:`);
    console.log(`   Countries: ${countries[0].count}`);
    console.log(`   Regions: ${regions[0].count}`);
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // If it's just duplicate/exists errors, that's ok
    if (error.message.includes('already exists') || error.message.includes('Duplicate entry')) {
      console.log('✅ Tables already exist - migration not needed');
    } else {
      console.error('📄 Full error:', error);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

runSimpleMigration();