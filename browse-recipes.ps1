[CmdletBinding()]
param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = $PSScriptRoot
$browserJob = $null

function Find-AvailablePreviewPort {
    foreach ($port in 8080..8090) {
        $listener = $null

        try {
            $listener = [System.Net.Sockets.TcpListener]::new(
                [System.Net.IPAddress]::Loopback,
                $port
            )
            $listener.Start()
            return $port
        }
        catch [System.Net.Sockets.SocketException] {
            continue
        }
        finally {
            if ($null -ne $listener) {
                $listener.Stop()
            }
        }
    }

    throw 'No available preview port was found between 8080 and 8090.'
}

try {
    if (-not (Get-Command -Name 'node.exe' -ErrorAction SilentlyContinue)) {
        throw 'Node.js is not installed or is not available on PATH. Install Node.js, then try again.'
    }

    if (-not (Get-Command -Name 'npm.cmd' -ErrorAction SilentlyContinue)) {
        throw 'npm is not installed or is not available on PATH. Reinstall Node.js, then try again.'
    }

    Set-Location -LiteralPath $repositoryRoot

    if (-not (Test-Path -LiteralPath (Join-Path $repositoryRoot 'node_modules'))) {
        Write-Host 'Preparing the recipe viewer for first use...'
        & npm.cmd ci

        if ($LASTEXITCODE -ne 0) {
            throw "npm could not install the recipe viewer (exit code $LASTEXITCODE)."
        }
    }

    $previewPort = Find-AvailablePreviewPort
    $previewUrl = "http://localhost:$previewPort/"

    if (-not $NoBrowser) {
        $browserJob = Start-Job -ScriptBlock {
            param($Url)

            for ($attempt = 0; $attempt -lt 120; $attempt++) {
                try {
                    Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 | Out-Null
                    Start-Process $Url
                    return
                }
                catch {
                    Start-Sleep -Milliseconds 500
                }
            }
        } -ArgumentList $previewUrl
    }

    Write-Host "Starting the recipe viewer at $previewUrl"
    Write-Host 'Keep this window open. Press Ctrl+C to stop the viewer.'
    Write-Host ''

    & npm.cmd run serve -- --port=$previewPort

    if ($LASTEXITCODE -notin @(0, 130, -1073741510, 3221225786)) {
        throw "The recipe viewer stopped unexpectedly (exit code $LASTEXITCODE)."
    }
}
catch {
    Write-Error $_
    exit 1
}
finally {
    if ($null -ne $browserJob) {
        Stop-Job -Job $browserJob -ErrorAction SilentlyContinue
        Remove-Job -Job $browserJob -Force -ErrorAction SilentlyContinue
    }
}
