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
            img: '../Images/Site Photos/Town/Negombo.jpg', 
            desc: 'The Golden Coastal Gateway.', 
            cat: ['leisure', 'cultural', 'family', 'honeymoon', 'wildlife', 'adventure', 'surfing'], 
            attribution: '',
            reasons: {
                leisure: 'The perfect spot to unwind after your flight. Indulge in premium Ayurvedic spas and luxury beach resorts with stunning sunset views over the Indian Ocean.',
                cultural: 'Explore the colonial-era Dutch Fort and the historic St. Mary’s Church. The 100km-long Dutch Canal offers a unique glimpse into the city’s trade history.',
                family: 'Extremely family-friendly with its calm lagoons and safe beaches. Enjoy a relaxed boat ride in the Muthurajawela Marsh or the historic Dutch Canal.',
                honeymoon: 'Romantic sunset catamaran rides and private dinners on the golden sands make Negombo a quiet and intimate escape for couples.',
                wildlife: 'Visit the Muthurajawela Wetlands to spot exotic birds and monitor lizards, or venture north to Kalpitiya for world-class whale and dolphin watching.',
                adventure: 'Try kitesurfing in the lagoon or take a diving trip to explore the nearby shipwrecks and vibrant coral reefs just off the coast.',
                surfing: 'Mainly a hub for kitesurfing due to the lagoon winds, but offers access to hidden northern surf spots for those seeking a unique wave.'
            }
        },
        { 
            id: 'Colombo', 
            name: 'Colombo', 
            img: '../Images/Site Photos/Town/Colombo.jpg', 
            desc: 'The Island’s Vibrant Metropolis.', 
            cat: ['leisure', 'cultural', 'family', 'honeymoon'], 
            attribution: '',
            reasons: {
                leisure: 'Experience the sophisticated side of the island. Enjoy high-end shopping at One Galle Face and cocktails at legendary colonial rooftop bars.',
                cultural: 'The heart of heritage. Visit the National Museum, admire the Gangarama Temple, and wander through the historic architecture of the Fort district.',
                family: 'Endless fun for kids at Viharamahadevi Park, the Planetarium, and the vibrant Lotus Tower. Modern shopping malls offer world-class entertainment.',
                honeymoon: 'Celebrate with Michelin-star dining and romantic walks along the Galle Face Green as the sun sets over the Indian Ocean.',
                wildlife: 'A surprisingly green city. Visit the Talangama Wetlands for birdwatching or explore the nearby Dehiwala National Zoo for an afternoon of wildlife.',
                adventure: 'Urban adventure at its best. Join a night cycling tour through the city or try urban water sports at the historic Beira Lake.',
                surfing: 'While not a surf hub itself, Colombo’s Mount Lavinia beach offers a great coastal atmosphere and occasional waves for beginners.'
            }
        },
        { 
            id: 'Kandy', 
            name: 'Kandy', 
            img: '../Images/Site Photos/Town/Kandy -Photo by Chathura Anuradha Subasinghe -.jpg', 
            desc: 'The Sacred Hill Capital.', 
            cat: ['leisure', 'cultural', 'family', 'adventure', 'honeymoon'], 
            attribution: 'Chathura Anuradha Subasinghe',
            reasons: {
                leisure: 'Escape into the misty hill country. Stay in boutique manor houses and enjoy the cool, refreshing mountain air away from the tropical heat.',
                cultural: 'The spiritual capital. Witness the majesty of the sacred Tooth Relic at the Dalada Maligawa and experience vibrant Kandyan traditional dances.',
                family: 'Perfect for all ages. Explore the massive Peradeniya Royal Botanical Gardens and take a scenic walk around the serene Kandy Lake.',
                honeymoon: 'The mist-covered hills are peak romance. Private villa stays with views of the Knuckles Range offer the ultimate secluded getaway for two.',
                wildlife: 'Hike through the Udawattakele Sanctuary within the city to see giant creepers, rare birds, and playful macaques in their natural forest home.',
                adventure: 'The gateway to the Knuckles Mountain Range. Embark on rugged treks, waterfall chases, and camping adventures under the forest stars.',
                surfing: 'Located in the central highlands, Kandy swaps the ocean waves for river adventures and mountain thrills in the mist.'
            }
        },
        { 
            id: 'Sigiriya', 
            name: 'Sigiriya', 
            img: '../Images/Site Photos/Town/Sigiriya - Photo by Dylan Shaw.jpg', 
            desc: 'Majesty of the Ancient World.', 
            cat: ['leisure', 'cultural', 'family', 'wildlife', 'adventure', 'honeymoon'], 
            attribution: 'Dylan Shaw',
            reasons: {
                leisure: 'Relax in world-class eco-resorts with views of the rock. Many hotels feature stunning infinity pools that blend seamlessly into the surrounding jungle.',
                cultural: 'Climb the "Lion Rock," a UNESCO masterpiece of urban planning and art, and explore the nearby ancient Dambulla Cave Temples.',
                family: 'A history lesson come to life. Enjoy a traditional village cart ride and see the spectacular "Gathering" of wild elephants in nearby Minneriya.',
                honeymoon: 'Wake up to a private breakfast overlooking the Sigiriya Rock. The area’s luxury forest chalets offer unmatched privacy and romantic vibes.',
                wildlife: 'The King of elephant sightings. Take a safari to Minneriya or Kaudulla National Parks to see hundreds of elephants in their natural habitat.',
                adventure: 'Hike up Pidurangala Rock at sunrise for the best view of Sigiriya, or take a breathtaking hot air balloon ride over the ancient landscape.',
                surfing: 'A landlocked cultural treasure, Sigiriya swaps the waves for ancient heights and lush forest expeditions in the heart of the island.'
            }
        },
        { 
            id: 'Rathnapura', 
            name: 'Rathnapura', 
            img: '../Images/Site Photos/Sri-Lanka-flag.jpg', 
            desc: 'The Gem City & Rainforest Gateway.', 
            cat: ['cultural', 'adventure', 'wildlife'], 
            attribution: '',
            reasons: {
                leisure: 'Hidden away in the deep rainforest. Stay in boutique eco-bungalows and listen to the soothing sounds of nature in total peace and quiet.',
                cultural: 'The "City of Gems." Visit the Maha Saman Devalaya temple and learn about the island’s 2,500-year-old gem mining and trading heritage.',
                family: 'Go on a guided gem-mining tour where kids can learn how precious stones are found. Explore the lush paddy fields and rubber estates with the locals.',
                honeymoon: 'Secluded rainforest retreats and misty mountain backdrops make this a top choice for couples seeking an off-beat and romantic mountain escape.',
                wildlife: 'The gateway to Sinharaja, the last virgin rainforest in Sri Lanka. Spot endemic birds, giant butterflies, and rare reptiles in the jungle.',
                adventure: 'Home to the sacred Adam’s Peak (Sri Pada) climb. A challenging overnight trek that rewards you with a spiritual sunrise at the summit.',
                surfing: 'Surrounded by rainforests and mountains, Rathnapura offers mountain adventures rather than coastal waves.'
            }
        },
        { 
            id: 'Nuwara Eliya', 
            name: 'Nuwara Eliya', 
            img: '../Images/Site Photos/Town/Nuwaraeliya.jpg', 
            desc: 'Little England & Tea Country.', 
            cat: ['leisure', 'family', 'adventure', 'honeymoon', 'wildlife'], 
            attribution: '',
            reasons: {
                leisure: 'Tea and tranquility. Enjoy legendary high tea at the Grand Hotel and walks through perfectly manicured tea estates in the cool mountain air.',
                cultural: 'Experience "Little England." Visit Victorian-era tea factories, colonial post offices, and the famous Hill Club for a taste of history.',
                family: 'Ride a swan boat on Gregory Lake, visit the Hakgala Gardens, or explore strawberry farms for a refreshing and fun family day out.',
                honeymoon: 'The most romantic mountain getaway. Cozy up by a fireplace in a colonial-style bungalow surrounded by misty tea valleys and rose gardens.',
                wildlife: 'Trek through Horton Plains National Park to see the Sambar deer and rare highland birds before reaching the dramatic "World’s End" cliff.',
                adventure: 'Peak-bagging and trekking. Climb the nearby Single Tree Hill or explore the roaring waterfalls like St. Clair’s and Devon Falls.',
                surfing: 'Located at the highest altitude on the island, Nuwara Eliya is a paradise for misty mountain trekking rather than surfing.'
            }
        },
        { 
            id: 'Ella', 
            name: 'Ella', 
            img: '../Images/Site Photos/Town/Ella - Photo by Anton Lecock.jpg', 
            desc: 'Mist-Covered Peaks & Iconic Views.', 
            cat: ['leisure', 'cultural', 'family', 'adventure', 'honeymoon'], 
            attribution: 'Anton Lecock',
            reasons: {
                leisure: 'A laid-back mountain village. Spend your days in cozy hillside cafes, enjoying yoga, and taking in the breathtaking views of the Ella Gap.',
                cultural: 'Walk across the iconic Nine Arch Bridge and explore the ancient Ravana Cave, tied to the epic Ramayana legend and history.',
                family: 'The most scenic train ride in the world is a family favorite. Hike the easy path to Little Adam’s Peak for panoramic views of the hills.',
                honeymoon: 'Privacy and views. Boutique hotels built into the mountainside offer "infinity" forest views that are perfect for romantic memories.',
                wildlife: 'Chase the waterfalls. Ravana Falls and the nearby Dunhinda Falls offer spectacular sights and the chance to spot unique hill-country birds.',
                adventure: 'The hikers’ paradise. Tackle the challenging Ella Rock hike or fly across the valley on the "Flying Ravana" mega-zip line.',
                surfing: 'Ella is a high-altitude marvel where the only "waves" are the rolling hills of tea as far as the eye can see.'
            }
        },
        { 
            id: 'Galle', 
            name: 'Galle', 
            img: '../Images/Site Photos/Town/Galle - Photo by Daniel Klein.jpg', 
            desc: 'The Timeless Dutch Fort City.', 
            cat: ['leisure', 'cultural', 'family', 'surfing', 'honeymoon', 'wildlife', 'adventure'], 
            attribution: 'Daniel Klein',
            reasons: {
                leisure: 'Boutique heaven. Shop for handmade jewelry, dine in world-class restaurants, and relax on the chic, quiet beaches of nearby Dalawella.',
                cultural: 'Step into history at the Galle Fort, a UNESCO World Heritage site filled with colonial buildings, ancient ramparts, and lighthouses.',
                family: 'Perfectly safe swimming at the Unawatuna bay and fun turtle hatchery visits. The Fort’s ramparts are great for a family sunset walk.',
                honeymoon: 'Intimate and historic. Stay in a restored colonial villa within the Fort and enjoy sunset dinners overlooking the Indian Ocean.',
                wildlife: 'The gateway to the deep blue. Head to nearby Mirissa for whale watching or spot sea turtles swimming in the coral gardens of Hikkaduwa.',
                adventure: 'Dive into the ocean to explore coral reefs and shipwrecks, or try stand-up paddleboarding in the calm southern lagoons.',
                surfing: 'Surrounded by world-class breaks. Take a short trip to Weligama for beginner waves or Hikkaduwa for more challenging reef breaks.'
            }
        },
        { 
            id: 'Hambantota', 
            name: 'Hambantota', 
            img: '../Images/Site Photos/Town/Yala.jpg', 
            desc: 'The Ultimate Safari Frontier.', 
            cat: ['leisure', 'family', 'wildlife', 'surfing', 'honeymoon'], 
            attribution: '',
            reasons: {
                leisure: 'Total luxury. The area is home to the island’s most exclusive 5-star resorts, featuring world-class golf courses and private beaches.',
                cultural: 'Visit the sacred multi-religious city of Kataragama and explore the ancient monastic ruins hidden deep in the southern jungles.',
                family: 'The ultimate family safari. Spot leopards in Yala and see the world’s most playful elephants at the Udawalawe Elephant Transit Home.',
                honeymoon: 'Deep-jungle romance. Stay in luxury glamping tents and enjoy private "safari dinners" under a spectacular blanket of stars.',
                wildlife: 'The wildlife capital. Yala National Park offers the highest density of leopards in the world, while Udawalawe is a haven for wild elephants.',
                adventure: 'Go dune driving on the southern sands or take a rugged jungle safari for a true "off-road" adrenaline rush.',
                surfing: 'While the main town is quiet, the nearby Hiriketiya Bay offers some of the most beautiful and scenic surf breaks on the south coast.'
            }
        },
        { 
            id: 'Polonnaruwa', 
            name: 'Polonnaruwa', 
            img: '../Images/Site Photos/Town/Polonnaruwa - Photo by Triplanka.jpg', 
            desc: 'Relics of a Golden Empire.', 
            cat: ['leisure', 'cultural', 'family', 'wildlife'], 
            attribution: 'Triplanka',
            reasons: {
                leisure: 'Tranquility by the Lake. Stay at the "Royal Lakeside" and watch the sunset over the massive ancient "Sea of Parakrama" reservoir.',
                cultural: 'Cycle through the ruins of a medieval kingdom. See the Gal Vihara’s giant Buddha statues and the intricate Parakrama Samudra reservoir.',
                family: 'Rent bicycles for the whole family to explore the ancient city ruins. The flat paths and giant statues are a major hit with children.',
                honeymoon: 'Romantic cycling journeys among ancient palaces and quiet sunset walks by the lake offer a peaceful and spiritual connection.',
                wildlife: 'The "Primate Capital." See the famous "Temple Monkeys" and take a short drive to Minneriya for the spectacular elephant gathering.',
                adventure: 'Explore the ruins on two wheels or take a jeep safari through the wild, untouched flood plains of the Mahaweli River.',
                surfing: 'A landlocked ancient capital where history flows deeper than the ocean waves.'
            }
        },
        { 
            id: 'Anuradhapura', 
            name: 'Anuradhapura', 
            img: '../Images/Site Photos/Town/Anuradhapura - Photo by Triplanka.jpg', 
            desc: 'The Birthplace of Heritage.', 
            cat: ['leisure', 'cultural', 'family', 'wildlife'], 
            attribution: 'Triplanka',
            reasons: {
                leisure: 'A place of profound peace. Stay in boutique forest lodges and experience the spiritual serenity of the island’s oldest ancient city.',
                cultural: 'The first capital of Sri Lanka. Walk under the shadow of the massive Ruwanwelisaya Stupa and visit the sacred Jaya Sri Maha Bodhi tree.',
                family: 'A spiritual journey. Explore the ancient pleasure gardens (Ranmasu Uyana) and see the engineering marvels of the massive ancient canals.',
                honeymoon: 'Peaceful evening walks among illuminated stupas. The quiet, sacred atmosphere is perfect for couples seeking a deeper bond.',
                wildlife: 'The gateway to Wilpattu National Park. Embark on a safari to spot leopards and sloth bears in a beautiful, dense "lakeside" forest.',
                adventure: 'Explore the sprawling ruins by bike or climb the Mihintale Rock, the "cradle of Buddhism," for breathtaking views of the plains.',
                surfing: 'Deep in the cultural triangle, Anuradhapura offers ancient wonders and forest safaris far from the coastal surf.'
            }
        },
        { 
            id: 'Batticaloa', 
            name: 'Batticaloa', 
            img: '../Images/Site Photos/Town/Arugam Bay.jpg', 
            desc: 'Lagoon Serenity & Surf Paradise.', 
            cat: ['leisure', 'family', 'surfing', 'honeymoon', 'wildlife', 'adventure'], 
            attribution: '',
            reasons: {
                leisure: 'Total beach bliss. Pasikudah offers some of the best luxury beachfront resorts with turquoise waters that remain shallow for miles.',
                cultural: 'Discover the unique history of the "Singing Fish" lagoon and explore the colonial Batticaloa Fort overlooking the water.',
                family: 'The calm, shallow waters of Pasikudah Bay are world-famous for being safe and perfect for children to play in all day.',
                honeymoon: 'Secluded and serene. The East Coast lagoons and private beaches offer a quiet, romantic retreat away from the crowds.',
                wildlife: 'Explore the lagoons by boat to spot unique water birds or head to nearby Arugam Bay for birdwatching in the Pottuvil Lagoon.',
                adventure: 'Dive the wreck of the HMS Hermes, the world’s first aircraft carrier, or try kite surfing in the untouched eastern lagoons.',
                surfing: 'Home to the legendary Arugam Bay. Whether you are chasing the perfect wave or a world-class point break, this is the ultimate surf hub.'
            }
        },
        { 
            id: 'Trincomalee', 
            name: 'Trincomalee', 
            img: '../Images/Site Photos/Town/Trincomalee.jpg', 
            desc: 'Pristine Sands & Ocean Wonders.', 
            cat: ['leisure', 'cultural', 'family', 'surfing', 'honeymoon', 'wildlife', 'adventure'], 
            attribution: '',
            reasons: {
                leisure: 'The Maldives of Sri Lanka. Crystal clear waters and pristine white beaches like Uppuveli offer the ultimate relaxed coastal vibe.',
                cultural: 'Visit the Koneswaram Temple perched on a cliff and walk through the historic Fort Frederick with its roaming wild deer.',
                family: 'Spend your days on the white sands of Nilaveli Beach and take a glass-bottom boat to Pigeon Island for snorkeling with sea turtles.',
                honeymoon: 'Marine romance. Enjoy a private sunset boat trip or a candlelit dinner on the secluded sands of Nilaveli for special memories.',
                wildlife: 'The whale-watching capital of the East. Spot Blue Whales and Sperm Whales, or snorkel with reef sharks and turtles at Pigeon Island.',
                adventure: 'World-class diving and snorkeling. Explore the vibrant coral gardens and underwater statues of the beautiful East Coast.',
                surfing: 'While the west coast is rough, Trincomalee’s Nilaveli offers beginner-friendly waves and a beautiful, uncrowded beach scene.'
            }
        },
        { 
            id: 'Jaffna', 
            name: 'Jaffna', 
            img: '../Images/Site Photos/Town/Jaffna.jpg', 
            desc: 'A Vibrant Northern Odyssey.', 
            cat: ['cultural', 'surfing'], 
            attribution: '',
            reasons: {
                leisure: 'Experience the unique charm of the North. Stay in boutique heritage hotels and enjoy the slow, authentic pace of Jaffna life.',
                cultural: 'A world to discover. Visit the majestic Nallur Kandaswamy Temple, explore the Jaffna Fort, and taste the famous Jaffna Crab Curry.',
                family: 'Take a ferry to the remote Delft Island to see wild horses and explore the unique coral-walled villages with the family.',
                honeymoon: 'An off-beat choice. Explore remote islands and vibrant Hindu temples for a truly unique and spiritual start to your journey.',
                wildlife: 'Visit the Chundikulam National Park to see migratory flamingos and a variety of unique bird species in the northern lagoons.',
                adventure: 'Island hopping in the North. Journey through the causeways to Nagadeepa and Karainagar for a true journey of discovery.',
                surfing: 'The northern tip offers unexplored coastlines and a quiet, authentic adventure far from the commercial surf hubs.'
            }
        }
    ];

    const hotelData = {
        'Negombo': [
            { name: "Jetwing Blue", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/11833116.jpg?k=f6412e22c0615993949f575231db0006761042ce4c8141443652c71047702a46&o=", rating: 5, price: { budget: 110, mid: 133, luxury: 250 } },
            { name: "Heritance Negombo", rating: 5, price: { budget: 130, mid: 162, luxury: 290 } },
            { name: "Amagi Aria", rating: 5, price: { budget: 60, mid: 79, luxury: 140 } },
            { name: "Goldi Sands Hotel", rating: 4, price: { budget: 55, mid: 85, luxury: 150 } }
        ],
        'Colombo': [
            { name: "Marino Beach Colombo", rating: 4, price: { budget: 65, mid: 85, luxury: 150 } },
            { name: "Shangri-La Colombo", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/118580299.jpg?k=f6412e22c0615993949f575231db0006761042ce4c8141443652c71047702a46&o=", rating: 5, price: { budget: 160, mid: 195, luxury: 380 } },
            { name: "Galle Face Hotel", rating: 5, price: { budget: 100, mid: 140, luxury: 260 } },
            { name: "Cinnamon Red", rating: 4, price: { budget: 65, mid: 90, luxury: 140 } }
        ],
        'Kandy': [
            { name: "Earl's Regency", rating: 5, price: { budget: 90, mid: 135, luxury: 240 } },
            { name: "Amaya Hills", rating: 4, price: { budget: 70, mid: 105, luxury: 190 } },
            { name: "The Golden Crown", rating: 5, price: { budget: 110, mid: 160, luxury: 280 } },
            { name: "OZO Kandy", rating: 4, price: { budget: 60, mid: 95, luxury: 160 } }
        ],
        'Sigiriya': [
            { name: "Aliya Resort & Spa", rating: 5, price: { budget: 120, mid: 170, luxury: 280 } },
            { name: "Heritance Kandalama", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/38383804.jpg?k=3933c04291880927702f277720993077708c2a8a7df&o=", rating: 5, price: { budget: 140, mid: 175, luxury: 340 } },
            { name: "Sigiriya Village", rating: 4, price: { budget: 70, mid: 110, luxury: 180 } },
            { name: "Hotel Sigiriya", rating: 4, price: { budget: 65, mid: 100, luxury: 170 } }
        ],
        'Nuwara Eliya': [
            { name: "The Grand Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/38385714.jpg?k=361cc38497faae52f9f1b40212727a29e4e69d7a2245e31707b6c57f0069a531&o=", rating: 4, price: { budget: 150, mid: 220, luxury: 350 } },
            { name: "Araliya Green City", rating: 5, price: { budget: 85, mid: 110, luxury: 210 } },
            { name: "Jetwing St. Andrews", rating: 5, price: { budget: 110, mid: 155, luxury: 260 } },
            { name: "The Tea Garden", rating: 3, price: { budget: 45, mid: 75, luxury: 130 } }
        ],
        'Ella': [
            { name: "98 Acres Resort", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/38385610.jpg?k=361cc38497faae52f9f1b40212727a29e4e69d7a2245e31707b6c57f0069a531&o=", rating: 4, price: { budget: 280, mid: 440, luxury: 650 } },
            { name: "Ella Flower Garden", rating: 3, price: { budget: 140, mid: 230, luxury: 320 } },
            { name: "Heavens Edge", rating: 4, price: { budget: 70, mid: 110, luxury: 180 } },
            { name: "Mountain Heavens", rating: 3, price: { budget: 55, mid: 85, luxury: 140 } }
        ],
        'Galle': [
            { name: "Jetwing Lighthouse", rating: 5, price: { budget: 140, mid: 210, luxury: 380 } },
            { name: "Amari Galle", rating: 5, price: { budget: 110, mid: 170, luxury: 290 } },
            { name: "Fort Bazaar", rating: 4, price: { budget: 120, mid: 190, luxury: 320 } },
            { name: "Le Grand Galle", rating: 5, price: { budget: 130, mid: 200, luxury: 350 } }
        ],
        'Hambantota': [
            { name: "Shangri-La Hambantota", rating: 5, price: { budget: 180, mid: 260, luxury: 450 } },
            { name: "Anantara Peace Haven", rating: 5, price: { budget: 200, mid: 310, luxury: 520 } },
            { name: "Cinnamon Wild Yala", rating: 4, price: { budget: 100, mid: 160, luxury: 280 } },
            { name: "Jetwing Yala", rating: 5, price: { budget: 120, mid: 190, luxury: 340 } }
        ],
        'Polonnaruwa': [
            { name: "Jetwing Lake", rating: 5, price: { budget: 95, mid: 145, luxury: 260 } },
            { name: "Cinnamon Lodge Habarana", rating: 5, price: { budget: 100, mid: 155, luxury: 280 } },
            { name: "Deer Park Hotel", rating: 4, price: { budget: 70, mid: 115, luxury: 190 } }
        ],
        'Anuradhapura': [
            { name: "Heritage Hotel", img: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/249275219.jpg?k=a27da83dd028718a6e9374fea46fe8f6658dfa7481d7d31784710c13b2a8a7df&o=", rating: 4, price: { budget: 65, mid: 100, luxury: 170 } },
            { name: "Ulagalla by Uga", rating: 5, price: { budget: 250, mid: 380, luxury: 620 } },
            { name: "Forest Rock Garden", rating: 4, price: { budget: 120, mid: 190, luxury: 320 } }
        ],
        'Trincomalee': [
            { name: "Trinco Blu by Cinnamon", rating: 4, price: { budget: 80, mid: 130, luxury: 210 } },
            { name: "Jungle Beach by Uga", rating: 5, price: { budget: 200, mid: 310, luxury: 520 } },
            { name: "Nilaveli Beach Hotel", rating: 4, price: { budget: 70, mid: 115, luxury: 190 } }
        ],
        'Jaffna': [
            { name: "Jetwing Jaffna", rating: 4, price: { budget: 85, mid: 130, luxury: 230 } },
            { name: "North Gate by Jetwing", rating: 4, price: { budget: 80, mid: 125, luxury: 220 } },
            { name: "The Thinnai", rating: 4, price: { budget: 75, mid: 115, luxury: 200 } }
        ]
    };

    // --- State ---
    let currentStep = 1;
    let selectedDests = [];
    let selectedVibes = []; // Initially empty as requested
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
        handleQueryParams();
        updateWizard();
    }

    function handleQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const startParam = urlParams.get('start');
        const vibeParam = urlParams.get('vibe');

        if (startParam) {
            const searchInput = document.getElementById('startPointSearch');
            const hiddenInput = document.getElementById('startPoint');
            
            // Look for a matching hub
            const match = startPoints.find(p => p.name.toLocaleLowerCase().includes(startParam.toLowerCase()) || 
                                              p.hub.toLocaleLowerCase().includes(startParam.toLowerCase()));
            if (match) {
                searchInput.value = match.name;
                hiddenInput.value = match.hub;
            }
        }

        if (vibeParam) {
            const vibe = vibeParam.toLowerCase();
            const card = document.querySelector(`.option-card[data-value="${vibe}"]`);
            if (card) {
                selectedVibes = [vibe]; // Set as single initial vibe if from link
                selectedVibes.forEach(v => {
                    const c = document.querySelector(`.option-card[data-value="${v}"]`);
                    if (c) c.classList.add('active');
                });
                document.getElementById('tripVibe').value = vibe;
                renderDestinations();
            }
        }

        // Auto-advance to Step 2 if deep-linked
        if (startParam || vibeParam) {
            currentStep = 2;
        }
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
        // Filter based on selected vibes (union)
        const filtered = destMeta.filter(d => showAllDests || selectedVibes.some(v => d.cat.includes(v)));
        
        // Update Step Title
        const titleEl = document.getElementById('destStepTitle');
        const descEl = document.getElementById('destStepDesc');
        
        const vibeNames = selectedVibes.map(v => v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' '));
        const vibeLabel = vibeNames.length > 2 
            ? `${vibeNames.slice(0, -1).join(', ')} & ${vibeNames.slice(-1)}` 
            : vibeNames.join(' & ');

        if (titleEl) titleEl.innerText = `Top Picks for ${vibeLabel || 'your trip'}`;
        if (descEl) descEl.innerText = `We've selected the best hubs for your ${vibeLabel || 'combined'} trip. Feel free to add more!`;

        destGrid.innerHTML = filtered.map(dest => {
            // Pick a reason: first selected vibe that the dest actually HAS, else its desc
            const primaryVibe = selectedVibes.find(v => dest.reasons[v]) || selectedVibes[0];
            const reason = dest.reasons[primaryVibe] || dest.desc;
            const attributionHtml = dest.attribution ? `<div class="photo-attribution">Photo by ${dest.attribution}</div>` : '';
            return `
                <div class="dest-select-card ${selectedDests.includes(dest.id) ? 'active' : ''}" data-id="${dest.id}">
                    <div class="dest-img-container">
                        <img src="${dest.img}" alt="${dest.name}">
                        <div class="dest-badge"><i class="fas fa-star"></i> Recommended</div>
                        ${attributionHtml}
                    </div>
                    <div class="dest-info-area">
                        <span class="dest-name">${dest.name}</span>
                        <p class="dest-reason">${reason}</p>
                    </div>
                </div>
            `;
        }).join('');

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
            if (selectedVibes.length < 1) {
                alert('Please select at least one travel vibe for your trip!');
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
                            if (selectedVibes.length < 1) {
                                alert('Please select at least one travel vibe for your trip!');
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
        
        // Fix: Ensure nextBtn is visible when not on Step 4
        if (currentStep === 4) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    vibeCards.forEach(card => {
        card.addEventListener('click', () => {
            const vibe = card.dataset.value;
            
            if (selectedVibes.includes(vibe)) {
                // Remove
                selectedVibes = selectedVibes.filter(v => v !== vibe);
                card.classList.remove('active');
            } else {
                // Add
                selectedVibes.push(vibe);
                card.classList.add('active');
            }
            
            document.getElementById('tripVibe').value = selectedVibes.join(',');
            
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
        const vibeStr = document.getElementById('tripVibe').value;
        const selectedVibeList = vibeStr.split(',');
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

            const primaryVibe = selectedVibeList.find(v => destInfo.reasons[v]) || selectedVibeList[0];
            itineraryHtml += `
                <div class="itinerary-day-box fade-in">
                    <div class="day-header-main">
                        <div class="day-id-badge">Day ${idx}</div>
                        <div class="day-title-info">
                            <h3>Explore ${hub}</h3>
                            <div class="leg-meta">
                                <span class="meta-pill"><i class="fas fa-road"></i> ${dist} KM Journey</span>
                                <span class="meta-pill"><i class="fas fa-clock"></i> ${time}h Drive</span>
                                <span class="meta-pill"><i class="fas fa-map-marker-alt"></i> Leg ${idx}: from ${prevHub}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="itinerary-bento-grid">
                        <div class="bento-info">
                            <div class="vibe-quote">
                                <i class="fas fa-quote-left"></i>
                                <p>${destInfo.reasons[primaryVibe] || destInfo.desc}</p>
                            </div>
                        </div>
                        
                        <div class="bento-hotels">
                            <div class="spotlight-header">
                                <h4><i class="fas fa-star-creative"></i> Smart Property Spotlight</h4>
                                <p>Hand-picked for your ${stay} comfort level.</p>
                            </div>
                            
                            <div class="property-spotlight-container">
                                ${(hotelData[hub] || []).slice(0, 1).map(hotel => {
                                    const p = hotel.price[stay] || 100;
                                    const stars = '<span class="star-pill"><i class="fas fa-star"></i> ' + hotel.rating + '</span>';
                                    return `
                                        <div class="spotlight-main-card">
                                            <div class="spotlight-visual">
                                                <img src="${hotel.img || destInfo.img || '../Images/Site Photos/hotel-thumb.png'}" alt="${hotel.name}">
                                                <div class="luxury-badge">TriLanka Choice</div>
                                            </div>
                                            <div class="spotlight-details">
                                                <div class="name-rating">
                                                    <h5>${hotel.name}</h5>
                                                    ${stars}
                                                </div>
                                                <div class="pricing-dashboard">
                                                    <div class="est-label">Estimated Nightly Rate</div>
                                                    <div class="est-price">$${p} <span>USD</span></div>
                                                </div>
                                                <div class="comparison-command-center">
                                                    <div class="compare-label">Compare Across Platforms</div>
                                                    <div class="compare-grid">
                                                        <a href="${bookingLink}" target="_blank" class="comp-btn booking">
                                                            <img src="../Images/Associated Companies/booking.com.png" alt="B.">
                                                            <span>Best Price</span>
                                                        </a>
                                                        <a href="${tripadvisorLink}" target="_blank" class="comp-btn tripadvisor">
                                                            <img src="../Images/Associated Companies/Trip Advisor.png" alt="TA">
                                                            <span>Reviews</span>
                                                        </a>
                                                        <a href="${airbnbLink}" target="_blank" class="comp-btn airbnb">
                                                            <img src="../Images/Associated Companies/airbnb.png" alt="AB">
                                                            <span>Homestay</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                                
                                <div class="alternative-stays">
                                    <div class="alt-label">Alternative Options in ${hub}:</div>
                                    <div class="alt-grid">
                                        ${(hotelData[hub] || []).slice(1).map(hotel => `
                                            <div class="alt-pill" title="${hotel.name}">
                                                <i class="fas fa-hotel"></i>
                                                <span>${hotel.name}</span>
                                            </div>
                                        `).join('')}
                                        <a href="${bookingLink}" target="_blank" class="alt-pill more">
                                            <i class="fas fa-plus"></i>
                                            <span>Explore All</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        const formattedVibes = selectedVibeList.map(v => v === 'surfing' ? 'Sea Surfing' : v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' '));
        const vibeHeader = formattedVibes.length > 2 
            ? `${formattedVibes.slice(0, -1).join(', ')} & ${formattedVibes.slice(-1)}` 
            : formattedVibes.join(' & ');

        const headerHtml = `
            <div class="itinerary-header">
                <h2>Your Custom ${vibeHeader.toUpperCase()} Journey</h2>
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
