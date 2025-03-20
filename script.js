let team1Count = 0;
let team2Count = 0;
let currentTeam = 1; // Default to Team 1
let playerAttributes = {
    team1: {},
    team2: {}
};

// Initialize the corner kick setup when the page loads
window.onload = function() {
    setupCornerKick();
    
    // Initialize player attributes tables for both teams
    generatePlayerAttributesTables();
    
    // Initialize teams with real player data
    initializeTeams();
    
    // Start with Team 1 tab active
    switchTeamTab(1);
    
    // Initialize default attributes for all players
    for (let team = 1; team <= 2; team++) {
        for (let i = 1; i <= 11; i++) {
            if (!playerAttributes[`team${team}`][i]) {
                playerAttributes[`team${team}`][i] = {
                    name: '',
                    height: '',
                    heading: '',
                    jumping: '',
                    strength: '',
                    position: ''
                };
            }
        }
    }
};

function switchTeamTab(team) {
    // Update active tab styling
    document.getElementById('team1Tab').className = team === 1 
        ? 'px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium'
        : 'px-4 py-2 border-b-2 border-transparent text-gray-500 font-medium';
    
    document.getElementById('team2Tab').className = team === 2 
        ? 'px-4 py-2 border-b-2 border-red-600 text-red-600 font-medium'
        : 'px-4 py-2 border-b-2 border-transparent text-gray-500 font-medium';
    
    // Show/hide panels
    document.getElementById('team1Panel').className = team === 1 
        ? 'bg-white shadow-md rounded-lg overflow-hidden mb-4'
        : 'bg-white shadow-md rounded-lg overflow-hidden mb-4 hidden';
    
    document.getElementById('team2Panel').className = team === 2 
        ? 'bg-white shadow-md rounded-lg overflow-hidden mb-4'
        : 'bg-white shadow-md rounded-lg overflow-hidden mb-4 hidden';
    
    // Set current team
    currentTeam = team;
}

function generatePlayerAttributesTables() {
    generateTeamAttributesTable(1, 'team1AttributesTable');
    generateTeamAttributesTable(2, 'team2AttributesTable');
}

function generateTeamAttributesTable(team, tableId) {
    const table = document.getElementById(tableId);
    table.innerHTML = '';
    
    // Get the team's attributes
    const teamAttributes = playerAttributes[`team${team}`];
    
    // Get all player numbers and sort them
    const playerNumbers = Object.keys(teamAttributes).map(Number).sort((a, b) => {
        // Always put goalkeeper (1) first
        if (a === 1) return -1;
        if (b === 1) return 1;
        return a - b;
    });
    
    // Generate rows for each player
    playerNumbers.forEach(number => {
        const attrs = teamAttributes[number] || {
            name: '',
            height: '',
            heading: '',
            jumping: '',
            strength: ''
        };
        
        const row = document.createElement('tr');
        row.className = number % 2 === 0 ? 'bg-gray-50' : 'bg-white';
        
        // Highlight if the player is a goalie (always #1)
        if (number === 1) {
            row.className += ' border-l-4 border-yellow-400';
        }
        
        row.innerHTML = `
            <td class="py-1 px-4 text-sm font-medium ${number === 1 ? 'text-yellow-600' : ''} w-24">
                <input type="number" min="1" max="99" value="${number}" 
                    onchange="updatePlayerNumber(${team}, ${number}, this.value)"
                    class="border px-2 py-1 w-12 rounded text-xs text-center">
                ${number === 1 ? ' (GK)' : ''}
            </td>
            <td class="py-1 px-2">
                <input type="text" value="${attrs.name}" 
                    onchange="updatePlayerAttribute(${team}, ${number}, 'name', this.value)"
                    class="border px-1 py-1 w-full rounded text-xs">
            </td>
            <td class="py-1 px-2">
                <input type="number" min="150" max="220" value="${attrs.height}" 
                    onchange="updatePlayerAttribute(${team}, ${number}, 'height', this.value)"
                    class="border px-1 py-1 w-12 rounded text-xs">
            </td>
            <td class="py-1 px-2">
                <input type="number" min="0" max="100" value="${attrs.heading}" 
                    onchange="updatePlayerAttribute(${team}, ${number}, 'heading', this.value)"
                    class="border px-1 py-1 w-12 rounded text-xs">
            </td>
            <td class="py-1 px-2">
                <input type="number" min="0" max="100" value="${attrs.jumping}" 
                    onchange="updatePlayerAttribute(${team}, ${number}, 'jumping', this.value)"
                    class="border px-1 py-1 w-12 rounded text-xs">
            </td>
            <td class="py-1 px-2">
                <input type="number" min="0" max="100" value="${attrs.strength}" 
                    onchange="updatePlayerAttribute(${team}, ${number}, 'strength', this.value)"
                    class="border px-1 py-1 w-12 rounded text-xs">
            </td>
        `;
        
        table.appendChild(row);
    });
}

