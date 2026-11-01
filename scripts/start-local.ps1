$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$serverRoot = Join-Path $repositoryRoot 'server'
$clientRoot = Join-Path $repositoryRoot 'client'
$logRoot = Join-Path $env:LOCALAPPDATA 'ToonVerse\logs'
$nodePath = (Get-Command node.exe -ErrorAction Stop).Source

New-Item -ItemType Directory -Path $logRoot -Force | Out-Null

function Test-LocalEndpoint {
  param([string]$Url)

  try {
    $null = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    return $true
  } catch {
    return $false
  }
}

if (-not (Test-LocalEndpoint 'http://127.0.0.1:5000/api/health')) {
  Start-Process -FilePath $nodePath `
    -ArgumentList @('server.js') `
    -WorkingDirectory $serverRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $logRoot 'server.out.log') `
    -RedirectStandardError (Join-Path $logRoot 'server.err.log')
}

if (-not (Test-LocalEndpoint 'http://127.0.0.1:5173')) {
  Start-Process -FilePath $nodePath `
    -ArgumentList @('node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--strictPort') `
    -WorkingDirectory $clientRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $logRoot 'client.out.log') `
    -RedirectStandardError (Join-Path $logRoot 'client.err.log')
}

$deadline = (Get-Date).AddSeconds(30)
do {
  $serverReady = Test-LocalEndpoint 'http://127.0.0.1:5000/api/health'
  $clientReady = Test-LocalEndpoint 'http://127.0.0.1:5173'

  if ($serverReady -and $clientReady) {
    Write-Output 'ToonVerse is ready at http://127.0.0.1:5173 (API: http://127.0.0.1:5000).'
    exit 0
  }

  Start-Sleep -Seconds 1
} while ((Get-Date) -lt $deadline)

throw "ToonVerse did not start. Check logs in $logRoot."
