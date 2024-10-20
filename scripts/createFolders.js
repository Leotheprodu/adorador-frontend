/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Tomar el argumento del comando de la consola
const baseDir = 'src/app/';
const userDir = process.argv[2];

if (!userDir) {
  console.log(
    'No se ha especificado el directorio ejm: npm run structure -- user',
  );
  process.exit(1);
}
const basePath = path.join(__dirname, '../', `${baseDir}/${userDir}`);

// Estructura de carpetas
const folders = [
  `${basePath}/_components`,
  `${basePath}/_hooks`,
  `${basePath}/_interfaces`,
  `${basePath}/_services`,
  `${basePath}/_utils`,
];

// Crear las carpetas
folders.forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`Carpeta creada: ${folder}`);
  } else {
    console.log(`La carpeta ya existe: ${folder}`);
  }
});
