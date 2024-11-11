/*
blocks.js

This file contains the block objects and functions for Tetris JS
Used as a support file for Tetris JS
*/



var extraBlocks = false
var blocks = []

var Block = function(shape, color, origin){
	// Block object
	// Contains the variables that define a block (tetromino)
	this.shape = shape.slice()
	this.defShape = shape.slice()
	this.color = color
	this.origin = origin.slice()
	this.defOrigin = origin.slice()
}


function rotateBlock(shape, CW=true){
	/*
	This function rotates a block 90 degrees clockwise or counter-clockwise about its center
	Inputs:
		shape: 2D array representing the block
		CW: Boolean, true for clockwise rotation, false for counter-clockwise rotation
	Output:
		shape: 2D array representing the rotated block
	*/

	times=1
	if(!CW)times=3
	while(times>0){
	    var origShape = shape.slice();
	    for(var i=0; i < shape.length; i++) {
	        var row = shape[i].map(function(x, j) {
	            var k = (shape.length - 1) - j;
	            return origShape[k][i];
	        });
	        shape[i] = row;
	    }
		times--
	}
	return shape
}

function placeBlock(){
	/*
	This function places the current block on the grid
	Inputs:
		None
	Outputs:
		None
	*/
	for(var y=0; y<currBlock.shape.length; y++){
		for(var x=0; x<currBlock.shape.length; x++){
			if(ghostBlock.shape[y][x]==1){
				var gridX = x+ghostBlock.origin[1]
				var gridY = y+ghostBlock.origin[0]
				if(gridY>=0&&gridX>=0&&gridY<grid.length&&gridX<grid[0].length)grid[gridY][gridX]=[ghostBlock.shape[y][x], 'silver']
			}
			if(currBlock.shape[y][x]==1){
				var gridX = x+currBlock.origin[1]
				var gridY = y+currBlock.origin[0]
				if(gridY>=0&&gridX>=0&&gridY<grid.length&&gridX<grid[0].length)grid[gridY][gridX]=[currBlock.shape[y][x], currBlock.color]
			}
		}
	}
}

var groundDelay = 0

function moveBlock(dir){
	/*
	This function moves the current block in the specified direction
	Inputs:
		dir: String, the direction to move the block
	Outputs:
		None
	*/
	var testTet
	if(dir=='slam'){
		score+=(ghostBlock.origin[0]-currBlock.origin[0])*2
		currBlock.origin=ghostBlock.origin.slice()
		makeStatic()
		checkLineClear()
		return
	}
	if(dir=='down'){
		testTet = new Block(currBlock.shape.slice(), '', currBlock.origin.slice())
		testTet.origin[0]++
		if(checkLegal(testTet)){
			currBlock.origin[0]++
			if(keyPressed.down)score++
			testTet.origin[0]++
			if(!checkLegal(testTet)&&!groundCol){
				groundCol=true
				groundDelay = Date.now()
			}
		} else {
			if(!groundCol){
				groundCol=true
				groundDelay = Date.now()
			} else if(groundCol) {
				if(Date.now()-groundDelay>=1000-delays[level]){
					makeStatic()
					checkLineClear()
					groundCol = false
				}
			}
			return
		}
	}
	//Right
	if(dir=='right'||dir=='left'){
		var legalMove=true
		var move = 1
		if(dir=='left')move=-1
		testTet = new Block(currBlock.shape.slice(), '', currBlock.origin.slice())
		testTet.origin[1]+=move
		legalMove=checkLegal(testTet)
		if(legalMove){
			currBlock.origin[1]+=move
			if(groundCol){
				groundCol=false
				moveBlock('down')
			}
		}

	}
	//Rotate
	if(dir=='rotate'){
		var newShape = new Block(rotateBlock(currBlock.shape.slice()), currBlock.color, currBlock.origin.slice())
		var legalMove = checkLegal(newShape)
		if(!legalMove){
			if(floorKickAllowed){
				newShape.origin[0]--
				legalMove = checkLegal(newShape)
				floorKickAllowed = false
				if(legalMove){
					groundCol = false
				} else {
					newShape.origin[0]++
				}
			}
			
		}

		if(!legalMove){
			newShape.origin[1]++
			legalMove = checkLegal(newShape)
			if(!legalMove){
				newShape.origin[1]-=2
				legalMove = checkLegal(newShape)
			}
		}

		if(legalMove){
			currBlock.shape = newShape.shape.slice()
			currBlock.origin = newShape.origin.slice()
		}
	}
}


