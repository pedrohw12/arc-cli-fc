#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const createTsconfig = (dirPath) => {
  const tsconfig = {
      "compilerOptions": {
          "target": "es6",
          "module": "commonjs",
          "strict": true,
          "esModuleInterop": true,
          "skipLibCheck": true,
          "forceConsistentCasingInFileNames": true,
          "outDir": "./dist",
          "rootDir": "./src",
      },
      "include": ["src/**/*.ts"],
      "exclude": ["node_modules", "dist"]
  };
  
  fs.writeFileSync(path.join(dirPath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
  console.log(`'tsconfig.json' created in '${dirPath}'.`);
}


const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory '${dirPath}' created.`);
  } else {
    console.log(`Directory '${dirPath}' already exists.`);
  }
}

const basePath = path.join(process.cwd(), '@core');
createDirectory(basePath);

// Initialize npm project
execSync('npm init -y', { cwd: basePath });

// Create tsconfig.json
createTsconfig(basePath);

// Define the structure
const structure = {
  src: {
    user: {
      application: {
        dto: {},
        'use-case': {}
      },
      domain: {
        entities: {},
        repository: {},
        validators: {}
      },
      infra: {
        db: {
          'in-memory': {},
          sequelize: {}
        }
      }
    }
  }
};

const createStructure = (base, structure) => {
  for (const [key, value] of Object.entries(structure)) {
    const newPath = path.join(base, key);
    createDirectory(newPath);
    createStructure(newPath, value);
  }
}

createStructure(basePath, structure);
