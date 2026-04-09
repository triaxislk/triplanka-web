import os
import glob

replacements = [
    (
        '<i class="fab fa-bootstrap"></i> <!-- Placeholder if FA booking icon missing, FA solid might have it -->',
        '<img src="../../Images/Associated Companies/booking.com.png" alt="Booking.com" class="partner-logo">'
    ),
    (
        '<i class="fab fa-tripadvisor"></i>',
        '<img src="../../Images/Associated Companies/Trip Advisor.png" alt="TripAdvisor" class="partner-logo">'
    ),
    (
        '<i class="fab fa-airbnb"></i>',
        '<img src="../../Images/Associated Companies/airbnb.png" alt="Airbnb" class="partner-logo">'
    )
]

guide_dir = r"c:\Users\koral\OneDrive\Documents\TriAxis\Github\triplanka-web\pages\guide"
html_files = glob.glob(os.path.join(guide_dir, "*.html"))

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    for old_str, new_str in replacements:
        modified = modified.replace(old_str, new_str)
        
    if modified != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Updated {os.path.basename(file_path)}")
