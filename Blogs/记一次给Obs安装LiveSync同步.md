---
modified: 2026年3月3日 星期二 下午 2点33分37秒
created: 2026年3月3日 星期二 中午 12点27分59秒
---
## 序言

因现有的 Git 同步实在是过于繁琐且在运行速度上不尽人意，现考虑切换到另一套同步方案，即 [Obsidian LiveSync](https://github.com/vrtmrz/obsidian-livesync)，这是一款面向 Obsidian 用户的同步解决方案，可以实现类似官方付费同步服务的实时同步体验，支持自动冲突处理和端到端加密。

它支持使用自托管数据库 (Apache CouchDB) 、对象存储 (S3、B2、R2 等) 或 WebRTC P2P（实验性）来同步数据。对于对象存储和 P2P 同步，只需在插件里配置即可，无需服务端支持。

**[Apache CouchDB](https://couchdb.apache.org/)** 是一个使用 JSON 作为存储格式，JavaScript 作为查询语言的 NoSQL 数据库，很适合作为 Obsidian 的存储。下面的自托管部署 LiveSync 服务，本质上就是部署一个单节点运行的 CouchDB 数据库。

## 准备工作

首先，确定工作环境和目标：
1. 在 Windows 下部署 LiveSync 服务
2. 实现在同一网络下（连热点）自动全端同步
3. 使用端到端加密

## Windows 安装 CouchDB

实现，在官网直接下载 msi 安装包，运行安装程序，配置 Install Services

### 管理员用户

在 3. X+版本，安装程序会提示你需要创建管理员用户，因为我们只用来进行 Obsidian 的同步，所以这里我设置我本人用户即管理员用户，密码自行配置，后面登录仪表盘要使用到

### Set Cookie value

选 Random Cookie，只有在分布式部署这个 db 的时候这个值才有意义

等待安装完成，完成后打开任务管理器应该见到两个新进程 `epmd.exe` 和 `Erlang`。

本机访问<http://127.0.0.1:5984/_utils>查看仪表盘，

首先在仪表盘检查下安装设置是否正确：

![[initDB.webp]]

新建一个数据库，比如 `obsidian`，这不是必需的步骤，插件本身可以执行该操作

![[createDB.webp]]

PS：如果本机已经安装了的，可以跳过该部分，自己创建一个 Obsidian 专用的数据库和用户就好

### 配置 IP 的 SSL

因为在移动设备上的 Obsidian 只允许访问 https 连接，所以我们还要配置一个 SSL 证书

但是我们又不想购买服务器，所以我们只能本地自配置一个证书

这里我们使用 [Caddy](https://caddyserver.com.cn/)来方便地配置自签名

首先在官网下载本体

## Obsidian 客户端配置



## 参考文献

[部署 Obsidian LiveSync 实时同步服务指南 | Dejavu's Blog](https://blog.dejavu.moe/posts/selfhosting-obsidian-livesync-service-guide/)
