---
modified: 2026年4月25日 星期六 下午 3点56分58秒
created: 2025年10月13日 星期一 凌晨 12点48分24秒
---
# 记修炼 1 h 的备款

BEFORE START：感谢 lal 大哥桑的打赏鸭🦆❀🌹

## 正文

前某日晚上，某同学正从他的 C: 分割出 D: 分区，令人诧异的是他孤芳自赏地使用了英文版的 Disk Genius 软件进行该操作，成功导致了 `0xc000000e` 错误，进不了系统了。在我们通力合作下，终于成功修复了引导，达成了 boot 入 Windows 的目标。特作记录，以期复用。

> [!note]- 错误代码 0xc000000e
> 错误代码 0xc000000e 通常表示计算机中的启动配置数据（BCD）已损坏，导致系统无法启动。以下是一些解决此问题的方法。
>
> 1. 使用 Windows 恢复环境（WinRE）
>
> 使用 Windows 安装媒体进入 WinRE 进行修复。
>
> 步骤：
>
> - 插入 Windows 安装盘或 USB，并重启电脑。
>
> - 进入“启动菜单”或更改 BIOS 设置，从安装媒体启动。
>
> - 选择“修复电脑”选项，而不是安装 Windows。
>
> - 在“选择选项”屏幕上，点击“疑难解答”，然后选择“高级选项”。
>
> - 选择“启动修复”来自动诊断并修复错误。
>
> 2. 重建启动配置数据（BCD）
>
>> 如果 BCD 损坏，可以尝试手动重建 BCD。
>
> 步骤：
>
> 在 WinRE 环境下打开命令提示符。
>
> 输入以下命令重建 BCD：

备注一下：这个通常是跑 `sfc /scannow` 解决不了的，你需要进行 cmd 操作根据信息来灵活操作

1. 首先是想办法进入恢复界面，就是能够进入 `cmd` 进行 `sfc /scannow` 的那个
2. 然后进入 `cmd`
3. 先试试 `bcdboot C:\Windows` （重建 C:/Windows 下的 boot），没有用就下一步
4. 输入 `diskpart` 进入硬盘操作环境
	1. 查看磁盘信息 `list disk`（这里是物理的整块 SSD/HDD）
	2. 选中磁盘 `select disk 0`（选中有原先的 boot 分区的那块 SSD/HDD）
	3. × 查看磁盘分区信息 `list partition` （不是这条，看下面那条）
	4. 查看磁盘分卷信息 `list vol`（这条可以看卷标）
	5. 选中代表 C 盘的卷 `select volume 1`（1 是 C 盘卷，看情况定夺）
	6. 并给他分配盘符 C `assign letter=C`（给他分配 C 盘盘符）
	7. `select volume 0`（找到 efi 分区，分配个 Z 盘符）
	8. `assign letter=Z`（如上，分配盘符有用）
	9. ×（`format quick fs=fat32` 直接把 Z 格式化，看下面情况定夺）
	10. ×（`remove letter=Z` 下面 Z 盘没有用了就删掉盘符）
	11. 然后输入 `exit` 退出硬盘操作环境
5. `cd /d Z:\EFI\Microsoft\Boot\`
6. `bootrec/fixboot`（此命令使用与 Windows 10 兼容的引导扇区将新引导扇区写入系统分区）
7. `bcdboot C:\Windows /l zh-cn /s Z: /f ALL`
8. `bootrec /rebuildbcd`（这两个命令会扫描所有磁盘以查找与 Windows 10 兼容的安装）
9. `bcdboot C:\Windows /l zh-cn /s Z: /f ALL`
	1. 解释：用DG等工具先将ESP分区装载为 Z 盘，从系统盘C:\Windows目录中复制UEFI格式的启动文件到ESP分区中，修复系统。
		1. 各参数的具体含义：
			1. `C:\Windows` 系统安装目录，打开我的电脑，查看你的系统是安装在那个盘，就输入相应的盘符和目录。
			2. `/s Z:` 指定esp分区所在磁盘，小编指定ESP分区为 Z 盘。
			3. `/f uefi` 指定启动方式为 uefi，注意之间的空格一定要输入。
			4. `/l zh-cn` 指定 uefi 启动界面语言为简体中文
	2. 这条命令有可能跑不动，这时候把 Z: 格式化即可
	3. WIN8/10的系统启动修复命令bcdboot还是比较简单的，它从损坏的系统中（一般是 c:\windows目录，这些文件当然是你安装系统时就存在了）复制启动文件到你的启动分区中，来达到修复系统的目的。因此，该命令正确执行的前提是：
		1. 启动分区存在
		2. windows安装盘中启动文件存在
		
参考文献：
[使用 Windows RE 中的 Bootrec.exe 解决启动问题 - Microsoft 支持](https://support.microsoft.com/zh-cn/topic/%E4%BD%BF%E7%94%A8-windows-re-%E4%B8%AD%E7%9A%84-bootrec-exe-%E8%A7%A3%E5%86%B3%E5%90%AF%E5%8A%A8%E9%97%AE%E9%A2%98-902ebb04-daa3-4f90-579f-0fbf51f7dd5d)
[win10 bcdboot引导修复命令使用方法及一些BCD修复心得经验 - 知乎](https://zhuanlan.zhihu.com/p/404820401)
[Win10 BCD修复怎么办？4种方法轻松修复！](https://www.disktool.cn/content-center/windows-10-bcd-repair-2111.html)
