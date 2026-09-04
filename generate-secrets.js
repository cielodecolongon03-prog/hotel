const crypto = require('crypto');

// Generate random secrets for deployment
const secrets = {
  JWT_SECRET: crypto.randomBytes(32).toString('hex'),
  SESSION_SECRET: crypto.randomBytes(32).toString('hex'),
};

console.log('Generated Secrets:');
console.log('==================');
console.log(`JWT_SECRET: ${secrets.JWT_SECRET}`);
console.log(`SESSION_SECRET: ${secrets.SESSION_SECRET}`);
console.log('\nCopy these to your Render environment variables!');