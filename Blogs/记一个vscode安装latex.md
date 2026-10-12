---
modified: 2025年6月13日 星期五 上午 9点46分56秒
created: 2025年6月12日 星期四 晚上 9点43分42秒
---
首先，环境上选用安装在 WSL 2 上的 TeX Live 完整版（我的是 Arch 包管理器直接安装的 `yay texlive texlive-lang`）
注意，这时候 `latexindent` 格式化会失败，你需要运行 `yay -S perl-yaml-tiny perl-file-homedir` 来安装依赖。

这时打开 VSCode 安装 Latex Workshop 拓展，然后在 `settings.json` 进行配置：

```json
"latex-workshop.formatting.latex": "latexindent",
"[latex]": {
	"editor.defaultFormatter": "James-Yu.latex-workshop"
},
"latex-workshop.latex.autoBuild.run": "onSave",
"latex-workshop.showContextMenu": false,
"latex-workshop.intellisense.package.enabled": true,
"latex-workshop.message.error.show": true,
"latex-workshop.message.warning.show": false,
"latex-workshop.latex.tools": [
	{
		"name": "xelatex",
		"command": "xelatex",
		"args": [
			"-synctex=1",
			"-interaction=nonstopmode",
			"-file-line-error",
			"%DOCFILE%"
		]
	},
	{
		"name": "pdflatex",
		"command": "pdflatex",
		"args": [
			"-synctex=1",
			"-interaction=nonstopmode",
			"-file-line-error",
			"%DOCFILE%"
		]
	},
	{
		"name": "latexmk",
		"command": "latexmk",
		"args": [
			"-xelatex",
			"-synctex=1",
			"-interaction=nonstopmode",
			"-file-line-error",
			"-pdf",
			"-outdir=%OUTDIR%",
			"%DOCFILE%"
		]
	},
	{
		"name": "bibtex",
		"command": "bibtex",
		"args": [
			"%DOCFILE%"
		]
	}
],
"latex-workshop.latex.recipes": [
	{
		"name": "XeLaTeX",
		"tools": [
			"xelatex"
		]
	},
	{
		"name": "PDFLaTeX",
		"tools": [
			"pdflatex"
		]
	},
	{
		"name": "BibTeX",
		"tools": [
			"bibtex"
		]
	},
	{
		"name": "LaTeXmk",
		"tools": [
			"latexmk"
		]
	},
	{
		"name": "xelatex -> bibtex -> xelatex*2",
		"tools": [
			"xelatex",
			"bibtex",
			"xelatex",
			"xelatex"
		]
	},
	{
		"name": "pdflatex -> bibtex -> pdflatex*2",
		"tools": [
			"pdflatex",
			"bibtex",
			"pdflatex",
			"pdflatex"
		]
	},
],
"latex-workshop.latex.clean.fileTypes": [
	"*.aux",
	"*.bbl",
	"*.blg",
	"*.idx",
	"*.ind",
	"*.lof",
	"*.lot",
	"*.out",
	"*.toc",
	"*.acn",
	"*.acr",
	"*.alg",
	"*.glg",
	"*.glo",
	"*.gls",
	"*.ist",
	"*.fls",
	"*.log",
	"*.fdb_latexmk"
],
"latex-workshop.latex.autoClean.run": "onFailed",
"latex-workshop.latex.recipe.default": "lastUsed",
"latex-workshop.view.pdf.internal.synctex.keybinding": "double-click",
```

这时候应该已经可以正常使用 Latex 编译了。
