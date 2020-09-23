// initialize
const board = document.getElementById('tetrisBoard')
const context = board.getContext('2d')

const menu = document.getElementById('menu')
const ctx = menu.getContext('2d')
const scale = 35

let arrayBoard = generateArray(10, 24)
localStorage.setItem("highestScore", 0)

const player = {
    matrix: null,
    position: null,
    score: 0,
    level: 0,
    totalLineClear: 0,
    curentLevelLineClear: 0,
    frame: 48,
    levelCap: 5,
    nextMatrix: generateBlock(),
    totalTime: 0,
}

function resetPlayer() {
    player.matrix = null
    player.score = 0
    player.level = 0
    player.totalLineClear = 0
    player.curentLevelLineClear = 0
    player.frame = 48
    player.levelCap = 5
    player.nextMatrix = generateBlock()
    player.totalTime = 0
    initialPiece()
}
// block
function generateBlock() {
    const block = [
        Z = [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        S = [
            [0, 2, 2],
            [2, 2, 0],
            [0, 0, 0]
        ],
        L = [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0]
        ],
        T = [
            [0, 4, 0],
            [4, 4, 4],
            [0, 0, 0]
        ],
        I = [
            [0, 0, 0, 0],
            [5, 5, 5, 5],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        O = [
            [6, 6],
            [6, 6]
        ],
        J = [
            [7, 0, 0],
            [7, 7, 7],
            [0, 0, 0]
        ],
    ]
    let result = Math.floor(Math.random() * (block.length))

    return block[result]
}

function blockColour(val) {
    color = ["#dd2e21", "#6eea47", "#e5a239", "#9130e7", "#6aecee", "#f1ee4f", "#0025e6",]
    return color[val]
}
// board
function boardStyle() {
    context.globalAlpha = 1
    context.fillStyle = 'black'                 // empty board generated
    context.fillRect(0, 0, board.width, board.height)

    if (isGrid) {
        for (var x = 0; x <= board.width; x += scale) {
            context.moveTo(x, 0)
            context.lineTo(x, board.height)
        }

        for (var y = 0; y <= board.height; y += scale) {
            context.moveTo(0, y)
            context.lineTo(board.width, y)
        }

        context.strokeStyle = "white"
        context.stroke()
    }
}

function pauseUI() {
    if (isStarted) {             // better looking for pause UI to show grid
        boardStyle()
    }
    else if (isPaused) {
        mainControlDraw()
    }

    context.globalAlpha = 1
    context.fillStyle = 'black'
    context.fillRect(10, 360, 330, 80)

    context.fillStyle = "red"
    context.fillRect(10, 360, 330, 2)
    context.fillRect(10, 440, 330, 2)
    context.fillRect(10, 360, 2, 80)
    context.fillRect(340, 360, 2, 82)

    context.fillStyle = "white"
    context.font = "30px Arial"

    if (isPaused) {
        context.fillText("Please press ESC", 15, 390)
        context.fillText("to continue", 15, 430)
    }
    else if (isStarted) {
        context.fillText("Please press ENTER", 15, 390)
        context.fillText("to Start the Game", 15, 430)
    }
}

// side menu
function sideMenuControl() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, menu.width, menu.height)

    ctx.font = "bold 70px Courier New"

    let array = ["T", "E", "T", "R", "I", "S"]
    for (let i = 0; i < 6; i++) {
        ctx.fillStyle = blockColour(i)
        ctx.fillText(array[i], 5 + 39 * i, 70)
    }

    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    ctx.strokeStyle = "white"

    let listTitle = ["SCORE", "LEVEL", "SPEED", "LINE", "TIME", "HIGHEST SCORE"]
    let listData = [player.score, player.level, ((player.frame / 60).toFixed(3)) + " second", player.totalLineClear, timer(player.totalTime), localStorage.getItem("highestScore")]

    for (let i = 0; i < listTitle.length; i++) {               // draw line
        ctx.fillText(listTitle[i], 6, 115 + 60 * i)
        ctx.fillText(listData[i], 10, 140 + 60 * i)
        ctx.beginPath()
        ctx.rect(5, 120 + 60 * i, 235, 25)
        ctx.stroke()
    }

    ctx.fillText("NEXT", 5, 475)
    ctx.beginPath()
    ctx.rect(5, 480, 235, 95)
    ctx.stroke()

    ctx.fillText("CONTROL", 5, 605)
    ctx.beginPath()
    ctx.rect(5, 610, 235, 225)
    ctx.stroke()

    let control = ["↑ - Rotate", "→ - Right", "← - Left", "↓ - Down", "Space Bar - Hard Drop", "1 - Level Up", "2 - Show Forecast", "3 - Show grid", "esc - Pause"]
    for (let i = 0; i < control.length; i++) {
        ctx.fillText(control[i], 10, 630 + 25 * i)
    }
    // if (isStarted) {
    //     drawBlock(player.matrix,
    //         { x: 3.5 - (player.matrix.length / 2), y: (player.matrix.length < 4) ? 14.1 : 13.6 }, ctx)
    // }
    // else {
        drawBlock(player.nextMatrix,
            { x: 3.5 - (player.nextMatrix.length / 2), y: (player.nextMatrix.length < 4) ? 14.1 : 13.6 }, ctx)
    // }
}

