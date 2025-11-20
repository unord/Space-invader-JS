// Henter HTML-elementerne fra DOM'en:
// - grid: containeren for spillepladen (15x15 felter)
// - resultDisplay: elementet hvor point eller slutresultat vises
const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")

// Definerer skyderens startposition (nederst i midten af grid'en)
// Da grid'en er 15 kolonner bred, svarer index 216 til række 14, kolonne 6
let currentShooterIndex = 216
let NowFatShooter = [215,216,217]; //bruges ikke endnu

var pressed = false;

// Antal kolonner i grid'en (bruges til at beregne bevægelser og kanter)
const width = 15

// Array til at holde styr på hvilke fjender (invaders) der er blevet skudt og fjernet
// Indeholder index i alienInvaders-arrayet, ikke selve grid-positionen
const aliensRemoved = []

// Variabel til at holde ID'et for det interval, der styrer fjendernes bevægelse
let invadersId

// Boolean der angiver om fjenderne bevæger sig mod højre (true) eller venstre (false)
let isGoingRight = true

// Retningen fjenderne bevæger sig i horisontalt: +1 (højre), -1 (venstre)
let direction = 1

// Antal point spilleren har opnået (antal fjender ramt)
let results = 0

// Opretter 225 <div>-elementer (15x15 grid) og tilføjer dem til grid-containeren
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

// Gemmer alle grid-felterne i et array for nem adgang via index
const squares = Array.from(document.querySelectorAll(".grid div"))

// Definerer de initiale positioner for fjenderne (invaders) i grid'en
// Disse er index i squares-arrayet, og danner 3 rækker af fjender
const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

// Funktion til at tegne fjenderne på grid'en
// Tilføjer klassen "invader" til de relevante felter, medmindre de er blevet fjernet
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader")
        }
    }
}

// Kalder draw() én gang ved start for at vise fjenderne
draw()

// Placerer skyderen (spilleren) på sin startposition ved at tilføje "shooter"-klassen
NowFatShooter.forEach(Index => squares[currentShooterIndex].classList.add("shooter"))

// Funktion til at fjerne alle fjender fra deres nuværende positioner
// Bruges før de flyttes, så de kan tegnes igen på nye positioner
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

// Funktion til at flytte skyderen til venstre eller højre, afhængigt af tastetryk
function moveShooter(e) {
    // Fjerner skyderen fra nuværende position
    NowFatShooter.forEach(Index => squares[Index].classList.remove("shooter"))

    // Flytter shooter hvis den ikke er ved kanten
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }

    // Tilføjer shooter på den nye position
    NowFatShooter.forEach(Index => squares[Index].classList.add("shooter"))
}

// Lytter efter tastetryk og kalder moveShooter ved venstre/højre pil
document.addEventListener("keydown", moveShooter)


// Funktion til at flytte fjenderne og håndtere kantkollisioner og spilstatus
function moveInvaders() {
    // Tjekker om fjenderne er ved venstre eller højre kant af grid'en
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1

    // Fjerner fjenderne fra deres nuværende positioner
    remove()

    // Hvis fjenderne rammer højre kant og bevæger sig til højre
    // Flyt dem én række ned og skift retning til venstre
    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
        }
        direction = -1
        isGoingRight = false
    }

    // Hvis fjenderne rammer venstre kant og bevæger sig til venstre
    // Flyt dem én række ned og skift retning til højre
    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
        }
        direction = 1
        isGoingRight = true
    }

    // Flyt fjenderne én kolonne i den aktuelle retning
    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    // Tegn fjenderne på deres nye positioner
    draw()

    // Tjek om en fjende er kollideret med skyderen (spillet tabt)
    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER"
        clearInterval(invadersId) // Stop fjendernes bevægelse
    }

    // Tjek om alle fjender er blevet fjernet (spillet vundet)
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN"
        clearInterval(invadersId)
    }
}

// Starter fjendernes bevægelse med et interval på 600 ms
invadersId = setInterval(moveInvaders, 600)

// Funktion til at håndtere skydning når spilleren trykker pil op
function shoot(e) {
    let laserId // ID til at styre laserens bevægelse
    let currentLaserIndex = NowFatShooter[1] + 1 // Startposition for laser (lige over skyderen)

    // Funktion til at flytte laseren opad og tjekke for kollision
    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser") // Fjern laser fra nuværende position
        currentLaserIndex -= width // Flyt én række op
        squares[currentLaserIndex].classList.add("laser") // Tilføj laser på ny position

        // Hvis laseren rammer en fjende
        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].classList.add("boom") // Vis eksplosion

            // Fjern eksplosionseffekt efter 300 ms
            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300)
            clearInterval(laserId) // Stop laserens bevægelse

            // Find index på fjenden der blev ramt og tilføj til listen over fjender fjernet
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)

            // Opdater point og vis dem
            results++
            resultDisplay.innerHTML = results
        }
    }

    // Start laserens bevægelse hvis pil op trykkes
    if (e.key === "ArrowUp" && !pressed) {    //sætter et flag for at forhindre gentagelse
        laserId = setInterval(moveLaser, 100)
        pressed = true;
    if (pressed = true);
        setTimeout(() => { pressed = false; }, 300); // Debounce for at forhindre hurtig gentagelse
    }
    
}

// Lytter efter tastetryk for at aktivere skydning
document.addEventListener('keydown', shoot)
