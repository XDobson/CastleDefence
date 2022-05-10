// Enemy sprite object list
let sprites = [
    { name: "image/enemies/Slime_Pog.png", price: 1, hp: 6, reward: 1 },
    { name: "image/enemies/Snake_Bird.png", price: 2, hp: 8, reward: 1 },
    { name: "image/enemies/Ghost.png", price: 3, hp: 12, reward: 2 },
    { name: "image/enemies/Horse.png", price: 3, hp: 15, reward: 3 },
    { name: "image/enemies/Knight.png", price: 4, hp: 20, reward: 4 },
    { name: "image/enemies/Knight_Shield.png", price: 5, hp: 24, reward: 4 },
    { name: "image/enemies/Knight_Sword.png", price: 5, hp: 28, reward: 5 },
    { name: "image/enemies/Knight_Gold.png", price: 10, hp: 35, reward: 8 },]

// Grimlock says:
let splashText = [
    // real tips
    "New enemies will show up as waves progress",
    "Click them faster to not die.",
    "A mouse would be better for this.",
    "You can buy archers to shoot for you in the shop.",
    "Upgrading archers is more helpful when you have many of them.",
    "Bow upgrades get more expensive as you level up your bow.",
    "You only deal damage when clicking on the field or an enemy!",
    "Archers will forever deal damage at exact intervals based on when you bought them.",
    "Getting gold multiplier early ensures great success!",
    "Enemies only damage you once when they hit you, but you cant continue attacking until the oldest enemies are gone!",
    "Power-ups spawn about every 30 seconds, but it can vary!",
    "Bow upgrades upgrades the Archers and Power-ups too!",
    "Dont tell anyone, but.. If you click on the sun, it starts the next wave!",
    // everything else
    "Yeah just put what im saying right now as the Splash Text",
    "Spider egg cereal, yum.",
    "Is cereal a soup?",
    "I'm hungry.",
    "All the enemy sprites were made by Dwight Dubert.",
    "Ping Pong Paddle!",
]

//Global variable 
window.waveNumber = 0           //counts waves
window.enemyModifier = 1.1      //helps enemies spawn
window.enemyBalance = 0         //how many enemies can spawn
window.bowLevel = 1             //bow dmg modifier
window.bowLevelDisplay = 1      //bow display level
window.bowUpgradePrice = 15     //bow upgrade price at current level
window.playerGold = 0           //player gold
window.castleHp = 100           //castle hp
window.castleHealPrice = 20     //How much it costs to heal castle
window.isDead = true            //have you died?
window.archers = 0              //number of archers
window.archerUpgrade = 0        //how much faster do archers shoot / archer level
window.archerUpgradeLevel = 0   //How many times archers have been upgraded
window.archerUpgradePrice = 0   //Cost to upgrade archers again
window.archerUpgradeScaling = 0 //after lvl5, archer upgrades get worse
window.potato = 0               //controls the timer
window.intermission = true      //can power-ups spawn?
window.goldModifier = 1         //controls how much extra gold you get

// Stolen from StackOverflow, prevents space-bar from scrolling the screen down
window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
});

// Cloud Animation
setInterval(() => {
    document.getElementById("cloud").style.top = (Math.floor(Math.random() * 50) + 1) + "%"
}, 60000);

// Puts game in motion and removes starting screen
function removeStartingScreen() {
    window.intermission = false
    document.getElementById("startingScreen").style.visibility = "hidden"
    document.getElementById('playerGold').innerText = "Gold: " + window.playerGold
    document.getElementsByTagName("input")[0].style.visibility = "hidden"
    document.getElementById("waveCheatButton").style.visibility = "hidden"
    window.isDead = false
    nextWave()
}

