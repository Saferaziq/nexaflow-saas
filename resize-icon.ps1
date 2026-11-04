Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\dinam\nexaflow-saas\public"

$file = Get-ChildItem -Path $dir -Filter "logo-nexaflow*" | Select-Object -First 1

if ($null -eq $file) {
    Write-Host "ERROR: File logo tidak ditemukan." -ForegroundColor Red
    Exit
}

$imgPath = $file.FullName
Write-Host "Menemukan file gambar: $imgPath" -ForegroundColor Cyan

$src = [System.Drawing.Image]::FromFile($imgPath)

# Buat ukuran 192x192 dengan nama -v2
$b192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($b192)
$g192.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g192.DrawImage($src, 0, 0, 192, 192)
$b192.Save("$dir\icons\icon-192-v2.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Buat ukuran 512x512 dengan nama -v2
$b512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($b512)
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.DrawImage($src, 0, 0, 512, 512)
$b512.Save("$dir\icons\icon-512-v2.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g192.Dispose(); $b192.Dispose()
$g512.Dispose(); $b512.Dispose()
$src.Dispose()

Write-Host "SUKSES! Icon v2 berukuran pas berhasil dibuat." -ForegroundColor Green