Add-Type -AssemblyName System.Drawing
$dir = "src\imgs"
$files = Get-ChildItem $dir | Where-Object { $_.Length -gt 400000 }
foreach ($file in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $w = $img.Width
        $h = $img.Height
        $maxDim = 900
        if ($w -gt $maxDim -or $h -gt $maxDim) {
            $ratio = [Math]::Min($maxDim / $w, $maxDim / $h)
            $newW = [int]($w * $ratio)
            $newH = [int]($h * $ratio)
            $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.DrawImage($img, 0, 0, $newW, $newH)
            $g.Dispose()
            $img.Dispose()
            
            $tempPath = $file.FullName + '.opt.tmp'
            if ($file.Extension -match '\.png$') {
                $bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
            } else {
                $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
                $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)
                $bmp.Save($tempPath, $codec, $encoderParams)
            }
            $bmp.Dispose()
            Move-Item -Path $tempPath -Destination $file.FullName -Force
            Write-Host "Optimized: $($file.Name) -> $((Get-Item $file.FullName).Length) bytes"
        } else {
            $img.Dispose()
        }
    } catch {
        Write-Warning "Failed on $($file.Name): $($_.Exception.Message)"
    }
}
