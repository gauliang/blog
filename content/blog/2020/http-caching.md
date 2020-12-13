---
title: "Http Caching"
date: 2020-12-06T10:55:29+08:00
draft: true
Description: ""
type: "posts"    # posts | series
tags: []
series: []
author: "Gl"
cover: false     # image name
---

Web 缓存减少了等待时间和网络流量，因此减少了显示资源表示形式所需的时间。

## Cache-Control

用在 http 请求和响应中，通过指定指令来实现缓存机制。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中。

```text
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-control: no-cache 
Cache-control: no-store
Cache-control: no-transform
Cache-control: only-if-cached
```