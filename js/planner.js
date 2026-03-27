/* Trip Planner Logic Engine */
document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration & Data ---
    const distances = {
        'Colombo': { 'Kandy': 120, 'Galle': 125, 'Ella': 200, 'Sigiriya': 170, 'Nuwara Eliya': 160, 'Jaffna': 395, 'Trincomalee': 270, 'Bentota': 80, 'Negombo': 40 },
        'Kandy': { 'Colombo': 120, 'Galle': 225, 'Ella': 140, 'Sigiriya': 90, 'Nuwara Eliya': 75, 'Jaffna': 320, 'Trincomalee': 180, 'Bentota': 180, 'Negombo': 110 },
        'Galle': { 'Colombo': 125, 'Kandy': 225, 'Ella': 200, 'Sigiriya': 275, 'Nuwara Eliya': 250, 'Jaffna': 498, 'Trincomalee': 360, 'Bentota': 55, 'Negombo': 160 },
        'Sigiriya': { 'Colombo': 170, 'Kandy': 90, 'Galle': 275, 'Ella': 175, 'Nuwara Eliya': 162, 'Jaffna': 253, 'Trincomalee': 97, 'Bentota': 230, 'Negombo': 150 },
        'Nuwara Eliya': { 'Colombo': 160, 'Kandy': 75, 'Galle': 250, 'Ella': 56, 'Sigiriya': 162, 'Jaffna': 395, 'Trincomalee': 254, 'Bentota': 210, 'Negombo': 160 },
        'Ella': { 'Colombo': 200, 'Kandy': 140, 'Galle': 200, 'Sigiriya': 175, 'Nuwara Eliya': 56, 'Jaffna': 406, 'Trincomalee': 260, 'Bentota': 180, 'Negombo': 210 },
        'Trincomalee': { 'Colombo': 270, 'Kandy': 180, 'Galle': 360, 'Sigiriya': 97, 'Nuwara Eliya': 254, 'Jaffna': 235, 'Bentota': 320, 'Negombo': 240 },
        'Jaffna': { 'Colombo': 395, 'Kandy': 320, 'Galle': 498, 'Sigiriya': 253, 'Nuwara Eliya': 395, 'Trincomalee': 235, 'Bentota': 460, 'Negombo': 360 }
    };

    const destMeta = [
        { id: 'Colombo', name: 'Colombo', img: '../Images/Site Photos/Aerial view of the Lotus Tower in Colombo at sunset.jpg', desc: 'The bustling commercial capital.' },
        { id: 'Kandy', name: 'Kandy', img: '../Images/Site Photos/Aerial view of the Temple of the Sacred Tooth Relic Dalada Maligawa and Kandy Lake in Kandy.jpg', desc: 'The hill capital & cultural heart.' },
        { id: 'Galle', name: 'Galle', img: '../Images/Site Photos/Close-up of the Galle Lighthouse at sunset with the Indian Ocean in the background.jpg', desc: 'The historic Dutch fort city.' },
        { id: 'Sigiriya', name: 'Sigiriya', img: '../Images/Site Photos/Full shot of Sigiriya Rock Fortress with lush greenery and gardens in the foreground.jpg', desc: 'The magnificent Lions Rock.' },
        { id: 'Nuwara Eliya', name: 'Nuwara Eliya', img: '../Images/Site Photos/Aerial view of Gregory Lake in Nuwara Eliya with mountains and houses in the background.jpg', desc: 'Little England & tea country.' },
        { id: 'Ella', name: 'Ella', img: '../Images/Site Photos/Wide shot of Nine Arch Bridge in Ella with a train passing through lush tea plantations.jpg', desc: 'Mountain views & scenic trains.' },
        { id: 'Trincomalee', name: 'Trincomalee', img: '../Images/Site Photos/Full shot of Koneswaram Temple in Trincomalee perched on a cliff overlooking the Indian Ocean.jpg', desc: 'Pristine beaches on the East.' },
        { id: 'Jaffna', name: 'Jaffna', img: '../Images/Site Photos/Full shot of Jaffna Fort with its star-shaped ramparts and colonial-style buildings.jpg', desc: 'Vibrant Tamil culture in the North.' }
    ];

    const trustableResources = {
        'Colombo': [
            { type: 'hotel', name: 'Kingsbury Colombo', link: 'https://www.booking.com/hotel/lk/the-kingsbury-colombo.en-gb.html' },
            { type: 'car', name: 'SR Rent A Car', link: 'https://srrentacar.lk/' }
        ],
        'Kandy': [
            { type: 'hotel', name: 'Earls Regency Kandy', link: 'https://www.booking.com/hotel/lk/earls-regency.en-gb.html' }
        ],
        'Galle': [
            { type: 'hotel', name: 'Le Grand Galle', link: 'https://www.booking.com/hotel/lk/le-grand-galle.en-gb.html' }
        ],
        'Sigiriya': [
            { type: 'hotel', name: 'Aliya Resort & Spa', link: 'https://www.booking.com/hotel/lk/aliya-resort-and-spa.en-gb.html' }
        ],
        'Nuwara Eliya': [
            { type: 'hotel', name: 'The Grand Hotel', link: 'https://www.booking.com/hotel/lk/grand-nuwara-eliya.en-gb.html' }
        ],
        'Ella': [
            { type: 'hotel', name: '98 Acres Resort & Spa', link: 'https://www.booking.com/hotel/lk/98-acres-resort-spa.en-gb.html' }
        ]
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
                    if (selectedDests.length < 6) {
                        selectedDests.push(id);
                        card.classList.add('active');
                    } else {
                        alert('Max 6 hubs for an optimal itinerary!');
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
        // Show/Hide Steps
        steps.forEach((step, idx) => {
            step.classList.toggle('active', idx + 1 === currentStep);
        });

        // Update Progress Bar
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progress}%`;

        // Update Labels
        labels.forEach((label, idx) => {
            label.classList.toggle('active', idx + 1 === currentStep);
            label.classList.toggle('completed', idx + 1 < currentStep);
        });

        // Update Buttons
        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.innerText = currentStep === 3 ? 'Generate Plan' : (currentStep === 4 ? 'Complete' : 'Continue');
        if (currentStep === 4) nextBtn.style.display = 'none';
    }

    // --- Event Listeners for Cards ---
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
        const resultContainer = document.getElementById('itineraryResult');

        let html = `
            <div class="itinerary-header">
                <h2>Your ${days}-Day Journey</h2>
                <p>Mode: <strong>${transport.replace('-', ' ')}</strong> | Route: ${selectedDests.join(' → ')}</p>
            </div>
        `;

        // Distribute days across selected destinations
        const perDest = Math.max(1, Math.floor(days / selectedDests.length));
        let dayCounter = 1;

        selectedDests.forEach((dest, idx) => {
            const isLast = idx === selectedDests.length - 1;
            const destName = dest;
            const destInfo = destMeta.find(d => d.id === dest);
            
            // Calculate distance from previous
            let travelInfo = "";
            if (idx > 0) {
                const prev = selectedDests[idx - 1];
                const dist = distances[prev]?.[dest] || 150;
                const time = Math.round(dist / 40 * 10) / 10; // Avg 40kmh
                travelInfo = `<span class="travel-info"><i class="fas fa-route"></i> Travel from ${prev}: ${dist}km (approx. ${time}h)</span>`;
            }

            const daysHere = isLast ? (days - dayCounter + 1) : perDest;
            const dayLabel = daysHere > 1 ? `Days ${dayCounter}-${dayCounter + daysHere - 1}` : `Day ${dayCounter}`;
            dayCounter += daysHere;

            // Recommendations
            const res = trustableResources[dest] || [];
            const recHtml = res.length > 0 ? `
                <div class="recommendations">
                    <h4>Trustable Options in ${dest}</h4>
                    ${res.map(r => `
                        <div class="rec-item">
                            ${r.type === 'hotel' ? '<i class="fas fa-bed"></i>' : '<i class="fas fa-car"></i>'}
                            <span>${r.name}: <a href="${r.link}" target="_blank">Book Now</a></span>
                        </div>
                    `).join('')}
                </div>
            ` : "";

            html += `
                <div class="itinerary-day">
                    <div class="day-number">${idx + 1}</div>
                    <div class="day-content">
                        <h3>${dayLabel}: ${destName}</h3>
                        ${travelInfo}
                        <p>${destInfo.desc} Spend your time exploring the local attractions and soaking in the unique vibe of this region.</p>
                        ${recHtml}
                    </div>
                </div>
            `;
        });

        resultContainer.innerHTML = html;
    }

    init();
});
