---
title: "Javascript 编写高质量箭头函数"
date: 2020-09-05T10:51:40+08:00
draft: false
Description: "箭头函数的语法简洁明了，非常适合作为回调使用。本文介绍 5 中关于箭头函数的最佳实践。"
type: "posts"    # posts | series
tags: [javascript, arrow-function,best-practices]
series: []
author: "Gl"
cover: "javascript-arrow-function-best-practices.jpg"     # image name
---

> 译自 [5 Best Practices to Write Quality Arrow Functions](https://dmitripavlutin.com/javascript-arrow-functions-best-practices/)

箭头函数的语法简洁明了，非常适合作为回调使用。本文介绍 5 中关于箭头函数的最佳实践。

## 一、箭头函数名称推断

JS 中的箭头函数 name 值是一个空字符串。在调试会话或调用堆栈分析期间箭头函数被标记为 anonymous（匿名函数）。
不幸的是，代码调试时长anonymous 没有任何有关正在执行的代码的线索。

```javascript
( number => number + 1 ).name; // => ''
```

幸运的是，函数名称推断（ES2015 的功能）可以在某些条件下检测到函数名称。
名称推断的思想是 JavaScript 可以从其语法位置确定箭头函数名称：例如，从保存函数对象的变量名称确定。

```javascript
const increaseNumber = number => number + 1;
increaseNumber.name; // => 'increaseNumber'
```

**建议：** 一个好的做法是使用函数名称推断来命名箭头函数。

## 二、尽可能内联

内联函数是仅具有一个表达式的函数。例如，不要使用箭头函数的长形式，当箭头函数具有一个表达式时，
可以轻松删除花括号 `{ }` 和 `return` 语句：

```javascript
const array = [1, 2, 3];

// 建议
array.map(number => number * 2);

// 不建议
array.map((number) => {
  return number * 2;
});
```

**建议：** 当函数仅具有一个表达式时，一种好的做法是内联箭头函数。

## 三、箭头函数和比较运算符

比较运算符 `<`,`>`,`<=` 类似与 `=>`，在行内箭头函数中使用，会造成一些阅读混乱，比如：

```javascript
const negativeToZero = number => number <= 0 ? 0 : number;
```

为了清楚的把他们区分开，可以这样

```javascript
const negativeToZero = number => (number <= 0 ? 0 : number);
// 或者
const negativeToZero = number => {
  return number <= 0 ? 0 : number;
};
```

**建议：** 如果箭头函数中包含比较运算符，则好的做法是将表达式包装在一对括号中，或者故意使用长的箭头函数形式。

## 四、构造普通对象

内联箭头函数中的对象文字触发语法错误，JavaScript认为花括号是代码块，而不是对象文字。

```javascript
const array = [1, 2, 3];

// throws SyntaxError!
array.map(number => { 'number': number });
```

将对象文字换成一对括号即可解决此问题，如果对象文字具有很多属性，那么您甚至可以使用换行符，同时仍然使arrow函数保持内联：

```javascript
const array = [1, 2, 3];

// Works!
array.map(number => ({ 'number': number }));

// Works!
array.map(number => ({
  'number': number
  'propA': 'value A',
  'propB': 'value B'
}));
```

**建议：** 在内联箭头函数中使用时，将对象文字包装为一对括号。

## 五、注意过多的嵌套

箭头函数的语法很短，很好。但是，副作用是，当许多箭头函数嵌套时，它可能会很隐秘。
让我们考虑以下情形。单击按钮后，将启动对服务器的请求。响应准备就绪后，将各项记录到控制台：

```javascript
myButton.addEventListener('click', () => {
  fetch('/items.json')
    .then(response => response.json())
    .then(json => {
      json.forEach(item => {
        console.log(item.name);
      });
    });
});
```

上面的 3 级嵌套，降低了代码可读性。为了提高嵌套函数的可读性，第一种方法是引入每个包含箭头函数的变量。
该变量应简明地描述函数的功能。

```javascript
const readItemsJson = json => {
  json.forEach(item => console.log(item.name));
};

const handleButtonClick = () => {
  fetch('/items.json')
    .then(response => response.json())
    .then(readItemsJson);
};

myButton.addEventListener('click', handleButtonClick);
```

更好的是，您可以重构整个函数以使用 `async/await` 语法，这是解决函数嵌套的好方法：

```javascript
const handleButtonClick = async () => {
  const response = await fetch('/items.json');
  const json = await response.json();
  json.forEach(item => console.log(item.name));
};

myButton.addEventListener('click', handleButtonClick);
```

**建议：** 好的做法是通过将箭头函数提取为单独的函数或尽可能包含 `async/await` 语法来避免过多的箭头函数嵌套。

## 总结

JavaScript 中的箭头函数是匿名的。为了使调试高效，一个好的实践是使用变量来保存箭头函数。这允许 JavaScript 推断函数名称。

当函数主体具有一个表达式时，嵌入式箭头函数非常方便。

运算符 `>，<，<=` 和 `>=` 类似于箭头 `=>`。在行内箭头功能中使用这些运算符时必须小心。

对象字面量语法 `{ prop: 'value' }` 类似于代码块 `{ }`。因此，当将对象字面量放置在行内箭头函数中时，您需要将其包装在一对括号中：`() => ({ prop: 'value' })`。

最后，过多的函数嵌套会掩盖代码意图。减少箭头函数嵌套的一种好方法是将它们提取到变量中。或者，尝试使用更好的功能，例如 `async/await` 语法。
