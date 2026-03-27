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

    const startPoints = [
        { name: "Bandaranaike International Airport (CMB)", hub: "Airport (CMB)", type: "airport" },
        { name: "Mattala Rajapaksa International Airport (HRI)", hub: "Hambantota", type: "airport" },
        { name: "Jaffna International Airport (JAF)", hub: "Jaffna", type: "airport" },
        { name: "Ratmalana International Airport (RML)", hub: "Colombo", type: "airport" },
        { name: "Batticaloa International Airport (BTC)", hub: "Batticaloa", type: "airport" },
        { name: "Colombo", hub: "Colombo", type: "town" },
        { name: "Sri Jayawardenepura Kotte", hub: "Colombo", type: "town" },
        { name: "Negombo", hub: "Negombo", type: "town" },
        { name: "Mount Lavinia", hub: "Colombo", type: "town" },
        { name: "Dehiwala", hub: "Colombo", type: "town" },
        { name: "Moratuwa", hub: "Colombo", type: "town" },
        { name: "Panadura", hub: "Colombo", type: "town" },
        { name: "Kalutara", hub: "Colombo", type: "town" },
        { name: "Beruwala", hub: "Galle", type: "town" },
        { name: "Bentota", hub: "Galle", type: "town" },
        { name: "Aluthgama", hub: "Galle", type: "town" },
        { name: "Wadduwa", hub: "Colombo", type: "town" },
        { name: "Kandy", hub: "Kandy", type: "town" },
        { name: "Peradeniya", hub: "Kandy", type: "town" },
        { name: "Katugastota", hub: "Kandy", type: "town" },
        { name: "Gampola", hub: "Kandy", type: "town" },
        { name: "Knuckles", hub: "Kandy", type: "town" },
        { name: "Nuwara Eliya", hub: "Nuwara Eliya", type: "town" },
        { name: "Hatton", hub: "Nuwara Eliya", type: "town" },
        { name: "Talawakele", hub: "Nuwara Eliya", type: "town" },
        { name: "Haputale", hub: "Nuwara Eliya", type: "town" },
        { name: "Maskeliya", hub: "Nuwara Eliya", type: "town" },
        { name: "Adam's Peak (Sri Pada)", hub: "Nuwara Eliya", type: "town" },
        { name: "Ella", hub: "Ella", type: "town" },
        { name: "Bandarawela", hub: "Ella", type: "town" },
        { name: "Badulla", hub: "Ella", type: "town" },
        { name: "Hali Ela", hub: "Ella", type: "town" },
        { name: "Passara", hub: "Ella", type: "town" },
        { name: "Galle", hub: "Galle", type: "town" },
        { name: "Unawatuna", hub: "Galle", type: "town" },
        { name: "Hikkaduwa", hub: "Galle", type: "town" },
        { name: "Ambalangoda", hub: "Galle", type: "town" },
        { name: "Ahangama", hub: "Galle", type: "town" },
        { name: "Koggala", hub: "Galle", type: "town" },
        { name: "Matara", hub: "Hambantota", type: "town" },
        { name: "Weligama", hub: "Galle", type: "town" },
        { name: "Mirissa", hub: "Galle", type: "town" },
        { name: "Dikwella", hub: "Hambantota", type: "town" },
        { name: "Tangalle", hub: "Hambantota", type: "town" },
        { name: "Talalla", hub: "Hambantota", type: "town" },
        { name: "Hambantota", hub: "Hambantota", type: "town" },
        { name: "Tissamaharama", hub: "Hambantota", type: "town" },
        { name: "Yala", hub: "Hambantota", type: "town" },
        { name: "Kataragama", hub: "Hambantota", type: "town" },
        { name: "Kirinda", hub: "Hambantota", type: "town" },
        { name: "Jaffna", hub: "Jaffna", type: "town" },
        { name: "Point Pedro", hub: "Jaffna", type: "town" },
        { name: "Chavakachcheri", hub: "Jaffna", type: "town" },
        { name: "Delft Island (Neduntheevu)", hub: "Jaffna", type: "town" },
        { name: "Nainativu (Nagadeepa)", hub: "Jaffna", type: "town" },
        { name: "Trincomalee", hub: "Trincomalee", type: "town" },
        { name: "Nilaveli", hub: "Trincomalee", type: "town" },
        { name: "Uppuveli", hub: "Trincomalee", type: "town" },
        { name: "Kinniya", hub: "Trincomalee", type: "town" },
        { name: "Marble Beach", hub: "Trincomalee", type: "town" },
        { name: "Batticaloa", hub: "Batticaloa", type: "town" },
        { name: "Pasikudah", hub: "Batticaloa", type: "town" },
        { name: "Kalkudah", hub: "Batticaloa", type: "town" },
        { name: "Arugam Bay", hub: "Batticaloa", type: "town" },
        { name: "Pottuvil", hub: "Batticaloa", type: "town" },
        { name: "Anuradhapura", hub: "Anuradhapura", type: "town" },
        { name: "Mihintale", hub: "Anuradhapura", type: "town" },
        { name: "Medawachchiya", hub: "Anuradhapura", type: "town" },
        { name: "Polonnaruwa", hub: "Polonnaruwa", type: "town" },
        { name: "Hingurakgoda", hub: "Polonnaruwa", type: "town" },
        { name: "Minneriya", hub: "Polonnaruwa", type: "town" },
        { name: "Giritale", hub: "Polonnaruwa", type: "town" },
        { name: "Sigiriya", hub: "Sigiriya", type: "town" },
        { name: "Dambulla", hub: "Sigiriya", type: "town" },
        { name: "Habarana", hub: "Sigiriya", type: "town" },
        { name: "Pidurangala", hub: "Sigiriya", type: "town" },
        { name: "Matale", hub: "Kandy", type: "town" },
        { name: "Kurunegala", hub: "Negombo", type: "town" },
        { name: "Kuliyapitiya", hub: "Negombo", type: "town" },
        { name: "Ratnapura", hub: "Rathnapura", type: "town" },
        { name: "Balangoda", hub: "Rathnapura", type: "town" },
        { name: "Belihuloya", hub: "Rathnapura", type: "town" },
        { name: "Kitulgala", hub: "Nuwara Eliya", type: "town" },
        { name: "Monaragala", hub: "Ella", type: "town" },
        { name: "Wellawaya", hub: "Ella", type: "town" },
        { name: "Ampara", hub: "Batticaloa", type: "town" },
        { name: "Akkaraipattu", hub: "Batticaloa", type: "town" },
        { name: "Puttalam", hub: "Negombo", type: "town" },
        { name: "Chilaw", hub: "Negombo", type: "town" },
        { name: "Kalpitiya", hub: "Negombo", type: "town" },
        { name: "Wilpattu", hub: "Anuradhapura", type: "town" },
        { name: "Mannar", hub: "Anuradhapura", type: "town" },
        { name: "Vavuniya", hub: "Anuradhapura", type: "town" },
        { name: "Kilinochchi", hub: "Jaffna", type: "town" },
        { name: "Mullaitivu", hub: "Jaffna", type: "town" },
        // National Parks & Nature Reserves
        { name: "Yala National Park (Tissamaharama)", hub: "Hambantota", type: "nature" },
        { name: "Wilpattu National Park (Puttalam)", hub: "Anuradhapura", type: "nature" },
        { name: "Udawalawe National Park", hub: "Hambantota", type: "nature" },
        { name: "Minneriya National Park (Habarana)", hub: "Sigiriya", type: "nature" },
        { name: "Kaudulla National Park (Habarana)", hub: "Sigiriya", type: "nature" },
        { name: "Gal Oya National Park (Inginiyagala)", hub: "Batticaloa", type: "nature" },
        { name: "Maduru Oya National Park (Mahiyanganaya)", hub: "Polonnaruwa", type: "nature" },
        { name: "Wasgamuwa National Park", hub: "Polonnaruwa", type: "nature" },
        { name: "Lahugala Kitulana National Park (Pottuvil)", hub: "Batticaloa", type: "nature" },
        { name: "Flood Plains National Park (Somawathiya)", hub: "Polonnaruwa", type: "nature" },
        { name: "Somawathiya National Park", hub: "Polonnaruwa", type: "nature" },
        { name: "Horton Plains National Park (Nuwara Eliya)", hub: "Nuwara Eliya", type: "nature" },
        { name: "Bundala National Park (Hambantota)", hub: "Hambantota", type: "nature" },
        { name: "Kumana National Park (Arugam Bay)", hub: "Batticaloa", type: "nature" },
        { name: "Lunugamvehera National Park (Thanamalwila)", hub: "Hambantota", type: "nature" },
        { name: "Chundikulam National Park (Kilinochchi)", hub: "Jaffna", type: "nature" },
        { name: "Angammedilla National Park (Hingurakgoda)", hub: "Polonnaruwa", type: "nature" },
        { name: "Horagolla National Park (Nittambuwa)", hub: "Colombo", type: "nature" },
        { name: "Pigeon Island National Park (Nilaveli)", hub: "Trincomalee", type: "nature" },
        { name: "Hikkaduwa National Park", hub: "Galle", type: "nature" },
        { name: "Sinharaja Forest Reserve (Deniyaya)", hub: "Galle", type: "nature" },
        { name: "Knuckles Conservation Forest (Riverston)", hub: "Kandy", type: "nature" },
        { name: "Peak Wilderness Sanctuary (Adam's Peak)", hub: "Nuwara Eliya", type: "nature" },
        { name: "Ritigala Strict Nature Reserve (Kekirawa)", hub: "Anuradhapura", type: "nature" },
        { name: "Hakgala Strict Nature Reserve (Nuwara Eliya)", hub: "Nuwara Eliya", type: "nature" },
        { name: "Udawattakele Sanctuary (Kandy)", hub: "Kandy", type: "nature" },
        { name: "Pinnawala Elephant Orphanage (Pinnawala)", hub: "Kandy", type: "nature" },
        { name: "Kala Wewa Elephant Gathering Area (Kekirawa)", hub: "Anuradhapura", type: "nature" }
    ];

    const destMeta = [
        { 
            id: 'Negombo', 
            name: 'Negombo', 
            img: '../Images/Site Photos/Beautiful Tropical Beach In Kalpitiya Sri Lanka. These boats used to take people to watch dolphins.jpg', 
            desc: 'The Golden Coastal Gateway.', 
            cat: ['leisure', 'cultural', 'family', 'honeymoon', 'wildlife', 'adventure'], 
            reason: 'Perfect for a smooth start or end to your journey. Enjoy sunset catamaran rides, explore the Dutch Canal, or venture north to Kalpitiya for world-class whale watching for a truly effortless coastal escape.' 
        },
        { 
            id: 'Colombo', 
            name: 'Colombo', 
            img: '../Images/Site Photos/Aerial view of the Lotus Tower in Colombo at sunset.jpg', 
            desc: 'The Island’s Vibrant Metropolis.', 
            cat: ['leisure', 'cultural', 'family', 'honeymoon'], 
            reason: 'A seamless blend of colonial heritage and modern luxury. From high-end shopping and rooftop dining to historic walks through the Fort, it’s the heartbeat of Sri Lanka’s modern culture.' 
        },
        { 
            id: 'Kandy', 
            name: 'Kandy', 
            img: '../Images/Site Photos/Aerial view of the Temple of the Sacred Tooth Relic Dalada Maligawa and Kandy Lake in Kandy.jpg', 
            desc: 'The Sacred Hill Capital.', 
            cat: ['leisure', 'cultural', 'family', 'adventure', 'honeymoon'], 
            reason: 'The spiritual soul of the island. Witness the majesty of the Temple of the Tooth and retreat into the misty Knuckles Range for a perfect balance of culture and quiet adventure.' 
        },
        { 
            id: 'Sigiriya', 
            name: 'Sigiriya', 
            img: '../Images/Site Photos/Full shot of Sigiriya Rock Fortress with lush greenery and gardens in the foreground.jpg', 
            desc: 'Majesty of the Ancient World.', 
            cat: ['leisure', 'cultural', 'family', 'wildlife', 'adventure', 'honeymoon'], 
            reason: 'Home to the iconic Lions Rock and the ancient Dambulla Cave Temples. This is where history meets nature, offering breathtaking views and the chance to see wild elephants in their natural habitat.' 
        },
        { 
            id: 'Rathnapura', 
            name: 'Rathnapura', 
            img: '../Images/Site Photos/Sri-Lanka-flag.jpg', 
            desc: 'The Gem City & Rainforest Gateway.', 
            cat: ['cultural', 'adventure', 'wildlife'], 
            reason: 'The island’s treasure chest. Beyond world-class gems, it’s your gateway to the Sinharaja Rainforest and the sacred climb of Adam’s Peak, perfect for the true explorer.' 
        },
        { 
            id: 'Nuwara Eliya', 
            name: 'Nuwara Eliya', 
            img: '../Images/Site Photos/Aerial view of Gregory Lake in Nuwara Eliya with mountains and houses in the background.jpg', 
            desc: 'Little England & Tea Country.', 
            cat: ['leisure', 'family', 'adventure', 'honeymoon', 'wildlife'], 
            reason: 'Escape to the emerald hills. Breathe in the mountain air, wander through manicured tea gardens, and witness the roaring waterfalls that make this the island’s most romantic getaway.' 
        },
        { 
            id: 'Ella', 
            name: 'Ella', 
            img: '../Images/Site Photos/Wide shot of Nine Arch Bridge in Ella with a train passing through lush tea plantations.jpg', 
            desc: 'Mist-Covered Peaks & Iconic Views.', 
            cat: ['leisure', 'cultural', 'family', 'adventure', 'honeymoon'], 
            reason: 'Famous for the most scenic railway journey in the world. Hike to Ella Rock at sunrise and cross the historic Nine Arch Bridge for photos that will last a lifetime.' 
        },
        { 
            id: 'Galle', 
            name: 'Galle', 
            img: '../Images/Site Photos/Close-up of the Galle Lighthouse at sunset with the Indian Ocean in the background.jpg', 
            desc: 'The Timeless Dutch Fort City.', 
            cat: ['leisure', 'cultural', 'family', 'surfing', 'honeymoon', 'wildlife', 'adventure'], 
            reason: 'Step back in time within the ramparts of the Dutch Fort. Pair historic charm with the golden beaches of Mirissa and Hikkaduwa for a premium coastal experience.' 
        },
        { 
            id: 'Hambantota', 
            name: 'Hambantota', 
            img: '../Images/Site Photos/Leopards on a stone. The Sri Lankan leopard (Panthera pardus kotiya) male and female..jpg', 
            desc: 'The Ultimate Safari Frontier.', 
            cat: ['leisure', 'family', 'wildlife', 'surfing', 'honeymoon'], 
            reason: 'The undisputed king of wildlife. Embark on a thrilling safari in Yala or Udawalawe to spot leopards and elephants, then unwind on the untouched, quiet beaches of Tangalle.' 
        },
        { 
            id: 'Polonnaruwa', 
            name: 'Polonnaruwa', 
            img: '../Images/Site Photos/Sigiriya Rock.jpg', 
            desc: 'Relics of a Golden Empire.', 
            cat: ['leisure', 'cultural', 'family', 'wildlife'], 
            reason: 'Cycle through the ruins of a medieval kingdom. From giant Buddha statues to ancient palaces, it offers a deep dive into the island’s royal heritage in a peaceful setting.' 
        },
        { 
            id: 'Anuradhapura', 
            name: 'Anuradhapura', 
            img: '../Images/Site Photos/Sigiriya Rock.jpg', 
            desc: 'The Birthplace of Heritage.', 
            cat: ['leisure', 'cultural', 'family', 'wildlife'], 
            reason: 'The grandest of the ancient capitals. Walk among sacred stupas that touch the clouds and visit the oldest documented tree in the world for a profound spiritual experience.' 
        },
        { 
            id: 'Batticaloa', 
            name: 'Batticaloa', 
            img: '../Images/Site Photos/Full shot of Koneswaram Temple in Trincomalee perched on a cliff overlooking the Indian Ocean.jpg', 
            desc: 'Lagoon Serenity & Surf Paradise.', 
            cat: ['leisure', 'family', 'surfing', 'honeymoon', 'wildlife', 'adventure'], 
            reason: 'Home to the legendary Arugam Bay. Whether you are chasing the perfect wave or exploring the tranquil lagoons of the East, this is the ultimate laid-back escape.' 
        },
        { 
            id: 'Trincomalee', 
            name: 'Trincomalee', 
            img: '../Images/Site Photos/River flows into Back Bay of Indian Ocean near Nilaveli beach in Trincomalee Sri Lanka.  Trincomalee is coastal resort city. Panoramic Top .jpg', 
            desc: 'Pristine Sands & Ocean Wonders.', 
            cat: ['leisure', 'cultural', 'family', 'surfing', 'honeymoon', 'wildlife', 'adventure'], 
            reason: 'A paradise of white sands and turquoise waters. NILAVELI is the island’s whale-watching capital and home to some of the most beautiful diving spots in the Indian Ocean.' 
        },
        { 
            id: 'Jaffna', 
            name: 'Jaffna', 
            img: '../Images/Site Photos/Full shot of Jaffna Fort with its star-shaped ramparts and colonial-style buildings.jpg', 
            desc: 'A Vibrant Northern Odyssey.', 
            cat: ['cultural'], 
            reason: 'Experience a world of its own. From vibrant Hindu temples and Dutch forts to the unique cuisine of the North, Jaffna offers an authentic cultural journey like no other.' 
        }
    ];

    // --- State ---
    let currentStep = 1;
    let selectedDests = [];
    let selectedVibe = 'leisure';
    let showAllDests = false;
    const totalSteps = 4;

    // --- DOM Elements ---
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressBar = document.getElementById('progressBar');
    const steps = document.querySelectorAll('.wizard-step');
    const indicators = document.querySelectorAll('.step-indicator');
    const destGrid = document.getElementById('destinationGrid');
    const vibeCards = document.querySelectorAll('.option-card');
    const transportOptions = document.querySelectorAll('.transport-option');
    const stayCards = document.querySelectorAll('.stay-card');

    // --- Initialization ---
    function init() {
        renderDestinations();
        initStartPointDropdown();
        updateWizard();
    }

    function initStartPointDropdown() {
        const searchInput = document.getElementById('startPointSearch');
        const dropdownList = document.getElementById('startPointList');
        const hiddenInput = document.getElementById('startPoint');
        
        // Alphabetical sort (Airports first, then name)
        const sortedPoints = [...startPoints].sort((a, b) => {
            if (a.type !== b.type) return a.type === 'airport' ? -1 : 1;
            return a.name.localeCompare(b.name);
        });

        const renderItems = (filter = "") => {
            const filtered = sortedPoints.filter(p => 
                p.name.toLowerCase().includes(filter.toLowerCase())
            );
            
            dropdownList.innerHTML = filtered.map(p => {
                let icon = 'fa-building';
                if (p.type === 'airport') icon = 'fa-plane';
                if (p.type === 'nature') icon = 'fa-tree';

                return `
                    <div class="dropdown-item ${p.type}" data-name="${p.name}" data-hub="${p.hub}">
                        <i class="fas ${icon}"></i>
                        <span>${p.name}</span>
                    </div>
                `;
            }).join('');

            // Click events
            dropdownList.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    const name = item.dataset.name;
                    const hub = item.dataset.hub;
                    searchInput.value = name;
                    hiddenInput.value = hub;
                    dropdownList.classList.remove('show');
                });
            });
        };

        searchInput.addEventListener('focus', () => {
            dropdownList.classList.add('show');
            renderItems(""); // Show full list on focus as requested
            searchInput.select(); // Select all text so they can just start typing to search
        });

        searchInput.addEventListener('input', (e) => {
            renderItems(e.target.value);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#startPointDropdown')) {
                dropdownList.classList.remove('show');
            }
        });

        // No initial value, use placeholder
        renderItems();
    }

    function renderDestinations() {
        // Filter based on selected vibe
        const filtered = destMeta.filter(d => showAllDests || d.cat.includes(selectedVibe));
        
        // Update Step Title
        const titleEl = document.getElementById('destStepTitle');
        const descEl = document.getElementById('destStepDesc');
        if (titleEl) titleEl.innerText = `Top Picks for ${selectedVibe.charAt(0).toUpperCase() + selectedVibe.slice(1)}`;
        if (descEl) descEl.innerText = `We've selected the best hubs for your ${selectedVibe} trip. Feel free to add more!`;

        destGrid.innerHTML = filtered.map(dest => `
            <div class="dest-select-card ${selectedDests.includes(dest.id) ? 'active' : ''}" data-id="${dest.id}">
                <div class="dest-img-container">
                    <img src="${dest.img}" alt="${dest.name}">
                    <div class="dest-badge"><i class="fas fa-star"></i> Recommended</div>
                </div>
                <div class="dest-info-area">
                    <span class="dest-name">${dest.name}</span>
                    <p class="dest-reason">${dest.reason}</p>
                </div>
            </div>
        `).join('');

        // Add "Show All" toggle if not already there
        if (!showAllDests) {
            const toggleWrapper = document.createElement('div');
            toggleWrapper.className = 'toggle-all-wrapper';
            toggleWrapper.innerHTML = `
                <button id="showAllBtn" class="btn-text-only">
                    <i class="fas fa-plus-circle"></i> See all other destinations
                </button>
            `;
            destGrid.appendChild(toggleWrapper);
            
            document.getElementById('showAllBtn').addEventListener('click', (e) => {
                e.stopPropagation();
                showAllDests = true;
                renderDestinations();
            });
        }

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
            const startSearch = document.getElementById('startPointSearch');
            if (!startSearch.value.trim()) {
                alert('Please select where you start your journey!');
                startSearch.focus();
                return;
            }
            currentStep++;
            updateWizard();
        } else if (currentStep === 2) {
            if (selectedDests.length < 1) {
                alert('Please select at least 1 destination.');
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

        indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx + 1 === currentStep);
            indicator.classList.toggle('completed', idx + 1 < currentStep);
            
            // Allow clicking to jump to steps
            indicator.style.cursor = 'pointer';
        });

        // Add once: Click listeners for indicators
        if (!indicators[0].dataset.hasListener) {
            indicators.forEach((indicator, idx) => {
                indicator.dataset.hasListener = "true";
                indicator.addEventListener('click', () => {
                    const targetStep = idx + 1;
                    
                    // Logic: Always allow jumping back. Only allow jumping forward if validation passes.
                    if (targetStep < currentStep) {
                        currentStep = targetStep;
                        updateWizard();
                    } else if (targetStep > currentStep) {
                        // Attempt to move forward one by one to ensure validation
                        if (currentStep === 1 && targetStep >= 2) {
                            const startSearch = document.getElementById('startPointSearch');
                            if (!startSearch.value.trim()) {
                                alert('Please select where you start your journey!');
                                startSearch.focus();
                                return;
                            }
                            currentStep = 2;
                            updateWizard();
                        } else if (currentStep === 2 && targetStep >= 3) {
                            if (selectedDests.length < 1) {
                                alert('Please select at least 1 destination.');
                                return;
                            }
                            currentStep = 3;
                            updateWizard();
                        } else if (currentStep === 3 && targetStep === 4) {
                            currentStep = 4;
                            generateItinerary();
                            updateWizard();
                        }
                    }
                });
            });
        }

        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.innerText = currentStep === 3 ? 'Generate Plan' : (currentStep === 4 ? 'Complete' : 'Continue');
        if (currentStep === 4) nextBtn.style.display = 'none';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    vibeCards.forEach(card => {
        card.addEventListener('click', () => {
            vibeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selectedVibe = card.dataset.value;
            document.getElementById('tripVibe').value = selectedVibe;
            
            // Re-render destinations for Step 2 based on this choice
            showAllDests = false; // Reset toggle when vibe changes
            renderDestinations();
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
        const startPointHub = document.getElementById('startPoint').value;
        const startPointDisplayName = document.getElementById('startPointSearch').value;
        const resultContainer = document.getElementById('itineraryResult');

        let totalKM = 0;
        let itineraryHtml = "";
        const hubCount = Math.max(1, selectedDests.length);
        const perDest = Math.floor(days / hubCount);
        let dayCounter = 1;

        // Construct Full Route Chain: Start Point Hub -> Hubs
        const fullRoute = [startPointHub, ...selectedDests];

        fullRoute.forEach((hub, idx) => {
            if (idx === 0) return; // Skip starting point as a 'destination' day

            const prevHub = fullRoute[idx - 1];
            const dist = distances[prevHub]?.[hub] || 150;
            totalKM += dist;
            const time = Math.round(dist / 40 * 10) / 10;
            
            const destInfo = destMeta.find(d => d.id === hub);
            const isLast = idx === fullRoute.length - 1;
            const daysHere = (isLast || hubCount === 1) ? (days - dayCounter + 1) : perDest;
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
                    <div class="summary-item"><i class="fas fa-plane-arrival"></i> Starts: <strong>${startPointDisplayName}</strong></div>
                    <div class="summary-item"><i class="fas fa-road"></i> Total Journey: <strong>~${totalKM} KM</strong></div>
                    <div class="summary-item"><i class="fas fa-bed"></i> Comfort: <strong>${stay.toUpperCase()}</strong></div>
                </div>
                <p class="route-preview"><strong>Route:</strong> ${startPointDisplayName} ${selectedDests.length > 0 ? '→ ' + selectedDests.join(' → ') : ''}</p>
            </div>
        `;

        resultContainer.innerHTML = headerHtml + itineraryHtml;
    }

    init();
});
