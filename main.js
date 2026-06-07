import * as THREE from 'three';

// ------------------- Three.js Setup -------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Transparent background
document.getElementById('three-container').appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Create a starfield
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Dynamic Planet
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const planetMaterial = new THREE.MeshLambertMaterial({ color: 0x2233ff }); // Default color
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.set(3, 0, -5); // Position the planet
scene.add(planet);

// Mapping of systems to planet colors
const planetColors = {
    'Sol': 0x0077ff, // Blue Earth-like
    'Alpha Centauri': 0xffa500, // Orange
    'Sirius': 0xffffcc, // White/Yellow
    'Proxima Centauri': 0xff0000, // Red
    'Kepler-186f': 0x00ff00 // Green
};

let currentSystemName = 'Sol'; // Global variable to track current system

function updatePlanetAppearance(systemName) {
    const color = planetColors[systemName] || 0x808080; // Default to grey if not found
    (planet.material).color.set(color);
    currentSystemName = systemName; // Update global system name
}

// Initial planet appearance
updatePlanetAppearance(currentSystemName);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the stars
    stars.rotation.y += 0.0005;

    // Rotate the planet
    planet.rotation.y += 0.005;

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ------------------- Game State -------------------
let playerCredits = 10000;

function updateCredits(amount) {
    playerCredits += amount;
    document.getElementById('credit-amount').textContent = playerCredits;
}

// Initial credit display
updateCredits(0);

// ------------------- UI Panel Management -------------------
const stockMarketPanel = document.getElementById('stock-market-panel');
const navigationPanel = document.getElementById('navigation-panel');
const spaceMapPanel = document.getElementById('space-map-panel'); // Added spaceMapPanel
const showStockMarketBtn = document.getElementById('show-stock-market');
const showNavigationBtn = document.getElementById('show-navigation');
const showSpaceMapBtn = document.getElementById('show-space-map'); // Added showSpaceMapBtn

function hideAllPanels() {
    stockMarketPanel.classList.remove('active');
    navigationPanel.classList.remove('active');
    spaceMapPanel.classList.remove('active'); // Included spaceMapPanel
}

showStockMarketBtn.addEventListener('click', () => {
    console.log('Stock Market button clicked');
    hideAllPanels();
    stockMarketPanel.classList.add('active');
    console.log('Stock Market panel active:', stockMarketPanel.classList.contains('active'));
});

showNavigationBtn.addEventListener('click', () => {
    console.log('Navigation button clicked');
    hideAllPanels();
    navigationPanel.classList.add('active');
    console.log('Navigation panel active:', navigationPanel.classList.contains('active'));
});

// Event listener for the new Space Map button
showSpaceMapBtn.addEventListener('click', () => {
    console.log('Space Map button clicked');
    hideAllPanels();
    spaceMapPanel.classList.add('active');
    console.log('Space Map panel active:', spaceMapPanel.classList.contains('active'));
});

// Optionally, hide panels when clicking outside or pressing ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideAllPanels();
    }
});

// ------------------- Web Components (Placeholders for now) -------------------

