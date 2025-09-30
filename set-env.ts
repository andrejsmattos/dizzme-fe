// set-env.ts
const fs = require('fs');

const targetPath = './src/environments/environment.prod.ts';

const apiUrl = process.env['API_URL'] || 'https://dizzme-be.onrender.com/api'; 

const envConfigFile = `
export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log(`Ambiente de produção gerado em ${targetPath}`);