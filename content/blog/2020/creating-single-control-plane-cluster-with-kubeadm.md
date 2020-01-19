---
title: "使用 kubeadm 安装单控制平面 Kubernetes 集群"
date: 2020-01-19T20:30:54+08:00
draft: false
Description: "本文主要介绍如何使用 kubeadm 安装部署单控制平面 Kubernetes v1.17.0 集群，所谓单控制平面，顾名思义就是由一个 Control-plane Node 和多个 Work Node 组成的 Kubernetes 集群。"
type: "posts"    # posts | series
tags: ["kubernetes", "docker", "dashboard", "ingress-nginx"]
series: []
author: "Gl"
cover: "cover.png"     # image name
---

{{< image src="cover.png" alt="部署单控制平面 k8s 集群，并安装 Dashboard 和 ingress-nginx 使外部浏览器可以访问集群。">}}

## 一、拓扑结构

本文主要介绍如何使用 kubeadm 安装部署单控制平面 Kubernetes v1.17.0 集群，所谓单控制平面，顾名思义就是由一个 Control-plane Node 和多个 Work Node 组成的 Kubernetes 集群。高可用集群与此不同，其由多个 Control-plane Node 和多个 Work Node 组成，高可用集群部署中，根据 etcd 数据库部署位置的不同，又分为栈内 etcd 数据库部署和外部独立 etcd 数据库集群部署两种模式。
下面展示了不同部署模式的拓扑结构：

{{< image src="kubeadm-scp-topology.svg" alt="单控制平面拓扑结构">}}

{{< image src="kubeadm-ha-topology-stacked-etcd.svg" alt="高可用拓扑结构（栈内 etcd 数据库）">}}

{{< image src="kubeadm-ha-topology-external-etcd.svg" alt="高可用拓扑结构（外部独立 etcd 数据库集群）">}}

高可用部署与单控制平面部署不同，不过，除负载均衡及多 kube-apiserver 部分外，其他流程大同小异。有关高可用安装的更多信息请参考 [Creating Highly Available clusters with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/high-availability/)。

## 二、准备工作

硬件要求，建议 4 核以上 CPU，8GB 以上内存，Ubuntu 16.04 以上或 CentOS 7 以上版本的操作系统，确保所有服务器间网络通信正常，1 台服务器作为控制平面节点，其余若干台服务器作为工作节点，我这里准备了4个工作节点。基本信息如下：

| 名称 | CPU | 内存 | IP | OS | 安装 | 用途 |
| --- | --- | --- | --- | --- | --- | --- |
| CPN-1 | 4U | 8GB | 10.163.10.6 | ubuntu18.04 | docker , kubeadm, kubelet , kubectl | Control Plane Node |
| WN-1 | 4U | 8GB | 10.163.10.7 | ubuntu18.04 | docker , kubeadm, kubelet | Worker Node |
| WN-2 | 4U | 8GB | 10.163.10.8 | ubuntu18.04 | docker , kubeadm, kubelet | Worker Node |
| WN-2 | 4U | 8GB | 10.163.10.9 | ubuntu18.04 | docker , kubeadm, kubelet | Worker Node |
| WN-2 | 4U | 8GB | 10.163.10.10 | ubuntu18.04 | docker , kubeadm, kubelet | Worker Node |

### 安装 docker

K8S 支持多种容器运行时环境，我们选择 docker，首先为所有节点服务器安装 docker，目前 kubernetes 最新版(v1.17.0) 可以完全兼容支持的 docker 最高版本为 v19.03，我们选择 Docker 的最新稳定版本 v19.03 作为容器运行时环境。安装细节可参考 [Get Docker Engine - Community for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)。

```bash
# 删除旧版本docker
$ sudo apt-get remove docker docker-engine docker.io containerd runc

# 更新 apt 
$ sudo apt-get update

# 安装工具包
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

# 添加Docker官方 GPG key
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 添加 stable apt 源
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# 安装 Docker CE
$ sudo apt-get update
$ sudo apt-get install \
  containerd.io=1.2.10-3 \
  docker-ce=5:19.03.4~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.4~3-0~ubuntu-$(lsb_release -cs)
```

如果你的网络环境从官方仓库安装速度较慢，可以使用阿里云镜像仓库安装。步骤如下：

```bash
# step 1: 安装必要的一些系统工具
sudo apt-get update
sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common

# step 2: 安装GPG证书
curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -

# Step 3: 写入软件源信息
sudo add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"

# Step 4: 更新并安装 Docker-CE
sudo apt-get -y update

# Step 5: 选择安装版本
apt-cache madison docker-ce

# Step 6: 安装
$ sudo apt-get update
$ sudo apt-get install \
  containerd.io=1.2.10-3 \
  docker-ce=5:19.03.4~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.4~3-0~ubuntu-$(lsb_release -cs)  
```

