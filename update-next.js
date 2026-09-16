const fs = require('fs');
let code = fs.readFileSync('next.config.mjs', 'utf8');

const rewrites = `
  async rewrites() {
    return [
      {
        source: '/__/auth/:path*',
        destination: 'https://huddle-dca59.firebaseapp.com/__/auth/:path*',
      },
    ];
  },
`;

code = code.replace('output: "standalone",', 'output: "standalone",' + rewrites);
fs.writeFileSync('next.config.mjs', code);
