---
title: "Block Formatting Context"
date: 2020-10-10T17:03:29+08:00
draft: false
Description: "块格式化上下文(Block Formatting Context) 是一个独立的渲染区域，它指定内部 `Block-level Box` 的布局方式，并且与该区域的外部无关（无论内部元素如何排列，都不会影响外部元素）。"
type: "posts"    # posts | series
tags: [BFC, CSS, layout]
series: []
author: "Gl"
cover: 'css.jpg'     # image name
---

了解 BFC 是什么，它具备什么布局特性，以及如何创建 BFC，有助于深入理解 CSS 布局的工作方式。

## 什么是 BFC

**块格式化上下文(Block Formatting Context)** 是一个独立的渲染区域，它指定内部 `Block-level Box` 的布局方式，并且与该区域的外部无关（无论内部元素如何排列，都不会影响外部元素）。

## BFC 布局规则

1. 在块格式设置上下文中的盒子从其顶部开始垂直地一个接一个地布局。
1. 两个兄弟盒子之间的垂直距离由'margin'属性确定。块格式化上下文中相邻块级框之间的垂直边距将会叠加，最终结果由较大的外边距决定。
1. 在块格式上下文中的所有盒子都是左对齐（用于从左到右格式）的，并且它们的左外边缘接触包含块的左边缘，即便存在浮动盒子也是如此，除非创建了新的跨格式化上下文。

{{< image src="001.jpg" alt="Block Formatting Context">}}

如上图中所看到的，属于块格式上下文的所有盒子都左对齐（对于LTR），并且它们的左外边缘接触包含块的左边缘。在最后一个框中，我们可以看到，即使左侧有一个浮动的元素（棕色），另一个元素（绿色）仍会触及包含块的左侧边距。

## 如何创建 BFC

> Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.

让我们以一种更易于理解的方式重新定义它。满足以下条件之一即可出发块格式化上下文：

- `float` 属性不为 `none`
- `position` 属性不为 `static` 或 `relative`
- `display` 属性取值 `table-cell`，`table-caption`，`inline-block`，`flex` 或 `inline-flex`
- `overflow` 属性取值不为 `visible`

明确触发块格式化上下文条件后，如果我们想创建一个新的块格式上下文，只需要向其添加任何上述 CSS 条件即可。
尽管上述任何条件都可以创建块格式化上下文，但是也可能为你的布局带来一些副作用，例如：

- `display: table` 可能会在响应能力方面造成问题
- `overflow: scroll` 可能显示不需要的滚动条
- `float: left` 将元素推向左侧，其他元素环绕
- `overflow: hidden` 将剪辑溢出的元素

因此，无论何时创建新的块格式化上下文，都需在不造成副作用的前提下做出最佳选择。


## 使用 BFC

这里仅举例两个利用 BFC 特性的小用例。

利用其包含浮动元素的特性，可用来避免父元素内的浮动子元素逃逸。

{{<codepen id="RwRPovR" tab="html,result" height="700" >}}

根据[外边距合并原则](https://www.w3.org/TR/CSS2/box.html#collapsing-margins)，利用块格式上下文避免父子元素外边距合并。

{{<codepen id="NWrqbbd" tab="html,result" height="360">}}

## 参考

1. <https://www.w3.org/TR/CSS2/visuren.html#block-formatting>
1. <https://www.sitepoint.com/understanding-block-formatting-contexts-in-css/>
1. [Understanding Block Formatting Contexts in CSS](https://www.smashingmagazine.com/2017/12/understanding-css-layout-block-formatting-context/)