// Restarts the game on a loss
function removeLoseScreen() {
    // Defaults all vars
    window.waveNumber = 0           
    window.enemyModifier = 1.1      
    window.enemyBalance = 0         
    window.bowLevel = 1             
    window.bowLevelDisplay = 1      
    window.bowUpgradePrice = 15     
    window.playerGold = 0        
    window.castleHp = 100           
    window.castleHealPrice = 20     
    window.isDead = false       //Only var that changes from default
    window.archers = 0              
    window.archerUpgrade = 0        
    window.archerUpgradeLevel = 0   
    window.archerUpgradePrice = 0   
    window.archerUpgradeScaling = 0 
    window.potato = 0               
    window.intermission = true      
    window.goldModifier = 1   
    //Resets all visuals      
    document.getElementById("loseScreen").style.visibility = "hidden"
    document.getElementById("Hp").style.width = "100%"
    document.getElementById('playerGold').innerText = "Gold: " + window.playerGold
    document.getElementById("bowButton").innerText = "Price: 15"
    document.getElementById("bowLevel").innerText = "Level: 1"
    document.getElementById("goldLevel").innerText = "Level: 1"
    document.getElementById("goldUpgradeButton").innerText = "Price: 20"
    document.getElementById("archerUpgradeTitle").innerText = "LOCKED"
    document.getElementById("archerUpLevel").innerText = "Level: LOCKED"
    document.getElementById("archerUpgradeButton").innerText = "XXX"
    document.getElementById("hireArchersButton").innerText = "Price: 20"
    document.getElementById("hiredArchers").innerText = "Archers: 0"
    document.getElementById("castleButton").innerText = "Price: "+window.castleHealPrice+"g"
    enemies = Array.from(document.getElementsByClassName("enemy"))
    for (item in enemies) {
        enemies[item].remove()
    }
    nextWave()
}

// Spawns an enemy, making a new element and giving it appropriate properties
function spawnEnemy(enemy) {
    let newEnemy = document.createElement("img")
    newEnemy.setAttribute("src", enemy)
    newEnemy.setAttribute("class", "enemy")
    newEnemy.setAttribute("onclick", "damageEnemy()")
    newEnemy.addEventListener("animationend", damageCheck);

    newEnemy.style.zIndex = "99"
    newEnemy.style.position = "absolute"
    newEnemy.style.width = "7.5%"
    newEnemy.style.visibility = "visible"
    newEnemy.style.bottom = (Math.floor(Math.random() * 50) + 1) + "%"
    document.body.appendChild(newEnemy)
}


// Makes game function
function nextWave() {
    window.waveNumber += 1
    document.getElementById("waveCounter").innerText = "Wave: " + window.waveNumber
    window.enemyBalance += Math.floor((window.waveNumber * window.enemyModifier) + 10)
    console.log("Enemy has " + window.enemyBalance + " points to buy troops.");
    window.enemyModifier += (window.enemyModifier - 1)
    spawnable = []

    // Spawn list contains everything that can be afforded
    for (item in sprites) {
        if (sprites[item].price <= window.enemyBalance) {
            spawnable.unshift(sprites[item].name)
        }
    }

    // Spawnlist removes monsters based on wave, so that it doesnt spawn hard enemies too early
    if (spawnable.includes("image/enemies/Snake_Bird.png") && window.waveNumber < 3) {
        index = spawnable.indexOf("image/enemies/Snake_Bird.png")
        spawnable.splice(index, 1)
    }
    if (spawnable.includes("image/enemies/Ghost.png") && window.waveNumber < 5) {
        index = spawnable.indexOf("image/enemies/Ghost.png")
        spawnable.splice(index, 1)
    }
    if (spawnable.includes("image/enemies/Horse.png") && window.waveNumber < 8) {
        index = spawnable.indexOf("image/enemies/Horse.png")
        spawnable.splice(index, 1)
    }
    if (spawnable.includes("image/enemies/Knight.png") && window.waveNumber < 10) {
        index = spawnable.indexOf("image/enemies/Knight.png")
        spawnable.splice(index, 1)
    }
    if (spawnable.includes("image/enemies/Knight_Shield.png") && window.waveNumber < 11) {
        index = spawnable.indexOf("image/enemies/Knight_Shield.png")
        spawnable.splice(index, 1)
    }
    if (spawnable.includes("image/enemies/Knight_Sword.png") && window.waveNumber < 12) {
        index = spawnable.indexOf("image/enemies/Knight_Sword.png")
        spawnable.splice(index, 1)
    }
    if (spawnable.includes("image/enemies/Knight_Gold.png") && window.waveNumber < 15) {
        index = spawnable.indexOf("image/enemies/Knight_Gold.png")
        spawnable.splice(index, 1)
    }
    handleEnemies()
}
function debug() {
    nextWave()
}
function handleEnemies() {
    // The following does this: Checks to make sure enemy has points left, tries a random enemy on the spawn list, either spawns them and takes that much money away from the balance or doesn't spawn them and tries again. Once it cant spawn any, it starts the next function
    if (window.enemyBalance > 0) {
        tryEnemy = Math.floor(Math.random() * spawnable.length)
        for (item in sprites) {
            if (sprites[item].name == spawnable[tryEnemy] && sprites[item].price <= window.enemyBalance) {
                spawnEnemy(sprites[item].name)
                window.enemyBalance -= sprites[item].price
                console.log("Enemy bought " + sprites[item].name.replace("image/enemies/", '').replace(".png", '') + " (Costs " + sprites[item].price + ")");
            }
        }
        speedUp = 30 * window.waveNumber
        if (speedUp > 3500) {
            speedUp = 3500
        }
        setTimeout(handleEnemies, Math.floor(Math.random() * 4500) - speedUp)
    } else {
        checkFinalDeath()
    }
}

