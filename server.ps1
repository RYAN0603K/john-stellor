$port = 8080
$ip = "0.0.0.0"

try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse($ip), $port)
    $listener.Start()
    
    $localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object InterfaceAlias -Match "Wi-Fi|Ethernet" | Select-Object -First 1).IPAddress
    Write-Host "Servidor rodando! Acesse do celular no link: http://${localIp}:${port}/"
    
    while ($true) {
        if ($listener.Pending()) {
            $client = $null
            try {
                $client = $listener.AcceptTcpClient()
                $stream = $client.GetStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $writer = New-Object System.IO.StreamWriter($stream)
                
                # Lê a primeira linha (Request-Line)
                $request = $reader.ReadLine()
                
                if ($null -ne $request -and $request -match "GET (.*?) HTTP") {
                    $path = $matches[1]
                    if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }
                    $path = $path.Split('?')[0]
                    
                    $localPath = Join-Path (Get-Location) $path.Replace('/', '\')
                    
                    # Esvazia o buffer de headers
                    while ($true) {
                        $line = $reader.ReadLine()
                        if ([string]::IsNullOrEmpty($line)) { break }
                    }
                    
                    if (Test-Path $localPath -PathType Leaf) {
                        $bytes = [System.IO.File]::ReadAllBytes($localPath)
                        $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                        $contentType = "text/html"
                        if ($ext -eq ".css") { $contentType = "text/css" }
                        if ($ext -eq ".js") { $contentType = "application/javascript" }
                        if ($ext -eq ".png") { $contentType = "image/png" }
                        if ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
                        if ($ext -eq ".svg") { $contentType = "image/svg+xml" }
                        
                        $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
                        $writer.Write($header)
                        $writer.Flush()
                        $stream.Write($bytes, 0, $bytes.Length)
                    } else {
                        $header = "HTTP/1.1 404 Not Found`r`nConnection: close`r`n`r`n"
                        $writer.Write($header)
                        $writer.Flush()
                    }
                }
            } catch {
                # Ignorar cliente desconectado
            } finally {
                if ($null -ne $client) { $client.Close() }
            }
        }
        Start-Sleep -Milliseconds 10
    }
} finally {
    if ($listener) { $listener.Stop() }
}
