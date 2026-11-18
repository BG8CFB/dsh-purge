<#
.SYNOPSIS
  Restore "C:\Program Files\DSH NEXT" to its pristine state by removing the patched
  resources\app extraction, then verify the untouched app.asar hash.

.DESCRIPTION
  Background: the legacy dsh-purge plugin extracted app.asar into resources\app and patched
  ~70 files inside it (markers: [dsh-purge]). Electron loads resources\app in preference to
  app.asar, so the running application was the patched copy.
  This script quarantines that directory (never deletes), removes the leftover rename markers,
  and proves the archive still matches the recorded baseline hash.
  Run it with the desktop app CLOSED and from an elevated shell.

.PARAMETER DryRun
  Report what would happen without touching anything.
#>
[CmdletBinding()]
param(
  [switch]$DryRun,
  [string]$QuarantineRoot = 'D:\Code\DSH\dsh-purge\.baseline\quarantine'
)

$ErrorActionPreference = 'Stop'
$RES = 'C:\Program Files\DSH NEXT\resources'
$EXPECTED = 'C7057E19E777FF6423815268901ECFE30382323E0DC2E5405B7A7E915328607E'
$EXE = 'C:\Program Files\DSH NEXT\DSH NEXT.exe'
$STAMP = Get-Date -Format 'yyyyMMdd-HHmmss'
$REPORT = Join-Path $PSScriptRoot "..\.baseline\restore-report-$STAMP.txt"

function Write-Step([string]$Text) {
  Write-Host $Text
  Add-Content -Path $REPORT -Value $Text -Encoding UTF8
}

if (-not $DryRun) {
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  if (-not $isAdmin) {
    Write-Host '需要管理员权限：请右键「以管理员身份运行」本脚本，或运行同名 .cmd 自动提权。' -ForegroundColor Red
    exit 2
  }
}

New-Item -ItemType Directory -Force -Path (Split-Path $REPORT) | Out-Null
Write-Step "DSH NEXT restore  $STAMP  dryRun=$DryRun"

# 1. close the app
if (-not $DryRun) {
  $procs = Get-Process -Name 'DSH NEXT' -ErrorAction SilentlyContinue
  if ($procs) {
    Write-Step "[1/6] 结束 DSH NEXT 进程 ($($procs.Count))"
    $procs | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
  } else {
    Write-Step '[1/6] 未发现运行中的 DSH NEXT'
  }
  $left = Get-Process -Name 'DSH NEXT' -ErrorAction SilentlyContinue
  if ($left) { Write-Step '  仍有余留进程，终止失败'; exit 3 }
} else {
  Write-Step '[1/6] dry-run: 跳过结束进程'
}

# 2. quarantine the patched extraction
$appDir = Join-Path $RES 'app'
if (Test-Path $appDir) {
  $dest = Join-Path $QuarantineRoot "app-patched-$STAMP"
  if ($DryRun) {
    Write-Step "[2/6] dry-run: 会把 $appDir 移到 $dest"
  } else {
    New-Item -ItemType Directory -Force -Path $QuarantineRoot | Out-Null
    Write-Step "[2/6] 隔离被打补丁的 app 目录 -> $dest"
    $rc = Start-Process -FilePath 'robocopy' -ArgumentList @($appDir, $dest, '/E', '/MOVE', '/R:1', '/W:1', '/NFL', '/NDL', '/NJH', '/NJS', '/NP') -Wait -PassThru -NoNewWindow
    if ($rc.ExitCode -ge 8) {
      Write-Step "  robocopy 失败 (exit $($rc.ExitCode))；改用 rename 兜底"
      Rename-Item -Path $appDir -NewName ("app.patched-" + $STAMP) -ErrorAction Stop
    }
    if (Test-Path $appDir) { Write-Step '  警告：app 目录仍存在'; exit 4 } else { Write-Step '  app 目录已移出' }
  }
} else {
  Write-Step '[2/6] resources\app 不存在，无需隔离'
}

# 3. clean leftover markers
foreach ($name in @('app.asar.rename-pending', 'app.dshpurge-prev')) {
  $path = Join-Path $RES $name
  if (Test-Path $path) {
    if ($DryRun) { Write-Step "[3/6] dry-run: 会删除 $name" }
    else { Remove-Item $path -Force; Write-Step "[3/6] 已删除残留标记 $name" }
  }
}

# 4. recover the archive if a previous run renamed it
$disabled = Join-Path $RES 'app.asar.disabled'
if (Test-Path $disabled) {
  if ($DryRun) { Write-Step '[4/6] dry-run: 会把 app.asar.disabled 改回 app.asar' }
  else { Rename-Item $disabled 'app.asar' -Force; Write-Step '[4/6] 已恢复 app.asar.disabled -> app.asar' }
}

# 5. verify the archive is the pristine one
$asar = Join-Path $RES 'app.asar'
if (-not (Test-Path $asar)) { Write-Step '[5/6] 失败：app.asar 不存在'; exit 5 }
$hash = (Get-FileHash $asar -Algorithm SHA256).Hash
Write-Step "[5/6] app.asar sha256 = $hash"
if ($hash -ne $EXPECTED) {
  Write-Step "  与基线不一致（期望 $EXPECTED）"
  Write-Step '  说明：若曾执行官方更新，哈希变化属正常；请核对文件大小与版本号后再决定是否继续。'
} else {
  Write-Step '  与基线一致：安装目录源码未被改写'
}

# 6. relaunch
if ($DryRun) {
  Write-Step '[6/6] dry-run: 不会启动应用'
} else {
  if (Test-Path $EXE) {
    Write-Step "[6/6] 启动 $EXE"
    Start-Process -FilePath $EXE
  } else {
    Write-Step "[6/6] 未找到可执行文件：$EXE"
  }
}

Write-Step ''
Write-Step '完成。报告：' + $REPORT
Write-Host ''
Write-Host '还原后请确认：侧栏会话的「删除会话」菜单已经回来。' -ForegroundColor Green