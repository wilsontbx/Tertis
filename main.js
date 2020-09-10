const board = document.getElementById('tertisBoard')
const context = board.getContext('2d')
// context.scale(30, 30)



let blockT = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1]
]

const player = {                                
    matrix: blockT,
    position: { x: 0, y: 0 },
}

function generateBlock(block, offset) {         // this function is generate block in screen offset is to move the block
    block.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val === 1) {
                context.fillStyle = "red"
                context.fillRect((x + offset.x)*30, (y + offset.y)*30, 30, 30)
                context.strokeRect((x + offset.x)*30, (y + offset.y)*30, 30, 30)
            }
        })
    })
}





function generate() {
    generateBlock(player.matrix, player.position)
}

let start = 0
let interval = 0
let speedCap = 1000                 // speed cap is the control speed of block drop

function updateBoard(t = 0) {
    const changeOfTime = t - start    // get the constant 16.66
    start = t                       // update the time accordingly
    interval += changeOfTime

    if (interval > speedCap) {
        player.position.y++
        interval = 0
    }
    context.fillStyle = 'white'         // empty board generated
    context.fillRect(0, 0, 300, 720);     

    generate()
    requestAnimationFrame(updateBoard)  // callback updateBoard to update flame
}

updateBoard()