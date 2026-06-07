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

// Create a rotating planet
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const planetMaterial = new THREE.MeshLambertMaterial({ color: 0x2233ff }); // Lambert material for lighting effect
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.set(3, 0, -5); // Position the planet
scene.add(planet);

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
        `;
        this.stockList = shadow.getElementById('stock-list');
        this.stocks = [
            { id: 'SPACEX-A', name: 'SpaceX Alpha', price: 100.00, quantity: 0 },
            { id: 'ORION-B', name: 'Orion Beta', price: 50.00, quantity: 0 },
            { id: 'GALAX-C', name: 'Galactic Corp', price: 200.00, quantity: 0 },
            { id: 'QUANTUM-D', name: 'Quantum Dynamics', price: 150.00, quantity: 0 }
        ];
        this.renderStocks();
        this.startPriceFluctuation();
    }

    renderStocks() {
        this.stockList.innerHTML = '';
        this.stocks.forEach(stock => {
            const row = document.createElement('tr');
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
    }

    startPriceFluctuation() {
        setInterval(() => {
            this.stocks.forEach(stock => {
                const fluctuation = (Math.random() - 0.5) * 10; // -5 to +5
                stock.price = Math.max(1, stock.price + fluctuation); // Ensure price doesn't go below 1
                this.updateStockDisplay(stock);
            });
        }, 3000); // Update prices every 3 seconds
    }

    addEventListeners() {
        this.shadowRoot.querySelectorAll('.buy-btn').forEach(button => {
            button.onclick = (e) => this.handleBuy(e.target.dataset.id);
        });
        this.shadowRoot.querySelectorAll('.sell-btn').forEach(button => {
            button.onclick = (e) => this.handleSell(e.target.dataset.id);
        });
    }

    handleBuy(stockId) {
        const stock = this.stocks.find(s => s.id === stockId);
        if (stock && playerCredits >= stock.price) {
            updateCredits(-stock.price);
            stock.quantity++;
            this.updateStockDisplay(stock);
            console.log(`Bought ${stock.name}. New quantity: ${stock.quantity}`);
        } else {
            console.log('Cannot buy: Insufficient credits or stock not found.');
        }
    }

    handleSell(stockId) {
        const stock = this.stocks.find(s => s.id === stockId);
        if (stock && stock.quantity > 0) {
            updateCredits(stock.price);
            stock.quantity--;
            this.updateStockDisplay(stock);
            console.log(`Sold ${stock.name}. New quantity: ${stock.quantity}`);
        } else {
            console.log('Cannot sell: No stock owned or stock not found.');
        }
    }

    updateStockDisplay(stock) {
        this.shadowRoot.getElementById(`price-${stock.id}`).textContent = stock.price.toFixed(2);
        this.shadowRoot.getElementById(`owned-${stock.id}`).textContent = stock.quantity;
    }
}
customElements.define('stock-market', StockMarket);


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

        this.jumpButton.onclick = () => this.handleJump();
    }

    handleJump() {
        const destination = this.destinationSelect.value;
        if (destination && destination !== this.currentSystem) {
            console.log(`Jumping from ${this.currentSystem} to ${destination}...`);
            this.currentSystem = destination;
            this.currentSystemDisplay.textContent = this.currentSystem;
            alert(`Arrived at ${destination}!`);
            // In a real game, this would trigger more complex logic
            // like updating market data based on new location, new missions, etc.
        } else {
            alert('Please select a different destination.');
        }
    }
}
customElements.define('space-navigation', SpaceNavigation);
