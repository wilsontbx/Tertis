# Tertis 

## Introduction
Tetris is a tile-matching video game created by Russian software engineer Alexey Pajitnov in 1984. It has been published by several companies, most prominently during a dispute over the appropriation of the game's rights in the late 1980s. After a significant period of publication by Nintendo, the rights reverted to Pajitnov in 1996, who co-founded The Tetris Company with Henk Rogers to manage Tetris licensing.

## Github Link:
https://wilsontbx.github.io/Tetris/

## Technologies:
1. HTML
2. CSS
3. Javascript

## Installation
Not required

## How to play
1. Then block will generate from top of board. Player can press arrow key up to rotate the block, left and right arrow key to move left and right.
2. Arrow key down is to move block down and space bar is for instant drop to last position, however the block will move down automatically according to speed table below. 
3. Once block hit the ground, it will become solid block and unable to move. Then new block will generate from top of board. Simultaneously, when controled block hit existing solid block, it will joint the solid block.
4. Once row/line filled up with full block, it be will clear and bring existing solid block structure down 1 row. Then score will given
5. When certain number of line is cleared arroding table below. The game will level up and increae the speed to move block down. 
6. There is function key like "1" for level up, "2" for show forecast of block final postion, "3" for show the grid of board
7. There is cheat code to clear all the block : "O"

| Level | Frames per Grid | Lines to advance |
|-------|:---------------:|-----------------:|
|  00   |        48       |         5        |
|  01   |        43       |        10        |
|  02   |        38       |        15        |
|  03   |        33       |        20        |
|  04   |        28       |        25        |
|  05   |        23       |        30        |
|  06   |        18       |        35        |
|  07   |        13       |        40        |
|  08   |         8       |        45        |
|  09   |         6       |        50        |
| 10-12 |         5       |        50        |
| 13-15 |         4       |        50        |
| 16-18 |         3       |        55-65     |
| 19-28 |         2       |        70-115    |
|  29+  |         1       |       120        |

- speed is based frames per grid, speed = frame/60, 1 seconds = 60 frame 
- after level 29, frames per grid will remain 1, lines to advance will add 5 line per level


## Issue:
1. Choosing the right method to start.
2. Use canvas to draw and generate board
3. Study requestAnimationFrame to update canvas
4. Board checking to make sure the block wouldnt go out of box for bottom line
5. check left and right cannot go out box
6. Rotote in side of board will cause piece go outside box
7. After rotate block and colilde the new genarate block will same
8. Delayed Auto Shift (DAS) behavior
9. random block autopop, solve via always declare value inside loop
10. Enhancement for pause and side menu
11. Enchacement to do forecast block

## Intended improvements
1. Support gamepad
2. Allow 2 player in game
3. Better clear line animation