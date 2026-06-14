---
modified: 2026年5月11日 星期一 晚上 9点26分11秒
created: 2025年12月21日 星期日 中午 12点07分53秒
---
## 前记

主要是今天早上刚起来发现 mol 桑的查重报告要转换成 Word/Png 文档。
然后我捣鼓一堆发现还不如领导随便找的免费网页转换来的好，故作记录。

## 2 word

1. Word 自带的转换，但是效果很差。

2. Python 直接用 `pdf2docx` 库，效果勉强还可以，但是可能会有文字重复/错位。

```bash
uv pip install pdf2docx
uv run pdf2docx convert input.pdf output.docx
```

3. 上网随便找一个转换，比如：Whatever

## 2 png

1. 使用 `mingw-w64-ucrt-x86_64-poppler`（under windows）

#### 1. 转换整个 PDF 为 PNG（每页一个文件）

```bash
# 格式：pdftoppm -png [输入PDF文件] [输出文件名前缀]
pdftoppm -png input.pdf output_prefix
```

- 输出结果：生成 `output_prefix-1.png`、`output_prefix-2.png`、`output_prefix-3.png` 等（对应 PDF 的第 1、2、3 页）。

#### 2. 转换指定页面

```bash
# 转换第 5 页
pdftoppm -png -f 5 -l 5 input.pdf output_page5

# 转换第 2-8 页
pdftoppm -png -f 2 -l 8 input.pdf output_pages_2_to_8
```

- 参数说明：
  - `-f N`：起始页（First page）
  - `-l N`：结束页（Last page）

#### 3. 自定义分辨率（DPI）

默认分辨率是 150 DPI，可通过 `-rx`/`-ry` 或 `-r` 调整（越高越清晰，文件越大）：

```bash
# 设置 300 DPI（高清）
pdftoppm -png -r 300 input.pdf output_highres
```

#### 5. 裁剪/缩放

```bash
# 缩放至 50px 大小
pdftoppm -png -scale-to 50 input.pdf output_scaled

# 按宽度缩放（高度自动适配，单位：像素）
pdftoppm -png -scale-to-x 800 input.pdf output_width_800

# 按高度缩放
pdftoppm -png -scale-to-y 600 input.pdf output_height_600
```

## 3 jpg

在 Linux 下面安装 Ghostscript

```sh
gs -dNOSAFER -r400 -dBATCH -sDEVICE=jpeg -dNOPAUSE -dEPSCrop -dFirstPage=1 -dLastPage=7 -sOutputFile=out-%d.jpg xxx.pdf
```

- `-r400`：以 400 ppi 值进行导出，越大图片尺寸越大


### 三、进阶技巧

#### 2. 合并多页 PNG 为单张（可选）

如果需要将多页 PNG 合并为一张长图，可配合 ImageMagick：

```bash
# 先安装 ImageMagick：sudo apt install imagemagick / brew install imagemagick
convert output_prefix-*.png -append output_combined.png  # 横向合并
convert output_prefix-*.png -append output_combined.png  # 纵向合并（注意是大写 -Append）
```

#### 3. 调整背景/透明度

```bash
# 强制白色背景（解决透明背景问题）
pdftoppm -png -rgb -bg "#FFFFFF" input.pdf output_white_bg
```

### 四、常见问题

1. **中文乱码**：确保 PDF 嵌入了中文字体，或安装系统中文字体包（如 `fonts-wqy-microhei`）。
2. **输出文件过大**：降低 DPI（如 `-r 100`）、使用灰度模式（`-gray`）或压缩 PNG（`optipng output.png`）。
3. **权限错误**：确保输入文件可读，输出目录可写。
