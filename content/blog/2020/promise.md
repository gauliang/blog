---
title: "Javascript Promise"
date: 2020-09-13T20:00:24+08:00
draft: false
Description: "Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值。本质上 Promise 是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了。"
type: "posts"    # posts | series
tags: [javascript,node.js,promise]
series: []
author: "Gl"
cover: '001.jpg'     # image name
---

JavaScript 是单线程工作，这意味着两段脚本不能同时运行，而是必须一个接一个地运行。
操作其中一项任务会延迟其他任务。您可能已使用事件和回调来解决该问题。
Promise 有点类似于事件侦听器，但有以下两点区别：

1. promise 只能成功或失败一次， 而不能成功或失败两次，也不能从成功转为失败或从失败转为成功。
1. 如果 promise 已成功或失败，且您之后添加了成功/失败回调，则将会调用正确的回调，即使事件发生在先也是如此。

Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值。
本质上 Promise 是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了。

## 概述

Promise 构造函数包含一个参数，该参数是带有 resolve（解析）和 reject（拒绝）两个参数的回调。在回调中执行一些操作（例如异步），如果一切都正常，则调用 resolve，否则调用 reject。

```js
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});

promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error:"It broke"
});
```

`then()` 包含两个参数：一个用于成功情形的回调和一个用于失败情形的回调。这两个皆可选，因此您可以只添加一个用于成功情形或失败情形的回调。

## 链试调用

（一）、可以在方法中返回或改变值：

```js
var promise = new Promise(function(resolve, reject) {
  resolve(1);
});

promise.then(function(val) {
  console.log(val); // 1
  return val + 2;
}).then(function(val) {
  console.log(val); // 3
})
```

（二）、还可以链接多个 `then()`，以便按顺序运行异步操作。当您 then() 回调中返回某些内容时：

1. 如果返回一个值，则会以该值调用下一个 then()。
1. 但是，如果返回类似于 Promise 对象，则下一个 then() 则会等待，并仅在 Promise 产生结果（成功/失败）时调用。

```js
getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  console.log("Got chapter 1!", chapter1);
})
```

## 错误处理

`then()` 包含两个参数：一个用于成功，一个用于失败：

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}, function(error) {
  console.log("Failed!", error);
})
```

也可以使用 `catch()`：

```js
get('story.json').then(function(response) {
  console.log("Success!", response);
}).catch(function(error) {
  console.log("Failed!", error);
})
```

## Promise API

1. `Promise.all(promises)` —— 等待所有 promise 都 resolve 时，返回存放它们结果的数组。如果给定的任意一个 promise 为 reject，那么它就会变成 Promise.all 的 error，所有其他 promise 的结果都会被忽略。
1. `Promise.allSettled(promises)`（ES2020 新增方法）—— 等待所有 promise 都 settle 时，并以包含以下内容的对象数组的形式返回它们的结果：
    - status: "fulfilled" 或 "rejected"
    - value（如果 fulfilled）或 reason（如果 rejected）。
1. `Promise.race(promises)` —— 等待第一个 settle 的 promise，并将其 result/error 作为结果。
1. `Promise.resolve(value)` —— 使用给定 value 创建一个 resolved 的 promise。
1. `Promise.reject(error)` —— 使用给定 error 创建一个 rejected 的 promise。