function checkLegal(testBlock){
	/*
	This function checks if a block is in a legal position
	Inputs:
		testBlock: Block object, the block to check
	Outputs:
		Boolean, true if the block is in a legal position, false otherwise

	*/
	for(var y=0; y<testBlock.shape.length; y++){
		for(var x=0; x<testBlock.shape.length; x++){
			if(testBlock.shape[y][x]==1){
				var xDist = testBlock.origin[1]+x
				var yDist = testBlock.origin[0]+y
				if(yDist>=0){
					if(xDist<0||xDist>=grid[0].length||yDist>=grid.length){
						return false
					} else if(staticGrid[y+testBlock.origin[0]][x+testBlock.origin[1]][0]==1){
						return false
					}
				}
			}
		}
	}
	return true
}


function holdBlock(){
	/*
	This function handles holding a block
	If a block is already held, the current block is swapped with the held block
	If no block is held, the current block is held and the next block is made current
	Inputs:
		None
	Outputs:
		None
	*/
	if(heldBlock==''){
		heldBlock = new Block(currBlock.defShape.slice(), currBlock.color, currBlock.defOrigin.slice())
		var nextBlock = blockBag.shift()
		currBlock = new Block(nextBlock.shape.slice(), nextBlock.color, nextBlock.origin.slice())
		if(blockBag<=0)fillBlockBag()
	} else {
		var tempTet = new Block(currBlock.defShape.slice(), currBlock.color, currBlock.defOrigin.slice())
		currBlock = new Block(heldBlock.shape.slice(), heldBlock.color, heldBlock.origin.slice())
		heldBlock = tempTet
	}
	groundCol = false
}


function createGhost(){
	/*
	This function creates a ghost block that shows where the current block will land
	Inputs:
		None
	Outputs:
		None
	*/

	var tempGhost = new Block(currBlock.shape.slice(),currBlock.color,currBlock.origin.slice())
	while(true){
		var testGhost = new Block(tempGhost.shape.slice(),tempGhost.color,tempGhost.origin.slice())
		testGhost.origin[0]++
		if(checkLegal(testGhost))tempGhost.origin[0]++
		else break
	}
	ghostBlock = tempGhost
}


function checkLineClear(){
	/*
	This function checks if any lines are cleared and awards points accordingly
	Inputs:
		None
	Outputs:
		None
	*/
	var linesCleared = []
	holdAllowed = true
	floorKickAllowed = true
	//Find lines to clear
	for(var y=0; y<staticGrid.length; y++){
		var filled = true
		for(var x=0; x<staticGrid[0].length; x++)if(staticGrid[y][x][0]==0)filled=false
		if(filled)linesCleared.push(y)
	}
	var messages = ['', 'Line Cleared!', 'Double!!', 'Triple!!', 'TETRIS!!!']
	//Award score
	var b2b = false
	//Check for B2B
	//Tetris
	if(linesCleared.length==4&&lastLinesCleared==4){
		//B2B Tetris
		console.log('B2B Tetris')
		b2b = true
		score+=1200*(level+1)
		textList.message.content='B2B TETRIS!!!'
	}
	lastLinesCleared = linesCleared.length



	if(!b2b)score+=scores[linesCleared.length]*(level+1)
	if(!b2b)textList.message.content=messages[linesCleared.length]


	if(combo){
		if(linesCleared.length==1){
			score+=20*(level+1)*comboCnt
			if(!b2b)textList.message.content='Combo X'+comboCnt
			comboCnt++
		} else if(linesCleared.length>0){
			score+=50*(level+1)*comboCnt
			if(!b2b)textList.message.content='Combo X'+comboCnt
			comboCnt++
		} else {
			combo = false
			comboCount = 0
		}
	} else {
		if(linesCleared.length>0){
			combo = true
			comboCnt = 1
		}
	}
	lines+=lineCnt[linesCleared.length]
	if(lines>level*5){
		level++
		if(level>delays.length-1)level = delays.length-1
	}
	clearTimeout(msgTimeout)
	msgTimeout = ''
	//Remove lines
	linesCleared.forEach(line=>staticGrid[line]=-1)
	var i = 0
	while(i<staticGrid.length){
		if(staticGrid[i]==-1){
			staticGrid.splice(i,1)
		} else {
			i++
		}
	}

	//Create new line
	var newLine = new Array(grid[0].length)
	//Replace removed lines
	for(var i=0; i<newLine.length; i++)newLine[i]=[0,'']
	while(staticGrid.length<grid.length)staticGrid.unshift(newLine.slice())
}



function makeStatic(){
	/*
	This function makes the current block static, adding it to the static grid
	It then sets the next block as the current block, refilling the block bag if necessary
	Lastly it calls the checkGameOver function
	Inputs:
		None
	Outputs:
		None
	*/
	addBlock(currBlock)
	var nextBlock = blockBag.shift()
	currBlock = new Block(nextBlock.shape.slice(),nextBlock.color,nextBlock.origin.slice())
	if(blockBag.length<=0)fillBlockBag()
	checkGameOver()
}

