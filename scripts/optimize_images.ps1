param (
    [string]$SourceFolder = "Images",
    [long]$MinSizeMB = 5,
    [int]$MaxWidth = 2048,
    [int]$Quality = 85
)

Add-Type -AssemblyName System.Drawing
$MinSizeBytes = $MinSizeMB * 1024 * 1024
$BackupFolder = "backups\images_original"

if (-not (Test-Path $BackupFolder)) {
    New-Item -ItemType Directory -Path $BackupFolder -Force | Out-Null
}

function Get-JpegCodec {
    return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
}

function Optimize-Image {
    param ([string]$FilePath)
    
    $file = Get-Item $FilePath
    if ($file.Length -lt $MinSizeBytes) { return }
    
    Write-Host "Optimizing: $($file.Name) ($($file.Length / 1MB -as [int]) MB)"
    
    # Backup original
    $relativeDir = Split-Path $file.FullName.Replace((Get-Location).Path + "\", "") -Parent
    $destDir = Join-Path $BackupFolder $relativeDir
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    $backupPath = Join-Path $destDir $file.Name
    Copy-Item $file.FullName $backupPath -Force
    
    # Load and process image
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    
    $newWidth = $img.Width
    $newHeight = $img.Height
    
    if ($img.Width -gt $MaxWidth) {
        $ratio = $MaxWidth / $img.Width
        $newWidth = $MaxWidth
        $newHeight = [int]($img.Height * $ratio)
    }
    
    $newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
    
    # Setup compression
    $encoder = Get-JpegCodec
    $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
    
    $img.Dispose()
    
    # Save optimized image
    $newImg.Save($file.FullName, $encoder, $encoderParameters)
    $newImg.Dispose()
    $graphics.Dispose()
    
    $newFile = Get-Item $file.FullName
    Write-Host "Done: $($newFile.Name) optimized to ($($newFile.Length / 1KB -as [int]) KB)"
}

Get-ChildItem -Path $SourceFolder -Recurse -Include *.jpg, *.jpeg, *.png | ForEach-Object {
    Optimize-Image $_.FullName
}
