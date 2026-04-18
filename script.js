// ======================== TEAM BATTLE - 3 ATTACKS, 3 OPPONENTS ========================
// You choose 3 Pokémon, fight 3 enemies. Switch Pokémon, type advantages.
// No heal - only three unique attacks per Pokémon.
// After defeating all 3 enemies, shows victory message.

const allPokemon = {
    groudon: { name: "Groudon", type: "Ground", maxHp: 115, color: "#b87c3a", initial: "G", img: "images/groudon.png",
        attacks: { a1: { name: "Precipice Blades", dmg: [14,22] }, a2: { name: "Lava Plume", dmg: [18,27] }, a3: { name: "Earth Power", dmg: [20,30] } } },
    landorus: { name: "Landorus", type: "Ground", maxHp: 110, color: "#b87c3a", initial: "L", img: "images/landorus.png",
        attacks: { a1: { name: "Sandsear Storm", dmg: [13,21] }, a2: { name: "Earthquake", dmg: [16,25] }, a3: { name: "Focus Blast", dmg: [19,29] } } },
    garchomp: { name: "Garchomp", type: "Ground", maxHp: 112, color: "#b87c3a", initial: "C", img: "images/garchomp.png",
        attacks: { a1: { name: "Dragon Claw", dmg: [12,20] }, a2: { name: "Dig", dmg: [14,23] }, a3: { name: "Outrage", dmg: [21,31] } } },
    kyogre: { name: "Kyogre", type: "Water", maxHp: 115, color: "#3a7cb8", initial: "K", img: "images/kyogre.png",
        attacks: { a1: { name: "Origin Pulse", dmg: [15,24] }, a2: { name: "Water Spout", dmg: [18,27] }, a3: { name: "Ice Beam", dmg: [20,29] } } },
    palkia: { name: "Palkia", type: "Water", maxHp: 110, color: "#3a7cb8", initial: "P", img: "images/palkia.png",
        attacks: { a1: { name: "Spacial Rend", dmg: [14,22] }, a2: { name: "Aqua Tail", dmg: [16,25] }, a3: { name: "Hydro Pump", dmg: [21,30] } } },
    greninja: { name: "Greninja", type: "Water", maxHp: 105, color: "#3a7cb8", initial: "G", img: "images/greninja.png",
        attacks: { a1: { name: "Water Shuriken", dmg: [12,19] }, a2: { name: "Night Slash", dmg: [14,23] }, a3: { name: "Hydro Cannon", dmg: [22,32] } } },
    charizard: { name: "Charizard", type: "Fire", maxHp: 110, color: "#e05a2a", initial: "C", img: "images/charizard.png",
        attacks: { a1: { name: "Flamethrower", dmg: [13,21] }, a2: { name: "Dragon Breath", dmg: [15,24] }, a3: { name: "Blast Burn", dmg: [22,32] } } },
    moltres: { name: "Moltres", type: "Fire", maxHp: 112, color: "#e05a2a", initial: "M", img: "images/moltres.png",
        attacks: { a1: { name: "Sky Attack", dmg: [14,22] }, a2: { name: "Heat Wave", dmg: [16,25] }, a3: { name: "Overheat", dmg: [23,33] } } },
    blaziken: { name: "Blaziken", type: "Fire", maxHp: 110, color: "#e05a2a", initial: "B", img: "images/blaziken.png",
        attacks: { a1: { name: "Blaze Kick", dmg: [13,21] }, a2: { name: "Flare Blitz", dmg: [17,26] }, a3: { name: "Focus Energy", dmg: [20,30] } } }
};