// Waits for the final death of the wave to pull up the intermission screen
function checkFinalDeath() {
    loop = 1
    if (document.getElementsByClassName("enemy").length == 0) {
        loop = 0
        betweenWaves()
    }
    if (loop == 1 && window.isDead == false) { setTimeout(checkFinalDeath, 200) }
    console.log("Waiting for enemy to die");
}
// Intermission screen
function betweenWaves() {
    window.intermission = true
    document.getElementById("betweenWave").style.visibility = "visible"
    document.getElementById("splashText").innerText = splashText[Math.floor(Math.random() * splashText.length)]
}
// Starts the game loop back
function jumperCable() {
    window.intermission = false
    document.getElementById("betweenWave").style.visibility = "hidden"
    nextWave()
}

// Calculate enemy damage
function damageEnemy() {
    if (window.isDead == false) {
        closestEnemy = document.getElementsByClassName("enemy")[0]
        if (closestEnemy != undefined) {
            squish = getComputedStyle(closestEnemy).height
            squish = squish.replace('px', '')
            enemyInUse = null
            if (closestEnemy.attributes[0].value == "image/enemies/Slime_Pog.png") {
                damage = 85.125 / sprites[0].hp
                enemyInUse = sprites[0]
            }
            if (closestEnemy.attributes[0].value == "image/enemies/Snake_Bird.png") {
                damage = 85.125 / sprites[1].hp
                enemyInUse = sprites[1]
            }
            if (closestEnemy.attributes[0].value == "image/enemies/Ghost.png") {
                damage = 85.125 / sprites[2].hp
                enemyInUse = sprites[2]
            }
            if (closestEnemy.attributes[0].value == "image/enemies/Horse.png") {
                damage = 85.125 / sprites[3].hp
                enemyInUse = sprites[3]
            }
            if (closestEnemy.attributes[0].value == "image/enemies/Knight.png") {
                damage = 85.125 / sprites[4].hp
                enemyInUse = sprites[4]
            }
            if (closestEnemy.attributes[0].value == "image/enemies/Knight_Shield.png") {
                damage = 85.125 / sprites[5].hp
                enemyInUse = sprites[5]
            }
            if (closestEnemy.attributes[0].value == "image/enemies/Knight_Sword.png") {
                damage = 85.125 / sprites[6].hp
                enemyInUse = sprites[6]
            }
            if (closestEnemy.attributes[0].value == "image/enemies/Knight_Gold.png") {
                damage = 85.125 / sprites[7].hp
                enemyInUse = sprites[7]
            }
            squish -= (damage * window.bowLevel)
            if (squish <= 0) {
                squish = 0
                document.querySelector(".enemy").remove()
                changeGold(enemyInUse.reward * window.goldModifier)
            }
            closestEnemy.style.height = squish + "px"
        }
    }
}

// Checks to see if enemy is alive and able to damage the castle
function damageCheck() {
    if (document.getElementsByClassName("enemy")[0].style.visibility == "visible") {
        damageCastle()
    }
}

// Does damage to the castle.
function damageCastle() {
    window.castleHp -= 10
    document.getElementById("Hp").style.width = window.castleHp + "%"
    if (window.castleHp == 0) {
        document.getElementById("loseScreen").style.visibility = "visible"
        window.isDead = true
        window.archers = 0
        for (i = 10; i != 0; i--) {
            id = "bow" + i
            document.getElementsByClassName(id)[0].style.visibility = "hidden"
        }
    }
}

// Changes gold and visual gold counter
function changeGold(amount) {
    window.playerGold += amount
    document.getElementById('playerGold').innerText = "Gold: " + window.playerGold
    document.getElementsByClassName('goldHUD')[0].innerText = "Gold: " + window.playerGold
}

