---
title: "深入 Webpack"
date: 2020-11-05T08:34:50+08:00
draft: false
Description: "大多数情况下，网站不再只是用带有一些可选 JavaScript 的纯 HTML 编写，它们通常完全由 JavaScript
构建。因此，我们必须将代码打包，最小化和翻译成所有浏览器都能理解的东西，这就是webpack的用武之地。"
type: "posts"    # posts | series
tags: [webpack,devops,node.js,esm]
series: [Dive into webpack]
author: "Gl"
cover: "webpack.jpg"     # image name
---

前端生态蓬勃发展，各垂直领域都有众多设计精良的优秀项目，几乎在所有场景中，应用系统都不同程度依赖这些三方项目。
同时，新的设计理念不断被提出并投入实践，应用程序本身也变的复杂起来。这为快速构建和部署项目带来了挑
战，于是，很多用于工程化管理前端项目的工具诞生了，Webpack 正是这样一个工具。

接下来，我们将深入探索 webpack ，本文假设你对 webpack 已有初步了解。

## Webpack 是什么

从代码管理角度讲，webpack 是一个静态模块打包器，他将模块间的依赖关系换转成一个 chunk 图，此依赖图对应映射到
项目所需的每个模块，并生成一个或多个 bundle。

从应用程序角度讲，大多数情况下，网站不再只是用带有一些可选 JavaScript 的纯 HTML 编写，它们通常完全由 JavaScript
构建。因此，我们必须将代码打包，最小化和翻译成所有浏览器都能理解的东西，这就是webpack的用武之地。

webpack 还提供了一个开发服务器，可以在保存时即时更新模块和样式。`vue create` 并 `create-react-app` 依赖于后台的
webpack，但是您可以轻松地为他们设置自己的 webpack 配置。

## Entry & Output

Entry & Output 是 webpack 的基本配置，指定程序入口点和输出信息。

1. **entry** 指定构建依赖图时的入口点，webpack 会从该点其，一次找出模块间的依赖关系。  
    默认值是 `./src/index.js`。
1. **output** 告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。  
    默认值是 `./dist/main.js`。

配置 `webpack.config.js` 可改变上述默认行为：

```js
module.exports = {
  entry: './path/to/my/entry/file.js'
  output: {
    path: __dirname + 'dist',
    filename: 'my-first-webpack.bundle.js'
  }
}
```

### Chunk

打包过程中，模块会被合并成 chunk。 chunk 合并成 chunk 组，并形成一个通过模块互相连接的图(ModuleGraph)。chunk 有两种形式：

- initial(初始化) 是入口起点的 main chunk。此 chunk 包含为入口起点指定的所有模块及其依赖项。
- non-initial 是可以延迟加载的块。可能会出现在使用 动态导入(dynamic imports) 或者 SplitChunksPlugin 时。

```js
// main.js
import React from "react"
import ReactDOM from "react-dom"

import("./app").then(App=>{
    ReactDOM.render(<App />, document.getElementById("root"))
})
```

```bash
# output
/dist/main.js   - initial chunk       包含 react,react-dom,main.js
/dist/375.js    - non-initial chunk   包含 app.jsx
```

#### Output

输出文件的名称会受配置中的两个字段的影响：

1. `output.filename` - 用于 initial chunk 文件
1. `output.chunkFilename` - 用于 non-initial chunk 文件
1. 在某些情况下，使用 initial 和 non-initial 的 chunk 时，可以使用 output.filename。

这些字段中会有一些 占位符。常用的占位符如下：

1. `[id]` - chunk id（例如 [id].js -> 485.js）
1. `[name]` - chunk name（例如 [name].js -> app.js）。如果 chunk 没有名称，则会使用其 id 作为名称
1. `[contenthash]` - 输出文件内容的 md4-hash（例如 [contenthash].js -> 4ea6ff1de66c537eb9b2.js）

## Module

通常，当我们提及模块，一般是指 Javascript 模块。在 webpack 语境下，模块可以是任何东西。下面是一些示例：