// Define the Stock Market Web Component
class StockMarket extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host { display: block; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #004400; padding: 8px; text-align: left; }
                th { background-color: rgba(0, 50, 0, 0.5); }
                .buy-btn, .sell-btn {
                    background-color: #008800;
                    color: #00ff00;
                    border: 1px solid #00ff00;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.9em;
                    transition: background-color 0.2s, box-shadow 0.2s;
                }
                .buy-btn:hover, .sell-btn:hover {
                    background-color: #00bb00;
                    box-shadow: 0 0 5px #00ff00;
                }
                .stock-row:hover {
                    background-color: rgba(0, 200, 0, 0.1);
                    cursor: pointer;
                }
                .stock-detail-panel {
                    display: none; /* Hidden by default */
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    z-index: 100;
                    padding: 20px;
                    box-sizing: border-box;
                    flex-direction: column;
                }
                .stock-detail-panel.active {
                    display: flex;
                }
                .close-detail {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: #00ff00;
                    font-size: 1.5em;
                    cursor: pointer;
                }
                .chart-container {
                    flex-grow: 1;
                    margin-top: 20px;
                    border: 1px solid #00ff00;
                    background-color: rgba(0, 0, 0, 0.5);
                }
                .exploration-features {
                    margin-top: 20px;
                    display: flex;
                    gap: 20px;
                }
                .exploration-features div {
                    flex: 1;
                    padding: 10px;
                    border: 1px dashed #008800;
                }
            </style>
            <table>
                <thead>
                    <tr>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="stock-list">
                    <!-- Stock items will be injected here -->
                </tbody>
            </table>
            <div id="stock-detail-panel" class="stock-detail-panel">
                <button class="close-detail" id="close-detail-panel">X</button>
                <h3><span id="detail-stock-name"></span> Chart</h3>
                <div class="chart-container">
                    <canvas id="stock-chart" width="400" height="200"></canvas>
                </div>
                <div class="exploration-features">
                    <div>
                        <h4>News Feed</h4>
                        <p id="news-content">Latest news for <span id="news-stock-name"></span>...</p>
                    </div>
                    <div>
                        <h4>Company Profile</h4>
                        <p id="profile-content">Profile of <span id="profile-stock-name"></span>...</p>
                    </div>
                </div>
            </div>
        `;
        this.stockList = shadow.getElementById('stock-list');
        this.stockDetailPanel = shadow.getElementById('stock-detail-panel');
        this.closeDetailPanelBtn = shadow.getElementById('close-detail-panel');
        this.detailStockName = shadow.getElementById('detail-stock-name');
        this.newsStockName = shadow.getElementById('news-stock-name');
        this.profileStockName = shadow.getElementById('profile-stock-name');
        this.stockChartCanvas = shadow.getElementById('stock-chart');
        this.stockChartCtx = this.stockChartCanvas.getContext('2d');

        this.stocks = [
            { id: 'SPACEX-A', name: 'SpaceX Alpha', price: 100.00, quantity: 0, history: [] },
            { id: 'ORION-B', name: 'Orion Beta', price: 50.00, quantity: 0, history: [] },
            { id: 'GALAX-C', name: 'Galactic Corp', price: 200.00, quantity: 0, history: [] },
            { id: 'QUANTUM-D', name: 'Quantum Dynamics', price: 150.00, quantity: 0, history: [] }
        ];

        this.closeDetailPanelBtn.addEventListener('click', () => {
            this.stockDetailPanel.classList.remove('active');
        });

        this.renderStocks();
        this.startPriceFluctuation();
    }

    renderStocks() {
        this.stockList.innerHTML = '';
        this.stocks.forEach(stock => {
            const row = document.createElement('tr');
            row.classList.add('stock-row'); // Add class for styling and event listener
            row.dataset.id = stock.id;
            row.innerHTML = `
                <td>${stock.name}</td>
                <td id="price-${stock.id}">${stock.price.toFixed(2)}</td>
                <td>
                    <button class="buy-btn" data-id="${stock.id}">Buy</button>
                    <button class="sell-btn" data-id="${stock.id}">Sell</button>
                    (Owned: <span id="owned-${stock.id}">${stock.quantity}</span>)
                </td>
            `;
            this.stockList.appendChild(row);
        });
        this.addEventListeners();
        this.addStockRowClickListeners();
    }

    startPriceFluctuation() {
        setInterval(() => {
            this.stocks.forEach(stock => {
                const fluctuation = (Math.random() - 0.5) * 10; // -5 to +5
                stock.price = Math.max(1, stock.price + fluctuation); // Ensure price doesn't go below 1
                stock.history.push(stock.price); // Store history for chart
                if (stock.history.length > 20) stock.history.shift(); // Keep last 20 points
                this.updateStockDisplay(stock);
            });
        }, 3000); // Update prices every 3 seconds
    }

    addEventListeners() {
        this.shadowRoot.querySelectorAll('.buy-btn').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation(); // Prevent row click from firing
                this.handleBuy(e.target.dataset.id);
            };
        });
        this.shadowRoot.querySelectorAll('.sell-btn').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation(); // Prevent row click from firing
                this.handleSell(e.target.dataset.id);
            };
        });
    }

    addStockRowClickListeners() {
        this.shadowRoot.querySelectorAll('.stock-row').forEach(row => {
            row.addEventListener('click', (e) => {
                this.showStockDetails(e.currentTarget.dataset.id);
            });
        });
    }

    showStockDetails(stockId) {
        const stock = this.stocks.find(s => s.id === stockId);
        if (stock) {
            this.detailStockName.textContent = stock.name;
            this.newsStockName.textContent = stock.name;
            this.profileStockName.textContent = stock.name;
            // Placeholder for news and profile content
            this.shadowRoot.getElementById('news-content').textContent = `Breaking news from ${stock.name}: New warp core developed!`;
            this.shadowRoot.getElementById('profile-content').textContent = `CEO: Jane Doe. Specializes in ${stock.name === 'SpaceX Alpha' ? 'interstellar transport' : 'quantum computing'}.`;

            this.drawChart(stock);
            this.stockDetailPanel.classList.add('active');
        }
    }

    drawChart(stock) {
        const canvas = this.stockChartCanvas;
        const ctx = this.stockChartCtx;
        const history = stock.history;

        // Clear canvas
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (history.length < 2) return;

        const maxPrice = Math.max(...history);
        const minPrice = Math.min(...history);
        const priceRange = maxPrice - minPrice;

        const xStep = canvas.width / (history.length - 1);
        const yScaler = priceRange === 0 ? 0 : (canvas.height - 20) / priceRange; // 20px padding

        ctx.beginPath();
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;

        history.forEach((price, index) => {
            const x = index * xStep;
            const y = canvas.height - 10 - (price - minPrice) * yScaler; // 10px bottom padding

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#00ff00';
        history.forEach((price, index) => {
            const x = index * xStep;
            const y = canvas.height - 10 - (price - minPrice) * yScaler;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }


// Define the Space Navigation Web Component
class SpaceNavigation extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host { display: block; }
                div { padding: 10px; border: 1px dashed #008800; border-radius: 5px; }
                p { margin: 5px 0; }
                select, button {
                    background-color: #008800;
                    color: #00ff00;
                    border: 1px solid #00ff00;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1em;
                    margin-top: 10px;
                    transition: background-color 0.2s, box-shadow 0.2s;
                }
                select:hover, button:hover {
                    background-color: #00bb00;
                    box-shadow: 0 0 8px #00ff00;
                }
                select { width: 100%; box-sizing: border-box; }
            </style>
            <div>
                <p>Current System: <span id="current-system">Sol</span></p>
                <label for="destination-select">Jump to:</label>
                <select id="destination-select">
                    <option value="Alpha Centauri">Alpha Centauri</option>
                    <option value="Sirius">Sirius</option>
                    <option value="Proxima Centauri">Proxima Centauri</option>
                    <option value="Kepler-186f">Kepler-186f</option>
                </select>
                <button id="jump-button">Initiate Jump</button>
            </div>
        `;

