---
modified: 2026年3月9日 星期一 下午 12点45分45秒
created: 2026年3月7日 星期六 中午 12点28分25秒
---
```sh
gs -dNOSAFER -r400 -dBATCH -sDEVICE=jpeg -dNOPAUSE -dEPSCrop -dFirstPage=1 -dLastPage=7 -sOutputFile=/mnt/r/out-%d.jpg xxx.pdf
```

解释：
- `gs`：Ghostscript
- `-r400`：以 400 ppi 值进行导出，越大图片尺寸越大

他会调用 pdf 处理工具比如 Poppler 处理 PDF 并导出到图片
