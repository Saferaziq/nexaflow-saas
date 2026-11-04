Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\dinam\nexaflow-saas\public"

# Cari file logo baru (mengantisipasi jika ekstensinya .png, .jpg, atau .jpeg)
$file = Get-ChildItem -Path $dir -Filter "logo-nexaflow*" | Select-Object -First 1

if ($null -eq $file) {
    Write-Host "ERROR: File logo-nexaflow tidak ditemukan di folder public." -ForegroundColor Red
    Exit
}

$imgPath = $file.FullName
Write-Host "Menemukan file gambar: $imgPath" -ForegroundColor Cyan

if (!(Test-Path "$dir\icons")) { New-Item -ItemType Directory -Path "$dir\icons" | Out-Null }

$src = [System.Drawing.Image]::FromFile($imgPath)

# Buat ukuran 192x192
$b192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($b192)
$g192.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g192.DrawImage($src, 0, 0, 192, 192)
$b192.Save("$dir\icons\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Buat ukuran 512x512
$b512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($b512)
$g512.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g512.DrawImage($src, 0, 0, 512, 512)
$b512.Save("$dir\icons\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g192.Dispose(); $b192.Dispose()
$g512.Dispose(); $b512.Dispose()
$src.Dispose()

Write-Host "SUKSES! Icon PWA 192x192 dan 512x512 berhasil diperbarui." -ForegroundColor Green