// 3 Opponents only
const opponentsList = [
    { name: "Mewtwo", type: "Psychic", maxHp: 115, initial: "M", color: "#9b59b6", img: "images/mewtwo.png",
        attacks: { a1: [12,20], a2: [15,25], a3: [18,28] } },
    { name: "Rayquaza", type: "Dragon", maxHp: 120, initial: "R", color: "#2ecc71", img: "images/rayquaza.png",
        attacks: { a1: [14,22], a2: [17,27], a3: [20,30] } },
    { name: "Lugia", type: "Flying", maxHp: 118, initial: "L", color: "#3498db", img: "images/lugia.png",
        attacks: { a1: [11,19], a2: [14,23], a3: [17,26] } }
];

const DODGE_CHANCE = 0.15;

function getTypeMultiplier(attackType, defenderType) {
    if (attackType === "Water" && defenderType === "Fire") return 1.5;
    if (attackType === "Fire" && defenderType === "Ground") return 1.5;
    if (attackType === "Ground" && defenderType === "Water") return 1.5;
    if (attackType === "Fire" && defenderType === "Water") return 0.75;
    if (attackType === "Ground" && defenderType === "Fire") return 0.75;
    if (attackType === "Water" && defenderType === "Ground") return 0.75;
    return 1.0;
}

let gameActive = false;
let playerTeam = [];
let activeIndex = 0;
let enemiesRemaining = [];
let currentEnemy = null;
let waitingAction = false;

// DOM elements
const teamSelectionDiv = document.getElementById("teamSelection");
const battleDiv = document.getElementById("battleArena");
const teamGrid = document.getElementById("teamGrid");
const teamListDiv = document.getElementById("teamList");
const startBtn = document.getElementById("startBattleBtn");
const enemiesDefeatedSpan = document.getElementById("enemiesDefeated");
const activeNameSpan = document.getElementById("activeName");
const playerNameSpan = document.getElementById("playerName");
const playerHpText = document.getElementById("playerHpText");
const playerHpFill = document.getElementById("playerHpFill");
const playerImg = document.getElementById("playerImg");
const playerFallback = document.getElementById("playerFallback");
const opponentNameSpan = document.getElementById("opponentName");
const opponentHpText = document.getElementById("opponentHpText");
const opponentHpFill = document.getElementById("opponentHpFill");
const opponentImg = document.getElementById("opponentImg");
const opponentFallback = document.getElementById("opponentFallback");
const teamStatusDiv = document.getElementById("teamStatus");
const battleLogDiv = document.getElementById("battleLog");
const attack1Btn = document.getElementById("attack1Btn");
const attack2Btn = document.getElementById("attack2Btn");
const attack3Btn = document.getElementById("attack3Btn");
const resetBtn = document.getElementById("resetGameBtn");

