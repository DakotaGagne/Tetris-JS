/*
text.js

This file contains the Text class and the textList object. 
The Text class is used to create text objects that can be rendered on the canvas. 
The textList object contains all the text objects that are rendered on the canvas.
Used as a support file for Tetris JS

*/
var Text = function(x, y, content, size=10, font='Arial', col='white', bold='400'){
	// Text object
	this.content = content
	this.bold = bold
	this.italic = 'normal'
	this.variant = 'normal'
	this.x = Math.round(x)
	this.y = Math.round(y)
	this.font = `${this.italic} ${this.variant} ${this.bold} ${size}px ${font}`
	this.size = size
	this.col = col
	this.textAlign = 'right'
	this.render = function(){
		ctx.beginPath()
		ctx.font = this.font
		ctx.fillStyle = this.col
		ctx.textAlign = this.textAlign
		ctx.fillText(this.content, this.x, this.y)
	}
}

var textList = {}

function setupText(){
	if(mobile){
		var leftMargin = gameArea[0]-board.squareSize
		var gap = c.height * 0.05
		var top = c.height * 0.60
		var bigFont = 90
		var smFont = 35
	} else {
		var leftMargin = gameArea[0]-c.width*0.05
		var gap = c.height * 0.1 
		var top = c.height * 0.5
		var bigFont = 80
		var smFont = 35
	}
	
	textList.title = new Text(leftMargin, top, 'Tetris', bigFont, 'Trebuchet MS', 'limegreen', 'bold')
	top+=gap
	textList.highscore = new Text(leftMargin, top, 'Best: 0', smFont, 'Trebuchet MS', '#53E9E4', '600')
	top+=gap
	textList.score = new Text(leftMargin, top, 'Score: 0', smFont, 'Trebuchet MS', '#53E9E4', '600')
	top+=gap
	textList.level = new Text(leftMargin, top, 'Level: 0', smFont, 'Trebuchet MS', '#DC567F', 'normal')
	top+=gap
	textList.lines = new Text(leftMargin, top, 'Lines: 0', smFont, 'Trebuchet MS', '#DC567F', 'normal')

	textList.next = new Text(0, 0, 'NEXT', smFont, 'Trebuchet MS', '#FFF15B', 'bold')
	textList.hold = new Text(0, 0, 'HOLD', smFont, 'Trebuchet MS', '#FFF15B', 'bold')
	textList.next.textAlign = 'center'
	textList.hold.textAlign = 'center'
	if(mobile){
		textList.message = new Text(c.width*0.5, c.height*0.12, '', 50, 'Arial', '#70ED70', 'bold')
		textList.message.textAlign = 'center'
	} else {
		textList.message = new Text(gameArea[0]+gameArea[2]+board.squareSize, c.height*0.5, '', 50, 'Arial', '#70ED70', 'bold')
		textList.message.textAlign = 'left'
	}
}

var timeoutSet = false

function renderText(){
	/*
	This function renders all the text objects in the textList object to the canvas.
	Inputs: 
		None
	Outputs: 
		None
	*/
	textList.score.content = 'Score: ' + score
	textList.highscore.content = 'Best: ' + highscore
	textList.level.content = 'Level: ' + level
	textList.lines.content = 'Lines: ' + lines

	textList.title.render()
	textList.score.render()
	textList.highscore.render()
	textList.level.render()
	textList.lines.render()
	textList.message.render()
	textList.hold.render()
	textList.next.render()

	if(textList.message.content!=''&&!timeoutSet){
		msgTimeout=setTimeout(()=>textList.message.content='',2000)
		setTimeout(timeoutSet=false, 2000)
		timeoutSet=true
	}
}