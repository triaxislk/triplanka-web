$files = Get-ChildItem -Path . -Filter *.html -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    $newContent = $content
    
    # Navigation and Buttons
    $newContent = $newContent -replace '>Touring Plans<', '>Journey Hub<'
    $newContent = $newContent -replace '>Touring Plans <i', '>Journey Hub <i'
    $newContent = $newContent -replace 'View Touring Plans', 'View Journey Hub'
    
    # Dropdown items
    $newContent = $newContent -replace 'Touring Plan</a>', 'Blueprint</a>'
    $newContent = $newContent -replace 'Travel Plan</a>', 'Blueprint</a>'
    $newContent = $newContent -replace 'Romance Plan</a>', 'Romance Blueprint</a>'
    $newContent = $newContent -replace 'Relaxation Plan</a>', 'Relaxation Blueprint</a>'
    
    # Page Titles
    $newContent = $newContent -replace '<title>Touring Plans', '<title>Journey Hub'
    $newContent = $newContent -replace '\| Touring Plans \|', '| Journey Hub |'
    
    # Hero Title in plans.html specifically (just in case)
    $newContent = $newContent -replace 'Journey Blueprint <span>& Selection</span>', 'Journey <span>Hub</span>'
    
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent -NoNewline
        Write-Host "Updated $($file.FullName)"
    }
}
