---
modified: 2025年10月21日 星期二 中午 12点04分29秒
created: 2025年6月11日 星期三 晚上 11点15分42秒
---
注：本文写作于 2025/6/11，处于 Alist 被某黑历史公司收购的节点，故将提供 Alist 的一个替代方案。

## 内网穿透：rathole

你想要在阿里云服务器上通过 VSCode SSH 连接，并配置一个 `systemd` 服务来启动 `/root/.cargo/bin/rathole`，使用配置文件 `/etc/rathole.toml`。下面是完整的步骤说明：

---

## ✅ 一、确认环境

确保你已经在服务器上完成了以下操作：

1. 安装了 `rathole` 并放置到了 `/root/.cargo/bin/rathole`
2. 配置文件 `/etc/rathole.toml` 已存在并配置正确
3. 使用的是 **root 权限** 或者有权限访问 `/root/` 和 `/etc/`

---

## ✅ 二、创建 systemd 服务文件

创建一个新的 systemd 单元文件：

```bash
sudo nano /etc/systemd/system/rathole.service
```

然后粘贴以下内容（根据你的实际路径和用户调整）：

```ini
[Unit]
Description=Rathole Tunnel Service
After=network.target

[Service]
User=root
Type=simple
ExecStart=/root/.cargo/bin/rathole --server /etc/rathole.toml
Restart=always
RestartSec=5s
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=rathole

[Install]
WantedBy=multi-user.target
```

> 如果你不是用 root 用户运行，需要将 `User=` 改为对应用户名，并确保该用户有权限读取 `/etc/rathole.toml`。

---

## ✅ 三、启用并启动服务

执行以下命令：

```bash
sudo systemctl daemon-reload
sudo systemctl enable rathole
sudo systemctl start rathole
```

查看服务状态：

```bash
sudo systemctl status rathole
```

如果看到 `active (running)` 就表示服务已经成功启动。

---

## ✅ 四、设置开机自启（可选）

上面的 `enable` 命令已经设置了开机自启，你可以再检查一下是否生效：

```bash
systemctl is-enabled rathole
```

---

## ✅ 五、VSCode SSH 连接后调试建议

如果你是通过 VSCode 的 Remote - SSH 插件连接到服务器，可以直接使用终端执行上述所有命令，不会影响后台服务运行。

如需调试服务日志，可以使用：

```bash
journalctl -u rathole -f
```

---

## ✅ 六、常见问题排查

### ❗1. 找不到 rathole 可执行文件

请确认路径是否正确：

```bash
ls /root/.cargo/bin/rathole
```

如果没有，尝试重新安装：

```bash
cargo install rathole --locked
```

### ❗2. 权限问题

确保 `/etc/rathole.toml` 文件对运行服务的用户可读：

```bash
chmod 644 /etc/rathole.toml
chown root:root /etc/rathole.toml
```

### ❗3. 启动失败但无明显错误

使用 `journalctl` 查看详细日志：

```bash
journalctl -u rathole --since "5 minutes ago"
```
