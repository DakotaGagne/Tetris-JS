# Tetris JS

This is a Tetris Clone created by Dakota Gagne. The goal of this project was to make a clone as close to the original as possible.

## Features
- Most of the original Tetris features
- Custom shapes that can be toggled
- Score is saved to your browser
- Endless gameplay
- Touch controls / mouse controls

## Files

### index.html
This is the main HTML file that sets up the structure of the Tetris game. It includes the canvas element where the game is rendered and buttons for controlling the game (resume, restart, toggle extra blocks, help, and home).

### main.css
This file contains the styles for the Tetris game. It includes styles for the body, canvas, main wrapper, menu wrapper, and buttons.

### init.js
This file contains the initialization functions for Tetris JS. It includes functions to initialize the game, set up the game board, generate the grid, and set up the game canvas.

### main.js
This file contains the main game logic for Tetris JS. It includes functions to render the game area, handle touch and mouse events, handle key events, render the grid, render the next block, render the hold block, pause and resume the game, toggle extra blocks, display help, and restart the game.

### blocks.js
This file contains the block objects and functions for Tetris JS. It includes functions to create blocks, rotate blocks, place blocks, move blocks, check if a block is in a legal position, hold a block, create a ghost block, check if any lines are cleared, make the current block static, check if the game is over, add a block to the static grid, fill the block bag, and return a random block.

### text.js
This file contains the Text class and the textList object. The Text class is used to create text objects that can be rendered on the canvas. The textList object contains all the text objects that are rendered on the canvas. It includes functions to set up the text objects and render them to the canvas.

## Installation
1. Clone the repository
2. Navigate to the project directory
3. Open `index.html` in your preferred web browser to start playing the game.

## How to Play
- Use the arrow keys or WASD to move and rotate the blocks.
- Press the space bar to slam the block down.
- Press the control key or E to hold the current block.
- Press the escape key or P to pause the game.
- Use touch controls or mouse controls to play on mobile devices / touchscreen laptops.