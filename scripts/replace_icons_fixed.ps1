$targetFiles = Get-ChildItem -Path "c:\Users\koral\OneDrive\Documents\TriAxis\Github\triplanka-web\pages\guide\*.html"
foreach ($file in $targetFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Use regex replace to handle the icon line, catching any trailing comments on that same line
    $content = $content -replace '<i class="fab fa-bootstrap"></i>.*', '<img src="../../Images/Associated Companies/booking.com.png" alt="Booking.com" class="partner-logo">'
    
    $content = $content -replace '<i class="fab fa-tripadvisor"></i>.*', '<img src="../../Images/Associated Companies/Trip Advisor.png" alt="TripAdvisor" class="partner-logo">'
    
    $content = $content -replace '<i class="fab fa-airbnb"></i>.*', '<img src="../../Images/Associated Companies/airbnb.png" alt="Airbnb" class="partner-logo">'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated $($file.Name)"
}
