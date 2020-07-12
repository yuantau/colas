const path = require('path');
const packageFilePath = path.resolve(process.cwd(), 'package.json');
const packageJson = require(packageFilePath);
const fs = require('fs-extra');
if (!packageJson.build) {
    packageJson.build = {
        "appId": "com.example.electron-cra",
        "extends": null,
        //"icon": "favicon.ico",
        "extraMetadata": {
            "main": "build/electron.js"
        },
        "files": [
            "build/**/*",
            "!node_modules/**/*"
        ]
    }
    packageJson.main = "public/electron.js";
    fs.writeFileSync(packageFilePath, JSON.stringify(packageJson, null, 4));
}

const entryPath = path.resolve(process.cwd(), 'public/electron.js');
if (!fs.existsSync(entryPath)) fs.copyFileSync(path.resolve(__dirname, 'entry.js'), entryPath);