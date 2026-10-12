---
modified: 2025年8月20日 星期三 凌晨 12点09分42秒
created: 2025年8月19日 星期二 晚上 11点36分24秒
---
在一个普通的 Paper-like 服务器上面，为了简单的实现多个世界，你可以使用 [Multiverse/多元世界](https://mvplugins.org/core/fundamentals/commands-usage/#Teleport-Command) 插件，进行服务器内的世界导入或者创建。以下首先介绍普通生存服务器中常用的几个插件：

1. [Multiverse-Core](https://modrinth.com/plugin/multiverse-core)

这个插件是**多元世界**的核心插件，他提供了包括**创建**、**导入**、**传送**、**配置**等的关键功能；下面简单介绍其使用。

1. [Multiverse-Inventories](https://modrinth.com/plugin/multiverse-inventories)

> [!note] Notice
> 这个插件可以记录 `mvtp` 的 **Last Location (in a world before teleporting)**，如果**不使用**这个插件会导致 `mvtp` 时每次都**出现在出生点**，这对于只是想利用多元世界开多个生存区的腐竹是类似于 bug 的存在
> 因为如果不记录 Last Location 的话，每次传送都会直接回到出生点，简直相当于多了个**一键回城**，破坏游戏平衡，并且有的时候还会导致**跑图进度清零**，总之对于原版生存玩家来说有毛病

### 特性

- 按世界或世界组分离玩家的统计数据和物品栏。
- 配置每个世界组的共享内容：
  - Inventories (背包)
  - Ender chest (末影箱)
  - Last location (in a world before teleporting) (最后的位置（在 `mvtp` 之前的世界）)
  - Hunger (肌饿值)
  - Health (生命值),
  - Exp (经验值)
  - Bed Spawns (重生点)
- 无需折腾修改配置文件！所有内容都可以在**游戏内**进行配置
- 从WorldInventories 1.0.2及以上版本和MultiInv 3.0.0版本导入你的数据。

1. [Multiverse-Nether Portals](https://modrinth.com/plugin/multiverse-netherportals)
