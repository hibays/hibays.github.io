---
modified: 2026年2月10日 星期二 凌晨 12点42分01秒
created: 2025年1月5日 星期日 下午 2点14分54秒
---
### 介绍AV1

先简单介绍一下AV1格式，AV1是一种新兴的开源免版税视频压缩格式，AV1编解码器的主要目标是在保持质量的同时降低视频的比特率。除了压缩方面的改进，AV1的设计还考虑到了硬件，新的SoC和GPU如高通8 Gen 2、Nvidia的RTX 40系列、Intel的Arc GPU都支持AV1编解码的加速硬件解码。

2018年，开放媒体联盟（AOMedia）发布了新一代的视频编码AV1（AOMedia Video Codec 1.0），现在流行的视频处理命令行工具FFmpeg也已经支持英伟达NVENC AV1编码器。

### FFmpeg显卡加速转av1指令

查看所有可用的硬件加速器：

`ffmpeg -hwaccels`

FFmpegke查询可用的GPU的加速：

`ffmpeg -codecs | sls cuvid`

查询编码器为av1_nvenc的全部信息：

`ffmpeg -h encoder=av1_nvenc`

高品质的转码的参数：

**`-cq`**：码率控制。类似 `-crf` 但是质量可能更低，越大越差，19-21 左右肉眼无损

```
ffmpeg -i "v.mp4" -c:v av1_nvenc -preset:v p7 -tune:v hq -c:a libopus -frame_duration:a 60 -b:a 127k "oup.mkv"
```