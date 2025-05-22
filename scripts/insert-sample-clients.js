/**
 * Script to insert sample client data into the database
 * 
 * To run:
 * 1. Make sure your MySQL server is running
 * 2. Update the connection details below as needed
 * 3. Run: node scripts/insert-sample-clients.js
 */

const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Using empty password by default
  database: process.env.DB_NAME || 'insurance_brokerage',
};

// Sample client data
const sampleClients = [
  {
    id: 1,
    introducer_code: 'IC001',
    customer_type: 'Individual',
    product: 'Motor Insurance',
    insurance_provider: 'AIA Insurance',
    branch: 'Colombo',
    client_name: 'John Fernando',
    street1: '45 Galle Road',
    street2: 'Apt 3B',
    city: 'Colombo',
    district: 'Colombo',
    province: 'Western',
    telephone: '0112345678',
    mobile_no: '0771234567',
    contact_person: 'John Fernando',
    email: 'john.fernando@gmail.com',
    social_media: '@johnf',
    policy_type: 'Comprehensive',
    policy_no: 'POL-MT-2023-001',
    policy_period_from: '2023-01-15',
    policy_period_to: '2024-01-14',
    coverage: 'Full Coverage',
    sum_insured: 5000000,
    basic_premium: 45000,
    srcc_premium: 5000,
    tc_premium: 3000,
    net_premium: 53000,
    stamp_duty: 250,
    admin_fees: 1500,
    road_safety_fee: 500,
    policy_fee: 1000,
    vat_fee: 6600,
    total_invoice: 62850,
    commission_type: 'Percentage',
    commission_basic: 5400,
    commission_srcc: 600,
    commission_tc: 360
  },
  {
    id: 2,
    introducer_code: 'IC002',
    customer_type: 'Corporate',
    product: 'Fire Insurance',
    insurance_provider: 'Ceylinco Insurance',
    branch: 'Negombo',
    client_name: 'ABC Enterprises',
    street1: '78 Main Street',
    street2: 'Floor 2',
    city: 'Negombo',
    district: 'Gampaha',
    province: 'Western',
    telephone: '0312267890',
    mobile_no: '0761234567',
    contact_person: 'Samantha Perera',
    email: 'info@abcenterprises.lk',
    social_media: '@abcenterprises',
    policy_type: 'Standard',
    policy_no: 'POL-FI-2023-012',
    policy_period_from: '2023-02-10',
    policy_period_to: '2024-02-09',
    coverage: 'Fire & Lightning',
    sum_insured: 12000000,
    basic_premium: 120000,
    srcc_premium: 15000,
    tc_premium: 7500,
    net_premium: 142500,
    stamp_duty: 500,
    admin_fees: 2000,
    road_safety_fee: 0,
    policy_fee: 1500,
    vat_fee: 17640,
    total_invoice: 164140,
    commission_type: 'Percentage',
    commission_basic: 14400,
    commission_srcc: 1800,
    commission_tc: 900
  },
  {
    id: 3,
    introducer_code: 'IC003',
    customer_type: 'Individual',
    product: 'Health Insurance',
    insurance_provider: 'Union Assurance',
    branch: 'Kandy',
    client_name: 'Priya Gunasekara',
    street1: '23 Temple Road',
    street2: '',
    city: 'Kandy',
    district: 'Kandy',
    province: 'Central',
    telephone: '0814563218',
    mobile_no: '0712345678',
    contact_person: 'Priya Gunasekara',
    email: 'priya.g@yahoo.com',
    social_media: '@priyag',
    policy_type: 'Premium',
    policy_no: 'POL-HI-2023-036',
    policy_period_from: '2023-03-20',
    policy_period_to: '2024-03-19',
    coverage: 'Hospitalization',
    sum_insured: 2500000,
    basic_premium: 75000,
    srcc_premium: 0,
    tc_premium: 0,
    net_premium: 75000,
    stamp_duty: 250,
    admin_fees: 1000,
    road_safety_fee: 0,
    policy_fee: 1000,
    vat_fee: 9270,
    total_invoice: 86520,
    commission_type: 'Fixed',
    commission_basic: 9000,
    commission_srcc: 0,
    commission_tc: 0
  },
  {
    id: 4,
    introducer_code: 'IC004',
    customer_type: 'Corporate',
    product: 'Liability Insurance',
    insurance_provider: 'Allianz Insurance',
    branch: 'Colombo',
    client_name: 'XYZ Holdings',
    street1: '120 Duplication Road',
    street2: '5th Floor',
    city: 'Colombo',
    district: 'Colombo',
    province: 'Western',
    telephone: '0112876543',
    mobile_no: '0778765432',
    contact_person: 'Ravi Mendis',
    email: 'admin@xyzholdings.com',
    social_media: '@xyzholdings',
    policy_type: 'Professional',
    policy_no: 'POL-LI-2023-078',
    policy_period_from: '2023-04-12',
    policy_period_to: '2024-04-11',
    coverage: 'Professional Liability',
    sum_insured: 20000000,
    basic_premium: 210000,
    srcc_premium: 0,
    tc_premium: 0,
    net_premium: 210000,
    stamp_duty: 1000,
    admin_fees: 3000,
    road_safety_fee: 0,
    policy_fee: 2000,
    vat_fee: 25920,
    total_invoice: 241920,
    commission_type: 'Percentage',
    commission_basic: 25200,
    commission_srcc: 0,
    commission_tc: 0
  },
  {
    id: 5,
    introducer_code: 'IC005',
    customer_type: 'Individual',
    product: 'Life Insurance',
    insurance_provider: 'AIA Insurance',
    branch: 'Galle',
    client_name: 'Lakshmi Silva',
    street1: '56 Marine Drive',
    street2: '',
    city: 'Galle',
    district: 'Galle',
    province: 'Southern',
    telephone: '0915678901',
    mobile_no: '0753456789',
    contact_person: 'Lakshmi Silva',
    email: 'lakshmi.silva@hotmail.com',
    social_media: '',
    policy_type: 'Term Life',
    policy_no: 'POL-LF-2023-125',
    policy_period_from: '2023-05-05',
    policy_period_to: '2043-05-04',
    coverage: 'Death Benefit',
    sum_insured: 5000000,
    basic_premium: 87500,
    srcc_premium: 0,
    tc_premium: 0,
    net_premium: 87500,
    stamp_duty: 250,
    admin_fees: 1000,
    road_safety_fee: 0,
    policy_fee: 1000,
    vat_fee: 10770,
    total_invoice: 100520,
    commission_type: 'Fixed',
    commission_basic: 8750,
    commission_srcc: 0,
    commission_tc: 0
  }
];

async function insertSampleData() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    // Clear existing data (optional)
    console.log('Clearing existing client data...');
    await connection.execute('TRUNCATE TABLE clients');
    
    console.log('Inserting sample client data...');
    for (const client of sampleClients) {
      // Create placeholders and values array for SQL query
      const columns = Object.keys(client);
      const placeholders = columns.map(() => '?').join(', ');
      const values = Object.values(client);
      
      const query = `
        INSERT INTO clients (${columns.join(', ')})
        VALUES (${placeholders})
      `;
      
      await connection.execute(query, values);
    }
    
    console.log('Successfully inserted sample client data!');
  } catch (error) {
    console.error('Failed to insert sample data:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

insertSampleData(); 