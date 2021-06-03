# colas

给 [creat-react-app](https://github.com/facebook/create-react-app) 加点料，
默认添加了`less-loader`。

:warning: 自用，未测试

## 使用

- 第一步

  ```bash
  yarn create react-app example
  cd example
  yarn add colas electron electron-builder -D
  ```

- 第二步
  修改`package.json`

  ```json
  "electron": true,
  "scripts": {
     "start": "colas start",
     "build": "colas build --dir"
     ....
   },
  ```

- 第三步
  ```bash
  yarn start
  ```

## 自定义`webpack.config.js`

项目根目录下添加`webpack.config.js`

```js
module.exports = {
  module: (prevModule) => {
    // prevModule 是原始的module配置
    return prevModule;
  },

  // 最终会使用output配置
  output: {
    filename: "bundle.js",
    path: "/home/proj/public/assets",
  },
};
```

v1.2 对于 css-loader 升级后默认处理 url 路径(https://github.com/facebook/create-react-app/issues/9870)进行了一些修补，使之与以前版本兼容
如果想开启 在 webpack.config.js 添加 `enableCSSURL:true`