// Spawns a powerup when ran
function spawnPowerup() {
    let newPowerup = document.createElement("img")
    newPowerup.setAttribute("src", "image/keyBoardUpgrade.png")
    newPowerup.setAttribute("class", "powerup")
    newPowerup.setAttribute("onclick", "powerup()")
    newPowerup.addEventListener("animationend", despawnPowerup);
    newPowerup.style.left = ((Math.random() * 70) + 15) + "%"
    document.body.append(newPowerup)
    console.log("Powerup spawned!");
}
// Despawns powerup and starts the loop over
function despawnPowerup() {
    document.getElementsByClassName("powerup")[0].remove()
    powerupLoop()
}
// Makes the powerup work properly when collected
function powerup() {
    if (window.isDead == false) {
        console.log("Power UP");
        document.getElementsByClassName("powerup")[0].style.visibility = "hidden"
        document.addEventListener('keydown', damageEnemy);
        window.potato = 11;
        document.getElementById("powerUpDiv").style.visibility = "visible";
        timer()
        setTimeout(() => {
            document.removeEventListener('keydown', damageEnemy);
        }, 11000);
    }
}
// Decides when to spawn a new powerup
function powerupLoop() {
    setTimeout(() => {
        console.log("====\nTried To Spawn Powerup!\n====");
        if (window.intermission == false && window.isDead == false) {
            spawnPowerup()
        } else {powerupLoop()}
    }, ((Math.random() * 20000) + 15000))
}
powerupLoop()
// Counts down until the powerup goes away
function timer() {
    if (window.potato != 0) {
        window.potato -= 1
        document.getElementById("powerUpCounter").innerText = window.potato
        setTimeout(() => {
            timer()
        }, 1000)
    } else {
        document.getElementById("powerUpDiv").style.visibility = "hidden";
    }
}

function waveCheat() {
    console.log("Wave Cheat Active!");
    if (document.getElementsByTagName("input")[0].style.visibility != "visible") {
        document.getElementsByTagName("input")[0].style.visibility = "visible"
        document.getElementById("waveCheatButton").style.visibility = "visible"
    }
}
function waveSkip() {
    skipTo = document.getElementsByTagName("input")[0].value
    console.log('Skipping to wave', skipTo);
    window.waveNumber = (skipTo - 1)
    changeGold(10 * skipTo)
    setTimeout(() => {
        document.getElementsByTagName("input")[0].style.visibility = "hidden"
        document.getElementById("waveCheatButton").style.visibility = "hidden"
        removeStartingScreen()
    }, 200)
}

// Upgrades 