function updatePlayerAttribute(team, playerNumber, attribute, value) {
    // Initialize player data if it doesn't exist
    if (!playerAttributes[`team${team}`][playerNumber]) {
        playerAttributes[`team${team}`][playerNumber] = {};
    }
    
    // Update the attribute
    playerAttributes[`team${team}`][playerNumber][attribute] = value;
}

function updatePlayerNumber(team, oldNumber, newNumber) {
    // Find the player element
    const players = document.querySelectorAll(`.player.team${team}, .player.goalie${team}`);
    const player = Array.from(players).find(p => parseInt(p.textContent) === oldNumber);
    
    if (player) {
        // Update the player number
        player.textContent = newNumber;
        
        // Move the attributes to the new number
        if (playerAttributes[`team${team}`][oldNumber]) {
            playerAttributes[`team${team}`][newNumber] = playerAttributes[`team${team}`][oldNumber];
            delete playerAttributes[`team${team}`][oldNumber];
        }
        
        // Update the attributes table
        generatePlayerAttributesTables();
    }
}

function clearPlayers() {
    const players = document.querySelectorAll('.player');
    players.forEach(player => player.remove());
    team1Count = 0;
    team2Count = 0;
}

function initializeTeams() {
    // Liverpool (Team 1) - Blue
    playerAttributes.team1 = {
        1: { name: "Alisson", height: 193, heading: 85, jumping: 88, strength: 82 },
        66: { name: "Alexander-Arnold", height: 180, heading: 72, jumping: 78, strength: 75 },
        4: { name: "Van Dijk", height: 193, heading: 92, jumping: 90, strength: 93 },
        5: { name: "Konaté", height: 194, heading: 85, jumping: 87, strength: 86 },
        26: { name: "Robertson", height: 178, heading: 75, jumping: 80, strength: 76 },
        6: { name: "Thiago", height: 174, heading: 65, jumping: 72, strength: 68 },
        11: { name: "Salah", height: 175, heading: 78, jumping: 83, strength: 76 },
        8: { name: "Szoboszlai", height: 186, heading: 78, jumping: 82, strength: 79 },
        9: { name: "Núñez", height: 187, heading: 86, jumping: 88, strength: 84 },
        10: { name: "Mac Allister", height: 176, heading: 70, jumping: 75, strength: 72 },
        7: { name: "Díaz", height: 178, heading: 73, jumping: 85, strength: 71 }
    };

    // Arsenal (Team 2) - Red
    playerAttributes.team2 = {
        22: { name: "Raya", height: 183, heading: 75, jumping: 82, strength: 75 },
        4: { name: "White", height: 186, heading: 78, jumping: 80, strength: 78 },
        2: { name: "Saliba", height: 192, heading: 85, jumping: 84, strength: 85 },
        6: { name: "Gabriel", height: 190, heading: 86, jumping: 85, strength: 87 },
        35: { name: "Zinchenko", height: 175, heading: 70, jumping: 75, strength: 72 },
        41: { name: "Rice", height: 185, heading: 83, jumping: 85, strength: 86 },
        7: { name: "Saka", height: 178, heading: 72, jumping: 80, strength: 74 },
        8: { name: "Ødegaard", height: 178, heading: 68, jumping: 75, strength: 70 },
        9: { name: "Jesus", height: 175, heading: 80, jumping: 85, strength: 78 },
        29: { name: "Havertz", height: 189, heading: 84, jumping: 83, strength: 82 },
        11: { name: "Martinelli", height: 176, heading: 75, jumping: 84, strength: 73 }
    };

    // Update the attributes tables
    generatePlayerAttributesTables();
    
    // Force a refresh of the current team's table
    switchTeamTab(currentTeam);
}

function setupCornerKick() {
    clearPlayers();
    
    // Add attacking team players (Team 1 - Liverpool)
    // Goalie
    addPlayerWithNumber(1, true, 1, 50, 300);
    
    // Players around the middle of the field
    addPlayerWithNumber(1, false, 66, 350, 250);  // TAA
    addPlayerWithNumber(1, false, 4, 400, 400);   // Van Dijk
    
    // Players slightly in front
    addPlayerWithNumber(1, false, 5, 480, 220);   // Konaté
    addPlayerWithNumber(1, false, 26, 500, 350);  // Robertson
    
    // Players in the box
    addPlayerWithNumber(1, false, 6, 650, 200);   // Thiago
    addPlayerWithNumber(1, false, 11, 680, 280);  // Salah
    addPlayerWithNumber(1, false, 8, 700, 360);   // Szoboszlai
    addPlayerWithNumber(1, false, 9, 630, 320);   // Núñez
    addPlayerWithNumber(1, false, 10, 600, 250);  // Mac Allister
    
    // Corner kick taker
    addPlayerWithNumber(1, false, 7, 780, 0);     // Díaz
    
    // Add defending team players (Team 2 - Arsenal)
    // Goalkeeper
    addPlayerWithNumber(2, true, 22, 765, 300);   // Raya
    
    // Defenders in position
    addPlayerWithNumber(2, false, 4, 750, 250);   // White
    addPlayerWithNumber(2, false, 2, 750, 350);   // Saliba
    addPlayerWithNumber(2, false, 6, 720, 220);   // Gabriel
    addPlayerWithNumber(2, false, 35, 720, 380);  // Zinchenko
    
    // More defenders in the box
    addPlayerWithNumber(2, false, 41, 700, 250);  // Rice
    addPlayerWithNumber(2, false, 7, 700, 350);   // Saka
    addPlayerWithNumber(2, false, 8, 650, 300);   // Ødegaard
    
    // Midfielders helping on defense
    addPlayerWithNumber(2, false, 9, 600, 200);   // Jesus
    addPlayerWithNumber(2, false, 29, 600, 400);  // Havertz
    
    // Forward staying up for counter
    addPlayerWithNumber(2, false, 11, 500, 300);  // Martinelli
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        // Bring to front
        element.style.zIndex = "100";
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        const newTop = element.offsetTop - pos2;
        const newLeft = element.offsetLeft - pos1;
        
        // Keep player within pitch bounds
        const pitch = document.querySelector('.pitch-container');
        const maxX = pitch.offsetWidth - element.offsetWidth;
        const maxY = pitch.offsetHeight - element.offsetHeight;
        
        element.style.top = Math.min(Math.max(0, newTop), maxY) + "px";
        element.style.left = Math.min(Math.max(0, newLeft), maxX) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        // Reset z-index
        element.style.zIndex = "10";
    }
}