function addLog(msg, isError = false) {
    const entry = document.createElement("div");
    entry.textContent = msg;
    entry.style.borderLeft = `3px solid ${isError ? "#d9534f" : "#6c8f4a"}`;
    entry.style.paddingLeft = "8px";
    entry.style.margin = "6px 0";
    entry.style.color = isError ? "#ffaaaa" : "#aaffaa";
    battleLogDiv.appendChild(entry);
    entry.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearLog() {
    battleLogDiv.innerHTML = '<div>Battle log ready.</div>';
}

function setPokemonImage(imgElement, fallbackElement, pokemon) {
    if (!pokemon) return;
    imgElement.src = pokemon.img;
    imgElement.onload = () => {
        imgElement.style.display = "block";
        fallbackElement.style.display = "none";
    };
    imgElement.onerror = () => {
        imgElement.style.display = "none";
        fallbackElement.style.display = "flex";
        fallbackElement.textContent = pokemon.initial;
        fallbackElement.style.background = pokemon.color;
    };
    if (imgElement.complete) {
        if (imgElement.naturalWidth === 0) imgElement.onerror();
        else imgElement.onload();
    }
}

function updateUI() {
    if (!gameActive) return;
    const active = playerTeam[activeIndex];
    if (active && !active.isFainted) {
        const percent = (active.hp / active.maxHp) * 100;
        playerHpFill.style.width = `${percent}%`;
        playerHpText.textContent = `${Math.max(0, active.hp)}/${active.maxHp}`;
        playerNameSpan.textContent = active.name;
        setPokemonImage(playerImg, playerFallback, active);
        activeNameSpan.textContent = active.name;
    } else if (active && active.isFainted) {
        playerNameSpan.textContent = active.name + " (FAINTED)";
        playerHpFill.style.width = "0%";
        playerHpText.textContent = `0/${active.maxHp}`;
    }
    if (currentEnemy) {
        const percent = (currentEnemy.hp / currentEnemy.maxHp) * 100;
        opponentHpFill.style.width = `${percent}%`;
        opponentHpText.textContent = `${Math.max(0, currentEnemy.hp)}/${currentEnemy.maxHp}`;
        opponentNameSpan.textContent = currentEnemy.name;
        setPokemonImage(opponentImg, opponentFallback, currentEnemy);
    }
    // Team status
    teamStatusDiv.innerHTML = "";
    playerTeam.forEach((poke, idx) => {
        const percent = (poke.hp / poke.maxHp) * 100;
        const statusDiv = document.createElement("div");
        statusDiv.className = "team-pokemon";
        statusDiv.innerHTML = `
            <span style="font-weight:bold; min-width:80px">${poke.name}</span>
            <div class="small-hp"><div class="small-fill" style="width:${percent}%; background:${poke.hp <= 0 ? "#aa3333" : "#88ff88"}"></div></div>
            <span>${Math.max(0, poke.hp)}/${poke.maxHp}</span>
            <button ${idx === activeIndex ? "disabled" : ""} data-switch="${idx}">SWITCH</button>
        `;
        if (poke.isFainted) statusDiv.style.opacity = "0.5";
        teamStatusDiv.appendChild(statusDiv);
    });
    document.querySelectorAll("[data-switch]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(btn.getAttribute("data-switch"));
            switchPokemon(idx);
        });
    });
    updateAttackButtons();
}

function updateAttackButtons() {
    const active = playerTeam[activeIndex];
    if (active && active.attacks && !active.isFainted) {
        attack1Btn.textContent = active.attacks.a1.name.toUpperCase();
        attack2Btn.textContent = active.attacks.a2.name.toUpperCase();
        attack3Btn.textContent = active.attacks.a3.name.toUpperCase();
        attack1Btn.disabled = false;
        attack2Btn.disabled = false;
        attack3Btn.disabled = false;
    } else {
        attack1Btn.disabled = true;
        attack2Btn.disabled = true;
        attack3Btn.disabled = true;
    }
}

function switchPokemon(idx) {
    if (!gameActive || waitingAction) return;
    if (idx === activeIndex) return;
    const target = playerTeam[idx];
    if (target.isFainted) {
        addLog(`${target.name} is fainted and cannot battle!`, true);
        return;
    }
    activeIndex = idx;
    addLog(`You switch to ${playerTeam[activeIndex].name}.`);
    updateUI();
}

function checkTeamFainted() {
    const allFainted = playerTeam.every(p => p.isFainted);
    if (allFainted) {
        addLog(`All your Pokemon have fainted! YOU LOSE!`, true);
        fullReset();
        return true;
    }
    return false;
}

function checkActiveFainted() {
    const active = playerTeam[activeIndex];
    if (active.hp <= 0) {
        active.hp = 0;
        active.isFainted = true;
        addLog(`${active.name} fainted!`, true);
        updateUI();
        let nextIndex = -1;
        for (let i = 0; i < playerTeam.length; i++) {
            if (!playerTeam[i].isFainted) { nextIndex = i; break; }
        }
        if (nextIndex === -1) {
            checkTeamFainted();
        } else {
            activeIndex = nextIndex;
            addLog(`You send out ${playerTeam[activeIndex].name}.`);
            updateUI();
        }
        return true;
    }
    return false;
}

