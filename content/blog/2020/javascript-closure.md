---
title: "Javascript Closure"
date: 2020-10-11T18:45:55+08:00
draft: false
Description: "函数和与其相关的词法环境（lexical environment）一起构成闭包（closure）。闭包可以让你从内部函数访问外部函数作用域，在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。"
type: "posts"    # posts | series
tags: [closure, lexical-environment, javascript, node.js, 闭包]
series: []
author: "Gl"
cover: "cover.jpg"     # image name
---

## 什么是闭包

**定义** 函数和与其相关的词法环境（lexical environment）一起构成闭包（closure）。

闭包可以让你从内部函数访问外部函数作用域，在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。它使得我们能够创建有状态的函数。

## 词法环境

在 JavaScript 中，每个运行的函数，代码块 {...} 以及整个脚本，都有一个被称为 词法环境（Lexical Environment）的内部对象。
词法环境对象由两部分组成：

1. 环境记录（Environment Record）：一个存储所有局部变量作为其属性（包括一些其他信息，例如 this 的值）的对象。
1. 对 **外部词法环境** 的引用，与外部代码相关联。

一个”变量“只是 **环境记录** 这个特殊的内部对象的一个属性。“获取或修改变量”意味着“获取或修改词法环境的一个属性”。

在一个函数运行时，在调用刚开始时，会自动创建一个新的词法环境以存储这个调用的局部变量和参数。
当代码要访问一个变量时 —— 首先会搜索内部词法环境，然后搜索外部环境，然后搜索更外部的环境，以此类推，直到全局词法环境。
如果在任何地方都找不到这个变量，那么在严格模式下就会报错（在非严格模式下，为了向下兼容，给未定义的变量赋值会创建一个全局变量）。

这也就是闭包使得 **”在内部函数中总是可以访问其所在的外部函数中声明的变量和参数“** 的原因。

在 JavaScript 中，所有函数生来就是闭包（只有一个例外，即 `new Function` 语法，它的 `[[Environment]]` 指向全局词法环境）。
也就是说：函数会自动通过隐藏的 `[[Environment]]` 属性记住创建它们的位置，所以它们都可以访问外部变量。

## 闭包应用场景

闭包通常用于对象的数据私有化。数据私有化是帮助我们开发接口而不是实现（应用程序开发的详细实现）的重要属性。
他是帮助我们开发强大软件的重要概念，因为实现细节通常比接口约定更容易被破坏。

## 闭包使用注意事项

1. 由于闭包中的变量将不会被垃圾回收机制回收，因此，在使用闭包后，您应该手动删除不必要的局部变量，以免大量占用内存资源。
1. 闭包能够更改父函数中的变量，如果变量是静态变量或私有变量，则必须小心使用它。

## 参考

- <https://javascript.info/closure>
- <https://developer.mozilla.org/docs/Web/JavaScript/Closures>
- <https://exploringjs.com/deep-js/ch_environments.html>
- <https://www.debuggr.io/js-closure-in-depth>