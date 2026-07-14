/* --- SAMPLE PROPERTY DATA (Replace this with real data later) --- */
const sampleProperties = [
    {
        id: 1,
        title: "Modern Apartment in Downtown Skyline",
        location: "Dubai Marina, Dubai",
        price: 2500000, // EGP or AED
        type: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: 1600, // Sqft
        image: "images/properties/prop1.jpg",
        description: "A sleek and stylish modern apartment in the heart of Downtown Dubai, featuring stunning marina views and direct access to luxury amenities.",
        amenities: ["City View", "Gym", "Pool", "Central A/C", "Parking"],
        featured: true
    },
    {
        id: 2,
        title: "Luxury Beachfront Villa with Private Pool",
        location: "Palm Jumeirah, Dubai",
        price: 15000000,
        type: "villa",
        bedrooms: 5,
        bathrooms: 6,
        area: 6000,
        image: "images/properties/prop2.jpg",
        description: "A unique beachfront villa offering ultimate privacy, a large private pool, a private beach entrance, and breathtaking views of the Arabian Gulf.",
        amenities: ["Beach View", "Gym", "Pool", "Jacuzzi", "Maid Service", "Garden"],
        featured: true
    },
    {
        id: 3,
        title: "Cozy Family Home near Park",
        location: "Arabian Ranches, Dubai",
        price: 3800000,
        type: "house",
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        image: "images/properties/prop3.jpg",
        description: "Perfect family house situated just steps from a community park. Features include a spacious garden, modern kitchen, and access to a community center.",
        amenities: ["Park View", "Garden", "Parking", "Security", "Kids Play Area"],
        featured: false
    },
    {
        id: 4,
        title: "Executive Penthouse in Finance District",
        location: "DIFC, Dubai",
        price: 7200000,
        type: "apartment",
        bedrooms: 4,
        bathrooms: 4,
        area: 4500,
        image: "images/properties/prop4.jpg",
        description: "A high-floor penthouse catering to executives, featuring floor-to-ceiling windows, panoramic city views, and premium finishes throughout.",
        amenities: ["City View", "Gym", "Pool", "Concierge", "High Floor"],
        featured: false
    }
];

/* --- MAIN FUNCTIONS --- */

// Function to render property cards into a container
function renderPropertyGrid(containerId, properties) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content

    if (properties.length === 0) {
        container.innerHTML = '<p>No properties found matching your criteria.</p>';
        return;
    }

    properties.forEach(prop => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.onclick = () => viewPropertyDetails(prop.id);

        card.innerHTML = `
            <img src="${prop.image}" alt="${prop.title}" class="card-image">
            <div class="card-details">
                <div class="card-price">AED ${prop.price.toLocaleString()}</div>
                <div class="card-title">${prop.title}</div>
                <div class="card-location">${prop.location}</div>
                <div class="card-specs">
                    <span>${prop.bedrooms} Bed</span> | 
                    <span>${prop.bathrooms} Bath</span> | 
                    <span>${prop.area.toLocaleString()} Sqft</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Function to handle showing the detailed property view
function viewPropertyDetails(propertyId) {
    const prop = sampleProperties.find(p => p.id === propertyId);
    if (!prop) return;

    const detailContent = document.getElementById('property-detail-content');
    
    // Create amenities list
    const amenitiesHTML = prop.amenities.map(a => `<li>${a}</li>`).join('');

    detailContent.innerHTML = `
        <div class="detail-header">
            <div>
                <h2>${prop.title}</h2>
                <p class="card-location">${prop.location}</p>
                <div class="detail-specs">
                    <span>${prop.bedrooms} Bed</span> | 
                    <span>${prop.bathrooms} Bath</span> | 
                    <span>${prop.area.toLocaleString()} Sqft</span>
                </div>
            </div>
            <div class="detail-price">AED ${prop.price.toLocaleString()}</div>
        </div>
        <div class="gallery-main">
            <img src="${prop.image}" alt="${prop.title}">
        </div>
        <div class="detail-description">
            <h3>Description</h3>
            <p>${prop.description}</p>
        </div>
        <div class="detail-amenities">
            <h3>Amenities</h3>
            <ul class="amenities-list">
                ${amenitiesHTML}
            </ul>
        </div>
        <div class="detail-actions" style="margin-top: 30px;">
            <button class="btn-primary-red">Request Information</button>
            <button class="btn-secondary-silver">Book a Viewing</button>
        </div>
    `;

    // Navigate to the detail "page"
    window.location.hash = '#property-detail';
}

// Basic search simulation
function performSearch() {
    const locationInput = document.getElementById('search-location').value.toLowerCase();
    const typeInput = document.getElementById('search-type').value;
    const minPriceInput = parseInt(document.getElementById('search-min-price').value) || 0;
    const maxPriceInput = parseInt(document.getElementById('search-max-price').value) || Infinity;

    const filtered = sampleProperties.filter(prop => {
        const matchesLocation = locationInput === "" || prop.location.toLowerCase().includes(locationInput);
        const matchesType = typeInput === "" || prop.type === typeInput;
        const matchesPrice = prop.price >= minPriceInput && prop.price <= maxPriceInput;
        return matchesLocation && matchesType && matchesPrice;
    });

    renderPropertyGrid('all-property-list', filtered);
    window.location.hash = '#listings';
}

// Simple SPA Routing based on URL fragments (#)
function handleRouting() {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(s => s.style.display = 'none');

    let currentHash = window.location.hash || '#home';
    const currentSection = document.querySelector(currentHash);

    if (currentSection) {
        currentSection.style.display = 'block';
        window.scrollTo(0, 0); // Scroll to top on page change
    } else {
        // Fallback to home if hash is invalid
        document.getElementById('home').style.display = 'block';
    }
}

/* --- EVENT LISTENERS --- */

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Populate featured properties on home page
    const featured = sampleProperties.filter(p => p.featured);
    renderPropertyGrid('featured-property-list', featured);
    
    // Populate all properties on listings page
    renderPropertyGrid('all-property-list', sampleProperties);

    // Initial Routing check
    handleRouting();
});

// Event Listener for URL changes (Routing)
window.addEventListener('hashchange', handleRouting);

// Event Listener for search button
document.getElementById('search-button').addEventListener('click', performSearch);