function enemyTurn() {
    if (!gameActive || !currentEnemy || currentEnemy.hp <= 0) return;
    const r = Math.floor(Math.random() * 3) + 1; // 1-3 for three attacks
    const dmgRange = currentEnemy.attacks[`a${r}`];
    let rawDamage = Math.floor(Math.random() * (dmgRange[1] - dmgRange[0] + 1) + dmgRange[0]);
    if (Math.random() < DODGE_CHANCE) {
        addLog(`${currentEnemy.name} attacks, but your ${playerTeam[activeIndex].name} dodged!`);
        return;
    }
    const active = playerTeam[activeIndex];
    const finalDamage = Math.min(rawDamage, active.hp);
    active.hp = Math.max(0, active.hp - finalDamage);
    updateUI();
    addLog(`${currentEnemy.name} deals ${finalDamage} damage to ${active.name}! ${active.name} HP: ${active.hp}/${active.maxHp}`);
    if (checkActiveFainted()) {
        if (checkTeamFainted()) return;
        waitingAction = false;
        return;
    }
}

function showVictoryScreen() {
    gameActive = false;
    disableActionButtons(true);
    addLog(`═══════════════════════════════════════`);
    addLog(`YOU WON! YOU ARE NOW THE POKEMON CHALLENGER!`);
    addLog(`Congratulations! Click RESTART GAME to play again.`);
    addLog(`═══════════════════════════════════════`);
    const victoryDiv = document.createElement("div");
    victoryDiv.style.textAlign = "center";
    victoryDiv.style.margin = "10px 0";
    victoryDiv.style.padding = "15px";
    victoryDiv.style.background = "#2a5a4a";
    victoryDiv.style.border = "2px solid #88ffaa";
    victoryDiv.style.borderRadius = "2px";
    victoryDiv.style.color = "#ffffff";
    victoryDiv.style.fontWeight = "bold";
    victoryDiv.style.fontSize = "1.2rem";
    victoryDiv.innerHTML = "🏆 YOU WON! YOU ARE NOW THE POKEMON CHALLENGER! 🏆";
    battleLogDiv.appendChild(victoryDiv);
}

function playerAction(attackNumber) {
    if (!gameActive || waitingAction) return;
    const active = playerTeam[activeIndex];
    if (active.isFainted) {
        addLog(`${active.name} is fainted! Switch to another Pokemon first.`, true);
        return;
    }
    waitingAction = true;

    const attackKey = `a${attackNumber}`;
    const attack = active.attacks[attackKey];
    let rawDamage = Math.floor(Math.random() * (attack.dmg[1] - attack.dmg[0] + 1) + attack.dmg[0]);
    const multiplier = getTypeMultiplier(active.type, currentEnemy.type);
    let finalDamage = Math.floor(rawDamage * multiplier);
    if (multiplier > 1) addLog(`It's super effective!`);
    if (multiplier < 1) addLog(`It's not very effective...`);
    if (Math.random() < DODGE_CHANCE) {
        addLog(`${currentEnemy.name} dodged your ${attack.name}!`);
    } else {
        finalDamage = Math.min(finalDamage, currentEnemy.hp);
        currentEnemy.hp = Math.max(0, currentEnemy.hp - finalDamage);
        updateUI();
        addLog(`${active.name} uses ${attack.name} and deals ${finalDamage} damage to ${currentEnemy.name}.`);
    }

    if (currentEnemy.hp <= 0) {
        addLog(`You defeated ${currentEnemy.name}!`);
        enemiesRemaining.shift();
        const defeatedCount = 3 - enemiesRemaining.length;
        enemiesDefeatedSpan.textContent = `${defeatedCount} / 3`;
        if (enemiesRemaining.length === 0) {
            showVictoryScreen();
            waitingAction = false;
            return;
        } else {
            currentEnemy = { ...enemiesRemaining[0] };
            currentEnemy.hp = currentEnemy.maxHp;
            updateUI();
            addLog(`A new enemy appears: ${currentEnemy.name}!`);
            waitingAction = false;
            return;
        }
    }

    enemyTurn();
    if (!gameActive) return;
    waitingAction = false;
}

