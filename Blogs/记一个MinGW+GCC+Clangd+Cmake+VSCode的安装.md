---
modified: 2026年3月19日 星期四 下午 1点32分47秒
created: 2026年3月9日 星期一 下午 12点32分27秒
---
## 原材料

- 一个 64 位处理器的 Windows 电脑
- `MSYS2`：一个 Windows 下的带包管理器的 Mingw + Cygwin 环境

依赖的软件包，基本上就是LLVM全家桶+`cmake`：

- `clang`：我们使用的编译器，拥有更加人性化的报错
- `clangd`：一个C/C++的Language Sever后端，薄纱C/C++ Tools
- `lldb`：调试工具，一家人就要整整齐齐
- `cmake`：构造工具，因为`clangd`需要读取`compile_commands.json`才能提供服务


## 安装 MSYS2

我们在[清华的MSYS2镜像](https://mirrors.tuna.tsinghua.edu.cn/msys2/distrib/x86_64/)里面找到最新的 `MSYS2` 的安装包并找一个心仪的位置安装

安装完之后打开 `MSYS2` 环境运行 `sed -i "s#https\?://mirror.msys2.org/#https://mirrors.tuna.tsinghua.edu.cn/msys2/#g" /etc/pacman.d/mirrorlist*` 来配置包管理器镜像

然后打开安装路径，应该是这样的

![[Pasted image 20260309125655.png|500]]

我们选择使用 `ucrt64` 和 `usr` 环境，并把他们的 **bin 路径放入系统 Path**，这样可以让我们方便地在外部访问他们

放入 Path 后，打开终端，输入命令安装 gcc 工具链和 CMake 和 Clangd 和 Clang 和 LLDB

```sh
pacman -Syu base-devel mingw-w64-ucrt-x86_64-toolchain mingw-w64-ucrt-x86_64-clang-tools-extra mingw-w64-ucrt-x86_64-cmake mingw-w64-ucrt-x86_64-lldb-mi
```

注：如果提示没有 pacman 命令的，就是没有成功把上面说的 bin 路径放入 Path 里面

好！MSYS 2 安装完成

## 安装 VSCode

在 [Download Visual Studio Code - Mac, Linux, Windows](https://code.visualstudio.com/Download) 选择一个版本下载即可

| 版本                   | 说明            |
| -------------------- | ------------- |
| **User Installer**   | 安装到只有本用户使用地版本 |
| **System Installer** | 安装到系统所有人可用的版本 |
| **.zip**             | 便捷版，解压即用      |
| **CLI**              | 命令行版          |

### 安装下面的插件即可

![[Pasted image 20260309131654.png]]
![[Pasted image 20260309131723.png]]

### 进行 Clangd 插件配置

```json
"clangd.arguments": [
	"--background-index", // 在后台自动分析文件（基于complie_commands)
	"--compile-commands-dir=${workspaceFolder}/build", // 标记compelie_commands.json文件的目录位置
	"-j=12", // 同时开启的任务数量
	"--cross-file-rename",
	"--query-driver=clang++", // 告诉clangd用那个clang进行编译，路径参考which clang++的路径
	"--clang-tidy", // clang-tidy 代码静态检查优化
	"--clang-tidy-checks=performance-*,bugprone-*,portability-*,modernize-*,clang-analyzer-security-*",
	"--all-scopes-completion", // 全局补全（会自动补充头文件）
	"--completion-style=detailed", // 更详细的补全内容
	"--header-insertion=iwyu", // 补充头文件的形式, iwyu (include-what-you-use), never
	"--pch-storage=memory", // pch优化的位置(内存 memory 磁盘 disk)
],
```

### 进行 Code Runner 插件配置

```json
"code-runner.saveAllFilesBeforeRun": true,
"code-runner.runInTerminal": true,
"code-runner.showExecutionMessage": false,
"code-runner.preserveFocus": false,
"code-runner.defaultLanguage": "code-text-binary",
"code-runner.executorMapByFileExtension": {
	".exe": "cd $dir && .\\'$fileName'"
},
"code-runner.executorMap": {
	"bat": "cd $dir && cmd /c '$fileName'",
	"c": "cd $dir && clang -s -O2 '$fileName' -o '$fileNameWithoutExt.exe' && .\\'$fileNameWithoutExt' && recbin '$fileNameWithoutExt.exe'",
	"cpp": "cd $dir && clang++ -s -O2 '$fileName' -o '$fileNameWithoutExt.exe' && .\\'$fileNameWithoutExt' && recbin '$fileNameWithoutExt.exe'",
	"asm": "cd $dir && clang '$fileName' -o '$fileNameWithoutExt.exe' && .\\'$fileNameWithoutExt' && recbin '$fileNameWithoutExt.exe'",
	"llvm": "cd $dir && clang -s -O2 '$fileName' -o '$fileNameWithoutExt.exe' && .\\'$fileNameWithoutExt' && recbin '$fileNameWithoutExt.exe'",
	"java": "cd $dir && javac -encoding utf8 '$fileName' && java '$fileNameWithoutExt' && recbin '$fileNameWithoutExt.class'",
	"python": "cd $dir && & '$pythonPath' '$fileName'",
	"code-text-binary": "cd $dir && .\\'$fileName'",
	"shellscript": "cd $dir && dash '$fileName'"
},
```

到这里准备基本结束

## 开始写 C/C++

随便找一个空文件夹打开，然后`Ctrl+Shift+P`或者你自定义的快捷键打开下拉菜单，搜索`cmake`，选择`Quick Start`：

![[Pasted image 20260309185804.png|725]]

给你的项目起个名字，类型选择`Executable`，第一次打开`cmake`可能还会问你一些编译套件的选择问题，选择`clang`即可，记得看清楚后缀免得用错。

![|600](https://pic2.zhimg.com/v2-bc8f336ea7a344bc166e004c7017b23b_1440w.jpg)

打开自动生成的`main.cpp`，发现`clangd`已经在运行了，就是这么简单。

![|550](https://pic1.zhimg.com/v2-be076afa271b04531e49b4b2ceb8bd2e_1440w.jpg)

## 运行与调试

按一下底部菜单中的 `build` 键，看看我们生成的可执行文件在哪里（一般就在 `build` 下面）：

![|675](https://pic1.zhimg.com/v2-27523b009d10182419ae5ac3d3549cce_1440w.jpg)

按 `F5` 键，VSCode会报错，同时在根目录下生成一个 `.vscode` 文件夹以及 `launch.json`。打开这个json文件，将其中唯一一个需要我们配置的（也是本文第二次跟配置文件打交道）`program` 项改为 `cmake` 生成的可执行文件的位置（按照惯例，根目录的名字和项目的名字应该是同一个，否则就需要手动指定）。

注：新版可以将 `program` 指定为 `${command:cmake.launchTargetPath}` 即可，这样按 `F5` 键 CMake 会自动进行编译后启动调试

![|500](https://pica.zhimg.com/v2-853b8410f04d1e7570ecb9014026d6fc_1440w.jpg)

再按一次`F5`，终端返回了一句亲切的`Hello World`。

![|444](https://pic2.zhimg.com/v2-8905258989ea496e490ea8249830d89d_1440w.jpg)

上个断点试试：

![|725](https://pica.zhimg.com/v2-0b1065976f31d39fa3e850c1897fa0ba_1440w.jpg)

完美，到这里就算搞掂了。

## 参考文献

[几乎无痛的VSCode+clangd+lldb+cmake配置C/C++开发环境指南 - 知乎](https://zhuanlan.zhihu.com/p/566365173)
[最终，我看向了clangd - 知乎](https://zhuanlan.zhihu.com/p/364518020)
