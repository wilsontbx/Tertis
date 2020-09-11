const board = document.getElementById('tertisBoard')
const context = board.getContext('2d')

const scale = 35;
const blockT = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
]
const blockL = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]
]


const player = {
    matrix: blockL,
    position: { x: 4, y: 0 },
}

function boardStyle() {
    context.fillStyle = 'white'                 // empty board generated
    context.fillRect(0, 0, board.width, board.height);
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


function generate() {                           // main control
    boardStyle()
    drawBlock(player.matrix, player.position)   // draw for moving block
    drawBlock(arrayBoard, { x: 0, y: 0 })        // draw for existing struture
}

function drawBlock(block, offset) {         // this function is generate block in screen offset is to move the block
    block.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                context.fillStyle = "red"
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
const arrayBoard = generateArray(10, 24)

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
            if (matrix[r][c] !== 0 &&                               // first condition
                (arrayBoard[offset.y + r] &&                         // second condition
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

    }
    else if (e.keyCode === 32) {                // 32 is space
        // instant
    }
})

function moveLeftRight(val) {
    player.position.x += val                              // +1 is right and -1 is left
    if (collideTetris(arrayBoard, player)) {   // will call this function check is that any collide(overlap)
        player.position.x -= val                  // no matter is positve or negative this can solve
    }
}

function keydown() {
    player.position.y++                         // everytime when press key down
    if (collideTetris(arrayBoard, player)) {    // will call this function check is that any collide(overlap)
        player.position.y--                     // reverse step and merge
        mergeBoardPositionToArray(arrayBoard, player)
        player.position = { x: 4, y: 0 }                  // respawn to top
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

function rotateCheck(){
    let count = 1
    while(collideTetris(arrayBoard, player)){
        if(count%2===0){
            player.position.x+=count
        }
        else{
            player.position.x-=count
        }
        count++
    }
}

let start = 0
let interval = 0
let speedCap = 1000                     // speed cap is the control speed of block drop

function updateBoard(t = 0) {
    const changeOfTime = t - start      // get the constant 16.66
    start = t                           // update the time accordingly
    interval += changeOfTime

    if (interval > speedCap) {
        keydown()
    }


    generate()
    requestAnimationFrame(updateBoard)  // callback updateBoard to update flame
}

updateBoard()