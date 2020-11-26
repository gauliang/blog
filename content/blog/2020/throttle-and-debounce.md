---
title: "Throttling and Debounce"
date: 2020-11-26T18:15:32+08:00
draft: false
Description: "节流是指，确保连续发生的事件（函数调用）按指定频率（时间间隔）触发执行器。防抖是指，事件发生（函数调用）后，在指定时间内，同样的操作只有最后一次会生效。"
type: "posts"    # posts | series
tags: [debounce,throttle,javascript]
series: []
author: "Gl"
cover: 'throttle-and-debounce.jpg'     # image name
---

## Throttle

节流是指，确保连续发生的事件（函数调用）按指定频率（时间间隔）触发执行器。
如：无论函数以什么频率被调用，均需确保在指定的时间区间内最大执行次数不超过 1 次。

根据上述需求，需要缓存一个时间戳，每次函数执行时用当前时间戳与缓存时间戳进行比对，
如果间隔大于指定要求，则更新缓存的时间戳并执行函数。接下来，我们来完成代码实现。

1. 定义一个高阶函数，在初始化的时候缓存时间戳；
2. 定义并返回节流函数，该函数每次被调用时，根据当前事件戳和缓存时间戳的情况来决策如何执行。

多数场景下，节流函数会与 DOM 事件一起使用，因此需要注意 `this` 的指向问题和 `arguments` 信息的透传。

```js
/**
 * Throttle
 * @param executor {Functioin} 执行器
 * @param time {Number} 节流时间,单位毫秒
 */
function Throttle(executor, time) {
    let prev = Date.now();
    return function () {
        let now = Date.now();
        if (now - prev > time) {
            // 运行执行器,需要注意两个细节：
            // 1. 指定 this
            // 2. 透传函数调用参数
            executor.call(this,...arguments);
            prev = now;
        }
    }
}
```

接下来，创建一个 `HTML` 文件，内容如下：

```html
...
<div id="app"><h2>Throttle</h2></div>
...
```

我们为页面中 `<div id="app">` 元素绑定 `mousemove` 事件，当鼠标在其上面移动，
打印函数执行时间、事件类型以及触发事件的 HTML 元素。

```js
let handle = Throttle(function (event) {
    console.log(`[${Date()}]`, 'throttle', event.type, this);
}, 1000);

document.getElementById('app').addEventListener("mousemove", handle);
```

打开页面，鼠标在 `#app` 上移动，将看到类似下面的输出：

```bash
[Thu Nov 26 2020 19：50:33] throttle mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19：50:34] throttle mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19：50:35] throttle mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19：50:36] throttle mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19：50:37] throttle mousemove <div id=​"app">​…​</div>​
```

Executor 根据节流配置(`1000ms`)均匀执行，成功打印事件类型，同时也通过 `this` 读取到了绑定事件的元素信息。

## Debounce

防抖是指，事件发生（函数调用）后，在指定时间内，同样的操作只有最后一次会生效。

根据上述需求，可以缓存一个定时器，每次函数执行时判断定时器状态，如果定时器尚未执行，则重置定时器。接下来，我们来完成代码实现。

1. 定义一个高阶函数，声明一个缓存定时器的变量；
2. 定义并返回节流函数，该函数每次被调用时，根据已缓存的定时器状态决策如何执行。

多数场景下，节流函数会与 DOM 事件一起使用，因此需要注意 `this` 的指向问题和 `arguments` 信息的透传。

```js
/**
 * Debounce
 * @param executor {Functioin} 执行器
 * @param time {Number} 节流时间,单位毫秒
 */
function Debounce(executor, time) {

    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        // 运行执行器,需要注意两个细节：
        // 1. 指定 this
        // 2. 透传函数调用参数
        timer = setTimeout(executor.bind(this, ...arguments), time);
    }
}
```

接下来，创建一个 HTML 文件，内容如下：

```html
...
<div id="app"><h2>Debounce</h2></div>
...
```

为页面中 `<div id="app">` 元素绑定 `mousemove` 事件，当鼠标在其上面移动， 打印函数执行时间、事件类型以及触发事件的 HTML 元素。

```js
let handle = Debounce(function (event) {
    console.log(`[${Date()}]`,'debounce',event.type, this);
}, 300);

document.getElementById('app').addEventListener("mousemove", handle);
```

打开页面，鼠标在 `#app` 上移动，将看到类似下面的输出：

```bash
[Thu Nov 26 2020 19:49:46] debounce mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19:49:48] debounce mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19:49:52] debounce mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19:49:56] debounce mousemove <div id=​"app">​…​</div>​
[Thu Nov 26 2020 19:49:59] debounce mousemove <div id=​"app">​…​</div>​
```

Executor 根据防抖配置(300ms)，对我们的连续操作进行了延时，并合并执行，成功打印事件类型，同时也通过 this 读取到了绑定事件的元素信息。