// initial game
function initialPiece() {
    boardStyle()

    player.matrix = player.nextMatrix
    player.position = { x: generateInitialPostion(), y: 0 }                  // respawn to top
    player.nextMatrix = generateBlock()
}

function generateInitialPostion() {
    let matrixLength = player.matrix.length
    let boardLength = arrayBoard[0].length
    return (boardLength / 2 - Math.ceil(matrixLength / 2))
}
// draw board
function mainControlDraw() {                           // main control
    boardStyle()
    checkLose()

    drawBlock(arrayBoard, { x: 0, y: 0 }, context)        // draw for existing struture
    drawBlock(player.matrix, player.position, context)   // draw for moving block
    if (isForecast) {
        drawBlock(player.matrix, player.position, context, findMinDistance(arrayBoard, player))
    }
}

function drawBlock(block, offset, element, forecast = 0) {         // this function is generate block in screen offset is to move the block
    block.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                if (forecast > 0) {
                    element.globalAlpha = 0.4
                }
                else {
                    element.globalAlpha = 1
                }
                element.fillStyle = blockColour(val - 1)
                element.fillRect((x + offset.x) * scale, (y + offset.y + forecast) * scale, scale, scale)
                element.strokeStyle = "black"
                element.strokeRect((x + offset.x) * scale, (y + offset.y + forecast) * scale, scale, scale)
            }
        })
    })
}

function generateArray(width, height) {
    let array = []
    for (let i = 0; i < height; i++) {
        let subArray = new Array(width).fill(0)
        array.push(subArray)
    }
    return array
}

function mergeBoardPositionToArray(arrayBoard, player) {    // this function is to merge current block value to array
    const matrix = player.matrix
    const offset = player.position
    matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                arrayBoard[offset.y + y][offset.x + x] = val
            }
        })
    })
}
// check function
function collideTetris(arrayBoard, player) {
    const matrix = player.matrix
    const offset = player.position
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] !== 0 &&                                   // first condition
                (arrayBoard[offset.y + r] &&                            // second condition
                    arrayBoard[offset.y + r][offset.x + c]) !== 0) {    // short circuit undefinite value
                return true
            }
        }
    }
    return false
}

function checkLose() {
    if (collideTetris(arrayBoard, player)) {
        if (localStorage.getItem("highestScore") < player.score) {
            localStorage.setItem("highestScore", player.score)
        }
        alert('You Lose. Please try again')
        arrayBoard = generateArray(10, 24)
        resetPlayer()
        isStarted = true
    }
}
// keydown
document.addEventListener('keydown', (e) => {
    e.preventDefault                            // refer to https://keycode.info/
    if (e.keyCode === 37) {                     // 37 is left for keycode
        if (!isPaused && !isStarted) {
            moveLeftRight(-1)
        }                       // left
    }
    else if (e.keyCode === 39) {                // 39 is right for keycode
        if (!isPaused && !isStarted) {
            moveLeftRight(1)
        }                       // right
    }
    else if (e.keyCode === 40) {                // 40 is down for keycode
        if (!isPaused && !isStarted) {
            keydown()
        }                              // down
    }
    else if (e.keyCode === 38) {                // 38 is up for keycode
        if (!isPaused && !isStarted) {
            rotate(player.matrix)                   // rotate
            rotateCheck()
        }
    }
    else if (e.keyCode === 32) {                // 32 is space
        if (!isPaused && !isStarted) {
            instantDrop(arrayBoard, player)
        }
    }
    else if (e.keyCode === 49) {
        instantLevelUP()
    }
    else if (e.keyCode === 50) {
        isForecast = !isForecast
    }
    else if (e.keyCode === 51) {
        isGrid = !isGrid
    }
    else if (e.keyCode === 27) {
        if (!isStarted) {
            isPaused = !isPaused
        }
    }
    else if (e.keyCode === 13) {
        if (isStarted){
            isStarted = false
            initialPiece()
        }

    }
    else if (e.keyCode === 79) {            // cheat code = 0
        arrayBoard = generateArray(10, 24)
    }
})
// control function
function instantDrop() {
    player.position.y += findMinDistance(arrayBoard, player)
    keydown()
}

function findMinDistance(arrayBoard, player) {
    const matrix = player.matrix
    const offset = player.position
    let array = []
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] !== 0) {
                array.push(findDistance(arrayBoard, offset.y + r, offset.x + c))
            }
        }
    }
    let minDistance = Math.min(...array)
    return minDistance
}

function findDistance(arrayBoard, r, c) {
    let i = 0
    while (true) {
        if ((arrayBoard[i + r] && arrayBoard[i + r][c]) !== 0) {
            return i - 1
        }
        i++
    }
}
function moveLeftRight(val) {
    player.position.x += val                    // +1 is right and -1 is left
    if (collideTetris(arrayBoard, player)) {    // will call this function check is that any collide(overlap)
        player.position.x -= val                // no matter is positve or negative this can solve
    }
}

