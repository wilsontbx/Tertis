const board = document.getElementById('tertisBoard')
const context = board.getContext('2d')

const scale = 35;

const player = {
    matrix: generateBlock(),
    position: { x: 0, y: 0 },
}

function generateBlock() {
    const block = [
        I=[
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ],
        J=[
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0]
        ],
        L=[
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ],
        O=[
            [4, 4],
            [4, 4]
        ],
        S=[
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0]
        ],
        T=[
            [0, 0, 0],
            [6, 6, 6],
            [0, 6, 0]
        ],
        Z=[
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ],
            W=[
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
                [1, 1, 1, 1,1],
            ],
    ]
    // let result = Math.floor(Math.random() * (block.length))

    return block[7]
}

function blockColour(val){
    color = ["#6aecee","#0025e6","#e5a239","#f1ee4f","#6eea47","#9130e7","#dd2e21"]
    return color[val]
}

function boardStyle() {
    context.fillStyle = 'white'                 // empty board generated
    context.fillRect(0, 0, board.width, board.height)
    for (var x = 0; x < board.width; x += scale) {
        context.moveTo(x, 0)
        context.lineTo(x, board.height)
    }

    for (var y = 0; y < board.height; y += scale) {
        context.moveTo(0, y)
        context.lineTo(board.height, y)
    }

    context.strokeStyle = "#ddd"
    context.stroke()
}

function mainControlDraw() {                           // main control
    boardStyle()
    checkLose()

    drawBlock(arrayBoard, { x: 0, y: 0 })        // draw for existing struture
    drawBlock(player.matrix, player.position)   // draw for moving block
}

function drawBlock(block, offset) {         // this function is generate block in screen offset is to move the block
    block.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                context.fillStyle = blockColour(val-1)
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

        player.position = { x: 0, y: 0 }                  // respawn to top
        player.matrix=generateBlock()
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

function checkLose(){
    if (collideTetris(arrayBoard, player)){
        alert('you lose')
        arrayBoard = generateArray(10, 24)
    }
}

function clearLine(arrayBoard){
    const isFilled = (currentValue) => currentValue >0
    let subArray = new Array(10).fill(0)
    for (let r = arrayBoard.length-1; r>-1;){
        if (arrayBoard[r].every(isFilled)){
            arrayBoard.splice(r,1)
            arrayBoard.unshift(subArray)
            console.log(arrayBoard)
        }
        else{
            r--
        }
    }
}

let start = 0
let interval = 0
let speedCap = 500                    // speed cap is the control speed of block drop

function updateBoard(t = 0) {
    const changeOfTime = t - start      // get the constant 16.67
    start = t                           // update the time accordingly
    interval += changeOfTime
    
    if (interval > speedCap) {
        keydown()
    }

    mainControlDraw()
    requestAnimationFrame(updateBoard)  // callback updateBoard by update every single flame in 0.16667
}

updateBoard()