        this.currentSystemDisplay = shadow.getElementById('current-system');
        this.destinationSelect = shadow.getElementById('destination-select');
        this.jumpButton = shadow.getElementById('jump-button');

        this.currentSystem = 'Sol';
        this.currentSystemDisplay.textContent = this.currentSystem;
        // updatePlanetAppearance(this.currentSystem); // Temporarily commented out for debugging

        this.jumpButton.onclick = () => this.handleJump();
    }

    handleJump() {
        const destination = this.destinationSelect.value;
        if (destination && destination !== this.currentSystem) {
            console.log(`Jumping from ${this.currentSystem} to ${destination}...`);
            this.currentSystem = destination;
            this.currentSystemDisplay.textContent = this.currentSystem;
            // updatePlanetAppearance(this.currentSystem); // Temporarily commented out for debugging
            alert(`Arrived at ${destination}!`);
            // In a real game, this would trigger more complex logic
            // like updating market data based on new location, new missions, etc.
        } else {
            alert('Please select a different destination.');
        }
    }
}
customElements.define('space-navigation', SpaceNavigation);

// Define the Space Map Web Component
class SpaceMap extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                :host { display: block; width: 100%; height: 100%; }
                canvas {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #00ff00;
                    background-color: rgba(0, 0, 0, 0.5);
                }
            </style>
            <canvas id="space-map-canvas"></canvas>
        `;
        this.canvas = shadow.getElementById('space-map-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.systems = [
            { name: 'Sol', x: 200, y: 150 },
            { name: 'Alpha Centauri', x: 500, y: 250 },
            { name: 'Sirius', x: 100, y: 400 },
            { name: 'Proxima Centauri', x: 300, y: 50 },
            { name: 'Kepler-186f', x: 600, y: 100 }
        ];
        this.drawMap();

        // Handle canvas resize
        new ResizeObserver(() => this.drawMap()).observe(this.canvas);
    }

    drawMap() {
        // Clear canvas
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw systems
        this.systems.forEach(system => {
            this.ctx.beginPath();
            this.ctx.arc(system.x, system.y, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = system.name === currentSystemName ? '#00ffff' : '#00ff00'; // Highlight current system
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillText(system.name, system.x + 10, system.y + 5);
        });

        // Draw connections (placeholder)
        this.ctx.strokeStyle = '#004400';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.systems[0].x, this.systems[0].y);
        this.ctx.lineTo(this.systems[1].x, this.systems[1].y);
        this.ctx.stroke();
    }
}
customElements.define('space-map', SpaceMap);
