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
    // Team 1 (Blue)
    playerAttributes.team1 = {
        1: { name: "Kristján Sigurðsson", height: 188, heading: 75, jumping: 78, strength: 76 },
        2: { name: "Bjarni Ólafsson", height: 182, heading: 68, jumping: 72, strength: 70 },
        4: { name: "Gunnar Magnússon", height: 190, heading: 82, jumping: 80, strength: 84 },
        5: { name: "Einar Jónsson", height: 188, heading: 78, jumping: 77, strength: 79 },
        6: { name: "Arnar Þórsson", height: 176, heading: 65, jumping: 74, strength: 68 },
        7: { name: "Daði Bergsson", height: 175, heading: 64, jumping: 76, strength: 66 },
        8: { name: "Stefán Árnason", height: 183, heading: 72, jumping: 75, strength: 73 },
        9: { name: "Óskar Halldórsson", height: 185, heading: 76, jumping: 78, strength: 77 },
        10: { name: "Þórður Guðmundsson", height: 178, heading: 68, jumping: 73, strength: 69 },
        11: { name: "Viktor Karlsson", height: 180, heading: 70, jumping: 75, strength: 71 },
        14: { name: "Baldur Björnsson", height: 181, heading: 71, jumping: 74, strength: 72 }
    };

    // Team 2 (Red)
    playerAttributes.team2 = {
        1: { name: "Pétur Guðjónsson", height: 186, heading: 74, jumping: 76, strength: 75 },
        3: { name: "Helgi Sveinsson", height: 184, heading: 73, jumping: 75, strength: 74 },
        4: { name: "Jóhann Einarsson", height: 189, heading: 80, jumping: 78, strength: 82 },
        5: { name: "Sigurður Kristjánsson", height: 187, heading: 77, jumping: 76, strength: 78 },
        6: { name: "Aron Þorsteinsson", height: 177, heading: 66, jumping: 73, strength: 69 },
        7: { name: "Kári Atlason", height: 174, heading: 63, jumping: 75, strength: 65 },
        8: { name: "Brynjar Gunnarsson", height: 182, heading: 71, jumping: 74, strength: 72 },
        9: { name: "Andri Marinósson", height: 184, heading: 75, jumping: 77, strength: 76 },
        10: { name: "Haukur Ingimarsson", height: 179, heading: 69, jumping: 72, strength: 70 },
        11: { name: "Dagur Hilmarsson", height: 178, heading: 67, jumping: 74, strength: 68 },
        15: { name: "Róbert Sigurðarson", height: 180, heading: 70, jumping: 73, strength: 71 }
    };

    // Update the attributes tables
    generatePlayerAttributesTables();
    
    // Force a refresh of the current team's table
    switchTeamTab(currentTeam);
}

function setupCornerKick() {
    clearPlayers();
    
    // Add attacking team players (Team 1 - Blue)
    // Goalie
    addPlayerWithNumber(1, true, 1, 50, 300);
    
    // Players around the middle of the field
    addPlayerWithNumber(1, false, 2, 350, 250);
    addPlayerWithNumber(1, false, 4, 400, 400);
    
    // Players slightly in front
    addPlayerWithNumber(1, false, 5, 480, 220);
    addPlayerWithNumber(1, false, 6, 500, 350);
    
    // Players in the box
    addPlayerWithNumber(1, false, 7, 650, 200);
    addPlayerWithNumber(1, false, 8, 680, 280);
    addPlayerWithNumber(1, false, 9, 700, 360);
    addPlayerWithNumber(1, false, 10, 630, 320);
    addPlayerWithNumber(1, false, 11, 600, 250);
    
    // Corner kick taker
    addPlayerWithNumber(1, false, 14, 780, 0);
    
    // Add defending team players (Team 2 - Red)
    // Goalkeeper
    addPlayerWithNumber(2, true, 1, 765, 300);
    
    // Defenders in position
    addPlayerWithNumber(2, false, 3, 750, 250);
    addPlayerWithNumber(2, false, 4, 750, 350);
    addPlayerWithNumber(2, false, 5, 720, 220);
    addPlayerWithNumber(2, false, 6, 720, 380);
    
    // More defenders in the box
    addPlayerWithNumber(2, false, 7, 700, 250);
    addPlayerWithNumber(2, false, 8, 700, 350);
    addPlayerWithNumber(2, false, 9, 650, 300);
    
    // Midfielders helping on defense
    addPlayerWithNumber(2, false, 10, 600, 200);
    addPlayerWithNumber(2, false, 11, 600, 400);
    
    // Forward staying up for counter
    addPlayerWithNumber(2, false, 15, 500, 300);
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

Team 1 (Blue) is attacking, Team 2 (Red) is defending.
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
            <div class="analysis-text">${marked.parse(data.completion || data.analysis)}</div>
        `;

    } catch (error) {
        console.error('Analysis error:', error);
        const content = modal.querySelector('.analysis-content');
        content.innerHTML = `
            <button class="close-button" onclick="this.closest('.analysis-modal').remove()">Close</button>
            <div class="analysis-text">
                <h2>Error</h2>
                <p>Sorry, there was an error analyzing the setup. Please try again later.</p>
                <p class="text-sm text-gray-600">${error.message}</p>
            </div>
        `;
    }
} 