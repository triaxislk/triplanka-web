param (
    [string]$SourceFolder = "Images",
    [long]$MinSizeMB = 1,
    [int]$MaxWidth = 1600,
    [int]$Quality = 75
)

Add-Type -AssemblyName System.Drawing
$MinSizeBytes = $MinSizeMB * 1024 * 1024

function Get-Codec {
    param([string]$mimeType)
    return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq $mimeType }
}

function Optimize-Image {
    param ([string]$FilePath)
    
    try {
        $file = Get-Item $FilePath
        if ($file.Length -lt $MinSizeBytes) { return }
        
        Write-Host "Checking: $($file.Name) ($($file.Length / 1MB -as [int]) MB)"
        
        # Load and process image
        $img = $null
        try {
            # Use a stream to avoid locking the file
            $stream = [System.IO.File]::OpenRead($file.FullName)
            $img = [System.Drawing.Image]::FromStream($stream)
            $stream.Close()
            $stream.Dispose()
        } catch {
            Write-Warning "Skipping $($file.Name): Not a valid or supported image file."
            return
        }
        
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
        
        # Determine format and setup compression
        $ext = [System.IO.Path]::GetExtension($file.FullName).ToLower()
        $mimeType = if ($ext -match "png") { "image/png" } else { "image/jpeg" }
        $encoder = Get-Codec $mimeType
        
        $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        
        # Save to a temporary file first
        $tempPath = [System.IO.Path]::GetTempFileName() + $ext
        $newImg.Save($tempPath, $encoder, $encoderParameters)
        
        $img.Dispose()
        $newImg.Dispose()
        $graphics.Dispose()
        
        $tempFile = Get-Item $tempPath
        if ($tempFile.Length -lt $file.Length) {
            Write-Host "Optimizing: $($file.Name) (Reduced: $($file.Length / 1KB -as [int]) KB -> $($tempFile.Length / 1KB -as [int]) KB)"
            Move-Item -Path $tempPath -Destination $file.FullName -Force
        } else {
            Write-Host "Skipping: $($file.Name) (Optimization didn't reduce size - kept original)"
            Remove-Item $tempPath
        }
    } catch {
        Write-Error "Failed to process $($FilePath): $($_.Exception.Message)"
    }
}

Get-ChildItem -Path $SourceFolder -Recurse -Include *.jpg, *.jpeg, *.png | ForEach-Object {
    Optimize-Image $_.FullName
}
