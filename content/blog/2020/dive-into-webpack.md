---
title: "深入 Webpack"
date: 2020-09-05T08:34:50+08:00
draft: true
Description: ""
type: "posts"    # posts | series
tags: [webpack]
series: [Dive into webpack]
author: "Gl"
cover: false     # image name
---

前端生态蓬勃发展，各垂直领域都有众多设计精良的优秀项目，几乎在所有场景中，应用系统都不同程度依赖这些三方项目。
同时，新的设计理念和开发思想不断被提出并投入被实践，应用程序本身也变的复杂起来。
这些都为快速构建和部署项目带来了挑战，于是很多用于工程化管理前端项目的工具诞生了。

Webpack 正是这样一个工具，接下来将深入探索这些功能，以优化应用程序并提高开发体验。

## Webpack 是什么

简单说，webpack 是一个模块打包器，他将模块间的依赖关系图优化成一个 chunk 图。

### Javascript 模块系统比较

| ---        | AMD              | CommonJS         | ESM                      |
|------------|------------------|------------------|--------------------------|
| Analyzable | With limitations | With limitations | Yes                      |
| Resolving  | Asynchronous     | Synchronous      | Implementation specific  |
| Linking    | Copy by value    | Copy by value    | Live binding             |
| Scoping    | Function wrapper | Function wrapper | New language environment |

## 热重载

## 参考

https://peerigon.github.io/talks/2018-09-28-hackerkiste-webpack-deep-dive