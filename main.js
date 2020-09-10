const board = document.getElementById('tertisBoard')
const context = board.getContext('2d')
// context.scale(30, 30)

context.fillStyle = 'white'
context.fillRect(0, 0, 300, 720); 

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

generateBlock(player.matrix, player.position)