---
modified: 2025年10月30日 星期四 晚上 7点05分36秒
created: 2025年6月16日 星期一 上午 9点47分17秒
---
注明：写作于 `JE 1.21.5` 和最新版 JDK 24

## OpenJDK

在 OpenJDK 中，如果是 Linux 则推荐 Auzl Zing JDK，如果是 Windows 则推荐 Auzl Zulu JDK

OpenJDK 提供了新型的 GC 算法包括 `ZGC` 和 `ShenandoahGC`

### ZGC

```sh
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC -XX:+EagerJVMCI -XX:+UseCompactObjectHeaders -XX:+PerfDisableSharedMem -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:NmethodSweepActivity=1 -XX:+ParallelRefProcEnabled -XX:+UseNUMA -XX:+AllowParallelDefineClass -XX:+UseFastUnorderedTimeStamps -XX:+UnlockDiagnosticVMOptions -XX:+OmitStackTraceInFastThrow -XX:+OptimizeStringConcat -XX:-DontCompileHugeMethods -XX:ReservedCodeCacheSize=512M -XX:MaxInlineSize=420 -XX:InlineSmallCode=2000 -XX:+SegmentedCodeCache
```

### ShenandoahGC

```sh
-XX:+UnlockExperimentalVMOptions -XX:+ShenandoahGC -XX:+EagerJVMCI -XX:+UseCompactObjectHeaders -XX:+PerfDisableSharedMem -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:NmethodSweepActivity=1 -XX:+ParallelRefProcEnabled -XX:+UseNUMA -XX:+AllowParallelDefineClass -XX:+UseFastUnorderedTimeStamps -XX:+UnlockDiagnosticVMOptions -XX:+OmitStackTraceInFastThrow -XX:+OptimizeStringConcat -XX:-DontCompileHugeMethods -XX:ReservedCodeCacheSize=512M -XX:MaxInlineSize=420 -XX:InlineSmallCode=2000 -XX:+SegmentedCodeCache
```

## GraalVM

除了 Open JDK 的推荐以外，还推荐 Oracle 的新 JDK：[GraalVM](https://www.graalvm.org/downloads/#)
Oracle 的 JDK 都不编译 `ShenandoahGC`，所以使用 `ZGC`

```sh
-XX:+UnlockExperimentalVMOptions -XX:+UseZGC -XX:+EagerJVMCI -XX:+UseCompactObjectHeaders -XX:+PerfDisableSharedMem -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:NmethodSweepActivity=1 -XX:+ParallelRefProcEnabled -XX:+UseNUMA -XX:+AllowParallelDefineClass -XX:+UseFastUnorderedTimeStamps -XX:+UnlockDiagnosticVMOptions -XX:+OmitStackTraceInFastThrow -XX:+OptimizeStringConcat -XX:-DontCompileHugeMethods -XX:ReservedCodeCacheSize=512M -XX:MaxInlineSize=420 -XX:InlineSmallCode=2000 -XX:+SegmentedCodeCache
```

## OpenJ9
在 `OpenJDK` 和 `Oracle JDK` 之外，还可以选择 [Semeru](https://developer.ibm.com/languages/java/semeru-runtimes/downloads/) 作为追求低内存占用的选择

这是一个适用于单机版的选择，使用 balanced 策略
```sh
-Xgcpolicy:balanced -Xgc:targetPausetime=10
```

或 gencon cs 策略
```sh
-Xgcpolicy:gencon -Xgc:concurrentScavenge
```

最後都補上 
```sh
-Xgc:dnssExpectedTimeRatioMaximum=2 -Xaggressive
```

這樣就應該能有滿意的低暫停與禎數效果了。
