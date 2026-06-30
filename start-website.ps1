$siteDir = "C:\Users\Farouk Adnan\Documents\Codex\2026-05-30\ai-news-editorial-agent-rss-feed\outputs\abaad-almashhad-site"
$nodeExe = "C:\Users\Farouk Adnan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$port = 3000

function Test-LocalPort {
  param([int]$Port)
  try {
    $client = New-Object Net.Sockets.TcpClient
    $result = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    $connected = $result.AsyncWaitHandle.WaitOne(700, $false)
    if ($connected) { $client.EndConnect($result) }
    $client.Close()
    return $connected
  } catch {
    return $false
  }
}

if (-not (Test-LocalPort -Port $port)) {
  Start-Process -FilePath $nodeExe -ArgumentList "server.js" -WorkingDirectory $siteDir -WindowStyle Hidden
  Start-Sleep -Seconds 2
}

if ($args -contains "-OpenBrowser") {
  Start-Process "http://localhost:3000/index.html"
}