function keydown() {
    player.position.y++                         // everytime when press key down
    if (collideTetris(arrayBoard, player)) {    // will call this function check is that any collide(overlap)
        player.position.y--                     // reverse step and merge

        mergeBoardPositionToArray(arrayBoard, player)
        clearLine(arrayBoard)

        initialPiece()
    }
    interval = 0
}

function rotate(matrix, dir = 1) {                       // classic rotate -> 90 degree clockwise
    for (let r = 0; r < matrix.length; r++) {   // transpore
        for (let c = 0; c < r; c++) {
            let temp = matrix[r][c]
            matrix[r][c] = matrix[c][r]
            matrix[c][r] = temp
        }
    }
    if (dir > 0) {
        matrix.forEach(element => {
            element.reverse()
        })
    }
    else {
        matrix.reverse()
    }
}

function rotateCheck() {
    const originalPosX = player.position.x
    let count = 1
    while (collideTetris(arrayBoard, player)) {   // function will operate as if when block crush outside box
        if (count % 2 === 0) {                        // it will move to left one block
            player.position.x += count            // still crush move to right two block
        }
        else {
            player.position.x -= count
        }

        if (count > player.matrix[0].length) {
            player.position.x = originalPosX
            player.position.y++
            if (collideTetris(arrayBoard, player)) {
                rotate(player.matrix, -1)
                player.position.y--
            }
        }
        count++
    }
}

// scoring function
function clearLine(arrayBoard) {
    const isFilled = (currentValue) => currentValue > 0
    let line = 0;
    let r = arrayBoard.length - 1
    while (r > -1) {
        if (arrayBoard[r].every(isFilled)) {
            let subArray = new Array(10).fill(0)
            arrayBoard.splice(r, 1)
            arrayBoard.unshift(subArray)
            line++
            player.totalLineClear++
            player.curentLevelLineClear++
            levelUp()
        }
        else {
            r--
        }
    }
    score(line, player.level)
}

function score(line, level) {         // calculation from classis tetris
    if (line === 1) {
        player.score += 30 * (level + 1)
    }
    else if (line === 2) {
        player.score += 100 * (level + 1)
    }
    else if (line === 3) {
        player.score += 300 * (level + 1)
    }
    else if (line === 4) {
        player.score += 1200 * (level + 1)
    }
}

function levelUp() {
    if (player.curentLevelLineClear >= player.levelCap) {
        instantLevelUP(1)
    }
}

function instantLevelUP() {
    if (player.level < 8) {
        player.frame -= 5
    }
    else if (player.level === 8) {
        player.frame -= 2
    }
    else if (player.level > 9 && player.level < 12) {
        player.frame = player.frame
    }
    else if (player.level > 12 && player.level < 15) {
        player.frame = player.frame
    }
    else if (player.level > 15 && player.level < 18) {
        player.frame = player.frame
    }
    else if (player.level > 18 && player.level < 28) {
        player.frame = player.frame
    }
    else if (player.frame > 1) {
        player.frame -= 1
    }
    if (player.level < 10 || player.level > 15) {
        player.levelCap += 5
    }
    player.level++
    player.curentLevelLineClear = 0
}

let start = 0
let interval = 0
var isPaused = false
var isStarted = true
var isForecast = true
var isGrid = false
var startTime = null
var pauseTime = 0

function updateBoard(t = 0) {

    
    if (!startTime) {
        startTime = t
    }

    if (isPaused || isStarted) {
        pauseUI()
        // cancelAnimationFrame(updateBoard)
        pauseTime = t - startTime - player.totalTime
        player.totalTime = t - startTime - pauseTime
    }
    else {
        const changeOfTime = t - start      // get the constant 16.67
        start = t                           // update the time accordingly
        interval += changeOfTime

        let speedCap = (player.frame / 60) * 1000   // speed cap is the control speed of block drop
        if (interval > speedCap) {
            keydown()
        }

        player.totalTime = (t - startTime) - pauseTime
        mainControlDraw()
        
    }
    sideMenuControl()
    
    requestAnimationFrame(updateBoard)  // callback updateBoard by update every single frame in 0.16667
}

// function updateMenu() {
    
//     requestAnimationFrame(updateMenu)
// }

// updateMenu()
updateBoard()


function timer(input) {
    input = (input / 1000)
    let hours = Math.floor((input % (60 * 60 * 24)) / (60 * 60))
    let minutes = Math.floor((input % (60 * 60)) / 60)
    let seconds = (input % 60).toFixed(2)

    let output = ""
    if (hours < 10) {
        output = "0" + hours
    }
    else {
        output = hours
    }

    if (minutes < 10) {
        output += ":0" + minutes
    }
    else {
        output += ":" + minutes
    }

    if (seconds < 10) {
        output += ":0" + seconds
    }
    else {
        output += ":" + seconds
    }

    return output
}
