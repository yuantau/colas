const path = require("path");
const fs = require("fs");

function overrideModule(modulePath, newModule) {
  if (!require.cache[modulePath]) {
    require(modulePath);
  }
  require.cache[modulePath].exports = newModule;
}

let appPackage = require(path.resolve(process.cwd(), "package.json"));
const isElectron = !!appPackage.electron;
if (isElectron) {
  require("./set-electron");
  const openElectron = require("./openElectron");
  const openBrowserModule = require.resolve("react-dev-utils/openBrowser");
  overrideModule(openBrowserModule, openElectron);
}

const _configFactory = require("react-scripts/config/webpack.config");
const mergeConfig = require("./merge-config");
const configFactory = function (env) {
  return mergeConfig(_configFactory(env), isElectron, env);
};
overrideModule(
  require.resolve("react-scripts/config/webpack.config"),
  configFactory
);

// https://github.com/facebook/create-react-app/pull/6116
const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");
if (fs.existsSync(tsConfigPath)) {
  if (require(tsConfigPath).compilerOptions.paths) {
    overrideModule(
      require.resolve("react-scripts/scripts/utils/verifyTypeScriptSetup"),
      require("./verifyTypeScriptSetup")
    );
  }
}
