$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$backupName = "Backup_TripLanka_$timestamp.zip"
$backupDir = "c:\Users\koral\OneDrive\Documents\TriAxis\Github\triplanka-web\backups"
$backupPath = Join-Path $backupDir $backupName
$sourcePath = "c:\Users\koral\OneDrive\Documents\TriAxis\Github\triplanka-web"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

Write-Host "Creating backup: $backupName..."

# Get all items in the root, excluding .git, backups, scratch, and zip files
$itemsToBackup = Get-ChildItem -Path $sourcePath -Exclude ".git", "backups", "scratch", "*.zip", "*.bak", "tmp"

Compress-Archive -Path $itemsToBackup.FullName -DestinationPath $backupPath -Force

Write-Host "Backup created successfully at $backupPath"
