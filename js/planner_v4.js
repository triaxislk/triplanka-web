/* Trip Planner Logic Engine v4.0 - Professional Distance & Unbiased Stays */
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const distances = {
        'Airport (CMB)': { 'Negombo': 10, 'Colombo': 35, 'Kandy': 105, 'Sigiriya': 145, 'Rathnapura': 110, 'Nuwara Eliya': 165, 'Ella': 210, 'Galle': 155, 'Hambantota': 240, 'Polonnaruwa': 200, 'Anuradhapura': 170, 'Batticaloa': 290, 'Trincomalee': 240, 'Jaffna': 360 },
        'Negombo': { 'Colombo': 35, 'Kandy': 105, 'Sigiriya': 145, 'Rathnapura': 130, 'Nuwara Eliya': 155, 'Ella': 205, 'Galle': 155, 'Hambantota': 245, 'Polonnaruwa': 175, 'Anuradhapura': 165, 'Batticaloa': 285, 'Trincomalee': 235, 'Jaffna': 365, 'Airport (CMB)': 10 },
        'Colombo': { 'Negombo': 35, 'Kandy': 115, 'Sigiriya': 165, 'Rathnapura': 95, 'Nuwara Eliya': 165, 'Ella': 215, 'Galle': 120, 'Hambantota': 235, 'Polonnaruwa': 215, 'Anuradhapura': 205, 'Batticaloa': 315, 'Trincomalee': 265, 'Jaffna': 395, 'Airport (CMB)': 35 },
        'Kandy': { 'Negombo': 105, 'Colombo': 115, 'Sigiriya': 90, 'Rathnapura': 105, 'Nuwara Eliya': 75, 'Ella': 135, 'Galle': 225, 'Hambantota': 215, 'Polonnaruwa': 140, 'Anuradhapura': 140, 'Batticaloa': 190, 'Trincomalee': 180, 'Jaffna': 320, 'Airport (CMB)': 105 },
        'Sigiriya': { 'Negombo': 145, 'Colombo': 165, 'Kandy': 90, 'Rathnapura': 185, 'Nuwara Eliya': 155, 'Ella': 175, 'Galle': 275, 'Hambantota': 285, 'Polonnaruwa': 65, 'Anuradhapura': 75, 'Batticaloa': 165, 'Trincomalee': 95, 'Jaffna': 255, 'Airport (CMB)': 145 },
        'Rathnapura': { 'Negombo': 130, 'Colombo': 95, 'Kandy': 105, 'Sigiriya': 185, 'Nuwara Eliya': 145, 'Ella': 165, 'Galle': 155, 'Hambantota': 145, 'Polonnaruwa': 225, 'Anuradhapura': 245, 'Batticaloa': 255, 'Trincomalee': 285, 'Jaffna': 445, 'Airport (CMB)': 110 },
        'Nuwara Eliya': { 'Negombo': 155, 'Colombo': 165, 'Kandy': 75, 'Sigiriya': 155, 'Rathnapura': 145, 'Ella': 55, 'Galle': 255, 'Hambantota': 185, 'Polonnaruwa': 195, 'Anuradhapura': 215, 'Batticaloa': 225, 'Trincomalee': 255, 'Jaffna': 415, 'Airport (CMB)': 165 },
        'Ella': { 'Negombo': 205, 'Colombo': 215, 'Kandy': 135, 'Sigiriya': 175, 'Rathnapura': 165, 'Nuwara Eliya': 55, 'Galle': 195, 'Hambantota': 135, 'Polonnaruwa': 195, 'Anuradhapura': 235, 'Batticaloa': 185, 'Trincomalee': 265, 'Jaffna': 445, 'Airport (CMB)': 210 },
        'Galle': { 'Negombo': 155, 'Colombo': 120, 'Kandy': 225, 'Sigiriya': 275, 'Rathnapura': 155, 'Nuwara Eliya': 255, 'Ella': 195, 'Hambantota': 145, 'Polonnaruwa': 305, 'Anuradhapura': 325, 'Batticaloa': 355, 'Trincomalee': 385, 'Jaffna': 515, 'Airport (CMB)': 155 },
        'Hambantota': { 'Negombo': 245, 'Colombo': 235, 'Kandy': 215, 'Sigiriya': 285, 'Rathnapura': 145, 'Nuwara Eliya': 185, 'Ella': 135, 'Galle': 145, 'Polonnaruwa': 295, 'Anuradhapura': 335, 'Batticaloa': 245, 'Trincomalee': 355, 'Jaffna': 535, 'Airport (CMB)': 240 },
        'Polonnaruwa': { 'Negombo': 175, 'Colombo': 215, 'Kandy': 140, 'Sigiriya': 65, 'Rathnapura': 225, 'Nuwara Eliya': 195, 'Ella': 195, 'Galle': 305, 'Hambantota': 295, 'Anuradhapura': 105, 'Batticaloa': 105, 'Trincomalee': 115, 'Jaffna': 285, 'Airport (CMB)': 200 },
        'Anuradhapura': { 'Negombo': 165, 'Colombo': 205, 'Kandy': 140, 'Sigiriya': 75, 'Rathnapura': 245, 'Nuwara Eliya': 215, 'Ella': 235, 'Galle': 325, 'Hambantota': 335, 'Polonnaruwa': 105, 'Batticaloa': 205, 'Trincomalee': 105, 'Jaffna': 195, 'Airport (CMB)': 170 },
        'Batticaloa': { 'Negombo': 285, 'Colombo': 315, 'Kandy': 190, 'Sigiriya': 165, 'Rathnapura': 255, 'Nuwara Eliya': 225, 'Ella': 185, 'Galle': 355, 'Hambantota': 245, 'Polonnaruwa': 105, 'Anuradhapura': 205, 'Trincomalee': 135, 'Jaffna': 335, 'Airport (CMB)': 290 },
        'Trincomalee': { 'Negombo': 235, 'Colombo': 265, 'Kandy': 180, 'Sigiriya': 95, 'Rathnapura': 285, 'Nuwara Eliya': 255, 'Ella': 265, 'Galle': 385, 'Hambantota': 355, 'Polonnaruwa': 115, 'Anuradhapura': 105, 'Batticaloa': 135, 'Jaffna': 235, 'Airport (CMB)': 240 },
        'Jaffna': { 'Negombo': 365, 'Colombo': 395, 'Kandy': 320, 'Sigiriya': 255, 'Rathnapura': 445, 'Nuwara Eliya': 415, 'Ella': 445, 'Galle': 515, 'Hambantota': 535, 'Polonnaruwa': 285, 'Anuradhapura': 195, 'Batticaloa': 335, 'Trincomalee': 235, 'Airport (CMB)': 360 }
    };

    const destMeta = [
        { id: 'Negombo', name: 'Negombo', img: '../Images/Site Photos/Beautiful Tropical Beach In Kalpitiya Sri Lanka. These boats used to take people to watch dolphins.jpg', desc: 'Coastal beauty & lagoon life.' },
        { id: 'Colombo', name: 'Colombo', img: '../Images/Site Photos/Aerial view of the Lotus Tower in Colombo at sunset.jpg', desc: 'The bustling commercial capital.' },
        { id: 'Kandy', name: 'Kandy', img: '../Images/Site Photos/Aerial view of the Temple of the Sacred Tooth Relic Dalada Maligawa and Kandy Lake in Kandy.jpg', desc: 'The hill capital & cultural heart.' },
        { id: 'Sigiriya', name: 'Sigiriya', img: '../Images/Site Photos/Full shot of Sigiriya Rock Fortress with lush greenery and gardens in the foreground.jpg', desc: 'The magnificent Lions Rock.' },
        { id: 'Rathnapura', name: 'Rathnapura', img: '../Images/Site Photos/Sri-Lanka-flag.jpg', desc: 'City of gems & lush landscapes.' },
        { id: 'Nuwara Eliya', name: 'Nuwara Eliya', img: '../Images/Site Photos/Aerial view of Gregory Lake in Nuwara Eliya with mountains and houses in the background.jpg', desc: 'Little England & tea country.' },
        { id: 'Ella', name: 'Ella', img: '../Images/Site Photos/Wide shot of Nine Arch Bridge in Ella with a train passing through lush tea plantations.jpg', desc: 'Mountain views & scenic trains.' },
        { id: 'Galle', name: 'Galle', img: '../Images/Site Photos/Close-up of the Galle Lighthouse at sunset with the Indian Ocean in the background.jpg', desc: 'The historic Dutch fort city.' },
        { id: 'Hambantota', name: 'Hambantota', img: '../Images/Site Photos/Leopards on a stone. The Sri Lankan leopard (Panthera pardus kotiya) male and female..jpg', desc: 'Safari gateway & southern coast.' },
        { id: 'Polonnaruwa', name: 'Polonnaruwa', img: '../Images/Site Photos/Sigiriya Rock.jpg', desc: 'Ancient kingdom & archaeological ruins.' },
        { id: 'Anuradhapura', name: 'Anuradhapura', img: '../Images/Site Photos/Sigiriya Rock.jpg', desc: 'The first capital & sacred city.' },
        { id: 'Batticaloa', name: 'Batticaloa', img: '../Images/Site Photos/Full shot of Koneswaram Temple in Trincomalee perched on a cliff overlooking the Indian Ocean.jpg', desc: 'Lush lagoons & serene beaches.' },
        { id: 'Trincomalee', name: 'Trincomalee', img: '../Images/Site Photos/River flows into Back Bay of Indian Ocean near Nilaveli beach in Trincomalee Sri Lanka.  Trincomalee is coastal resort city. Panoramic Top .jpg', desc: 'Pristine beaches on the East.' },
        { id: 'Jaffna', name: 'Jaffna', img: '../Images/Site Photos/Full shot of Jaffna Fort with its star-shaped ramparts and colonial-style buildings.jpg', desc: 'Vibrant Tamil culture in the North.' }
    ];

    // --- State ---
    let currentStep = 1;
    let selectedDests = [];
    const totalSteps = 4;

    // --- DOM Elements ---
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressBar = document.getElementById('progressBar');
    const steps = document.querySelectorAll('.wizard-step');
    const labels = document.querySelectorAll('.step-label');
    const destGrid = document.getElementById('destinationGrid');
    const vibeCards = document.querySelectorAll('.option-card');
    const transportOptions = document.querySelectorAll('.transport-option');
    const stayCards = document.querySelectorAll('.stay-card');

    // --- Initialization ---
    function init() {
        renderDestinations();
        updateWizard();
    }

    function renderDestinations() {
        destGrid.innerHTML = destMeta.map(dest => `
            <div class="dest-select-card" data-id="${dest.id}">
                <img src="${dest.img}" alt="${dest.name}">
                <div class="overlay">
                    <span>${dest.name}</span>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.dest-select-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                if (selectedDests.includes(id)) {
                    selectedDests = selectedDests.filter(d => d !== id);
                    card.classList.remove('active');
                } else {
                    if (selectedDests.length < 8) {
                        selectedDests.push(id);
                        card.classList.add('active');
                    } else {
                        alert('Max 8 hubs for an optimal itinerary!');
                    }
                }
            });
        });
    }

    // --- Wizard Navigation ---
    nextBtn.addEventListener('click', () => {
        if (currentStep === 1) {
            currentStep++;
            updateWizard();
        } else if (currentStep === 2) {
            if (selectedDests.length < 2) {
                alert('Please select at least 2 destinations.');
                return;
            }
            currentStep++;
            updateWizard();
        } else if (currentStep === 3) {
            currentStep++;
            generateItinerary();
            updateWizard();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizard();
        }
    });

    function updateWizard() {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx + 1 === currentStep);
        });

        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;

        labels.forEach((label, idx) => {
            label.classList.toggle('active', idx + 1 === currentStep);
            label.classList.toggle('completed', idx + 1 < currentStep);
        });

        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.innerText = currentStep === 3 ? 'Generate Plan' : (currentStep === 4 ? 'Complete' : 'Continue');
        if (currentStep === 4) nextBtn.style.display = 'none';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    vibeCards.forEach(card => {
        card.addEventListener('click', () => {
            vibeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            document.getElementById('tripVibe').value = card.dataset.value;
        });
    });

    transportOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            transportOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            document.getElementById('transportType').value = opt.dataset.value;
        });
    });

    stayCards.forEach(card => {
        card.addEventListener('click', () => {
            stayCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            document.getElementById('stayPref').value = card.dataset.value;
        });
    });

    // --- Generator Engine ---
    function generateItinerary() {
        const days = parseInt(document.getElementById('tripDuration').value);
        const transport = document.getElementById('transportType').value;
        const vibe = document.getElementById('tripVibe').value;
        const stay = document.getElementById('stayPref').value;
        const startPoint = document.getElementById('startPoint').value;
        const resultContainer = document.getElementById('itineraryResult');

        let totalKM = 0;
        let itineraryHtml = "";
        const perDest = Math.max(1, Math.floor(days / selectedDests.length));
        let dayCounter = 1;

        // Construct Full Route Chain: Start Point -> Hubs
        const fullRoute = [startPoint, ...selectedDests];

        fullRoute.forEach((hub, idx) => {
            if (idx === 0) return; // Skip starting point as a 'destination' day

            const prevHub = fullRoute[idx - 1];
            const dist = distances[prevHub]?.[hub] || 150;
            totalKM += dist;
            const time = Math.round(dist / 40 * 10) / 10;
            
            const destInfo = destMeta.find(d => d.id === hub);
            const isLast = idx === fullRoute.length - 1;
            const daysHere = isLast ? (days - dayCounter + 1) : perDest;
            const dayLabel = daysHere > 1 ? `Days ${dayCounter}-${dayCounter + daysHere - 1}` : `Day ${dayCounter}`;
            dayCounter += daysHere;

            // Smart Link Filter Construction (Generic Search)
            let bookingParams = "";
            let taParams = "";
            let categoryLabel = "";

            if (stay === 'luxury') {
                categoryLabel = "Luxury Stays";
                bookingParams = "&nflt=class%3D5&sort_by=popularity";
                taParams = "&attrs=hotel_class_5";
            } else if (stay === 'mid') {
                categoryLabel = "Mid-Range Stays";
                bookingParams = "&nflt=class%3D4&sort_by=popularity";
                taParams = "&attrs=hotel_class_4";
            } else {
                categoryLabel = "Budget Deals";
                bookingParams = "&nflt=class%3D3%3Bclass%3D2%3Bpri%3D1&sort_by=price_asc";
                taParams = "&attrs=hotel_class_3&sort_by=price_low_to_high";
            }

            const searchQuery = `${categoryLabel} in ${hub} Sri Lanka`;
            const bookingLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(searchQuery)}${bookingParams}`;
            const tripadvisorLink = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(searchQuery)}${taParams}`;
            const airbnbLink = `https://www.airbnb.com/s/${encodeURIComponent(hub + ' Sri Lanka')}/homes?refinement_paths[]=%2Fhomes${stay==='luxury' ? '&room_types[]=Entire%20home/apt' : ''}`;

            itineraryHtml += `
                <div class="itinerary-day">
                    <div class="day-number">${idx}</div>
                    <div class="day-content">
                        <h3>${dayLabel}: ${hub}</h3>
                        <span class="travel-info"><i class="fas fa-route"></i> Leg ${idx}: from ${prevHub} (~${dist} KM | ${time}h)</span>
                        <p>${destInfo.desc} A perfect choice for your ${vibe} experience. Explore the local culture and landmarks of ${hub}.</p>
                        
                        <div class="recommendations">
                            <h4>Comparison: ${categoryLabel} in ${hub}</h4>
                            <div class="rec-item">
                                <div class="rec-links">
                                    <a href="${bookingLink}" target="_blank" class="booking"><i class="fas fa-check-circle"></i> Booking.com</a>
                                    <a href="${tripadvisorLink}" target="_blank" class="tripadvisor"><i class="fas fa-star"></i> TripAdvisor</a>
                                    <a href="${airbnbLink}" target="_blank" class="airbnb"><i class="fab fa-airbnb"></i> Airbnb</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        const headerHtml = `
            <div class="itinerary-header">
                <h2>Your Custom ${vibe.replace('-', ' ').toUpperCase()} Journey</h2>
                <div class="journey-summary">
                    <div class="summary-item"><i class="fas fa-plane-arrival"></i> Starts: <strong>${startPoint}</strong></div>
                    <div class="summary-item"><i class="fas fa-road"></i> Total Journey: <strong>~${totalKM} KM</strong></div>
                    <div class="summary-item"><i class="fas fa-bed"></i> Comfort: <strong>${stay.toUpperCase()}</strong></div>
                </div>
                <p class="route-preview">${fullRoute.join(' → ')}</p>
            </div>
        `;

        resultContainer.innerHTML = headerHtml + itineraryHtml;
    }

    init();
});
