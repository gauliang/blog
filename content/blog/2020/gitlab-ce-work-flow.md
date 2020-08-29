---
title: "Gitlab CE Work Flow"
date: 2020-08-29T08:09:15+08:00
draft: false
Description: "Gitlab-CE 工作流最佳实践"
type: "posts"    # posts | series
tags: ["devops","gitlab"]
series: ["Gitlab"]
author: "Gauliang"
cover: Gitlab-1.png     # image name
---

本系列文章旨在整理和规范 Gitlab-CE 在团队协作中的最佳应用建议。内容将覆盖工作流规范、CI、CD、WebHooks、ChatOps、Gitlab API、基础运维等。

## 一、认领 issue

1. 在项目仓库首页依次打开左侧菜单 Issues / Boards，进入看板页面；
2. 左侧 Open 列表中单击待认领的 Issue，在弹出的 Issue 信息面板中， 将其 Assigness 到自己名下。部分 Issue 会在创建时直接 Assigness 到相关人员，此时则无需再次 Assigness 操作；
3. 把当前 Issue 从左侧 Open 列表移动到 To Do 列表；

> 注：完成上述操作，页面右上角 To-Do 列表任务数将会加一。

## 二、开发

1. 创建分支，打开 Issue 页面，点击 **Create merge request** 按钮右侧下拉箭头，选择  Create branch，输入分支名称，创建分支。
2. 拉取新创建的分支到本地，开始开发工作。
3. 完成开发后，Push 当前分支代码到 Git 服务端。

## 三、创建 MR

1. 仓库首页打开 Merge Requests 页面，点击 **New merge request** 按钮。
2. 选择源分支以及要合并的目标分支，点击 **Compare branches and continue**。
3. MR 描述，在'Closes #{branch-id}'之后空出一行，输入当前 MR 相关的描述信息。
   `Close #{branch-id}` 会确保分支合并后自动关闭相关 Issue，`/done`确保分支合并后更新 Issue 的 Doing 标签为 Done。
   更多 Quick Actions 请参考 [GitLab Quick Actions](https://gitlab.com/help/user/project/quick_actions.md)
4. Assignee 参与代码审查的人员。如果需要更多人参与评审，可在MR创建完成后，在其评论区 **AT 具体人名**参与评审。
5. 在 Merge options 处，选中 `Delete source branch when merge request is accepted`。如果要在合并到 master 时
   压缩 commit 记录，可以选中  `Squash commits when merge request is accepted`。
6. Submit merge request 提交

## 四、代码审查

1. 仓库首页打开 Merge Requests ，列出全部 MR 清单，或通过页面右上角的 `Merge requests` 按钮打开一个仅包含需要你进行代码审查的MR清单。
2. 选择并打开需要 Review 的 MR 。在 Discussion 界面可以进行沟通，Commits 界面查看当前 MR 源分支上的所有提交，Changes 界面查看
   当前 MR 源分支与目标分支的变更对比。
3. 在Changes界面可以通过代码行号左侧的讨论图标对代码提出修改意见，这些修改意见的总数量会在 Changes 页面的 Tab 菜单右侧展示。浏览所有变更
   文件，并提出修改意见。
4. 针对 Review 中提出的问题，开发人员需在MR源分支上进行处理，处理后提交分支代码到服务器，在评论区**@ 相关审查人员**继续进行代码评审。
5. 审查人员再次对分支代码进行评审，将已经处理好的修改意见标记为 resolved，参考步骤[3]，对于新出现的问题继续提出修改意见。
6. 循环执行上述步骤 [4-5]，直至分支代码完全符合合并要求。
7. 当 Review 中提出的所有修改意见，全部被标记为 resolved 之后，在 Discussion 界面**回复 `/LGTM` 并 AT Master 分支管理员**。
8. 只要满足上述条件，CI 机器人或 Master 管理员会合并MR源分支到目标分支（Master），合并后，相关MR源分支自动删除，issue自动关闭。

## 五、完成

1. 更新 issue 上的 Doing 标签为 Done。
