---
title: "安装和配置 kubectl & istioctl"
date: 2020-08-09T11:13:31+08:00
draft: false
Description: "本文整理记录 ubuntu 操作系统上常见问题处理说明。"
type: "posts"    # posts | series
tags: ["cloudnative", "linux", "kubernetes","service-mesh"]
series: []
author: "Gl"
cover: "cover.jpg"     # image name
---

## 一、Kubectl

`kubectl` 是 Kubernetes 的命令行工具，通过它可以对 Kubernetes 集群执行指定的命令。
通过 `kubectl` 你可以部署应用，检查和管理集群资源并查看日志等。

### 1. 安装 kubectl

**Linux** ubuntu 系统

```bash
sudo apt install kubectl
# 测试
kubectl version --client
```

**Macos** 系统

```bash
brew install kubectl
# 测试
kubectl version --client
```

### 2. 配置 kubectl 自动补全

kubectl 为 bash 和 zsh 提供自动补全能力。`kubectl completion bash` 命令可生成 Bash 的自动补全脚本，该脚本基于 **bash-completion**，需要线安装该软件。

**Linux** 系统

```bash
# 该命令会创建 `/usr/share/bash-completion/bash_completion`
sudo apt install bash-completion
# 启用kubectl自动补全
echo 'source <(kubectl completion bash)' >>~/.bashrc
```

**MacOS** 系统

将以下内容添加到 `~/.zshrc` 文件中：

```bash
autoload -Uz compinit
compinit
source <(kubectl completion zsh)
```

## 二、Istioctl

### 1. 安装 istioctl

**Linux** 系统

```bash
sudo apt install istioctl
```

**Macos** 系统

```bash
brew install istioctl
```

### 2. 配置 istioctl 自动补全

要 istioctl 在系统上启用完成功能，请执行以下步骤：

**Linux** 系统

如果您使用的是基于 Linux 的操作系统，则可以使用以下 `apt-get install bash-completion` 命令安装Bash完成包：基于 Debian 的 Linux 发行版
或 `yum install bash-completion` 基于 RPM 的 Linux 发行版，这是最常见的两种情况。

在 Linux 系统上安装了 bash-completion 软件包之后，将以下行添加到~/.bash_profile文件中：

```bash
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

**MacOS** 系统

将以下内容添加到 `~/.zshrc` 文件中：

```bash
source ~/_istioctl
```

## 三、参考

1. <https://kubernetes.io/docs/tasks/tools/install-kubectl/#optional-kubectl-configurations>
1. <https://istio.io/latest/docs/ops/diagnostic-tools/istioctl/#istioctl-auto-completion>
