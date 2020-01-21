---
title: "ubuntu 常用操作指南"
date: 2020-01-21T23:20:31+08:00
draft: false
Description: "本文整理记录 ubuntu 操作系统上常见问题处理说明。"
type: "posts"    # posts | series
tags: ["ubuntu", "linux", "handbook"]
series: []
author: "Gl"
cover: "cover.jpg"     # image name
---


**1. 移除桌面图标显示**

```bash
sudo apt remove gnome-shell-extension-desktop-icons
```

**2. 移除桌面边栏菜单**

```bash
sudo apt remove gnome-shell-extension-ubuntu-dock
```

**3. 双显示器**

桌面空间切换时，默认仅切换主显示器，如需同步切换，执行该操作。

```bash
sudo apt install gnome-tweaks
gnome-tweaks
```
启动 *gnome-tweaks* 进入 Workspaces 菜单，Display Handling 选项选择 *Workspaces span displays*

**4. 自动隐藏桌面顶部状态栏**

安装 GNOME Shell Extension **Hide Top Bar**

**5. 安装 Nodejs**

参考 https://github.com/nodejs/help/wiki/Installation 下载二进制文件完成安装。