---
modified: 2026年4月20日 星期一 晚上 8点24分47秒
created: 2026年4月8日 星期三 凌晨 12点46分30秒
---
```sh
yay -S john
pdf2john  '/mnt/g/高等数学 少学时 第五版 下册 可复制搜索.pdf' > '/mnt/g/hash.txt'
hashcat -m 10500 -a 3 '/mnt/g/hash.txt' "?l?d?l?d?l?d"
hashcat -m 10500 -a 3 '/mnt/g/hash.txt' "?a?a?a?a?a?a?a?a" -i --increment-min=4 --increment-max=9
```

# 跑完怎么看密码

出现下面这样就是成功：

```
$pdf$xxxx:123456
```

冒号后面就是**PDF 打开密码**。

## Supported PDF Types

| PDF Version | Adobe Acrobat | Hash Type              | Hashcat Mode |
| ----------- | ------------- | ---------------------- | ------------ |
| 1.1-1.3     | 2-4           | MD 5/SHA-256 + RC 4    | 10400        |
| 1.4-1.6     | 5-8           | MD 5/SHA-256 + RC 4    | 10500        |
| 1.7         | 9+            | MD 5/SHA-256 + AES-256 | 10501        |

Example Mode: [example_hashes [hashcat wiki]](https://hashcat.net/wiki/doku.php?id=example_hashes)

## Output Formats

The tool creates multiple output formats:

- **Hashcat Format**: `$pdf$1*1*40*hash1*hash2`
- **John the Ripper Format**: Compatible with JtR
- **Clean Format**: Simplified hash format

---

[Wuzi](https://www.zhihu.com/people/1a091f4cd2b0d972ccb974d7f7b2338b)

您好，我最近在学习 john 的使用，想问您一下，在用 john 破解 zip 文件的时候，如果我已经知道密码有 10 位且有一个固定的 4 位前缀，有没有可能让 john 在这个前缀的基础上去遍历后面的 6 位呢

​回复​

[赏金猎手](https://www.zhihu.com/people/32458fa00ab23eb063a0fec741bca684)

掩码啊，比如你固定 4 位是 asdf，john --mask=asdf? A? A? A? A? A? A hash. Txt
