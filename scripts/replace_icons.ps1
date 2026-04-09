$targetFiles = Get-ChildItem -Path "c:\Users\koral\OneDrive\Documents\TriAxis\Github\triplanka-web\pages\guide\*.html"
foreach ($file in $targetFiles) {
    $content = Get-Content $file.FullName -Raw
    
    $content = $content.Replace('<i class="fab fa-bootstrap"></i> <!-- Placeholder if FA booking icon missing, FA solid might have it -->', '<img src="../../Images/Associated Companies/booking.com.png" alt="Booking.com" class="partner-logo">')
    
    $content = $content.Replace('<i class="fab fa-tripadvisor"></i>', '<img src="../../Images/Associated Companies/Trip Advisor.png" alt="TripAdvisor" class="partner-logo">')
    
    $content = $content.Replace('<i class="fab fa-airbnb"></i>', '<img src="../../Images/Associated Companies/airbnb.png" alt="Airbnb" class="partner-logo">')
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
    Write-Host "Updated $($file.Name)"
}