function checkGameOver(){
	/* 
	This function checks if the game is over
	Inputs:
		None
	Outputs:
		None
	*/
	for(var y=0; y<currBlock.shape.length; y++){
		for(var x=0; x<currBlock.shape.length; x++){
			if(y+currBlock.origin[1]>=0){
				if(currBlock.shape[y][x]==1&&staticGrid[y+currBlock.origin[0]][x+currBlock.origin[1]][0]==1)gameState='gameOver'
			}
		}
	}
}


function addBlock(block){
	/*
	This function adds a block to the static grid
	Inputs:
		block: Block object, the block to add
	Outputs:
		None
	*/
	for(var y=0;y<block.shape.length;y++){
		for(var x=0;x<block.shape.length;x++){
			if(block.shape[y][x]==1){
				staticGrid[y+block.origin[0]][x+block.origin[1]]=[1,block.color]
			}
		}
	}
}

function fillBlockBag(){
	/*
	This function fills the block bag with all the blocks in the blocks array
	Inputs:
		None
	Outputs:
		None
	*/
	var tempBlocks = blocks.slice()
	tempBlocks = tempBlocks.reduce((a,v)=>a.splice(Math.floor(Math.random() * a.length), 0, v) && a, [])
	blockBag = tempBlocks.slice()
}

function randBlock(){
	/*
	This function returns a random block from the blocks array
	Inputs:
		None
	Outputs:
		Block object, a random block from the blocks array
	*/
	index = randInt(blocks.length)
	return new Block(blocks[index].shape.slice(), blocks[index].color, blocks[index].origin.slice())
}

var randInt=(high,low=0)=>Math.floor(Math.random()*high)+low


function createBlocks(){
	/*
	This function creates the blocks array
	Inputs:
		None
	Outputs:
		None
	*/
	var shape
	var col
	var origin
	//i
	shape = [[0,0,0,0],
			 [0,0,0,0],
			 [1,1,1,1],
			 [0,0,0,0]]
	col = '#00E4E4'
	origin = [-2, 3]
	blocks.push(new Block(shape, col, origin))
	//j
	shape = [[0,0,0],
			 [1,1,1],
			 [0,0,1]]
	col = '#004EE4'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))
	//o
	shape = [[1,1],
		 	 [1,1]]
	col = '#E4DE00'
	origin = [0, 4]
	blocks.push(new Block(shape, col, origin))
	//l
	shape = [[0,0,0],
			 [1,1,1],
			 [1,0,0]]
	col = '#E46200'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))
	//s
	shape = [[0,0,0],
			 [0,1,1],
			 [1,1,0]]
	col = '#00E427'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))
	//z
	shape = [[0,0,0],
			 [1,1,0],
			 [0,1,1]]
	col = '#E40027'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))
	//t
	shape = [[0,0,0],
			 [1,1,1],
			 [0,1,0]]
	col = '#9C13E4'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))
	if(extraBlocks)createExtraBlocks()
}

function createExtraBlocks(){
	/*
	This function creates the extra blocks for the blocks array
	The extra blocks are not part of the original Tetris game, they are custom made
	Inputs:
		None
	Outputs:
		None
	*/
	var shape
	var col
	var origin
	
	shape = [[1]]
	col = '#FF00E4'
	origin = [0, 4]
	blocks.push(new Block(shape, col, origin))

	shape = [[1,1,1],
			 [1,0,1],
			 [0,0,0]]
	col = '#08C89D'
	origin = [0, 3]
	blocks.push(new Block(shape, col, origin))

	shape = [[1,1,1],
			 [0,1,0],
			 [0,1,0]]
	col = '#78F97B'
	origin = [0, 3]
	blocks.push(new Block(shape, col, origin))

	shape = [[0,0,0],
			 [1,1,1],
			 [0,0,0]]
	col = '#E36E6E'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))

	shape = [[1,1],
			 [0,0]]
	col = '#B2A008'
	origin = [0, 4]
	blocks.push(new Block(shape, col, origin))

	shape = [[0,0,0,0],
			 [0,0,0,0],
			 [1,1,1,1],
			 [0,0,0,0]]
	col = '#009E0F'
	origin = [-2, 3]
	blocks.push(new Block(shape, col, origin))

	shape = [[1,1,0],
			 [1,0,0],
			 [0,0,0]]
	col = '#696767'
	origin = [0, 5]
	blocks.push(new Block(shape, col, origin))


	shape = [[0,1,0],
			 [1,1,0],
			 [0,0,0]]
	col = '#053A43'
	origin = [0, 5]
	blocks.push(new Block(shape, col, origin))

	shape = [[0,0,0,0],
			 [1,1,1,1],
			 [0,1,1,0],
			 [0,0,0,0]]
	col = '#FF0000'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))

	shape = [[0,0,0],
			 [1,1,1],
			 [0,1,1]]
	col = '#8AF7DA'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))

	shape = [[0,0,0],
			 [1,1,1],
			 [1,1,0]]
	col = '#5F9805'
	origin = [-1, 3]
	blocks.push(new Block(shape, col, origin))
}