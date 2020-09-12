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
    levelCap:10
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
    for (var x = 0; x <= 350; x += scale) {
        context.moveTo(x, 0)
        context.lineTo(x, board.height)
    }

    for (var y = 0; y <= board.height; y += scale) {
        context.moveTo(0, y)
        context.lineTo(350, y)
    }

    context.strokeStyle = "#ddd"
    context.stroke()

}

function wordStyle() {
    context.fillStyle = "#4b75a7";
    context.font = "100px Helvetica";
    context.fillText("Tetris", 355, 90);

    context.fillStyle = "white";
    context.font = "40px Arial";

    context.fillText("Score", 355, 170);
    context.beginPath();
    context.rect(355, 180, 240, 40);
    context.stroke();
    context.fillText(player.score, 355, 215);

    context.fillText("Level", 355, 290);
    context.beginPath();
    context.rect(355, 300, 240, 40);
    context.stroke();
    context.fillText(player.level, 355, 335);

    context.fillText("Speed", 355, 410);
    context.beginPath();
    context.rect(355, 420, 240, 40);
    context.stroke();
    context.fillText((player.frame / 60).toFixed(2) + " second", 355, 455);

    context.fillText("Level Line", 355, 530);
    context.beginPath();
    context.rect(355, 540, 240, 40);
    context.stroke();
    context.fillText(player.curentLevelLineClear, 355, 575);

    context.fillText("Total Line", 355, 650);
    context.beginPath();
    context.rect(355, 660, 240, 40);
    context.stroke();
    context.fillText(player.totalLineClear, 355, 695);
}



function mainControlDraw() {                           // main control
    boardStyle()
    checkLose()
    wordStyle()
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
        moveLeftRight(-1)                       // left
    }
    else if (e.keyCode === 39) {                // 39 is right for keycode
        moveLeftRight(1)                        // right
    }
    else if (e.keyCode === 40) {                // 40 is down for keycode
        keydown()                               // down
    }
    else if (e.keyCode === 38) {                // 38 is up for keycode
        rotate(player.matrix)                   // rotate
        rotateCheck()
        // interval-=100                        // das
    }
    else if (e.keyCode === 32) {                // 32 is space
        // instant
    }
})
function instantDrop(arrayBoard, player){
    const matrix = player.matrix
    const offset = player.position
    for (let r = 0; r > -1; r--) {
        for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] !== 0){
                
            }
        }
    }
    return false
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
        if (player.level < 10 || player.level > 15) {
            player.levelCap += 10
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
        player.curentLevelLineClear=0
    }
}
function instantLevelUP(num){
    for (let i =0;i<num;i++){
    if (player.level < 10 || player.level > 15) {
        player.levelCap += 10
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
    player.curentLevelLineClear=0}
}

let start = 0
let interval = 0

function updateBoard(t = 0) {
    const changeOfTime = t - start      // get the constant 16.67
    start = t                           // update the time accordingly
    interval += changeOfTime
    let speedCap = (player.frame / 60) * 1000
    // speed cap is the control speed of block drop
    if (interval > speedCap) {
        keydown()
    }

    mainControlDraw()
    requestAnimationFrame(updateBoard)  // callback updateBoard by update every single flame in 0.16667
}

updateBoard()