### 后续操作

**1、当前用户加入"docker"用户组**

```bash
$ sudo usermod -aG docker $USER
```
**2、 配置 cgroup 驱动为 systemd，同时，增加 docker 仓库镜像配置。**

```bash
#  创建文件 /etc/docker/daemon.json ，内容如下：
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/"]
}
```
**3、重启服务生效配置**
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker.service
```
**4、检查配置是否生效**
```bash
docker info | grep Cgroup

# ECHO ------
Cgroup Driver: systemd

```

### 关闭 swap

```bash
swapoff -a && sudo sed -i 's/^.*swap/#&/g' /etc/fstab
```

### 安装 kubelet kubeadm kubectl

由于网络原因，直接 APT-GET 安装可能安装不了，这里需要配置一下镜像仓库。

**1、配置阿里云 kubernetes 镜像仓库**
```bash
$ sudo apt-get update && sudo apt-get install -y apt-transport-https

curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add -
```

**2、创建文件 `/etc/apt/sources.list.d/kubernetes.list`， 内容如下：**

```bash
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
```

**3、安装 kubelet kubectl kubeadm**
```bash
$ sudo apt-get update
$ sudo apt-get install -y kubelet kubeadm kubectl
```

**4、设置 kubelet 开机启动**
```bash
$ sudo systemctl enable kubelet
```

## 三、部署控制平面节点

过程中会用到一系列来自 Google 的 docker 镜像，可以通过 `kubeadm config images pull` 命令验证网络是否能够正常拉取镜像。如果无法访问，可从其他镜像仓库下载，然后再修改镜像标签，以启动相关 pod。

### 准备镜像

列出安装过程中需要用到的镜像文件，命令为

```bash
kubeadm config images list

# ECHO ------
k8s.gcr.io/kube-apiserver:v1.17.0
k8s.gcr.io/kube-controller-manager:v1.17.0
k8s.gcr.io/kube-scheduler:v1.17.0
k8s.gcr.io/kube-proxy:v1.17.0
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.4.3-0
k8s.gcr.io/coredns:1.6.5
```

这里选择从 Docker hub 的 gotok8s 仓库拉取镜像副本，然后再修改 tag 名称，脚本如下：

```sh
images=(kube-apiserver:v1.17.0 kube-controller-manager:v1.17.0 kube-scheduler:v1.17.0 kube-proxy:v1.17.0 pause:3.1 etcd:3.4.3-0 coredns:1.6.5)
for imageName in ${images[@]} ; do
  docker pull gotok8s/$imageName  
  docker tag gotok8s/$imageName k8s.gcr.io/$imageName  
  docker rmi gotok8s/$imageName
done

```

### 初始化控制平面节点

控制平面节点是运行控制平面组件的机器，包括 etcd（集群数据库）和 API Server （kubectl CLI 与之通信）。

需要安装 Pod 网络插件，才能使得集群 Pod 间可以相互通信，必须在任何应用程序之前部署 Pod 网络。此外，CoreDNS 将不会在安装网络之前启动。kubeadm 仅支持基于容器网络接口（CNI）的网络，有几个项目使用 CNI 提供了 Kubernetes Pod 网络，其中一些还支持网络策略。有关可用的网络加载项列表，请参阅[网络组件页面](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)。

另外，请注意，Pod 网络不得与任何主机网络重叠，因为这可能会导致问题。如果发现网络插件的首选 Pod 网络与某些主机网络之间发生冲突，在执行命令 kubeadm init 时应通过指定 --pod-network-cidr 参数配置网络，并在网络插件的 YAML 中修改相应信息。

这里选择 `calico` 网络插件，根据 Calico 文档说明，我们需为 ` kubeadm init ` 指定 `--pod-network-cidr=192.168.0.0/16` 参数。现在运行 `kubeadm init <args> `，命令如下：

```bash
sudo kubeadm init \
    --kubernetes-version=v1.17.0 \
    --apiserver-advertise-address=10.163.10.6 \
    --pod-network-cidr=192.168.0.0/16
```

如果一切正常，安装成功，将输入类似下面的结果信息：

```bash
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 10.163.10.6:6443 --token xxxxxx.xxxxxxxxxxxxxxxx \
    --discovery-token-ca-cert-hash sha256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

根据提示消息，依次执行以下命令：