// Bow upgrade, makes bow do 20% more dmg
function tryUpgradeBow() {
    if (window.isDead == false) {
        if (window.playerGold > window.bowUpgradePrice) {
            changeGold(-window.bowUpgradePrice)
            window.bowLevel += 0.1
            window.bowLevelDisplay += 1
            window.bowUpgradePrice += 10
            document.getElementById("bowLevel").innerText = "Level: " + window.bowLevelDisplay
            document.getElementById("bowButton").innerText = "Price: " + window.bowUpgradePrice
        }
    }
}
// Re-heals castle to full hp
function healCastle() {
    if (window.playerGold >= window.castleHealPrice && window.isDead == false) {
        changeGold(-window.castleHealPrice)
        window.castleHealPrice+=5
        window.castleHp = 100
        document.getElementById("castleButton").innerText = "Price: "+window.castleHealPrice+"g"
        document.getElementById("Hp").style.width = "100%"
    }
}
// Hires a new archer to do damage for you
function hireArcher() {
    if (window.playerGold >= 20 && window.archers < 10 && window.isDead == false) {
        if (window.archerUpgrade == 0) {
            upgradeArcher(true)
        }
        changeGold(-20)
        window.archers += 1
        document.getElementsByClassName("bow" + window.archers)[0].style.visibility = "visible";
        document.getElementById("hiredArchers").innerText = "Archers: " + window.archers
        archerFires()
    }
    if (window.archers == 10) {
        document.getElementById("hireArchersButton").innerText = "MAX"
    }
}
// handles archers firing and dealing dmg
function archerFires() {
    setTimeout(() => {
        damageEnemy()
        console.log("An archer fired!");
        if (window.archers != 0) { archerFires() }
    }, 3500 - window.archerUpgrade)
}
// Upgrades archers dmg per shot
function upgradeArcher(special) {
    if (window.archerUpgrade == 0 && special == true) {
        window.archerUpgrade += 500
        window.archerUpgradeLevel = 0
        window.archerUpgradePrice = 0
        document.getElementById("archerUpgradeTitle").innerText = "Upgrade Archers"
        document.getElementById("archerUpLevel").innerText = "Level: 0"
        document.getElementById("archerUpgradeButton").innerText = "Price: 10g"
    } else if (window.isDead == false) {
        if (window.archerUpgrade == 500 && window.playerGold >= 10) {
            document.getElementById("archerUpLevel").innerText = "Level: 1"
            document.getElementById("archerUpgradeButton").innerText = "Price: 20g"
            window.archerUpgrade += 500
            window.archerUpgradeLevel += 1
            changeGold(-10)
        } else if (window.archerUpgrade == 1000 && window.playerGold >= 20) {
            document.getElementById("archerUpLevel").innerText = "Level: 2"
            document.getElementById("archerUpgradeButton").innerText = "Price: 30g"
            window.archerUpgrade += 500
            window.archerUpgradeLevel += 1
            changeGold(-20)
        } else if (window.archerUpgrade == 1500 && window.playerGold >= 30) {
            document.getElementById("archerUpLevel").innerText = "Level: 3"
            document.getElementById("archerUpgradeButton").innerText = "Price: 40g"
            window.archerUpgrade += 500
            window.archerUpgradeLevel += 1
            changeGold(-30)
        } else if (window.archerUpgrade == 2000 && window.playerGold >= 40) {
            document.getElementById("archerUpLevel").innerText = "Level: 4"
            document.getElementById("archerUpgradeButton").innerText = "Price: 50g"
            window.archerUpgrade += 500
            window.archerUpgradeLevel += 1
            changeGold(-40)
        } else if (window.archerUpgrade == 2500 && window.playerGold >= 50) {
            document.getElementById("archerUpLevel").innerText = "Level: 5"
            document.getElementById("archerUpgradeButton").innerText = "Price: 60g"
            document.getElementsByClassName("bow1")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow2")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow3")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow4")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow5")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow6")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow7")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow8")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow9")[0].setAttribute("src", "image/upgradedBowMan.png")
            document.getElementsByClassName("bow10")[0].setAttribute("src", "image/upgradedBowMan.png")
            changeGold(-50)
            window.archerUpgrade += 500
            window.archerUpgradeLevel += 1
            window.archerUpgradePrice = 60
            window.archerUpgradeScaling = 500
        } else if (window.archerUpgrade > 2500 && window.playerGold >= window.archerUpgradePrice && window.archerUpgradeLevel != 11) {
            changeGold(-window.archerUpgradePrice)
            window.archerUpgradeScaling = window.archerUpgradeScaling / 3
            window.archerUpgradePrice += 15
            window.archerUpgradeLevel += 1
            window.archerUpgrade += window.archerUpgradeScaling
            document.getElementById("archerUpLevel").innerText = "Level: " + window.archerUpgradeLevel
            document.getElementById("archerUpgradeButton").innerText = "Price: " + window.archerUpgradePrice + "g"
            if (window.archerUpgradeLevel == 11) {
                document.getElementById("archerUpLevel").innerText = "Level: MAX"
                document.getElementById("archerUpgradeButton").innerText = "MAX"
            }
        }
    }
    console.log("Archer Delay is currently "+ (3500 - window.archerUpgrade) + "ms at Level "+ window.archerUpgradeLevel);
}
function goldUpgrade() {
    if (window.isDead == false) {
        if (window.playerGold >= 20 && window.goldModifier == 1) {
            document.getElementById("goldLevel").innerText = "Level: 2"
            document.getElementById("goldUpgradeButton").innerText = "Price: 45g"
            changeGold(-20)
            window.goldModifier += 1
        } else if (window.playerGold >= 45 && window.goldModifier == 2) {
            document.getElementById("goldLevel").innerText = "Level: 3"
            document.getElementById("goldUpgradeButton").innerText = "Price: 80g"
            changeGold(-45)
            window.goldModifier += 1
        } else if (window.playerGold >= 80 && window.goldModifier == 3) {
            document.getElementById("goldLevel").innerText = "Level: MAX"
            document.getElementById("goldUpgradeButton").innerText = "MAX"
            changeGold(-80)
            window.goldModifier += 1
        }
    }
}