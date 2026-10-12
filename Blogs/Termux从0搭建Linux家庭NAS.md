---
modified: 2026年5月28日 星期四 凌晨 2点29分39秒
created: 2025年3月22日 星期六 晚上 6点14分00秒
tags:
  - 博客
---
好的，那么这段话是什么意思呢？
就是说使用一台老旧的安卓手机，在上面安装 `Arch Linux` 并且设置 `SSH`、`Alist` 以及 `unftp` ！

## 基础安装和配置

首先，下载 `Termux` 并安装，打开，默认进入家目录，输入 `pkg upgrade` 进行更新

为了顺利在 Termux 里配置 ssh 服务，我们使用 [Dropbear](https://matt.ucc.asn.au/dropbear/dropbear.html) 作为 sshd 的替代品，使用 netcat 作为端口联通性检测，并安装 `s6` 作为进程管理（一会讲）。

```shell
apt install dropbear netcat-openbsd
# 生成密钥对
mkdir ~/.ssh
dropbearkey -t ed25519 -f ~/.ssh/id_dropbear
```

执行成功后，应当输出生成的公钥内容。这时，执行 `ls -a` 应当发现 `.ssh` 下面有 `id_dropbear` 和 `id_dropbear.pub` 文件。稍后我们将会把 `id_dropbear.pub` 公钥作为我们登录 `Proot` 容器的凭证

然后，**安装 Linux**：

 ```shell
 # 安装 Proot 容器
 apt install proot-distro
 # 在容器里安装 archlinux
 proot-distro install archlinux
 ```

国内下载可能很慢，可以提前下载好放进 pd 的缓存目录（把下载的包 mv 进 `/data/data/com.termux/files/usr/var/lib/proot-distro/dlcache`），见 [proot-distro](https://github.com/termux/proot-distro)
运行完之后看到 finish 就表示安装完成了。
* 安装的 `Linux rootfs` 在安卓系统中的路径：`/data/data/com.termux/files/usr/var/lib/proot-distro/installed-rootfs/*`

**接下来登录进 Arch**：`proot-distro login --shared-tmp archlinux`

设置 `pacman.conf` 和国内镜像（下面有懒人版）

> [!example]- `pacman.conf` 一条命令懒人版
> ```shell
> cat <<'EOF' > /etc/pacman.conf
> #
> # /etc/pacman.conf
> #
> # See the pacman.conf(5) manpage for option and repository directives
> 
> #
> # GENERAL OPTIONS
> #
> [options]
> # The following paths are commented out with their default values listed.
> # If you wish to use different paths, uncomment and update the paths.
> #RootDir     = /
> #DBPath      = /var/lib/pacman/
> #CacheDir    = /var/cache/pacman/pkg/
> #LogFile     = /var/log/pacman.log
> #GPGDir      = /etc/pacman.d/gnupg/
> #HookDir     = /etc/pacman.d/hooks/
> HoldPkg     = pacman glibc
> #XferCommand = /usr/bin/curl -L -C - -f -o %o %u
> #XferCommand = /usr/bin/wget --passive-ftp -c -O %o %u
> #CleanMethod = KeepInstalled
> Architecture = aarch64
> 
> # Pacman won't upgrade packages listed in IgnorePkg and members of IgnoreGroup
> #IgnorePkg   =
> #IgnoreGroup =
> 
> #NoUpgrade   =
> #NoExtract   =
> 
> # Misc options
> #UseSyslog
> Color
> #NoProgressBar
> CheckSpace
> VerbosePkgLists
> ParallelDownloads = 5
> 
> # By default, pacman accepts packages signed by keys that its local keyring
> # trusts (see pacman-key and its man page), as well as unsigned packages.
> SigLevel    = Required DatabaseOptional
> LocalFileSigLevel = Optional
> #RemoteFileSigLevel = Required
> 
> # NOTE: You must run `pacman-key --init` before first using pacman; the local
> # keyring can then be populated with the keys of all official Arch Linux ARM
> # packagers with `pacman-key --populate archlinuxarm`.
> 
> #
> # REPOSITORIES
> #   - can be defined here or included from another file
> #   - pacman will search repositories in the order defined here
> #   - local/custom mirrors can be added here or in separate files
> #   - repositories listed first will take precedence when packages
> #     have identical names, regardless of version number
> #   - URLs will have $repo replaced by the name of the current repo
> #   - URLs will have $arch replaced by the name of the architecture
> #
> # Repository entries are of the format:
> #       [repo-name]
> #       Server = ServerName
> #       Include = IncludePath
> #
> # The header [repo-name] is crucial - it must be present and
> # uncommented to enable the repo.
> #
> 
> # The testing repositories are disabled by default. To enable, uncomment the
> # repo name header and Include lines. You can add preferred servers immediately
> # after the header, and they will be used before the default mirrors.
> 
> [archlinuxcn]
> SigLevel = Optional TrustedOnly
> Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
> Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
> 
> [core]
> Include = /etc/pacman.d/mirrorlist
> 
> [extra]
> Include = /etc/pacman.d/mirrorlist
> 
> [alarm]
> Include = /etc/pacman.d/mirrorlist
> 
> [aur]
> Include = /etc/pacman.d/mirrorlist
> 
> # An example of a custom package repository.  See the pacman manpage for
> # tips on creating your own repositories.
> #[custom]
> #SigLevel = Optional TrustAll
> #Server = file:///home/custompkgs
> EOF
> ```

> [!example]- `mirrorlist` 一条命令懒人版
> ```shell
> cat <<'EOF' > /etc/pacman.d/mirrorlist
> #
> # Arch Linux ARM repository mirrorlist
> # Generated on 2023-02-06
> #
> 
> ## China
> Server = https://mirrors.ustc.edu.cn/archlinuxarm/$arch/$repo
> 
> ## Geo-IP based mirror selection and load balancing
> Server = http://mirror.archlinuxarm.org/$arch/$repo
> 
> ### Mirrors by country
> 
> ### Denmark
> ## Aalborg
> # Server = http://dk.mirror.archlinuxarm.org/$arch/$repo
> 
> ### Germany
> ## Aachen
> # Server = http://de3.mirror.archlinuxarm.org/$arch/$repo
> ## Berlin
> # Server = http://de.mirror.archlinuxarm.org/$arch/$repo
> ## Coburg
> # Server = http://de4.mirror.archlinuxarm.org/$arch/$repo
> ## Falkenstein
> # Server = http://eu.mirror.archlinuxarm.org/$arch/$repo
> # Server = http://de5.mirror.archlinuxarm.org/$arch/$repo
> 
> ### Greece
> ## Athens
> # Server = http://gr.mirror.archlinuxarm.org/$arch/$repo
> 
> ### Hungary
> ## Budapest
> # Server = http://hu.mirror.archlinuxarm.org/$arch/$repo
> 
> ### Japan
> ## Tokyo
> # Server = http://jp.mirror.archlinuxarm.org/$arch/$repo
> 
> ### Singapore
> # Server = http://sg.mirror.archlinuxarm.org/$arch/$repo
> 
> ### Taiwan
> ## Hsinchu
> # Server = http://tw2.mirror.archlinuxarm.org/$arch/$repo
> ## New Taipei City
> # Server = http://tw.mirror.archlinuxarm.org/$arch/$repo
> 
> ### United Kingdom
> ## London
> # Server = http://uk.mirror.archlinuxarm.org/$arch/$repo
> 
> ### United States
> ## California
> # Server = http://ca.us.mirror.archlinuxarm.org/$arch/$repo
> ## Florida
> # Server = http://fl.us.mirror.archlinuxarm.org/$arch/$repo
> ## New Jersey
> # Server = http://nj.us.mirror.archlinuxarm.org/$arch/$repo
> EOF
> ```A

然后事情还没完，因为镜像里面有 `archlinuxcn` 所以需要通过以下命令安装 `archlinuxcn-keyring` 包导入 GPG key。

```
pacman -Sy archlinuxcn-keyring
```

*新系统额外步骤*：
2023 年 12 月后，在新系统下安装 `archlinuxcn-keyring` 时可能会出现错误：

```
error: archlinuxcn-keyring: Signature from "Jiachen YANG (Arch Linux Packager Signing Key) " is marginal trust
```

需要在本地信任 `farseerfc` 的 GPG key：

```
pacman-key --lsign-key "farseerfc@archlinux.org"
```

然后重试安装。

配置了镜像后进行全面更新并安装基本编译套件和 Yay 社区源包管理器

```shell
pacman -Su base-devel yay
```

接下来为了顺利使用 Yay，我们配置一个非 root 用户

### 配置 Proot 普通用户

因为 proot linux 安装默认以 root 登录，但是我们通常以普通用户登录，所以**新建一个 sudo 普通用户**

之后执行命令创建用户，并修改 `/etc/sudoers` 文件添加 sudo 权限

```shell
# 创建新用户
useradd -m -d /home/userhome username

# 为新用户配置密码
passwd username

# 把新用户加入到 sudo 用户中
cat <<'EOF' >> /etc/sudoers

# Custom user
username ALL=(ALL:ALL) ALL
EOF
```

#### 切换到新建的用户

```shell
su - username
```

### 配置新用户公钥登录（免密登录）

因为未知原因，Termux 的 sshd **不能密码登录**，所以我们只能设置公钥登录

1. 配置 termux shell 的 ssh 免密登录

先登录 proot，然后运行这条命令将先前生成的**公钥**复制到新用户的 `.ssh/authorized_keys` 文件里

> [!info] authorized_keys 文件是什么
> SSH（安全外壳协议）中用于公钥认证的一部分。它的主要作用是存储允许通过公钥认证登录到 SSH 服务器的用户的公钥。当用户尝试通过公钥认证登录时，SSH 服务器会检查 authorized_keys 文件，以确认提供的公钥是否存在于文件中。如果匹配成功，用户将被允许登录。

```shell
# 先生成 .ssh 文件夹（和本地密钥对）
ssh-keygen -t ed25519
# 加入 Termux 的免密登录
cat /data/data/com.termux/files/home/.ssh/id_dropbear.pub >> ~/.ssh/authorized_keys
```

2. 配置**本地**计算机免密登录 Termux

首先在你的**本地**计算机生成密钥对：`ssh-keygen -t ed25519`

这时你的 `~/.ssh` 应该出现两个文件：

- 私钥：保存在 `~/.ssh/id_ed25519`
- 公钥：保存在 `~/.ssh/id_ed25519.pub`

然后将本地生成的**公钥**文件**内容**复制到远程服务器（就是 Termux 容器 ）上的 `~/.ssh/authorized_keys` **文件**中。

之后在登录服务器，本地 ssh 会自动检测 `.ssh` 下的私钥文件进行鉴权，无需再输入密码。

## 配置 `s6` 和 `ssh` 自启动

通常来说，我们希望 ssh 服务能够**开机自启，并且只启动一个进程**，但是 termux 的 proot 环境下用不了 systemd，怎么办呢？

实际上，我们有多种方法实现进程的自启动，包括但不限于：`profile.d`、`runit` 、`rc.local`、`tmux`、`.bashrc`、`Termux service（实际就是runit）`、` Termux boot`、`s6` 等

> [!failure]- 一次失败的 sshd 尝试
> **注意！**：以下内容都没有用！我折腾了一周都没能让 ssh 成功登录！要么是密码错误，要么是 `/usr/bin/userdbctl` 所有权或者权限错误！还有启动不了 `systemd` 的问题！最后替换到 dropbear 才成功！而且就算密钥登录进去了也会立刻 close！
> 
> 首先编写 `sshd` 自启动服务脚本 `nano /etc/profile.d/sshd_service.sh`
> 
> ```shell
> #!/bin/sh
> 
> # 检查是否已有 SSHD 进程，若是没有就启动
> If pgrep -x "sshd" >/dev/null; then
> Else
> 	/usr/bin/sshd -E /var/log/sshd
> Fi
> ```
> 
> 然后添加执行权限：
> 
> ```shell
> Sudo chmod +x /etc/profile. D/sshd_service. Sh
> ```
> 
> 之后，打开 `nano /etc/ssh/sshd_config` 修改配置
> 
> > [!example]- sshd_config 命令直接覆写版
> > ```shell
> > cat <<'EOF' > /etc/ssh/sshd_config
> > # This is the sshd server system-wide configuration file.  See
> > # sshd_config (5) for more information.
> > 
> > # This sshd was compiled with PATH=/usr/bin:/bin:/usr/sbin:/sbin
> > 
> > # The strategy used for options in the default sshd_config shipped with
> > # OpenSSH is to specify options with their default value where
> > # possible, but leave them commented.  Uncommented options override the
> > # default value.
> > 
> > Include /etc/ssh/sshd_config. D/*. Conf
> > 
> > Port 8022
> > #AddressFamily any
> > #ListenAddress 0.0.0.0
> > #ListenAddress ::
> > 
> > #HostKey /etc/ssh/ssh_host_rsa_key
> > #HostKey /etc/ssh/ssh_host_ecdsa_key
> > #HostKey /etc/ssh/ssh_host_ed 25519_key
> > 
> > # Ciphers and keying
> > #RekeyLimit default none
> > 
> > # Logging
> > #SyslogFacility AUTH
> > #LogLevel INFO
> > 
> > # Authentication:
> > 
> > #LoginGraceTime 2 m
> > #PermitRootLogin prohibit-password
> > #StrictModes yes
> > #MaxAuthTries 6
> > #MaxSessions 10
> > 
> > PubkeyAuthentication yes
> > 
> > # Expect .ssh/authorized_keys 2 to be disregarded by default in future.
> > #AuthorizedKeysFile     .ssh/authorized_keys .ssh/authorized_keys 2
> > 
> > #AuthorizedPrincipalsFile none
> > 
> > #AuthorizedKeysCommand none
> > #AuthorizedKeysCommandUser nobody
> > 
> > # For this to work you will also need host keys in /etc/ssh/ssh_known_hosts
> > #HostbasedAuthentication no
> > # Change to yes if you don't trust ~/. Ssh/known_hosts for
> > # HostbasedAuthentication
> > #IgnoreUserKnownHosts no
> > # Don't read the user's ~/. Rhosts and ~/. Shosts files
> > #IgnoreRhosts yes
> > 
> > # To disable tunneled clear text passwords, change to no here!
> > #PasswordAuthentication yes
> > #PermitEmptyPasswords no
> > 
> > # Change to yes to enable challenge-response passwords (beware issues with
> > # some PAM modules and threads)
> > ChallengeResponseAuthentication no
> > 
> > # Kerberos options
> > #KerberosAuthentication no
> > #KerberosOrLocalPasswd yes
> > #KerberosTicketCleanup yes
> > #KerberosGetAFSToken no
> > 
> > # GSSAPI options
> > #GSSAPIAuthentication no
> > #GSSAPICleanupCredentials yes
> > #GSSAPIStrictAcceptorCheck yes
> > #GSSAPIKeyExchange no
> > 
> > # Set this to 'yes' to enable PAM authentication, account processing,
> > # and session processing. If this is enabled, PAM authentication will
> > # be allowed through the ChallengeResponseAuthentication and
> > # PasswordAuthentication.  Depending on your PAM configuration,
> > # PAM authentication via ChallengeResponseAuthentication may bypass
> > # the setting of "PermitRootLogin without-password".
> > # If you just want the PAM account and session checks to run without
> > # PAM authentication, then enable this but set PasswordAuthentication
> > # and ChallengeResponseAuthentication to 'no'.
> > UsePAM yes
> > 
> > #AllowAgentForwarding yes
> > #AllowTcpForwarding yes
> > #GatewayPorts no
> > #X11Forwarding no
> > #X11DisplayOffset 10
> > #X11UseLocalhost yes
> > #PermitTTY yes
> > PrintMotd no
> > #PrintLastLog yes
> > #TCPKeepAlive yes
> > #PermitUserEnvironment no
> > #Compression delayed
> > #ClientAliveInterval 0
> > #ClientAliveCountMax 3
> > #UseDNS no
> > #PidFile /var/run/sshd. Pid
> > #MaxStartups 10:30:100
> > #PermitTunnel no
> > #ChrootDirectory none
> > #VersionAddendum none
> > 
> > # no default banner path
> > #Banner none
> > 
> > # Allow client to pass locale environment variables
> > AcceptEnv LANG LC_*
> > 
> > # override default of no subsystems
> > Subsystem       sftp    /usr/lib/openssh/sftp-server
> > 
> > # Example of overriding settings on a per-user basis
> > #Match User anoncvs
> > #       X 11 Forwarding no
> > #       AllowTcpForwarding no
> > #       PermitTTY no
> > #       ForceCommand cvs server
> > PermitRootLogin yes
> > PasswordAuthentication no
> > UseDNS no
> > EOF
> > ```
> 
> 这时运行避免 sshd 报错：`sshd: no hostkeys available – exiting.`
> 
> ```shell
> Ssh-keygen -A
> ```
> 
> 但是，你可能发现 ssh 怎么也登录不进去！这是因为 Termux 的 proot 容器的 root 用户和权限等的诸多问题导致的！（导致我被困扰了一周！）
> 
> 可能的解决方案如下：
> 
> ```shell
> # 移除所有用户的写权限
> Chmod a-w /usr/bin/userdbctl
> 
> # 设置所有者为 root
> Chown root: root /usr/bin/userdbctl
> 
> # /etc/passwd 和 /etc/shadow
> Chmod 644 /etc/passwd
> Chmod 600 /etc/shadow
> 
> # 其他关键目录
> Chmod 755 /etc
> Chmod 700 /root
> ```
> 
> 最后重启 Termux，测试下输入 `pstree` 能够发现存在 `sshd` 进程，即可~
> 
> 注意：这个方案在你退出 proot 进入 Termux 原生 shell 的时候会导致 sshd 关闭
> 
> **设置免密登录**
> 
> 因为未知原因，Termux 的 sshd **不能密码登录**，所以我们只能设置公钥登录
> 
> 首先在你的**本地**计算机生成密钥对：`ssh-keygen -t ed25519`
> 
> 这时你的 `~/.ssh` 应该出现两个文件：
> 
> - 私钥：保存在 `~/.ssh/id_ed25519`
> - 公钥：保存在 `~/.ssh/id_ed25519.pub`
> 
> 然后将本地生成的公钥文件**内容**复制到远程服务器（就是 Termux ）上的 `~/.ssh/authorized_keys` **文件**中。
> 
> ```shell
> ssh-copy-id -i ~/.ssh/id_25519.pub username@remote-server-ip
> ```
> 
> > [!note] 什么是 authorized_keys 文件
> > SSH（安全外壳协议）中用于公钥认证的一部分。它的主要作用是存储允许通过公钥认证登录到 SSH 服务器的用户的公钥。当用户尝试通过公钥认证登录时，SSH 服务器会检查 authorized_keys 文件，以确认提供的公钥是否存在于文件中。如果匹配成功，用户将被允许登录。
> 
> 之后在本地登录服务器，ssh 会自动检测 `.ssh` 里的私钥文件进行鉴权，无需再输入密码。
> 

在我折腾了两周时间后！终于搞定了一套基于 `s6` 的 proot 容器服务自启动管理！能够顺利进行高性能低占用的服务管理、重启的一站式解决方案

为了顺利在 Termux 里配置 ssh 服务，我们使用 [Dropbear](https://matt.ucc.asn.au/dropbear/dropbear.html) 作为 sshd 的替代品，并安装 `s6` 作为进程管理。首先进行安装：

```shell
yay -S s6 dropbear
```

注：应该在普通用户环境下使用 Yay，否则无法使用 fakeroot。安装 `s6` 时会提示 error 不支持 `aarch64` 架构，不用管他！`s6` 是从 `c` 源码编译安装的，十分 portable，没有架构问题！实际上也可以顺利使用

之后配置 `s6` 服务文件夹，编写 boot 脚本，给予可执行权限

```shell
mkdir -p /etc/s6/services
nano /etc/s6/s6-boot
chmod +x /etc/s6/s6-boot
```

在脚本里加入下面内容：

```shell
#!/bin/execlineb -P

/bin/s6-setsid -qb
/bin/redirfd -r 0 /dev/null
/bin/redirfd -wnb 1 /etc/s6/s6-log
/bin/fdmove -c 2 1
/bin/exec -ca s6-svscan
/bin/s6-svscan -t14000 /etc/s6/services
```

接下来进行 Dropbear 服务脚本编写

```shell
# 首先创建服务文件夹
mkdir /etc/s6/services/dropbear
# 如何编写服务脚本
nano /etc/s6/services/dropbear/run
# 给予可执行权限（必须）
chmod +x /etc/s6/services/dropbear/run
```

在 Dropbear 服务启动脚本里加入下面内容：

> [!quote]- Dropbear 的命令行参数
> ### **Dropbear 服务器选项详解**
> #### **基本配置**
> | 选项 | 说明 |
> |------|------|
> | `-b bannerfile` | 用户登录前显示 `bannerfile` 文件内容（如免责声明） |
> | `-r keyfile` | 指定主机密钥文件（可重复使用），默认：<br> • RSA: `/etc/dropbear/dropbear_rsa_host_key`<br> • ECDSA: `/etc/dropbear/dropbear_ecdsa_host_key`<br> • Ed 25519: `/etc/dropbear/dropbear_ed25519_host_key` |
> | `-R` | 如果密钥文件不存在，自动生成 |
> | `-D` | 指定包含 `authorized_keys` 的目录（默认用户 `~/.ssh/`） |
> 
> ---
> 
> #### **运行模式**
> | 选项 | 说明 |
> |------|------|
> | `-F` | **前台运行**（不后台守护，调试时使用） |
> | `-E` | 日志输出到 **stderr**（默认输出到 syslog） |
> | `-i` | 以 **inetd 模式** 运行（受超级服务器管理） |
> | `-P PidFile` | 指定 PID 文件路径（默认 `/var/run/dropbear.pid`） |
> 
> ---
> 
> #### **安全限制**
> | 选项 | 说明 |
> |------|------|
> | `-s` | **禁用密码登录**（仅允许公钥认证） |
> | `-g` | 禁用 root 的密码登录（但允许公钥） |
> | `-w` | **完全禁止 root 登录**（即使公钥也不行） |
> | `-G group` | 仅允许指定用户组的成员登录 |
> | `-B` | 允许空密码登录（危险！） |
> | `-t` | **强制双因素认证**（需密码+公钥） |
> | `-T num` | 最大认证尝试次数（默认 10 次） |
> 
> ---
> 
> #### **端口与网络**
> | 选项 | 说明 |
> |------|------|
> | `-p [address:]port` | 监听指定端口（可绑定 IP），最多 10 个<br> 例：`-p 2222` 或 `-p 192.168.1.1:22` |
> | `-l interface` | 绑定到指定网络接口（如 `eth0`） |
> | `-j` | 禁用本地端口转发（`-L`） |
> | `-k` | 禁用远程端口转发（`-R`） |
> | `-a` | 允许任何主机访问转发端口（默认仅允许本地） |
> 
> ---
> 
> #### **性能与连接**
> | 选项 | 说明 |
> |------|------|
> | `-W size` | 设置接收窗口缓冲区大小（默认 24576，最大 10 MB） |
> | `-K seconds` | 保持连接心跳间隔（0 表示禁用，默认 0） |
> | `-I seconds` | 空闲超时断开（0 表示永不，默认 0） |
> | `-z` | 禁用 QoS（服务质量标记） |
> 
> ---
> 
> #### **其他功能**
> | 选项 | 说明 |
> |------|------|
> | `-c command` | 强制客户端登录后执行指定命令（类似 `authorized_keys` 的 `command=`） |
> | `-m` | 禁用登录后显示 MOTD（当日消息） |
> | `-V` | 显示版本信息 |
> 
> ---
> 
> ### **常用组合示例**
> 1. **安全配置（仅密钥+限制 root）**  
> ```bash
>    dropbear -s -w -p 2222 -r /etc/dropbear/ed 25519_key
>    ```
> 2. **调试模式（前台+详细日志）**  
> ```bash
>    dropbear -F -E -p 22
>    ```
> 3. **限制用户组（仅允许 `sshusers` 组）**  
> ```bash
>    dropbear -G sshusers
>    ```
> 
> ---
> 
> ### **常见问题**
> - **密钥格式不兼容？**  
> 用 `dropbearconvert` 转换 OpenSSH 密钥为 Dropbear 格式。  
> - **如何查看运行状态？**  
> ```bash
>    cat /var/run/dropbear. Pid
>    ```
> - **连接超时？**  
> 调整 `-K`（心跳）和 `-I`（空闲超时）参数。
> 

```shell
#!/bin/execlineb -P
dropbear -F -E -R -r -s -g -p 8022
```

现在，通过启动 `s6-boot` 脚本（实际上是把他作为了容器的 entrypoint），应该可以顺利实现 Dropbear 的 ssh 服务自启动自动管理

### 查看 `s6` 日志

根据 `s6-boot` 启动脚本，当前 `s6-svscan` **进程的**和所有启动的**服务日志**都会写在 `/etc/s6/s6-log` 文件下，等下一次运行 `s6-svscan` 时，这个文件的内**不会**被保留

然而，在同时启动了多个服务的情况下，这通常导致错误信息不清晰

如果希望自定义服务的日志行为，你需要在 `/etc/s6/services/具体服务/log/` 文件夹下添加 `run` 可执行脚本

以前面配置的 Dropbear 为例：

```shell
# 创建日志服务文件夹
mkdir -p /etc/s6/services/dropbear/log
```

编辑 `/etc/s6/services/dropbear/log/run`：

```shell
#!/bin/execlineb -P
s6-log -b t -- /var/log/services/dropbear
```

给予日志脚本可执行权限：

```shell
chmod +x /etc/s6/services/dropbear/log/run
```

这样，在启动该服务时，脚本日志就会储存在 `/var/log/services/dropbear` 里

### 设置入口脚本

之后，编写 Termux `/data/data/com.termux/files/usr/etc` 目录下的 `termux-login.sh` 入口脚本，在里面加入登录 Linux 的 pd 命令
注意：把命令里面的 `username` 改成你自己的！

```shell
cat <<'EOF' >> /data/data/com.termux/files/usr/etc/termux-login.sh
##
## This script is sourced by /data/data/com.termux/files/usr/bin/login before executing shell.
##
TIMEOUT=4
PORT=8022
USER="username"

# 使用nc检测ssh(s6 ran)端口
is_s6_ok() {
	/data/data/com.termux/files/usr/bin/nc -z 127.0.0.1 $PORT >/dev/null 2>&1
}

show_spinner() {
    case $((COUNT % 4)) in
        0) printf "\r| " ;;
        1) printf "\r/ " ;;
        2) printf "\r- " ;;
        3) printf "\r\\ " ;;
    esac
    printf "%ds remaining" $((TIMEOUT - COUNT/10))
}

# open another session and Ctrl+D if wanted termux's basic shell
# do replace termux shell with proot linux ssh login by using exec?
if is_s6_ok; then
	dbclient $USER@127.0.0.1 -p $PORT && return
	echo "SSH port $PORT failed, restarting services..."
fi

# See https://skarnet.org/software/s6/s6-svscan-1.html
proot-distro login \
	--user root \
	--shared-tmp \
	archlinux \
	-- /etc/s6/s6-boot &

echo "Waiting for Proot Linux Container and S6 SSH Service"
COUNT=0
while [ "$COUNT" -lt $((TIMEOUT * 10)) ]; do
	show_spinner
	
	if is_s6_ok; then
		printf "\r%${COLUMNS}s\r"  # 清除整行
		
		dbclient $USER@127.0.0.1 -p $PORT && return
	fi
	sleep 0.1
	COUNT=$((COUNT + 1))
done

printf "\r%${COLUMNS}s\r"  # 清除整行
echo "Timeout: Dropbear SSH did not start after $TIMEOUT seconds"
echo "Falling back to Proot shell..."
proot-distro login \
	--user $USER \
	--shared-tmp \
	archlinux
EOF
```

如果报错则在脚本开头加入 `unset LD_PRELOAD`

~~如果你安装了`termux-exec`，则这一步是必须的，如果不进行这一步则proot必报错。~~  
_此问题已在 [#2163](https://github.com/termux/termux-packages/pull/2163) 中修复_

这个脚本会自动启动 proot 运行 `s6-boot` 脚本，从而自动启动 ssh 服务。并且为了使启动环境最小化，在 termux 启动时的 session 1 是不附带 termux 的 sh 的，如果希望启动 termux 默认的 bash，你需要在侧边栏启动 session 2 并 Ctrl+D 退出 linux 环境。当检测到 `s6` 容器已经启动时，脚本自动运行 dbclient 进行连接，否则会先启动容器，待到 Dropbear 服务启动后再连接，从而确保只有一个 proot 进程。在 Dropbear 启动超时（4 秒）时会自动 fallback 到 proot 启动。

*PS: 其实到了这一步，可以通过在电脑登录 ssh 来配置，比在手机上折腾好得多了*

### 设置 Termux 互通配置

因为在 proot 环境下不好访问 termux 的 home，但是又希望修改他的 config 怎么办呢
只需要软连接 termux home 下的 `.termux` 到 archlinux 的 home 下就可以了

```shell
ln -s /data/data/com.termux/files/home/.termux ~/.termux
```

### 设置 Termux 闪烁 bar 鼠标条

运行以下命令，将 `termux.properties` 内容修改为新样式

> [!example]- termux.properties
> ```shell
> cat <<'EOF' >> /data/data/com.termux/files/home/.termux/termux.properties
> ### After making changes and saving you need to run `termux-reload-settings`
> ### to update the terminal.  All information here can also be found on the
> ### wiki: https://wiki.termux.com/wiki/Terminal_Settings
> 
> ###############
> # General
> ###############
> 
> ### Allow external applications to execute arbitrary commands within Termux.
> ### This potentially could be a security issue, so option is disabled by
> ### default. Uncomment to enable.
> # allow-external-apps = true
> 
> ### Default working directory that will be used when launching the app.
> # default-working-directory = /data/data/com.termux/files/home
> 
> ### Uncomment to disable toasts shown on terminal session change.
> # disable-terminal-session-change-toast = true
> 
> ### Uncomment to not show soft keyboard on application start.
> hide-soft-keyboard-on-startup = true
> 
> ### Uncomment to let keyboard toggle button to enable or disable software
> ### keyboard instead of showing/hiding it.
> # soft-keyboard-toggle-behaviour = enable/disable
> 
> ### Adjust terminal scrollback buffer. Max is 50000. May have negative
> ### impact on performance.
> # terminal-transcript-rows = 2000
> 
> ### Uncomment to use volume keys for adjusting volume and not for the
> ### extra keys functionality.
> # volume-keys = volume
> 
> ###############
> # Fullscreen mode
> ###############
> 
> ### Uncomment to let Termux start in full screen mode.
> # fullscreen = true
> 
> ### Uncomment to attempt workaround layout issues when running in
> ### full screen mode.
> # use-fullscreen-workaround = true
> 
> ###############
> # Cursor
> ###############
> 
> ### Cursor blink rate. Values 0, 100 - 2000.
> terminal-cursor-blink-rate = 500
> 
> ### Cursor style: block, bar, underline.
> terminal-cursor-style = bar
> 
> ###############
> # Extra keys
> ###############
> 
> ### Settings for choosing which set of symbols to use for illustrating keys.
> ### Choose between default, arrows-only, arrows-all, all and none
> # extra-keys-style = default
> 
> ### Force capitalize all text in extra keys row button labels.
> # extra-keys-text-all-caps = true
> 
> ### Default extra-key configuration
> # extra-keys = [[ESC, TAB, CTRL, ALT, {key: '-', popup: '|'}, DOWN, UP]]
> 
> ### Two rows with more keys
> # extra-keys = [['ESC','/','-','HOME','UP','END','PGUP'], \
> #               ['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]
> 
> ### Configuration with additional popup keys (swipe up from an extra key)
> # extra-keys = [[ \
> #   {key: ESC, popup: {macro: "CTRL f d", display: "tmux exit"}}, \
> #   {key: CTRL, popup: {macro: "CTRL f BKSP", display: "tmux ←"}}, \
> #   {key: ALT, popup: {macro: "CTRL f TAB", display: "tmux →"}}, \
> #   {key: TAB, popup: {macro: "ALT a", display: A-a}}, \
> #   {key: LEFT, popup: HOME}, \
> #   {key: DOWN, popup: PGDN}, \
> #   {key: UP, popup: PGUP}, \
> #   {key: RIGHT, popup: END}, \
> #   {macro: "ALT j", display: A-j, popup: {macro: "ALT g", display: A-g}}, \
> #   {key: KEYBOARD, popup: {macro: "CTRL d", display: exit}} \
> # ]]
> 
> ###############
> # Colors/themes
> ###############
> 
> ### Force black colors for drawer and dialogs
> # use-black-ui = true
> 
> ###############
> # HW keyboard shortcuts
> ###############
> 
> ### Disable hardware keyboard shortcuts.
> # disable-hardware-keyboard-shortcuts = true
> 
> ### Open a new terminal with ctrl + t (volume down + t)
> # shortcut.create-session = ctrl + t
> 
> ### Go one session down with (for example) ctrl + 2
> # shortcut.next-session = ctrl + 2
> 
> ### Go one session up with (for example) ctrl + 1
> # shortcut.previous-session = ctrl + 1
> 
> ### Rename a session with (for example) ctrl + n
> # shortcut.rename-session = ctrl + n
> 
> ###############
> # Bell key
> ###############
> 
> ### Vibrate device (default).
> # bell-character = vibrate
> 
> ### Beep with a sound.
> # bell-character = beep
> 
> ### Ignore bell character.
> # bell-character = ignore
> 
> ###############
> # Back key
> ###############
> 
> ### Send the Escape key.
> # back-key=escape
> 
> ### Hide keyboard or leave app (default).
> # back-key=back
> 
> ###############
> # Keyboard issue workarounds
> ###############
> 
> ### Letters might not appear until enter is pressed on Samsung devices
> enforce-char-based-input = true
> 
> ### ctrl+space (for marking text in emacs) does not work on some devices
> # ctrl-space-workaround = true
> EOF
> ```

至此，Linux 就算安装完了，接下来是**配置和调教 Arch Linux**

### 更改用户 shell

默认的 shell 实在太丑了，不如换成 zsh 吧

安装 zsh 和一些插件

```shell
# 如果没有 yay 先在 cn 源用 pacman 安装
yay -S zsh zsh-theme-powerlevel10k-git zsh-fast-syntax-highlighting zsh-completions zsh-autosuggestions zsh-history-substring-search
# 配置默认 shell 到 ZSH
chsh -s /usr/bin/zsh
```

重新登录后进入打开 Termux 会显示第一次使用，可以按提示进行配置。配置完成后会在 **~/** 下生成 **.zshrc** 配置文件。

#### 配置zsh 的 p10k 主题

完成首次配置之后，进入 `.zshrc` 文件，加入下面内容启用 `p10k` 主题和自动提示

```shell
# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

#source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /usr/share/zsh/plugins/fast-syntax-highlighting/fast-syntax-highlighting.plugin.zsh
source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh/plugins/zsh-history-substring-search/zsh-history-substring-search.zsh

source /usr/share/zsh-theme-powerlevel10k/powerlevel10k.zsh-theme

[[ ! -f ~/.bashrc ]] || source ~/.bashrc
```

之后重启命令行：`source ~/.zshrc` 即可进行 p10k 的样式设置。

#### 关闭 powerlevel10k 的 git 感知

`p10k` 有一个自动启动 16 个子进程的 Git 感知服务，没有什么用还占 CPU 占内存，下面将他关闭

设置环境变量 `POWERLEVEL9K_DISABLE_GITSTATUS=true` 即可

在 `.bashrc` 里加入：

```shell
export POWERLEVEL9K_DISABLE_GITSTATUS=true
```

## 配置 NAS 必备服务

NAS 必备：Alist 和 FTP 服务

### 安装并配置 Alist 服务

#### 1. 安装 Alist

```bash
yay -S alist-bin
```

#### 2. 初始化 Alist
```bash
# 创建数据目录
sudo mkdir -p /var/lib/alist

# 初始化配置
sudo -u alist alist admin --data /var/lib/alist init # 执行后会输出 admin 的密码，复制下来

# 如果希望重新设置 admin 的密码
sudo -u alist alist admin --data /var/lib/alist random
```

#### 3. 创建服务目录结构
```bash
mkdir -p /etc/s6/services/alist
touch /etc/s6/services/alist/run
chmod +x /etc/s6/services/alist/run
```

#### 4. 配置 Alist 服务

编辑 `/etc/s6/services/alist/run`：

```bash
#!/bin/execlineb -P
s6-setuidgid alist
alist server --data /var/lib/alist
```

#### 8. 访问 Alist

在浏览器打开 5244 端口网址即可

这样 Alist 就会作为 `s6` 管理的服务在 Arch Linux 上运行了。

### 安装并配置 unftp 服务

#### 1. 安装 Rust 和依赖

首先通过 `yay` 安装 Rust 和其他必要依赖：

```bash
yay -S rust
```

#### 2. 安装 unFTP

使用 cargo 编译安装 unFTP：

```bash
cargo install unftp
```

#### 3. 创建 `s6` 服务目录结构

```bash
mkdir -p /etc/s6/services/unftp
touch /etc/s6/services/unftp/run
chmod +x /etc/s6/services/unftp/run
```

#### 4. 配置 unFTP 服务

编辑 `/etc/s6/services/unftp/run`：

```bash
#!/bin/execlineb -P
s6-setuidgid nobody
/usr/bin/unftp --auth-type=anonymous --bind-address 0.0.0.0:6589 --root-dir /srv/ftp/public
```

#### 可选配置

1. **用户认证**：可以在 `/etc/s6/services/unftp/env` 下添加环境变量文件配置认证
2. **TLS 支持**：在 run 脚本中添加 `--tls-cert` 和 `--tls-key` 参数
3. **调整端口**：修改 run 脚本中的 `--listen` 参数

这样 unFTP 就会作为 `s6` 管理的服务在 Arch Linux 上的 **6589 端口**运行了。

至此，就基本上大功告成了！

### 特殊情况处理

#### 忘记密码

如果忘记了自定义用户的密码，可以从 termux 终端直接 proot 登录 root 用户重置密码，然后重启即可

```shell
# enter following command directly from termux basic shell
proot-distro login --user root --shared-tmp archlinux -- passwd zene
```

## 后记

差不多两周时间的折腾！~~一个半月后还要忘了密码~~
