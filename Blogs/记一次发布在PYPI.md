---
modified: 2026年3月23日 星期一 凌晨 1点26分03秒
created: 2026年3月23日 星期一 凌晨 1点03分45秒
---
注意：现在 PYPI 强制要求 2-FA

在 25 年末，UV 已经支持了包括发布和打包在内的一系列功能（打包好像是基于 `pyproject.toml`）
所以下面直接使用 uv 完成。

1. Cd 到你的 Python 项目目录
2. Run `uv build`，成功会在当前生成 `dist/**`，目录下面就是打包出来的文件
3. Run `uv publish --token xxxxxxx`

这个 xxx 就是你在 pypi 上面注册获得的 Token，你也可以不带命令行参数，这样 uv 会询问你

注意：这个发布的版本号不能是带有 dev, git, xxx 字样的，这样会发布不上去，正确的应该是 `v1.3.5` 这种

其他方法是使用 twine 进行发布（要先 build）

`twine upload dist/`

发布到 testpypi

`twine upload --repository-url https://test.pypi.org/legacy/ dist/*`
