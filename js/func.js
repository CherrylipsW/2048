function getBgColor(number){
	var color = "#000000"
	switch(number){
		case 2: color="#EEE4DA";
				break;
		case 4: color="#EDE0C8";
				break;
		case 8: color="#F2B179";
				break;
		case 16:color="#F59563";
				break;
		case 32: color="#F67F5F";
				 break;
		case 64: color="#F65E3A";
				 break;
		case 128: color="#EDCF72";
				 break;
		case 256: color="#EDCC61";
				  break;
		case 512: color="#EDC850";
				  break;
		case 1024: color="#EDC53F";
				   break;
		case 2048: color="#EDC212";
				   break;
	}

	return color;
}

function getColor(number){
	var color="#000000";
	if(number<=4){
		color = "#776E65";
	}else{
		color = "#F9F6F2";
	}

	return color;
}

function getANumber(speed,board){
	if(noSpace(board)){
		return false;
	}
	var ranX = parseInt(Math.floor(Math.random()*4));
	var ranY = parseInt(Math.floor(Math.random()*4));

	var time = 0;//寻找空格的次数
	while(time<=50){
		if(!board[ranX][ranY]){
			break;
		}

		var ranX = parseInt(Math.floor(Math.random()*4));
		var ranY = parseInt(Math.floor(Math.random()*4));

		time++;
	}

	if(time>50){
		for(var i=0;i<4;i++){
			for (var j=0;j<4;j++){
				if(board[i][j]==0){
					ranX = i;
					ranY = j;
				}
			}
		}
	}
	//随机生成数字2或4，概率分别为2/3,1/3
	var num = Math.random()<0.67? 2:4;
	showNumber(ranX,ranY,num,speed);
	board[ranX][ranY] = num;

}

function noSpace(board){
	for (var i=0;i<4;i++) {
		for(var j=0;j<4;j++){
			if(board[i][j]==0)
				return false;
		}
	}

	return true;
}

function showNumber(i,j,num,speed){
	var row = $(".row-grid-container");
	var col = row.eq(i).children(".number-cell");

	col.eq(j).css({
		"background-color":getBgColor(num),
		"color":getColor(num)
	});

	col.eq(j).animate({
		"width":$(".grid-cell").width(),
		"height":$(".grid-cell").height(),
		"top":getTop(i,j),
		"left":getLeft(i,j)
	},speed);

	if(num.toString().length>=4){
		col.eq(j).css({
			"font-size":parseInt($(".grid-cell").css("font-size"))-5+"px"
		});
	}

	col.eq(j).text(num);
}



function getTop(i,j){
	var row = $(".row-grid-container");
	var col = row.eq(i).children(".grid-cell");
	var colTop = col.eq(j).offset().top;
	var containerTop = $(".game-container").offset().top;

	var top = colTop - containerTop;

	return top;
}

function getLeft(i,j){
	var row = $(".row-grid-container");
	var col = row.eq(i).children(".grid-cell");
	var colLeft = col.eq(j).offset().left;
	var containerLeft = $(".game-container").offset().left;

	var left = colLeft - containerLeft;

	return left;
}

function canMoveLeft(board){
	//只需遍历除最左边一列的剩余三列的格子
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				if(board[i][j-1]==0 || board[i][j-1]==board[i][j])
					return true;
			}
		}
	}

	return false;
}

function canMoveUp(board){
	//只需遍历除最上一行的剩余三行的格子
	for(var i=1;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j]!=0){
				if(board[i-1][j]==0 || board[i-1][j]==board[i][j])
					return true;
			}
		}
	}

	return false;
}
function canMoveRight(board){
	for(var i=0;i<4;i++){
		for(var j=0;j<3;j++){
			if(board[i][j]!=0){
				if(board[i][j+1]==0 || board[i][j+1] == board[i][j])
					return true;
			}
		}
	}

	return false;
}
function canMoveDown(board){
	for(var i=0;i<3;i++){
		for(var j=0;j<4;j++){
			if(board[i][j]!=0){
				if(board[i+1][j] == 0 || board[i+1][j] == board[i][j])
					return true;
			}
		}
	}

	return false;
}

function isGameOver(board){
	if(isWin(board)){
		gameover("You Win!");
	}

	if(noSpace(board) && !canMoveLeft(board) && !canMoveUp(board) && !canMoveRight(board) && !canMoveDown(board)){
		gameover("Game Over!");
	}
}

function ifGameOver(board){
	if(isWin(board) || (noSpace(board) && !canMoveLeft(board) && !canMoveUp(board) && !canMoveRight(board) && !canMoveDown(board))){
		return true;
	}
	return false;
}

function gameover(string){
	$(".game-over").css({
		"line-height":$(".game-container").height() + "px"
	});

	$(".game-over").animate({
		"top":0
	});

	$(".game-over").text(string);
}

function isWin(board){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j] == 2048){
				return true;
			}
		}
	}

	return false;
}



function noObstacle(row1,col1,row2,col2,board){

	if(row1 == row2){
		for(var i=col1+1;i<col2;i++){
			if(board[row1][i]!=0)
				return false;
		}
	}

	if(col1 == col2){
		for(var i=row1+1;i<row2;i++){
			if(board[i][col1] != 0)
				return false;
		}
	}

	return true;
}

function move(xFrom,yFrom,xTo,yTo){
	var col = $(".row-grid-container").eq(xFrom).children(".number-cell");
	col.eq(yFrom).animate({
		"top":getTop(xTo,yTo),
		"left":getLeft(xTo,yTo)
	},200);

}

function strToDbarr(string){
	var arr1 = string.split(",");
	for(var i=3;i<arr1.length-4;i+=4){
		arr1[i] += " ";
	}
	string = arr1.join(".");
	arr1 = string.split(" .");

	for(var j=0;j<arr1.length;j++){
		arr1[j] = arr1[j].split(".");
	}

	for(var i=0;i<arr1.length;i++){
		for(j=0;j<arr1[i].length;j++){
			arr1[i][j] = parseInt(arr1[i][j]);
		}
	}

	return arr1;
}

/*function isNew(board){
	for(var i=0;i<board.length;i++){
		for(var j=0;j<board[i].length;j++){
			if(board[i][j]!=0)
				return false;
		}
	}

	return true;
}*/
