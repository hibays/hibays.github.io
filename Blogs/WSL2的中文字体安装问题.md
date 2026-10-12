---
modified: 2026年4月24日 星期五 晚上 11点37分20秒
created: 2025年11月24日 星期一 晚上 10点28分51秒
---
使用 GUI 的时候总会觉得应该在 WSL2 安装个独特的字体，但其实 WSL 可以直接使用宿主机的字体，这样 UI 也没问题了，也不用怎么改了。

## 使用方法

来自[这里](https://blog.csdn.net/oZuoZuoZuoShi/article/details/118977701)。

我们可以通过使用 Windows 自带字体的方式，来实现快速安装中文字体（以 Ubuntu 为例）。

```sh
sudo ln -s /mnt/c/Windows/Fonts /usr/share/fonts/font
```

我们只需要将 Windows 下的字体目录链接到 WSL 目录下即可然后再刷新一下。

```sh
fc-cache -fv
```

然后再重启一下即可。这样可以减少重复安装字体的占用。