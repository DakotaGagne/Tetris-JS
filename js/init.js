/*
init.js

This file contains the initialization functions for Tetris JS
init() - initializes the game
setupBoard() - sets up the game board
generateGrid() - generates the grid for the game
setupCanvas() - sets up the game canvas
Used as a support file for Tetris JS

*/

function init(){
	// Reset / Initialize Game
	if(screen.width<900)mobile=true
	else mobile = false
	combo = false
	comboCount = 0
	lastLinesCleared = 0
	holdAllowed = true
	floorKickAllowed = true
	gameState = 'normal'
	groundCol = false
	staticGrid.length=0
	buttons =  document.getElementsByClassName('menuBtn')
	for(var i=0;i<buttons.length;i++){
		buttons[i].style.visibility = 'hidden'
	}
	blocks = []
	level = 0
	score = 0
	lines = 0
	highscore = localStorage.getItem('highscore')||0
	c = getElem('canvas')
	ctx = c.getContext('2d')
	blocks = []
	heldBlock = []
	createBlocks()
	setupBoard()
	borderSize = Math.round(board.squareSize/2)
	fillBlockBag()
	var nextBlock = blockBag.shift()
	currBlock = new Block(nextBlock.shape.slice(),nextBlock.color,nextBlock.origin.slice())
	setupCanvas()
	currTime = Date.now()
}

function setupBoard(){
	// Set up the game board
	if(mobile){
		var length = window.innerWidth*0.6
		var squareSizeX = Math.floor(length/board.width)
		length = window.innerHeight*0.75
		var squareSizeY = Math.floor(length/board.height)
		if(squareSizeX<squareSizeY)board.squareSize = squareSizeX
		else board.squareSize = squareSizeY
	} else {
		var length = window.innerHeight
		if(window.innerHeight>window.innerWidth)length=window.innerWidth
		board.squareSize = Math.floor(length/(board.height+2))
	}
	//grid is y, x
	generateGrid()
}

function generateGrid(){
	// Generate the grid for the game
	if(staticGrid.length==0){
		staticGrid = new Array(board.height)
		for(y=0;y<staticGrid.length;y++){
			staticGrid[y] = new Array(board.width)
			for(x=0;x<staticGrid[y].length;x++)staticGrid[y][x]=[0,'']
		}
	}
	grid = new Array(board.height)
	for(y=0;y<grid.length;y++){
		grid[y] = new Array(board.width)
		for(x=0;x<grid[y].length;x++)grid[y][x]=staticGrid[y][x]
	}

}

var gameArea// x, y, w, h

function setupCanvas(){
	// Set up the game canvas
	c.width = window.innerWidth
	c.height = window.innerHeight
	if(mobile)gameArea = [c.width*0.3, c.height * 0.15, board.width*board.squareSize, board.height*board.squareSize]
	else gameArea = [c.width/2-(board.width/2)*board.squareSize, c.height/2-(board.height/2)*board.squareSize, board.width*board.squareSize, board.height*board.squareSize]
	setupText()
	renderNext()
	renderHold()
	renderGameArea()
}