```bash
  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

注意记录输出结果中的 `kubeadm join ***` 信息，随后在添加工作节点到集群时需要用到，可以复制后暂存在某个地方。

### 安装网络

此时，我们通过 `kubectl get pods --all-namespaces` 命令，应该可以看到 CoreDNS pod  处于 pending 状态，安装网络以后，它才能处于 running 状态。我们选择 calico 为 pod 提供网络，pod 网络组件本身以 k8s 应用的形式运行，执行下面命令进行安装。

```bash
kubectl apply -f https://docs.projectcalico.org/v3.11/manifests/calico.yaml
```

安装了 Pod 网络后，可以通过检查 CoreDNS Pod 的运行状态来确认它是否正常工作 `kubectl get pods --all-namespaces`。

```bash
kubectl get pods --all-namespaces

# ECHO ----
NAMESPACE     NAME                                       READY   STATUS    RESTARTS   AGE
kube-system   calico-kube-controllers-7bd78b474d-vmq2w   1/1     Running   0          4m57s
kube-system   calico-node-2cwtx                          1/1     Running   0          4m57s
kube-system   coredns-5c98db65d4-gv2j6                   1/1     Running   0          10m
kube-system   coredns-5c98db65d4-n6lpj                   1/1     Running   0          10m
kube-system   etcd-vm-10-13-ubuntu                       1/1     Running   0          8m54s
kube-system   kube-apiserver-vm-10-13-ubuntu             1/1     Running   0          9m10s
kube-system   kube-controller-manager-vm-10-13-ubuntu    1/1     Running   0          9m3s
kube-system   kube-proxy-qbk66                           1/1     Running   0          10m
kube-system   kube-scheduler-vm-10-13-ubuntu             1/1     Running   0          9m8s
```
pod 启动需要时间，请耐心等待。

## 四、加入工作节点

CoreDNS Pod 启动并运行后，我们可以为集群添加工作节点。工作节点服务器需安装 Docker 、kubeadm 和 kubelet，安装过程请参考前面相关小节。

### 拉取镜像

工作节点服务器需要至少启动两个 pod ，用到的镜像为 `kube-proxy` 和 `pause` ，同理我们无法直接从 k8s.grc.io 下载，需要提前拉取镜像并修改 tag ，执行下面命令：

```sh
images=(kube-proxy:v1.17.0 pause:3.1)
for imageName in ${images[@]} ; do
  docker pull gotok8s/$imageName  
  docker tag gotok8s/$imageName k8s.gcr.io/$imageName  
  docker rmi gotok8s/$imageName
done

```

### 加入集群

执行控制平面节点初始化完成后提供的添加工作节点命令，格式如下：

```bash
kubeadm join --token <token> <master-ip>:<master-port> --discovery-token-ca-cert-hash sha256:<hash>
```

命令中的 `--token` 和 `--discovery-token-ca-cert-hash` 在集群 kube-apiserver 节点部署完成后的结果信息中有体现，直接复制出来即可使用。

可以通过在控制平面节点执行 `kubeadm token list` 来获取 token 信息，token 令牌会在 24 小时候失效，如果要创建新的令牌，使用 `kubeadm token create` 命令。

可以通过下面命令获取 `--discovery-token-ca-cert-hash` 

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

注意，如果需要重新执行 `kubeadm join` ，需在控制平面节点删除该节点 `kubectl delete node node-name`，并在工作节点上执行 `kubeadm reset` 进行清理工作。

节点执行完 join 命令后，可以在控制平面节点检查 pod 启动进度 `watch kubectl get pods --all-namespaces -o wide`，观察新节点服务器上的 Pod 状态，正常启动则加入成功且节点状态为 `Ready`。参照上述步骤，依次将所有工作节点加入集群。

### 检查工作节点状态

工作节点加入集群后，随着工作节点上相应 Pod 的正常启动，工作节点状态会由 `NotReady` 切换到 `Ready`，Pod 启动需要时间，请耐心等待。所有节点正常加入集群后，可以通过命令查看节点状态：

```bash
kubectl get nodes

# ECHO ------
NAME              STATUS   ROLES    AGE    VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
vm-10-6-ubuntu    Ready    master   9h     v1.15.2   10.163.10.6    <none>        Ubuntu 18.04.1 LTS   4.15.0-54-generic   docker://18.6.3
vm-10-7-ubuntu    Ready    <none>   9h     v1.15.2   10.163.10.7    <none>        Ubuntu 18.04.1 LTS   4.15.0-54-generic   docker://18.6.3
vm-10-8-ubuntu    Ready    <none>   9h     v1.15.2   10.163.10.8    <none>        Ubuntu 18.04.1 LTS   4.15.0-54-generic   docker://18.6.3
vm-10-9-ubuntu    Ready    <none>   8h     v1.15.2   10.163.10.9    <none>        Ubuntu 18.04.1 LTS   4.15.0-54-generic   docker://18.6.3
vm-10-10-ubuntu   Ready    <none>   120m   v1.15.2   10.163.10.20   <none>        Ubuntu 18.04.1 LTS   4.15.0-54-generic   docker://18.6.3
```

## 五、安装 Dashboard

Dashboard 不会随集群一起安装，需要单独部署，执行下面命令安装：

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc2/aio/deploy/recommended.yaml
```

