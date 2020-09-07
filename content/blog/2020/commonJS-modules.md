---
title: "CommonJS Modules"
date: 2020-09-06T10:19:40+08:00
draft: false
Description: "在 ES2015 标准之前，JavaScript语言没有模块化组织代码的原生方法。Node.js 用 CommonJS 模块格式填补了这一空白。 CommonJS 规范了如何编写模块，以及如何在模块系统之间实现互操作。由于其同步执行特性，CMD 主要用于服务端开发，也可通过打包工具处理后用在浏览器端。"
type: "posts"    # posts | series
tags: ['javascript','node.js','commonjs']
series: []
author: "Gl"
cover: '001.jpg'     # image name
---

{{< image src="001.jpg" alt="CommonJS Modules">}}

在 ES2015 标准之前，JavaScript语言没有模块化组织代码的原生方法。Node.js 用 CommonJS 模块格式填补了这一空白。
CommonJS 规范了如何编写模块，以及如何在模块系统之间实现互操作。由于其同步执行特性，CMD 主要用于服务端开发，也可通过打包工具处理后用在浏览器端。

## 模块规范

1. 在模块中，有一个可用的 **require** 函数。
    1. **require** 函数接收一个模块标识符
    1. **require** 函数返回外部模块导出的 API
    1. 如果存在依赖循环，则外部模块在其传递依赖要求时可能尚未完成执行；在这种情况下，由 **require** 返回的对象必须至少包含外部模块在调用要求导致当前模块执行之前准备的导出。
    1. 如果要求的模块不能被返回，则 **require** 必须 **throw** 一个错误。
1. 在模块中，有一个名为 **exports** 的自由变量，该变量是模块在执行时可以向其添加 API 的对象。
1. 模块必须使用 **exports** 对象作为唯一的导出方法。

## 应用

所有代码都运行在模块作用域，不会污染全局作用域。模块的加载顺序，按照其在代码中的出现顺序。
接下来，我们尝试用 Commonjs 完成一个简单的小应用。在 **math.js** 中声明一个 CommonJS 模块，并通过 `exports` 导出名为 `add` 的方法。

```javascript
//math.js
exports.add = function() {
    var sum = 0, i = 0, args = arguments, l = args.length;
    while (i < l) {
        sum += args[i++];
    }
    return sum;
};
```

要使用刚才的 add，我们需要 **require** 它，下面我们引用 add 模块，并导出 `increment` 方法。如果要导出多个方法，
可以多次执行 `exports[api] = any` 操作，也可以在模块的最后，将要导出接口以对象形式赋值给 `exports`，如:`exports={any}`。

```javascript
//increment.js
var add = require('math').add;
exports.increment = function(val) {
    return add(val, 1);
};
```

在 **program.js** 中引用 `increment` 模块。

```javascript
//program.js
var inc = require('increment').increment;
var a = 1;
inc(a); // 2
```

## 循环依赖

当有循环require()调用时，模块返回时可能未完成执行。考虑这种情况：

// a.js：

```javascript
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```

// b.js：

```javascript
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```

// main.js：

```javascript
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```

在 main.js 加载 a.js，然后 a.js 加载 b.js。此时，b.js 尝试加载 a.js。为了防止无限循环，这将返回未完成的 a.js 的 exports 副本给 b.js 模块。随后 b.js 完成加载，并将其 exports 对象提供给 a.js 模块。在 main.js 加载两个模块时，它们都已完成。因此，该程序的输出为：

```bash
$ node main.js
# ---
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