1. ES2015 import 语句
1. CommonJS require() 语句
1. AMD define 和 require 语句
1. css/sass/less 文件中的 @import 语句。
1. stylesheet url(...) 或者 HTML `<img src=...>` 文件中的图片链接。

webpack 原生支持如下模块类型：

1. ECMAScript 模块
1. CommonJS 模块
1. AMD 模块
1. Assets
1. WebAssembly 模块

## Loader

我们通过 **loader** 使 webpack 处理 `js` 和 `json` 之外任何类型的文件（模块），如后缀巍为**ts**、**scss**、**jsx** 和 **vue**。
loader 向 webpack 描述了如何处理非原生模块，并将相关依赖引入到你的 bundles中。loader 有两个属性：

1. `test` 属性，识别出哪些文件会被转换。
1. `use` 属性，指出在进行转换时，应该使用哪个 loader。

```js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

## Plugin

webpack 插件是一个具有 apply 方法的 JavaScript 对象。与 loader(仅用于转换某些类型的模块)不同，插件的目的在于扩展 webpack 自身能力，其可以直接访问 compiler 对象，
通常用于处理 loader 无法完成的其他工作，如打包优化、资源管理。

## Mode

webpack 有两种操作模式：开发(development)和生产(production)。 它们之间的主要区别是生产模式自动生成一些优化后的代码。

## Code Splitting

代码分离能够把代码分离到不同的 bundle 中，然后按需加载或并行加载这些文件。常用的代码分离方法有三种：

1. 入口起点：entry 配置
1. 防止重复：SplitChunksPlugin 配置
1. 动态导入：通过模块的内联函数调用来分离代码。`import()` 或 `require.ensure()`；

```js
module.exports = {
    mode: 'development',
    // 入口起点：entry 配置
    entry: {
        index: './src/index.js',
        another: './src/another-module.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        // 防止重复：SplitChunksPlugin 配置
        splitChunks: {
            chunks: 'all',
        },
    },
};
```

## HMR

模块热替换(HMR - hot module replacement)功能会在应用程序运行过程中，替换、添加或删除 模块，而无需重新加载整个页面。主要是通过以下几种方式，来显著加快开发速度：

1. 保留在完全重新加载页面期间丢失的应用程序状态。
1. 只更新变更内容，以节省宝贵的开发时间。
1. 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。

`devServer.hot = true`

## treeshaking

使 treeshaking 生效需要满足以下条件：

1. 使用 ESM 规范
1. 配置 babel-loader 不将 EMS 转为 CMD
1. 运行在 production 模式

注：在 webpack v4+ 将会在生产模式下，默认开启代码压缩。

## 性能优化

可以从以下几个角度考虑优化构建性能：

1. 将 `webpack`、`npm`和`yarn` 更新到最新版本；
1. 将 loader 应用于最少数量的必要模块；
1. 每个额外的 loader/plugin 都有其启动时间。尽量少地使用工具；
1. 优化模块解析条目；
1. 使用 dll 插件为更改不频繁的代码生成单独的编译结果；
1. 尽量保持 chunk 体积小；使用数量更少/体积更小的 library；在多页面应用程序中使用 SplitChunksPlugin ，并开启 async 模式；移除未引用代码；只编译你当前正在开发的那些代码。
1. worker 池
1. 持久化缓存
1. 移除 Progress plugin
1. 留意自定义 plugin/loader
1. 增量编译
1. 在内存中编译
1. 不同的 devtool 设置，会导致性能差异。
1. 避免在生产环境下才会用到的工具，某些 utility, plugin 和 loader 都只用于生产环境。
1. 最小化 entry chunk
1. 避免额外的优化步骤
1. 输出结果不携带路径信息
1. 为 TypeScript loader 传入 transpileOnly 选项，以缩短使用 ts-loader 时的构建时间。

## 参考

https://peerigon.github.io/talks/2018-09-28-hackerkiste-webpack-deep-dive
https://www.taniarascia.com/how-to-use-webpack/