---
title: "简述 Javascript 模块化规范"
date: 2020-09-05T16:04:37+08:00
draft: false
Description: ""
type: "posts"    # posts | series
tags: [javascript, node.js, CommonJS, esm, amd, umd]
series: []
author: "Gl"
cover: false     # image name
---

ESM 具有语法简单、异步等特性。UMD 随处可见，通常在不支持 ESM 的环境中作为备用。CJS是同步的，适合后端。AMD是异步的，适合前端。

## CommonJS

CommonJS 由 Node.js 实现，同步导入模块CJS，主要用于服务器端，无法在浏览器中直接运行。
导入 CJS 时，它将为你提供导入对象的副本。不支持 Tree-shaking，因为在导入时会得到一个对象。
循环依赖管理不善。

```javascript
//importing
const doSomething = require('./doSomething.js');

//exporting
module.exports = function doSomething(n) {
  // do something
}
```

## AMD

AMD —— 异步模块定义，由 RequireJS 实现，可在浏览器直接使用，语法相对复杂。

```javascript
define(['dep1', 'dep2'], function (dep1, dep2) {
    //Define the module value by returning a value.
    return function () {};
});

//Or

// "simplified CommonJS wrapping" https://requirejs.org/docs/whyamd.html
define(function (require) {
    var dep1 = require('dep1'),
        dep2 = require('dep2');
    return function () {};
});
```

## UMD

通用模块定义，可以在前端和后端工作。与 CJS 和 AMD 不同，UMD 更像是一种配置多个模块系统的模式。
UMD 本质上创建了一种使用这两种方法之一的方式，同时还支持全局变量定义。结果就是，UMD 模块能够在客户端和服务器上工作。

```javascript
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "underscore"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"), require("underscore"));
    } else {
        root.Requester = factory(root.$, root._);
    }
}(this, function ($, _) {
    // this is where I defined my module implementation

    var Requester = { // ... };

    return Requester;
}));
```

## ESM

ES 模块，在许多现代浏览器中均可使用。他具有类似 CJS 的简单语法和 AMD 的异步能力。支持模块的运行时/静态加载。
由于 ES6 的静态模块结构，ESM 可以通过 tree-shaking 优化。允许像 Rollup 这样的打包程序删除不必要的代码，从而加快加载速度。比 CommonJS 更好的循环依赖管理。

```javascript
import React from 'react';
在野外的其他发现：

import {foo, bar} from './myLib';

...

export default function() {
  // your Function
};
export const function1() {...};
export const function2() {...};
```

## 参考

<https://www.freecodecamp.org/news/anatomy-of-js-module-systems-and-building-libraries-fadcd8dbd0e/>
<https://irian.to/blogs/what-are-cjs-amd-umd-and-esm-in-javascript/>