function disableActionButtons(disabled) {
    attack1Btn.disabled = disabled;
    attack2Btn.disabled = disabled;
    attack3Btn.disabled = disabled;
}

function startBattle() {
    if (playerTeam.length !== 3) return;
    gameActive = true;
    activeIndex = 0;
    playerTeam.forEach(p => {
        p.hp = p.maxHp;
        p.isFainted = false;
    });
    enemiesRemaining = opponentsList.map(e => ({ ...e, hp: e.maxHp }));
    currentEnemy = { ...enemiesRemaining[0] };
    currentEnemy.hp = currentEnemy.maxHp;
    enemiesDefeatedSpan.textContent = `0 / 3`;
    teamSelectionDiv.style.display = "none";
    battleDiv.style.display = "flex";
    clearLog();
    addLog(`Battle starts! Your team: ${playerTeam.map(p=>p.name).join(", ")}`);
    addLog(`First enemy: ${currentEnemy.name}`);
    addLog(`You can switch Pokemon using the buttons below.`);
    updateUI();
    disableActionButtons(false);
}

function fullReset() {
    gameActive = false;
    playerTeam = [];
    activeIndex = 0;
    enemiesRemaining = [];
    currentEnemy = null;
    teamSelectionDiv.style.display = "block";
    battleDiv.style.display = "none";
    renderTeamSelection();
    clearLog();
    addLog("Game restarted. Choose 3 Pokemon.");
}

let selectedIds = [];

function renderTeamSelection() {
    teamGrid.innerHTML = "";
    for (const [id, data] of Object.entries(allPokemon)) {
        const card = document.createElement("div");
        card.className = "poke-card";
        if (selectedIds.includes(id)) card.classList.add("selected");
        card.innerHTML = `
            <img src="${data.img}" alt="${data.name}" onerror="this.style.display='none'; this.nextSibling.style.display='flex';">
            <div class="poke-icon" style="display: none; background:${data.color};">${data.initial}</div>
            <div>${data.name}</div>
            <div style="font-size:0.7rem">${data.type}</div>
        `;
        const img = card.querySelector("img");
        const fallbackIcon = card.querySelector(".poke-icon");
        img.onerror = () => {
            img.style.display = "none";
            fallbackIcon.style.display = "flex";
        };
        if (img.complete && img.naturalWidth === 0) img.onerror();
        card.onclick = () => toggleSelect(id);
        teamGrid.appendChild(card);
    }
    teamListDiv.innerHTML = "";
    selectedIds.forEach(id => {
        const data = allPokemon[id];
        const chip = document.createElement("div");
        chip.className = "team-member";
        chip.innerHTML = `<span>${data.name}</span> ✖`;
        chip.onclick = () => toggleSelect(id);
        teamListDiv.appendChild(chip);
    });
    startBtn.disabled = selectedIds.length !== 3;
}

function toggleSelect(id) {
    if (selectedIds.includes(id)) {
        selectedIds = selectedIds.filter(i => i !== id);
    } else if (selectedIds.length < 3) {
        selectedIds.push(id);
    } else {
        addLog("You can only select 3 Pokemon.", true);
        return;
    }
    renderTeamSelection();
    if (selectedIds.length === 3) {
        playerTeam = selectedIds.map(id => {
            const data = allPokemon[id];
            return {
                id, name: data.name, type: data.type, maxHp: data.maxHp, hp: data.maxHp,
                attacks: data.attacks, initial: data.initial, color: data.color, img: data.img,
                isFainted: false
            };
        });
    }
}

startBtn.onclick = startBattle;
resetBtn.onclick = fullReset;

attack1Btn.onclick = () => playerAction(1);
attack2Btn.onclick = () => playerAction(2);
attack3Btn.onclick = () => playerAction(3);

renderTeamSelection();
addLog("Choose 3 Pokemon to form your team.");
