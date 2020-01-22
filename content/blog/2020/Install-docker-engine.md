---
title: "在 Linux 和 Windows 平台安装 Docker CE"
date: 2020-01-22T16:32:22+08:00
draft: false
Description: "Docker 是一个用于开发、交付和运行应用程序的开放平台。Docker 使您能够将应用程序与基础架构分开，以与管理应用程序相同的方式来管理基础架构，从而快速交付软件。通过利用 Docker 快速交付、测试和部署代码的方法，您可以大大缩短编写代码和在生产环境中运行代码之间的时间。"
type: "posts"    # posts | series
tags: ["docker"]
series: []
author: "Gl"
cover: false     # image name
---

Docker 是一个用于开发、交付和运行应用程序的开放平台。Docker 使您能够将应用程序与基础架构分开，以与管理应用程序相同的方式来管理基础架构，从而快速交付软件。通过利用 Docker 快速交付、测试和部署代码的方法，您可以大大缩短编写代码和在生产环境中运行代码之间的时间。

## Windows 系统安装

windows10 操作系统自带 `windows hyper-v` 可以非常方便的运行 Docker。 在 windows7 系统上则稍微复杂一点，需通过安装 Docker-Toolbox 来使用 Docker（用 Oracle virtualbox 来取代 `Hyper-V`）。

- windows 10 安装 [Docker for Windows Installer](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe)
- windows 7 安装  [Docker Toolbox](https://docs.docker.com/toolbox/overview/)

安装完成后，要启动 Docker 请从开始菜单打开 `Docker for Winodws`，window7 系统需打开 `Kitematic`，Kitematic 提供直观的图形用户界面来运行 Docker 容器。

虽然在 windows7 平台通过 DockerToolbox 可以正常运行 Docker，但使用体验一般，建议迁移到 Linux 平台，debian / ubuntu / fedora 等都是不错的选择。

## Linux 系统安装

这里以 Fedora 为例（当前最新版本为 Fedora28），简要整理一下安装过程，其他环境大同小异。

### 卸载旧版本

如果存在旧版本的 Docker 则将其卸载，不存在可忽略此步骤。

```bash
$ sudo dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```

### 安装 Docker CE

```bash
# 1. 安装dnf-plugins-core包，该包提供从命令行管理DNF存储库的命令。
$ sudo dnf -y install dnf-plugins-core

# 2. 设置存储库
```bash
$ sudo dnf config-manager \
    --add-repo \
    https://download.docker.com/linux/fedora/docker-ce.repo

# 3. 安装 Docker CE
$ sudo dnf install docker-ce

# 4.  启动 Docker
$ sudo systemctl start docker

# 5. 设置开机启动
$ sddo systemctl enable docker

# 6. 更新用户组
$ sudo usermod -aG docker $USER
```

注销并重新登陆后即可直接运行 `docker` 命令，而不用添加 `sudo` 前缀。

## 测试安装是否成功

```bash
docker run hello-world
```

此命令将下载 `hello-world` 镜像并在容器中运行它。当容器运行时，它会打印一条消息并退出。

## 卸载 Docker CE

Windows 平台到控制面板应用管理中卸载，Linux 平台使用下面命令卸载。

```bash
# 1. 卸载 Docker CE
$ sudo dnf remove docker-ce

# 2. 删除镜像和容器
$ sudo rm -rf /var/lib/docker
```
