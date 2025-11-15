// Henter HTML-elementerne til spillepladen og resultatvisningen
const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")

// Startposition for spilleren (skyderen)
let currentShooterIndex = 202

// Bredde på spillepladen (antal kolonner)
const width = 15

// Array til at holde styr på fjender, der er blevet skudt
const aliensRemoved = []

// ID til at styre intervallet for fjendernes bevægelse
let invadersId

// Retning og bevægelsesstatus for fjenderne
let isGoingRight = true
let direction = 1

// Antal point (antal fjender ramt)
let results = 0

// Opretter 15x15 = 225 felter (divs) og tilføjer dem til grid'en
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

// Gemmer alle felterne i et array for nem adgang
const squares = Array.from(document.querySelectorAll(".grid div"))

// Definerer startpositionerne for fjenderne (invaders)
const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

// Tegner fjenderne på spillepladen
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }
}

draw()

// Placerer skyderen på startpositionen
squares[currentShooterIndex].classList.add("shooter")

// Fjerner fjenderne fra deres nuværende positioner
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

// Flytter skyderen til venstre eller højre med piletasterne
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    squares[currentShooterIndex].classList.add("shooter")
}

// Lytter efter tastetryk for at flytte skyderen
document.addEventListener("keydown", moveShooter)

// Flytter fjenderne og håndterer retning og kollisioner
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    // Hvis fjenderne rammer højre kant og bevæger sig til højre, rykker de ned og skifter retning
    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
        }
        direction = -1
        isGoingRight = false
    }

    // Hvis fjenderne rammer venstre kant og bevæger sig til venstre, rykker de ned og skifter retning
    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
        }
        direction = 1
        isGoingRight = true
    }

    // Flytter fjenderne i den aktuelle retning
    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    // Tjekker om en fjende har ramt skyderen
    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId)
    }

    // Tjekker om alle fjender er fjernet
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(invadersId)
    }
}

// Starter fjendernes bevægelse med et interval
invadersId = setInterval(moveInvaders, 600)

// Håndterer skydning med pil op
function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex

    // Flytter laseren opad og tjekker for kollision med fjender
    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

        // Hvis laseren rammer en fjende
        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].classList.add("boom")

            // Fjerner "boom"-effekten efter kort tid
            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId)

            // Registrerer fjenden som fjernet
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultDisplay.innerHTML = results
        }
    }

    // Starter laseren hvis pil op trykkes
    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100)
    }
}

// Lytter efter skydning
document.addEventListener('keydown', shoot)
