---
title: "Ubuntu 18.04 安装 Java 环境 - OpenJDK"
date: 2020-01-21T00:20:08+08:00
draft: false
Description: "Java 和 JVM（Java 的虚拟机）被广泛使用，本文介绍如何使用 apt-get 安装不同版本的 Open JRE 和 Open JDK。JRE 仅用于提供 Java 应用程序执行环境，如果要编译 Java 应用程序，则要安装 JDK。"
type: "posts"    # posts | series
tags: ["Java"]
series: []
author: "Gl"
cover: false     # image name
---

Java 和 JVM（Java 的虚拟机）被广泛使用，本文介绍如何使用 `apt-get` 安装不同版本的 Open JRE 和 Open JDK。JRE 仅用于提供 Java 应用程序执行环境，如果要编译 Java 应用程序，则要安装 JDK。

## 先决条件

- Ubuntu 18.04 服务器
- 具有 sudo 或 root 执行权限的账户

## 安装默认版本

安装 Java 最简单的做法是使用 Ubuntu 系统自带的版本。默认情况下，Ubuntu 18.04 包含 Open JDK，它是 JRE 和 JDK 的开源变体。

```bash
# 更新软件包索引：
sudo apt update

# 检查是否已安装Java：
java -version
```

如果当前未安装 Java，则会看到以下输出：

```bash
Command 'java' not found, but can be installed with:
...
```

执行以下命令以安装 OpenJDK：

```bash
sudo apt install default-jre
```

该命令将安装 Java Runtime Environment（JRE），这将允许您运行几乎所有的Java软件。再次验证安装：

```bash
$ java -version
openjdk version "11.0.5" 2019-10-15
OpenJDK Runtime Environment (build 11.0.5+10-post-Ubuntu-0ubuntu1.118.04)
OpenJDK 64-Bit Server VM (build 11.0.5+10-post-Ubuntu-0ubuntu1.118.04, mixed mode, sharing)
```

除 JRE 之外，您可能还需要 Java 开发工具包（JDK），以便编译和运行某些基于 Java 的应用程序。要安装 JDK，请执行以下命令，该命令还将安装JRE：

```bash
sudo apt install default-jdk
```

通过检查编译器 javac 的版本，验证是否已安装JDK ：

```bash
javac -version

javac 11.0.5
```

## 安装指定版本

您可以安装默认的 OpenJDK 软件包，也可以安装不同版本的 OpenJDK。

列出可用版本清单：

```bash
kelsen@kelsen-XPS-L521X:~$ sudo apt install openjdk-
openjdk-11-dbg           openjdk-11-jre-zero      openjdk-12-jre-headless  openjdk-13-jre           openjdk-8-jdk-headless
openjdk-11-demo          openjdk-11-source        openjdk-12-jre-zero      openjdk-13-jre-headless  openjdk-8-jre
openjdk-11-doc           openjdk-12-dbg           openjdk-12-source        openjdk-13-jre-zero      openjdk-8-jre-dcevm
openjdk-11-jdk           openjdk-12-demo          openjdk-13-dbg           openjdk-13-source        openjdk-8-jre-headless
openjdk-11-jdk-headless  openjdk-12-doc           openjdk-13-demo          openjdk-8-dbg            openjdk-8-jre-zero
openjdk-11-jre           openjdk-12-jdk           openjdk-13-doc           openjdk-8-demo           openjdk-8-source
openjdk-11-jre-dcevm     openjdk-12-jdk-headless  openjdk-13-jdk           openjdk-8-doc            
openjdk-11-jre-headless  openjdk-12-jre           openjdk-13-jdk-headless  openjdk-8-jdk
```

### OpenJDK 8

Java 8 是当前的长期支持版本，尽管公共维护已于 2019 年 1 月结束，但仍得到广泛支持。要安装 OpenJDK 8，请执行以下命令：

```bash
sudo apt install openjdk-8-jdk

# 验证安装
java -version
```

也可以仅安装 JRE，可以通过执行 `sudo apt install openjdk-8-jre` 来完成。

```bash
sudo apt install openjdk-11-jre
```

### OpenJDK11/12

如果要安装 Java11

```bash
sudo apt install openjdk-11-jdk

# 或者仅安装 jre
sudo apt install openjdk-11-jre
```

## 管理 Java

一台服务器上可以安装多个版本的 Java。使用 `update-alternatives` 命令可以配置默认使用版本。

```bash
sudo update-alternatives --config java

There are 3 choices for the alternative java (providing /usr/bin/java).

  Selection    Path                                            Priority   Status
------------------------------------------------------------
  0            /usr/lib/jvm/java-13-openjdk-amd64/bin/java      1311      auto mode
* 1            /usr/lib/jvm/java-11-openjdk-amd64/bin/java      1111      manual mode
  2            /usr/lib/jvm/java-13-openjdk-amd64/bin/java      1311      manual mode
  3            /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java   1081      manual mode
```

输入与 Java 版本关联的数字以将其用作默认值，或按 ENTER 保留当前设置。

您可以对其他 Java 命令执行此操作，例如编译器（javac）：

```bash
sudo update-alternatives --config javac
```

## 环境变量 JAVA_HOME

使用 Java 编写的许多程序都使用 JAVA_HOME 环境变量来确定 Java 安装位置。要设置此环境变量，首先确定 Java 的安装位置。可以通过 `update-alternatives` 命令获取 Java 的安装路径。

复制默认版本 Java 的安装路径，然后编辑 `/etc/environment`，在此文件的末尾，添加或替换您自己复制的路径：

```bash
JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64/bin/"
```

重新加载此文件以将更改应用于当前会话：

```bash
source /etc/environment

# 验证
echo $JAVA_HOME
```
