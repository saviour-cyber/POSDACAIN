const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Configure the driver to use ws
neonConfig.webSocketConstructor = ws;

const connectionString = 'postgresql://neondb_owner:npg_OS2R3DdpHLCV@ep-frosty-morning-a9b0xkre-pooler.gwc.azure.neon.tech/neondb?sslmode=require';

async function test() {
  console.log('Testing connection over WebSockets (Neon Serverless)...');
  const pool = new Pool({ connectionString });
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Success! Database time:', res.rows[0].now);
  } catch (err) {
    console.error('Failed over WebSockets:', err.message);
  } finally {
    await pool.end();
  }
}

test();