function addPlayer(team, isGoalie) {
    const player = document.createElement('div');
    player.className = isGoalie ? `player goalie${team}` : `player team${team}`;
    player.textContent = team === 1 ? ++team1Count : ++team2Count;
    
    // Set initial position
    if (isGoalie) {
        player.style.left = team === 1 ? '350px' : '750px';
        player.style.top = '300px';
    } else {
        player.style.left = team === 1 ? '100px' : '600px';
        player.style.top = '300px';
    }
    
    makeDraggable(player);
    document.querySelector('.pitch').appendChild(player);
    
    return player;
}

function addPlayerWithNumber(team, isGoalie, number, left, top) {
    const player = document.createElement('div');
    player.className = isGoalie ? `player goalie${team}` : `player team${team}`;
    player.textContent = number;
    
    player.style.left = left + 'px';
    player.style.top = top + 'px';
    
    // Update team count to match highest number
    if (team === 1 && number > team1Count) team1Count = number;
    if (team === 2 && number > team2Count) team2Count = number;
    
    makeDraggable(player);
    document.querySelector('.pitch').appendChild(player);
    
    return player;
}

async function analyzeSetup() {
    // Create the analysis modal
    const modal = document.createElement('div');
    modal.className = 'analysis-modal';
    modal.innerHTML = `
        <div class="analysis-content">
            <div class="analysis-loading">
                <div class="spinner"></div>
                <p>Analyzing corner kick setup...</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    try {
        // Get all players and their positions
        const players = document.querySelectorAll('.player');
        const playerData = Array.from(players).map(player => {
            const rect = player.getBoundingClientRect();
            const pitch = document.querySelector('.pitch').getBoundingClientRect();
            const team = player.classList.contains('team1') || player.classList.contains('goalie1') ? 1 : 2;
            const number = parseInt(player.textContent);
            const attributes = playerAttributes[`team${team}`][number] || {};
            
            return {
                team,
                number,
                name: attributes.name || `Player ${number}`,
                attributes: {
                    height: attributes.height || '',
                    heading: attributes.heading || '',
                    jumping: attributes.jumping || '',
                    strength: attributes.strength || ''
                },
                position: {
                    x: ((rect.left + rect.width/2) - pitch.left) / pitch.width * 100,
                    y: ((rect.top + rect.height/2) - pitch.top) / pitch.height * 100
                }
            };
        });

        // Prepare the prompt
        const prompt = `Analyze this corner kick setup and provide tactical insights. Here's the data:

Team 1 (Liverpool, Blue) is attacking, Team 2 (Arsenal, Red) is defending.
${JSON.stringify(playerData, null, 2)}

Please analyze:
1. The positioning of attacking players
2. The defensive setup
3. Key matchups based on player attributes (height, heading, jumping, strength)
4. Potential threats and opportunities
5. Suggested improvements for both teams

Format your response in markdown.`;

        // Send the analysis request to our Netlify function
        const response = await fetch('/.netlify/functions/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error('Analysis request failed');
        }

        const data = await response.json();
        
        // Update the modal with the analysis
        const content = modal.querySelector('.analysis-content');
        content.innerHTML = `
            <button class="close-button" onclick="this.closest('.analysis-modal').remove()">Close</button>
            <div class="analysis-text">${marked.parse(data.analysis)}</div>
        `;

    } catch (error) {
        console.error('Analysis error:', error);
        const content = modal.querySelector('.analysis-content');
        content.innerHTML = `
            <button class="close-button" onclick="this.closest('.analysis-modal').remove()">Close</button>
            <div class="analysis-text">
                <h2>Error</h2>
                <p>Sorry, there was an error analyzing the setup. Please try again later.</p>
            </div>
        `;
    }
} 