---
title: "Git Rebase"
date: 2020-09-13T09:39:21+08:00
draft: false
Description: "在 Git 中整合来自不同分支的修改主要有两种方法：merge 以及 rebase。rebase 命令能够将提交到某一分支上的所有修改都应用到另一分支上。"
type: "posts"    # posts | series
tags: [devops, git, rebase]
series: []
author: "Gl"
cover: "cover.jpg"     # image name
---

在 Git 中整合来自不同分支的修改主要有两种方法：**merge** 以及 **rebase**。
这两种整合方法的最终效果一致，但 rebase 使得提交历史更加整洁。
在查看一个经过 rebase 的分支历史记录时会发现，尽管实际的开发工作是并行的， 但它们看上去就像是串行的一样，
提交历史是一条直线没有分叉。

## 执行流程

Rebase 背后的执行流程如下：

1. 找出 **当前分支** 和 **rebase 目标分支** 的最近共同祖先节点；
1. 对比当前分支相对于该祖先的历次提交，提取相应的修改并存到临时区域；
1. 定位目标分支最后更新节点；
1. 将之前另存为临时文件的修改依序应用。
1. 在目标分支进行 **快进合并**

**rebase** 将一系列提交按照原有次序依次应用到另一分支上，这与 **merge** 直接把最终结果合并在一起创建新的提交不同。
这也意味着，**rebase** 修改了提交历史。

## Rebase 进阶

在对两个分支进行 rebase 时，生成的 ”补丁“ 不一定要在目标分支上应用，还可以指定另外一个分支进行应用。

```bash
git rebase --onto master server client
```

以上命令将取出 client 分支，找出它从 server 分支分岔之后的补丁， 然后把这些补丁在 master 分支上重放一遍，让 client 看起来像直接基于 master 修改一样。

应用补丁过程中的冲突会阻止 rebase 继续执行，在处理完冲突后直接执行 `git rebase --continue` 即可，无需 `commit`。如果要绕过导致合并失败的提交，可以执行
`git rebase --skip`。如果要取消 rebase，执行 `git rebase --abort`。

考虑以下情况：

```text
     A---B---C topic
    /
D---E---F---G master
```

假设你当前处于 **topic** 分支上，执行下面命令，得到结果是相同的：

```bash
git rebase master
git rebase master topic
```

结果

```text
              A'--B'--C' topic
             /
D---E---F---G master
```

## Rebase 风险

不要在公共分支上进行 rebase 操作，别人可能基于你的提交进行开发。总的原则是，只对尚未推送或分享给别人的本地修改执行变基操作清理历史， 从不对已推送至别处的提交执行变基操作，这样，你才能享受到两种方式带来的便利。
