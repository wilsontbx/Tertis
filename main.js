const board = document.getElementById('tetrisBoard')
const context = board.getContext('2d')

const scale = 35;


const player = {
    matrix: generateBlock(),
    position: { x: 4, y: 0 },
    // position: { x: 0, y: 0 },
    score: 0,
    level: 0,
    totalLineClear: 0,
    curentLevelLineClear: 0,
    frame: 48,
    levelCap: 5
}

function resetPlayer() {
    player.score = 0
    player.level = 0
    player.totalLineClear = 0
    player.curentLevelLineClear = 0
    player.frame = 48
    player.levelCap = 5
}


function generateBlock() {
    const block = [
        I = [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        J = [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0]
        ],
        L = [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ],
        O = [
            [4, 4],
            [4, 4]
        ],
        S = [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0]
        ],
        T = [
            [0, 0, 0],
            [6, 6, 6],
            [0, 6, 0]
        ],
        Z = [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ],
        // W=[
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        //     [1, 1, 1, 1,1],
        // ],
        //     A = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        //     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        // ]
    ]
    let result = Math.floor(Math.random() * (block.length))

    return block[result]
}

function blockColour(val) {
    color = ["#6aecee", "#0025e6", "#e5a239", "#f1ee4f", "#6eea47", "#9130e7", "#dd2e21"]
    return color[val]
}

function boardStyle() {
    context.fillStyle = 'black'                 // empty board generated
    context.fillRect(0, 0, board.width, board.height)
    for (var x = 0; x <= board.width; x += scale) {
        context.moveTo(x, 0)
        context.lineTo(x, board.height)
    }

    for (var y = 0; y <= board.height; y += scale) {
        context.moveTo(0, y)
        context.lineTo(board.width, y)
    }

    context.strokeStyle = "#ddd"
    context.stroke()

}

function sideMenuControl() {

    const menu = document.getElementById('menu')
    const ctx = menu.getContext('2d')
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, menu.width, menu.height)

    ctx.fillStyle = "#4b75a7";
    ctx.font = "100px Helvetica";
    ctx.fillText("Tetris", 5, 90);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.strokeStyle = "#ddd"

    ctx.fillText("Score", 5, 170);
    ctx.beginPath();
    ctx.rect(5, 180, 120, 40);
    ctx.stroke();
    ctx.fillText(player.score, 5, 215);

    ctx.fillText("Level", 5, 290);
    ctx.beginPath();
    ctx.rect(5, 300, 240, 40);
    ctx.stroke();
    ctx.fillText(player.level, 5, 335);

    ctx.fillText("Speed", 5, 410);
    ctx.beginPath();
    ctx.rect(5, 420, 240, 40);
    ctx.stroke();
    ctx.fillText((player.frame / 60).toFixed(2) + " second", 5, 455);

    ctx.fillText("Level Line", 5, 530);
    ctx.beginPath();
    ctx.rect(5, 540, 240, 40);
    ctx.stroke();
    ctx.fillText(player.curentLevelLineClear, 5, 575);

    ctx.fillText("Total Line", 5, 650);
    ctx.beginPath();
    ctx.rect(5, 660, 240, 40);
    ctx.stroke();
    ctx.fillText(player.totalLineClear, 5, 695);
}



function mainControlDraw() {                           // main control
    boardStyle()
    checkLose()

    drawBlock(arrayBoard, { x: 0, y: 0 })        // draw for existing struture
    drawBlock(player.matrix, player.position)   // draw for moving block
}

function generateInitialPostion() {
    let matrix = player.matrix
    return (5 - Math.floor(matrix.length / 2))
}

function drawBlock(block, offset) {         // this function is generate block in screen offset is to move the block
    block.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                context.fillStyle = blockColour(val - 1)
                context.fillRect((x + offset.x) * scale, (y + offset.y) * scale, scale, scale)
                context.strokeRect((x + offset.x) * scale, (y + offset.y) * scale, scale, scale)
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
let arrayBoard = generateArray(10, 24)

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

function collideTetris(arrayBoard, player) {
    const matrix = player.matrix
    const offset = player.position
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] !== 0 &&                                   // first condition
                (arrayBoard[offset.y + r] &&                            // second condition
                    arrayBoard[offset.y + r][offset.x + c]) !== 0) {    // this can check undefinite value
                return true
            }
        }
    }
    return false
}

