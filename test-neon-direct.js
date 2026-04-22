const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// 1. Configure WebSockets
neonConfig.webSocketConstructor = ws;

// 2. Use the simplified URL
const url = 'postgresql://neondb_owner:npg_OS2R3DdpHLCV@ep-frosty-morning-a9b0xkre-pooler.gwc.azure.neon.tech/neondb';

async function test() {
  console.log('--- Direct Neon WebSocket Test ---');
  console.log('Target Host:', 'ep-frosty-morning-a9b0xkre-pooler.gwc.azure.neon.tech');
  
  const pool = new Pool({ connectionString: url });
  
  try {
    console.log('Attempting connection...');
    const client = await pool.connect();
    console.log('✅ Connected!');
    
    const res = await client.query('SELECT current_database(), now()');
    console.log('Query Result:', res.rows[0]);
    
    client.release();
  } catch (e) {
    console.error('❌ Detailed Failure:');
    console.error('Message:', e.message);
    console.error('Stack:', e.stack);
  } finally {
    await pool.end();
  }
}

test();
