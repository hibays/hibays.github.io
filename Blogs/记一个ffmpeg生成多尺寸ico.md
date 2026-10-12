---
modified: 2026年3月18日 星期三 晚上 10点48分18秒
created: 2026年3月18日 星期三 晚上 7点22分41秒
---
```sh
ffmpeg -i icon.png -filter_complex "split=6[a][b][c][d][e][f];[a]scale=16:16[b];[b]scale=32:32[c];[c]scale=48:48[d];[d]scale=64:64[e];[e]scale=128:128[f];[f]scale=256:256[g]" -map "[b]" -map "[c]" -map "[d]" -map "[e]" -map "[f]" -map "[g]" -c:v bmp icon.ico
```

基本相当于

```sh
magick icon.png -define icon:auto-resize=16,32,48,64,128,256 -compress none icon.ico
```
