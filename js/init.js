var board = [];//储存数字方格变化的数字
var score = 0;
var bestScore = 0;

(function(){
	if(localStorage.score){
		score = parseInt(localStorage.score);
		bestScore = parseInt(localStorage.bestScore);
	}
	
	newGame();
})();

function newGame(){
	/*if(newG){
		init();
		getANumber(200,board);
		getANumber(200,board);
		storage();
	}else{
		board = strToDbarr(localStorage.board);
		updateBoard();
	}*/
	init();

	$(".game-over").css({"top":$(".game-container").height()});

}

function init(){
	//初始化board
	if(localStorage.board && score!=0){
		if(!ifGameOver(strToDbarr(localStorage.board))){
			board = strToDbarr(localStorage.board);
			updateBoard();
			return board;
		}
		score = 0;
	}

	var row = $(".row-grid-container");
	for(var i=0;i<row.length;i++){
		var col = row.eq(i).children(".grid-cell");
		board[i] = [];
		for(var j=0;j<col.length;j++){
			board[i][j] = 0;
		}
	}
	
	//刚开始要随机生成两个数字才能开始游戏
	getANumber(200,board);
	getANumber(200,board);


	//当有操作时，更新board数组数据，并显示
	updateBoard();
	return board;
}

function updateBoard(){
	$(".number-cell").remove();

	var row = $(".row-grid-container");
	for(var i=0;i<row.length;i++){
		var col = row.eq(i).children(".grid-cell");
		for(var j=0;j<col.length;j++){
			row.eq(i).append("<div class='number-cell'></div>");
			var numberCell = row.eq(i).children(".number-cell");
			if(board[i][j]==0){
				numberCell.eq(j).css({
					"width":0,
					"height":0,
					"top":getTop(i,j)+$(".grid-cell").width()/2,//将没有数字的空格的位置调整到格子中间，为了动画显示好看
					"left":getLeft(i,j)+$(".grid-cell").height()/2
				});
			}else{
				numberCell.eq(j).css({
					"width":$(".grid-cell").width(),
					"height":$(".grid-cell").height(),
					"top":getTop(i,j),
					"left":getLeft(i,j),
					"background-color":getBgColor(board[i][j]),
					"color":getColor(board[i][j])
				});

				if(board[i][j].toString().length>=4){
					numberCell.eq(j).css({
						"font-size":parseInt($(".grid-cell").css("font-size"))-5+"px"
					});
				}

				numberCell.eq(j).text(board[i][j]);
				//showNumber(i,j,board[i][j],1);
			}
		}
	}

	$("#current-score").text(score);

	if(score >= bestScore){
		$("#best-score").text(score);
		bestScore = score;
	};
 	
 	$("#best-score").text(bestScore);

	storage();
}

$(".new-game").on("click",function(){
	score = 0;
	newGame(true);
});

$(document).keydown(function(ev) {
	switch(ev.keyCode){
		case 37:
				if(canMoveLeft(board)){
					moveLeft();
					getANumber(1000,board);
					storage();
					isGameOver(board);
				};
				break;
		case 38:if(canMoveUp(board)){
					moveUp();
					getANumber(1000,board);
					storage();
					isGameOver(board);
				};
				break;
		case 39:
				if(canMoveRight(board)){
					moveRight();
					getANumber(1000,board);
					storage();
					isGameOver(board);
				};
				break;
		case 40:
				if(canMoveDown(board)){
					moveDown();
					getANumber(1000,board);
					storage();
					isGameOver(board);
				};
				break;
	}
});


function moveLeft(){
	//避免按一下键造成整排或者整列的一次性添加
	var noRepeatAdd = [[true,true,true,true],[true,true,true,true],[true,true,true,true],[true,true,true,true]];

	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){

			if(board[i][j]!=0){
				for(var k=0;k<j;k++){

					if(board[i][k]==0 && noObstacle(i,k,i,j,board)){
						move(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					}else if(board[i][k] == board[i][j] && noObstacle(i,k,i,j,board) && noRepeatAdd[i][k]){
						move(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						noRepeatAdd[i][k] = false;
						score += board[i][k];
						break;
					}
				}
			}
		}
	}
	setTimeout("updateBoard()",220);
}

function moveUp(){
	//避免按一下键造成整排或者整列的一次性添加
	var noRepeatAdd = [[true,true,true,true],[true,true,true,true],[true,true,true,true],[true,true,true,true]];

	for(var i=1;i<4;i++){
		for(var j=0;j<4;j++){

			if(board[i][j]!=0){
				for(var k=0;k<i;k++){

					if(board[k][j] == 0 && noObstacle(k,j,i,j,board)){
						move(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						break;
					}else if(board[k][j] == board[i][j] && noObstacle(k,j,i,j,board) && noRepeatAdd[k][j]){
						move(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						noRepeatAdd[k][j] = false;
						score += board[k][j];
						break;
					}
				}
			}
		}
	}

	setTimeout("updateBoard()",220);
}

function moveRight(){
	//避免按一下键造成整排或者整列的一次性添加
	var noRepeatAdd = [[true,true,true,true],[true,true,true,true],[true,true,true,true],[true,true,true,true]];

	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){

			if(board[i][j] != 0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0 && noObstacle(i,j,i,k,board)){
						move(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						break;
					}else if(board[i][k] == board[i][j] && noObstacle(i,j,i,k,board) && noRepeatAdd[i][k]){
						move(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						noRepeatAdd[i][k] = false;
						score += board[i][k];
						break;
					}
				}
			}
		}
	}

	setTimeout("updateBoard()",220);
}

function moveDown(){
	//避免按一下键造成整排或者整列的一次性添加
	var noRepeatAdd = [[true,true,true,true],[true,true,true,true],[true,true,true,true],[true,true,true,true]];

	for(var i=2;i>=0;i--){
		for(var j=0;j<4;j++){

			if(board[i][j] != 0){
				for(var k=3;k>i;k--){

					if(board[k][j] == 0 && noObstacle(i,j,k,j,board)){
						move(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						break;
					}else if(board[k][j] == board[i][j] && noObstacle(i,j,k,j,board) && noRepeatAdd[k][j]){
						move(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						noRepeatAdd[k][j] = false;
						score += board[k][j];
						break;
					}
				}
			}
		}
	}

	setTimeout("updateBoard()",220);
}

function storage(){
	if(window.localStorage){
		var storage = window.localStorage;

		storage.score = $("#current-score").text();
		storage.bestScore = $("#best-score").text();
		storage.board = board;
			
	}else{
		alert("Your broswer doesn't support localstorage!");
	}
}

