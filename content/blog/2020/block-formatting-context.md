---
title: "Block Formatting Context"
date: 2020-10-10T17:03:29+08:00
draft: true
Description: "块格式化上下文(Block Formatting Context)  是一个独立的渲染区域，仅块级元素参与其中。它指定内部块级元素的布局方式，与该区域的外部无关。
了解 BFC 是什么，它为什么起作用以及如何创建 BFC，有助于深入理解 CSS 布局的工作方式。"
type: "posts"    # posts | series
tags: [BFC, CSS]
series: []
author: "Gl"
cover: false     # image name
---

了解 BFC 是什么，它为什么起作用以及如何创建 BFC，有助于深入理解 CSS 布局的工作方式。

## 什么是 BFC

**块格式化上下文(Block Formatting Context)** 是一个独立的渲染区域，仅 `Block-level box` 参与其中，它指定内部 `Block-level Box` 的布局方式，并且与该区域的外部无关（无论内部元素如何排列，都不会影响外部元素），BFC 仍然属于文档中的正常流程。

## BFC 布局规则

## 理解 BFC

## 如何创建 BFC

满足下列条件之一则可以触发 BFC：

- 根元素
- 浮动属性不是无
- 位置不是静态的还是相对的
- 溢出不可见
- 显示内容为内联块，表单元格，表标题，伸缩，内联伸缩