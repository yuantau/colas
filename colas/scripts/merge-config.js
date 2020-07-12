const fs = require("fs");
const path = require("path");
const customConfigPath = path.resolve(process.cwd(), "webpack.config.js");
const customConfig = fs.existsSync(customConfigPath)
  ? require(customConfigPath)
  : undefined;
const paths = require("react-scripts/config/paths");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssNormalize = require("postcss-normalize");

const isEnvDevelopment = process.env.NODE_ENV === "development";
const isEnvProduction = process.env.NODE_ENV === "production";

function patch(config, custom, field) {
  if (typeof custom[field] === "function") {
    config[field] = custom[field](config[field]);
  } else if (typeof custom[field] !== "undefined") {
    config[field] = custom[field];
  }
}
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve("style-loader"),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith(".")
        ? { publicPath: "../../" }
        : {},
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009",
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

module.exports = function (config, isElectron) {
  if (isElectron) {
    config.target = "electron-renderer";
  }
  let oneOfNode = config.module.rules.find((n) => !!n.oneOf);
  const len = oneOfNode.oneOf.length;
  oneOfNode.oneOf.splice(
    len - 1,
    0,
    {
      test: /\.less$/,
      exclude: /\.module\.less$/,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: false,
        },
        "less-loader"
      ),
      sideEffects: true,
    },
    {
      test: /\.module\.less$/,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: false,
          modules: {
            getLocalIdent: getCSSModuleLocalIdent,
          },
        },
        "less-loader"
      ),
    }
  );
  if (customConfig) {
    for (let k in customConfig) {
      patch(config, customConfig, k);
    }
  }
  return config;
};
