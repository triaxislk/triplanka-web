$files = Get-ChildItem -Path . -Filter *.html -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace in various navigation/button contexts
    $newContent = $content -replace '>Touring Plans<', '>Journey Hub<'
    $newContent = $newContent -replace '>Touring Plans <i', '>Journey Hub <i'
    $newContent = $newContent -replace 'View Touring Plans', 'View Journey Hub'
    $newContent = $newContent -replace '>Touring Plans</a>', '>Journey Hub</a>'
    $newContent = $newContent -replace '/ Touring Plans /', '/ Journey Hub /' # For breadcrumbs or titles
    
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent -NoNewline
        Write-Host "Updated $($file.FullName)"
    }
}