这里要注意 Dashboard 的版本，并非所有版本的 Dashboard 都能和任意版本的 k8s 集群完全兼容。引用官网对照表 

| Kubernetes version | 1.11	| 1.12 | 1.13 | 1.14 | 1.15 | 1.16 |
| --- | --- | --- | --- | --- | --- | --- |
| Compatibility |	? |	? |	? |	? |	? | ✓ |

- **✓** 完全支持。
- **?** 由于 Kubernetes API 版本之间的变化，部分功能无法正确地在 Dashboard 中工作。

默认情况下，Dashboard 使用最小 RBAC 配置进行部署。目前，Dashboard 仅支持使用 Bearer Token 登录。可以按照[关于创建示例用户的指南](https://github.com/kubernetes/dashboard/wiki/Creating-sample-user) 进行操作。

关于 Dashboard 的使用，随后会抽时间再详细写一篇进行介绍。

## 六、Inress-nginx

1. 选择一个节点，打上 `node.k8s.xx.cn/role: ingress` 标签，以便于下一步进行 Pod 调度。

1. 下载 ingress-nginx 资源信息

```bash
wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/mandatory.yaml
wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/baremetal/service-nodeport.yaml
```
1. 修改配置信息

修改 ingress-nginx 安装文件 `mandatory.yaml`，以确保 nginx-ingress-controller 运行在指定节点上。

```yaml
...
      nodeSelector:
        kubernetes.io/os: linux
        node.k8s.xx.cn/role: ingress
      serviceAccountName: nginx-ingress-serviceaccount
...
```
配置 service 为集群 IP 类型，并配置 `externalIPs` 以对外暴露服务。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ingress-nginx
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
spec:
  type: ClusterIP
  externalIPs:
    - 10.163.10.7
  ports:
    - name: http
      port: 80
      targetPort: 80
      protocol: TCP
    - name: https
      port: 443
      targetPort: 443
      protocol: TCP
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
---
```
1. 安装 ingress-nginx

```bash
kubectl apply -f mandatory.yaml
kubectl apply -f service-nodeport.yaml
```

## 七、访问 Dashboard

现在有了 Dashboard 和 Ingress 我们可以通过一些简单的配置使 dashbaord 可从外部访问。

**1、创建 Service 以将外部流量倒向 Dashboard**
```yaml
kind: Service
apiVersion: v1
metadata:
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
  labels:
    k8s-app: kubernetes-dashboard
spec:
  ports:
    - protocol: TCP
      port: 443
      targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
  type: ClusterIP
  sessionAffinity: None
```

**2、创建存储 TLS 数字证书的 Secret**

Dashboard 只能通过 HTTPS 访问，我们需要准备一个域名并为其签发数字证书。以 `www.yourdomain.com` 域名为例，在命名空间 `kubernetes-dashboard` 创建 Secret。
```bash
kubectl create secret tls cloud.jfjbapp.cn --cert=$HOME/certs/dashboard.crt --key=$HOME/certs/dashboard.key -n kubernetes-dashboard
```

**3、创建 Ingerss 将外部流量倒入集群**
```yaml
kind: Ingress
apiVersion: extensions/v1beta1
metadata:
  name: dashboard-ingress
  namespace: kubernetes-dashboard
  annotations:
    nginx.ingress.kubernetes.io/backend-protocol: HTTPS
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  tls:
    - hosts:
        - www.yourdomain.com
      secretName: www.yourdomain.com
  rules:
    - host: www.yourdomain.com
      http:
        paths:
          - path: /kube(/|$)(.*)
            backend:
              serviceName: kubernetes-dashboard
              servicePort: 443
```

浏览器访问 https://www.yourdomain.com/kube/，输入登陆信息，即可正常使用 Kubernetes Dashboard 。

## 八、完成
现在我们已经拥有一个 4 工作节点的单控制平面 k8s 集群，本文仅简单介绍了部署过程，关于集群的管理、使用还会涉及到非常多 k8s 概念及领域知识，官网文档基本上很详细的介绍了各类概念，还有详尽的操作演示，可以多看、多实践。