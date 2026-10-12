---
modified: 2026年3月9日 星期一 下午 1点45分50秒
created: 2025年12月1日 星期一 晚上 11点35分36秒
---
# 记一个Win下让GNU-Clangd适配MSVC的过程

在 Windows 下使用 MSVC 编译器的时候，Clangd 默认是无法正确识别 MSVC 的头文件路径的，导致头文件报错。
这里在 VSCode 里面的 Cmake 工具链选择 MSVC 之后，头文件会有提示错误。
我找到的解决方案有：

- 要么在 CMakeLists 里面手动加入 MSVC 的头文件路径（有点不优雅）
- 那么有点不优雅的解决方案也只有改动 Clangd 系统上的配置文件，加入头文件路径（但是改回 gcc preset会报错）
- 要么可以选择使用 BuildTool 可选的 LLVM/Clang，里面附带一个 Clangd，这个会自动找到 MSVC 的头文件，但是这个很大，下载安装要 9 Gb，而且每次切换工具链还要手动改 VSCode 的配置文件

## 方案一：改 CMakeLists (不优雅但是最兼容)

```cmake
# 设置MSVC编译器的 clangd 跳转特殊处理
if(MSVC)
    # 手动适配clangd提示，不保真... 不知道会不会有什么奇怪的问题，出问题可以翻找一下cmake的缓存看看里面存了什么
    if(DEFINED CMAKE_AR)
        get_filename_component(VC_INCLUDE_DIR ${CMAKE_AR} DIRECTORY)
        get_filename_component(VC_INCLUDE_DIR ${VC_INCLUDE_DIR} DIRECTORY)
        get_filename_component(VC_INCLUDE_DIR ${VC_INCLUDE_DIR} DIRECTORY)
        get_filename_component(VC_INCLUDE_DIR ${VC_INCLUDE_DIR} DIRECTORY)

        set(DIASDK_DIR "${VC_INCLUDE_DIR}")
        get_filename_component(DIASDK_DIR ${DIASDK_DIR} DIRECTORY)
        get_filename_component(DIASDK_DIR ${DIASDK_DIR} DIRECTORY)
        get_filename_component(DIASDK_DIR ${DIASDK_DIR} DIRECTORY)
        get_filename_component(DIASDK_DIR ${DIASDK_DIR} DIRECTORY)
        set(DIASDK_DIR "${DIASDK_DIR}/DIA SDK/include")
        message(STATUS "DIASDK_DIR: ${DIASDK_DIR}")

        set(VC_INCLUDE_DIR "${VC_INCLUDE_DIR}/include")
        message(STATUS "VC_INCLUDE_DIR: ${VC_INCLUDE_DIR}")

        include_directories(
            BEFORE SYSTEM
            "${DIASDK_DIR}"
            "${VC_INCLUDE_DIR}")
    endif()

    if(DEFINED CMAKE_MT)
        get_filename_component(WINDOWS_KITS_10_DIR ${CMAKE_MT} DIRECTORY)
        get_filename_component(_PLATFORM ${WINDOWS_KITS_10_DIR} NAME)
        get_filename_component(WINDOWS_KITS_10_DIR ${WINDOWS_KITS_10_DIR} DIRECTORY)
        get_filename_component(_VERSION ${WINDOWS_KITS_10_DIR} NAME)
        get_filename_component(WINDOWS_KITS_10_DIR ${WINDOWS_KITS_10_DIR} DIRECTORY)
        get_filename_component(WINDOWS_KITS_10_DIR ${WINDOWS_KITS_10_DIR} DIRECTORY)

        message(STATUS "WINDOWS_KITS_10_DIR: ${WINDOWS_KITS_10_DIR}")

        include_directories(
            BEFORE SYSTEM
            "${WINDOWS_KITS_10_DIR}/include/${_VERSION}/um"
            "${WINDOWS_KITS_10_DIR}/include/${_VERSION}/ucrt"
            "${WINDOWS_KITS_10_DIR}/include/${_VERSION}/shared"
            "${WINDOWS_KITS_10_DIR}/include/${_VERSION}/winrt")
    endif()
endif()
```

## 方案二：改用户配置（改回 gcc 编译器就报错）

根据：

- _Windows_: `%LocalAppData%\clangd\config.yaml`, typically `C:\Users\Bob\AppData\Local\clangd\config.yaml`.
我们打开 `config.yaml`

然后根据实际 MSVC 和 Windows SDK 的路径填入

```yaml
# Use the MSVC as the compiler
CompileFlags:
    Add:
    - '-ID:/Program Files (x86)/Microsoft Visual Studio/2022/BuildTools/DIA SDK/include'
    - '-ID:/Program Files (x86)/Microsoft Visual Studio/2022/BuildTools/VC/Tools/MSVC/14.44.35207/include'
    - '-IC:/Program Files (x86)/Windows Kits/10/Include/10.0.22621.0/um'
    - '-IC:/Program Files (x86)/Windows Kits/10/Include/10.0.22621.0/ucrt'
    - '-IC:/Program Files (x86)/Windows Kits/10/Include/10.0.22621.0/shared'
    - '-IC:/Program Files (x86)/Windows Kits/10/Include/10.0.22621.0/winrt'
```

保存之后重启 VSCode，Clangd 就可以正确识别 MSVC 的头文件了。

## 方案三：安装 MSVC BuildTool 的 LLVM 工具链

打开 VS Installer 选择修改，并选中 `适用于Windows的C++ Clang工具`

![[Pasted image 20251207142615.png]]

然后在 VSCode 配置里面把 clangd 的位置改成这里的即可。
