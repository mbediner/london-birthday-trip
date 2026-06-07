$ErrorActionPreference = "Stop"

function Section($name) {
  Write-Host ""
  Write-Host "== $name =="
}

function Resolve-Git {
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $candidates = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) { return $candidate }
  }

  throw "Git was not found. Install Git or add it to PATH before running the Drive preflight."
}

$git = Resolve-Git
$repoRoot = (& $git rev-parse --show-toplevel).Trim()
Set-Location $repoRoot

Section "Refresh Git Index"
& $git update-index -q --refresh

Section "Google Drive Conflict Files"
$conflicts = Get-ChildItem -LiteralPath $repoRoot -Recurse -Force -File |
  Where-Object {
    $_.FullName -notmatch "\\.git\\" -and
    ($_.Name -match "conflicted copy|sync conflict| \(.\d+\)\." -or $_.Name -match "\.tmp$|\.crdownload$")
  }

if ($conflicts) {
  $conflicts | ForEach-Object { Write-Host $_.FullName }
  throw "Potential Google Drive conflict or temporary files found."
}
Write-Host "No obvious Drive conflict files found."

Section "Dependency Folders"
$blocked = @("node_modules", ".venv", "venv", "__pycache__") |
  ForEach-Object { Join-Path $repoRoot $_ } |
  Where-Object { Test-Path -LiteralPath $_ }

if ($blocked) {
  $blocked | ForEach-Object { Write-Host $_ }
  throw "Generated dependency/cache folders should not live in this Google Drive repo."
}
Write-Host "No generated dependency/cache folders found."

Section "Whitespace"
& $git diff --check

Section "Remote Drift"
& $git fetch --quiet origin
$upstream = (& $git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null).Trim()
if ($upstream) {
  $counts = (& $git rev-list --left-right --count "HEAD...$upstream").Trim() -split "\s+"
  Write-Host "Ahead: $($counts[0])  Behind: $($counts[1])"
  if ([int]$counts[1] -gt 0) {
    throw "Local branch is behind $upstream. Pull/rebase before editing or pushing."
  }
} else {
  Write-Host "No upstream branch configured."
}

Section "Working Tree"
$status = & $git status --porcelain=v1
if ($status) {
  $status
  Write-Host ""
  Write-Host "Working tree has changes. Review them before committing."
} else {
  Write-Host "Working tree is clean."
}
