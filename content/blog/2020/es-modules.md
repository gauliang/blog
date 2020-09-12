---
title: "ECMAScript Modules"
date: 2020-09-07T17:14:01+08:00
draft: false
Description: "ES6 中首次内置了对模块的支持。从理论上讲，ECMAScript模块应该在所有JavaScript环境中通用。实际上，浏览器仍然是ES模块的主要目标。"
type: "posts"    # posts | series
tags: [esm, node.js, javascript]
series: []
author: "Gl"
cover: '001.jpg'     # image name
---

ES6 中首次内置了对模块的支持。从理论上讲，ECMAScript模块应该在所有JavaScript环境中通用。实际上，浏览器仍然是ES模块的主要目标。

## 一、export 语法

1. 可以在实体前使用 `export` 关键字实现导出，也可以通过 `export` 语句导出；
1. 每个模块中可以有 0 各或者多个具名导出;
1. 每个模块最多可以具有 1 个默认导出，常用于只有一个函数或类的模块；
1. 在 `export` 子句中，可以通过 `as` 语法重命名导出；
1. 一个模块可以同时包含**具名导出**和**默认导出**，但是通常最好每个模块都采用一种导出样式；
1. 未导出的部分，是模块专有的，不能被外部访问。

```js
// 具名导出
export function func() {}
export const number = 1;
export {f as foo, bar};

// 默认导出
export default function func() {}
export default 618;

// 从另一个模块导出
export * from './module.mjs';
export {foo, b as bar} from './another-module.mjs';
```

> `default` 不能是变量名，但可以是导出名，也可以是属性名

## 二、import 语法

模块说明符是标识模块的字符串，主要分为以下几类：

```js
// 相对路径：以点开头
import x from './lib/module.mjs'
import x from '../lib/module.mjs'

// 绝对路径：以斜线开头
import x from '/home/user/module.mjs'
import x from 'https://example.com/module.mjs'
import x from 'file:///home/user/module.mjs'

// 裸路径：不以点，斜线或协议开头，并且由一个没有扩展名的文件名组成
import x from 'lodash'

// 深度导入路径：从一条裸露的路径开始，并且至少有一个斜线
import x from 'lodash/dist/module.mjs'
```

1. 通过解构语法可以仅导入需要的部分；
1. 模块是单例的，即使一个模块被多次导入，也仅存在一个实例。
1. 通过 `as` 语法能够重命名导入的内容；
1. 通过 `* as` 语法可以将整个命名空间导入并重命名；

```js
// 按名称导入
import {foo, bar as newBar} from './module.mjs';

// 导入整个模块命名空间
import * as api from './modules.mjs';

// 导入 Default
import someModule from './modules.mjs';

// 上面的导入方式还可以组合使用
import mod, {foo, bar as b} from './modules.mjs';

// 仅执行代码，不导入任何信息
import './modules.mjs'
```

## 三、只读视图

导入是导出的只读视图

```js
export let counter = 1;
export function inCounter(){
    counter++;
}
```

```js
import { counter, incCounter } from './counter.mjs';

console.log(counter);   // 3
incCounter();
console.log(counter);   // 4

counter++;   // error
```

## 四、动态加载

我们可以通过 import 语句导入模块，但是存在局限性：

1. 你必须在模块的顶层使用它，无法在块内导入内容。
2. 模块标识符三固定的，无法根据条件计算模块标识符。

如果需要动态导入，可以通过 `import()` 运算符。它接收 **模块标识符** 作为参数，返回 **Promises** 对象。

```js
let path = 'path';

import(`./${path}/modules.mjs`)
    .then(m=>{
        // 在这里通过传递近来的 m 获取导出的内容
    })
    .catch(e=>{
        /* error */
    })
```

## 五、在浏览器中使用

现代浏览器支持 ES 模块，但有一些警告。要加载模块，需添将 `script` 标签的 `type` 属性设置为 `module`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ESM</title>
</head>
<body>
<p id="el">The result is: </p>
</body>
<script type="module">
    import { appendResult } from "./append.js";

    const el = document.getElementById("el");
    appendResult(el);
</script>
</html>
```

在与 HTML 文件文件统一目录中添加以下文件：

```js
export function appendResult(element) {
  const result = Math.random();
  element.innerText += result;
}
```
