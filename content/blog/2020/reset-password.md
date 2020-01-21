---
title: "常用系统 root 密码重置"
date: 2020-01-21T22:44:48+08:00
draft: false
Description: "本文介绍如何重置各类常用业务系统的超级管理员账号密码，如 MySQL、Gitlab 等。"
type: "posts"    # posts | series
tags: ["MySQL", "Gitlab", "handbook"]
series: []
author: "Gl"
cover: "password_security_feature.png"     # image name
---

## 1、MySql 5.7

本节介绍如何重置 MySql 5.7 系统 root 用户密码。

**首选，以安全模式登录**

```bash
# Stop MySQL
sudo service mysql stop

# Make MySQL service directory.
sudo mkdir -p /var/run/mysqld

# Give MySQL user permission to write to the service directory.
sudo chown mysql:mysql /var/run/mysqld

# Start MySQL manually, without permission checks or networking.
sudo mysqld_safe --skip-grant-tables &

# Log in without a password.
mysql -u root
```

**现在可以修改密码**

```bash
UPDATE mysql.user SET authentication_string=PASSWORD('NEW-PASSWORD'), plugin='mysql_native_password' WHERE User='root' ;
EXIT;
```

**重启数据库，使配置生效**

```bash
# Turn off MySQL.
sudo mysqladmin -S /var/run/mysqld/mysqld.sock shutdown

# Start the MySQL service normally.
sudo service mysql start
```

## 2、Gitlab

本节介绍如何重置 Gitlab 系统 root 用户密码，您需要使用具备服务器 root 权限的账号登录服务器，并启动 Ruby on Rails 控制台：

```bash
gitlab-rails console production
```

待控制台加载完毕，通过搜索电子邮件或用户名等方法找到您要修改的账号。

```bash
user = User.where(id: 1).first

## 或者
user = User.find_by(email: 'admin@local.host')
```

找出用户以后，可以更改其密码：

```bash
user.password = 12345678
user.password_confirmation = 12345678
```

最后，保存上面的更改，即可使用新密码登录。