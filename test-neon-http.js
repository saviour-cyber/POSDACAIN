const { neon } = require('@neondatabase/serverless');

// Use the simplified URL
const url = 'postgresql://neondb_owner:npg_OS2R3DdpHLCV@ep-frosty-morning-a9b0xkre-pooler.gwc.azure.neon.tech/neondb';

async function test() {
  console.log('--- Direct Neon HTTP Test (No WebSockets) ---');
  
  // neon() creates a fetch-based client
  const sql = neon(url);
  
  try {
    console.log('Attempting HTTP fetch query...');
    const rows = await sql`SELECT current_database(), now()`;
    console.log('✅ Success!');
    console.log('Query Result:', rows[0]);
  } catch (e) {
    console.error('❌ HTTP Failure:');
    console.error('Message:', e.message);
    console.error('Stack:', e.stack);
  }
}

test();
