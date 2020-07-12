const args = process.argv.splice(2);
const path = require("path");

const spawn = require("react-dev-utils/crossSpawn");
const fs = require("fs-extra");
const result = spawn.sync("node", [require.resolve("./prebuild.js"), ...args], {
  stdio: "inherit",
});
const appPackage = require(path.resolve(process.cwd(), "package.json"));
const isElectron = !!appPackage.electron;
if (!isElectron) return;
const builder = require("electron-builder");
fs.emptyDirSync("dist");
if (result.signal) {
  console.error("Build faild.");
} else {
  builder
    .build({
      dir: args.indexOf("--dir") > -1,
      config: appPackage.build || {},
    })
    .then((e) => {
      const buildPath = path.resolve(process.cwd(), "build");
      fs.emptyDirSync(buildPath);
      fs.rmdirSync(buildPath);
      console.log("done");
    })
    .catch((err) => {
      console.log(err);
    });
}
