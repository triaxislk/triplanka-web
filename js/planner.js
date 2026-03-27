/* Trip Planner Logic Engine v2.0 - Full 14 Regions & 7 Categories */
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const distances = {
        'Negombo': { 'Colombo': 35, 'Kandy': 105, 'Sigiriya': 145, 'Rathnapura': 130, 'Nuwara Eliya': 155, 'Ella': 205, 'Galle': 155, 'Hambantota': 245, 'Polonnaruwa': 175, 'Anuradhapura': 165, 'Batticaloa': 285, 'Trincomalee': 235, 'Jaffna': 365 },
        'Colombo': { 'Negombo': 35, 'Kandy': 115, 'Sigiriya': 165, 'Rathnapura': 95, 'Nuwara Eliya': 165, 'Ella': 215, 'Galle': 120, 'Hambantota': 235, 'Polonnaruwa': 215, 'Anuradhapura': 205, 'Batticaloa': 315, 'Trincomalee': 265, 'Jaffna': 395 },
        'Kandy': { 'Negombo': 105, 'Colombo': 115, 'Sigiriya': 90, 'Rathnapura': 105, 'Nuwara Eliya': 75, 'Ella': 135, 'Galle': 225, 'Hambantota': 215, 'Polonnaruwa': 140, 'Anuradhapura': 140, 'Batticaloa': 190, 'Trincomalee': 180, 'Jaffna': 320 },
        'Sigiriya': { 'Negombo': 145, 'Colombo': 165, 'Kandy': 90, 'Rathnapura': 185, 'Nuwara Eliya': 155, 'Ella': 175, 'Galle': 275, 'Hambantota': 285, 'Polonnaruwa': 65, 'Anuradhapura': 75, 'Batticaloa': 165, 'Trincomalee': 95, 'Jaffna': 255 },
        'Rathnapura': { 'Negombo': 130, 'Colombo': 95, 'Kandy': 105, 'Sigiriya': 185, 'Nuwara Eliya': 145, 'Ella': 165, 'Galle': 155, 'Hambantota': 145, 'Polonnaruwa': 225, 'Anuradhapura': 245, 'Batticaloa': 255, 'Trincomalee': 285, 'Jaffna': 445 },
        'Nuwara Eliya': { 'Negombo': 155, 'Colombo': 165, 'Kandy': 75, 'Sigiriya': 155, 'Rathnapura': 145, 'Ella': 55, 'Galle': 255, 'Hambantota': 185, 'Polonnaruwa': 195, 'Anuradhapura': 215, 'Batticaloa': 225, 'Trincomalee': 255, 'Jaffna': 415 },
        'Ella': { 'Negombo': 205, 'Colombo': 215, 'Kandy': 135, 'Sigiriya': 175, 'Rathnapura': 165, 'Nuwara Eliya': 55, 'Galle': 195, 'Hambantota': 135, 'Polonnaruwa': 195, 'Anuradhapura': 235, 'Batticaloa': 185, 'Trincomalee': 265, 'Jaffna': 445 },
        'Galle': { 'Negombo': 155, 'Colombo': 120, 'Kandy': 225, 'Sigiriya': 275, 'Rathnapura': 155, 'Nuwara Eliya': 255, 'Ella': 195, 'Hambantota': 145, 'Polonnaruwa': 305, 'Anuradhapura': 325, 'Batticaloa': 355, 'Trincomalee': 385, 'Jaffna': 515 },
        'Hambantota': { 'Negombo': 245, 'Colombo': 235, 'Kandy': 215, 'Sigiriya': 285, 'Rathnapura': 145, 'Nuwara Eliya': 185, 'Ella': 135, 'Galle': 145, 'Polonnaruwa': 295, 'Anuradhapura': 335, 'Batticaloa': 245, 'Trincomalee': 355, 'Jaffna': 535 },
        'Polonnaruwa': { 'Negombo': 175, 'Colombo': 215, 'Kandy': 140, 'Sigiriya': 65, 'Rathnapura': 225, 'Nuwara Eliya': 195, 'Ella': 195, 'Galle': 305, 'Hambantota': 295, 'Anuradhapura': 105, 'Batticaloa': 105, 'Trincomalee': 115, 'Jaffna': 285 },
        'Anuradhapura': { 'Negombo': 165, 'Colombo': 205, 'Kandy': 140, 'Sigiriya': 75, 'Rathnapura': 245, 'Nuwara Eliya': 215, 'Ella': 235, 'Galle': 325, 'Hambantota': 335, 'Polonnaruwa': 105, 'Batticaloa': 205, 'Trincomalee': 105, 'Jaffna': 195 },
        'Batticaloa': { 'Negombo': 285, 'Colombo': 315, 'Kandy': 190, 'Sigiriya': 165, 'Rathnapura': 255, 'Nuwara Eliya': 225, 'Ella': 185, 'Galle': 355, 'Hambantota': 245, 'Polonnaruwa': 105, 'Anuradhapura': 205, 'Trincomalee': 135, 'Jaffna': 335 },
        'Trincomalee': { 'Negombo': 235, 'Colombo': 265, 'Kandy': 180, 'Sigiriya': 95, 'Rathnapura': 285, 'Nuwara Eliya': 255, 'Ella': 265, 'Galle': 385, 'Hambantota': 355, 'Polonnaruwa': 115, 'Anuradhapura': 105, 'Batticaloa': 135, 'Jaffna': 235 },
        'Jaffna': { 'Negombo': 365, 'Colombo': 395, 'Kandy': 320, 'Sigiriya': 255, 'Rathnapura': 445, 'Nuwara Eliya': 415, 'Ella': 445, 'Galle': 515, 'Hambantota': 535, 'Polonnaruwa': 285, 'Anuradhapura': 195, 'Batticaloa': 335, 'Trincomalee': 235 }
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

    const hotelRegistry = {
        'Negombo': 'Jetwing Blue',
        'Colombo': 'The Kingsbury Colombo',
        'Kandy': 'Earls Regency Kandy',
        'Sigiriya': 'Aliya Resort & Spa',
        'Rathnapura': 'The Grand Guardian',
        'Nuwara Eliya': 'The Grand Hotel',
        'Ella': '98 Acres Resort & Spa',
        'Galle': 'Le Grand Galle',
        'Hambantota': 'Shangri-La Hambantota',
        'Polonnaruwa': 'The Jetwing Lake',
        'Anuradhapura': 'Heritage Hotel',
        'Batticaloa': 'Uga Bay by Uga Escapes',
        'Trincomalee': 'Trinco Blu by Cinnamon',
        'Jaffna': 'Jetwing Jaffna'
    };

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

    // --- Generator Engine ---
    function generateItinerary() {
        const days = parseInt(document.getElementById('tripDuration').value);
        const transport = document.getElementById('transportType').value;
        const vibe = document.getElementById('tripVibe').value;
        const resultContainer = document.getElementById('itineraryResult');

        let html = `
            <div class="itinerary-header">
                <h2>Your Custom ${vibe.replace('-', ' ').toUpperCase()} Journey</h2>
                <p>Mode: <strong>${transport.replace('-', ' ')}</strong> | Duration: <strong>${days} Days</strong></p>
                <p>Route Overview: ${selectedDests.join(' → ')}</p>
            </div>
        `;

        const perDest = Math.max(1, Math.floor(days / selectedDests.length));
        let dayCounter = 1;

        selectedDests.forEach((dest, idx) => {
            const isLast = idx === selectedDests.length - 1;
            const destInfo = destMeta.find(d => d.id === dest);
            
            let travelInfo = "";
            if (idx > 0) {
                const prev = selectedDests[idx - 1];
                const dist = distances[prev]?.[dest] || 150;
                const time = Math.round(dist / 40 * 10) / 10;
                travelInfo = `<span class="travel-info"><i class="fas fa-route"></i> Travel from ${prev}: ~${dist} KM (approx. ${time}h Drive)</span>`;
            }

            const daysHere = isLast ? (days - dayCounter + 1) : perDest;
            const dayLabel = daysHere > 1 ? `Days ${dayCounter}-${dayCounter + daysHere - 1}` : `Day ${dayCounter}`;
            dayCounter += daysHere;

            // Triple Recommendation Logic
            const hotelName = hotelRegistry[dest];
            const bookingLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotelName + ' Sri Lanka')}`;
            const tripadvisorLink = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(hotelName)}`;
            const airbnbLink = `https://www.airbnb.com/s/${encodeURIComponent(dest + ' Sri Lanka')}/homes`;

            html += `
                <div class="itinerary-day">
                    <div class="day-number">${idx + 1}</div>
                    <div class="day-content">
                        <h3>${dayLabel}: ${dest}</h3>
                        ${travelInfo}
                        <p>${destInfo.desc} A perfect choice for your ${vibe} experience. Immerse yourself in the local atmosphere and explore the unique landmarks of ${dest}.</p>
                        
                        <div class="recommendations">
                            <h4>Comparison: Trustable Stays in ${dest}</h4>
                            <div class="rec-item">
                                <div class="rec-header"><i class="fas fa-hotel"></i> ${hotelName}</div>
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

        resultContainer.innerHTML = html;
    }

    init();
});