document.addEventListener('keydown', (e) => {
    e.preventDefault                            // refer to https://keycode.info/
    if (e.keyCode === 37) {                     // 37 is left for keycode
        if (!isPaused) {
            moveLeftRight(-1)
        }                       // left
    }
    else if (e.keyCode === 39) {                // 39 is right for keycode
        if (!isPaused) {
            moveLeftRight(1)
        }                       // right
    }
    else if (e.keyCode === 40) {                // 40 is down for keycode
        if (!isPaused) {
            keydown()
        }                              // down
    }
    else if (e.keyCode === 38) {                // 38 is up for keycode
        if (!isPaused) {
            rotate(player.matrix)                   // rotate
            rotateCheck()
        }
        // interval-=100                        // das
    }
    else if (e.keyCode === 32) {                // 32 is space
        // instant
    }
    else if (e.keyCode === 49) {                // cheat code
        instantLevelUP(1)
    }
    else if (e.keyCode === 27) {                // cheat code
        isPaused = !isPaused
    }
})
// function instantDrop(arrayBoard, player) {
//     const matrix = player.matrix
//     const offset = player.position
//     for (let r = 0; r > -1; r--) {
//         for (let c = 0; c < matrix[r].length; c++) {
//             if (matrix[r][c] !== 0) {
//                 for (let i = r; i < 24; i++) {

//                 }
//             }
//         }
//     }
//     return false
// }

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

        player.matrix = generateBlock()
        player.position = { x: generateInitialPostion(), y: 0 }                  // respawn to top
        // player.position = { x: 0, y: 0 }
    }
    interval = 0
}
function rotate(matrix) {                       // classic rotate -> 90 degree clockwise
    for (let r = 0; r < matrix.length; r++) {   // transpore
        for (let c = 0; c < r; c++) {
            let temp = matrix[r][c]
            matrix[r][c] = matrix[c][r]
            matrix[c][r] = temp
        }
    }
    matrix.forEach(element => {
        element.reverse()
    })
}

function rotateCheck() {
    let count = 1
    while (collideTetris(arrayBoard, player)) {   // function will operate as if when block crush outside box
        if (count % 2 === 0) {                        // it will move to left one block
            player.position.x += count            // still crush move to right two block
        }
        else {
            player.position.x -= count
        }
        count++
    }
}

function checkLose() {
    if (collideTetris(arrayBoard, player)) {
        alert('you lose')
        arrayBoard = generateArray(10, 24)
        resetPlayer()
    }
}

function clearLine(arrayBoard) {
    const isFilled = (currentValue) => currentValue > 0
    let line = 0;
    for (let r = arrayBoard.length - 1; r > -1;) {
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
function instantLevelUP(num) {
    for (let i = 0; i < num; i++) {
        if (player.level < 10 || player.level > 15) {
            player.levelCap += 5
        }
        player.level++;
        if (player.frame > 7) {
            player.frame -= 5
        }
        else if (player.frame === 8) {
            player.frame -= 2
        }
        else if (player.frame > 1) {
            player.frame -= 1
        }
        player.curentLevelLineClear = 0
    }
}

let start = 0
let interval = 0
var isPaused = false;

function updateBoard(t = 0) {
    if (isPaused) {
        cancelAnimationFrame(updateBoard)

    } else {
        const changeOfTime = t - start      // get the constant 16.67
        start = t                           // update the time accordingly
        interval += changeOfTime
        let speedCap = (player.frame / 60) * 1000   // speed cap is the control speed of block drop
        console.log(speedCap)
        if (interval > speedCap) {
            keydown()
        }

        mainControlDraw()
    }
    requestAnimationFrame(updateBoard)  // callback updateBoard by update every single flame in 0.16667
}

function updateMenu() {
    sideMenuControl()
    requestAnimationFrame(updateMenu)
}
updateBoard()
updateMenu()
