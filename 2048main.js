var score = 0;
var board = new Array();
//声明冲突数组
var hasConflict = new Array();
$(document).ready(function() {
    newgame();
});

function newgame() {
    //初始化棋盘
    init();
    //随机生成两个数字
    getOneNumber();
    getOneNumber();

}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridcell = $("#grid-cell-" + i + "-" + j);
            console.log(gridcell);
            gridcell.css('top', getPosTop(i, j));
            gridcell.css('left', getPosLeft(i, j));
        }
    }
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflict[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflict[i][j] = false;
        }
    }
    updataBoardView();
    score = 0;
}

function updataBoardView() {
    // 每次更新先清除以前的
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('.grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            // var numbercell = $(".number-cell");
            var numbercell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                //宽度高度要加像素单位px
                numbercell.css('width', '0px');
                numbercell.css('height', '0px');
                // 调用函数不要忘记传实参
                numbercell.css('top', getPosTop(i, j) + 50);
                numbercell.css("left", getPosLeft(i, j) + 50);
            } else {
                numbercell.css('width', '100px');
                numbercell.css('height', '100px');
                numbercell.css('top', getPosTop(i, j));
                numbercell.css('left', getPosLeft(i, j));
                //  jQuery 样式里的背景颜色是background-color
                numbercell.css('background-color', getNumberBackGroundColor(board[i][j]));
                numbercell.css('color', getNumberColor(board[i][j]));
                // 要在numbercell里显示数字的值
                numbercell.text(board[i][j]);
            }
            hasConflict[i][j] = false;
        }
    }
}

function getOneNumber() {
    //判断是否有位置
    if (nospace(board)) {
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) {
        if (board[randx][randy] == 0) {
            break;
        }
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randx = i;
                    randy = j;
                    break;
                }
            }
        }
    }
    //随机一个数字
    var randNum = Math.random() > 0.5 ? 2 : 4;
    //数字给位置
    board[randx][randy] = randNum;
    showNumWithAnimation(randx, randy, randNum);

    return true;
}
$(document).keydown(function(e) {
    switch (e.keyCode) {
        case 37:
            if (moveLeft()) {
                getOneNumber();
                isgameover();
            }
            break;
        case 38:
            if (moveUp()) {
                getOneNumber();
                isgameover();
            }
            break;
        case 39:
            if (moveRight()) {
                getOneNumber();
                isgameover();
            }
            break;
        case 40:
            if (moveDown()) {
                getOneNumber();
                isgameover();
            }
            break;
        default:
            break;
    }

})

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noblockX(i, k, j, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noblockX(i, k, j, board) && hasConflict[i][k] == false) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        // add score
                        score += board[i][k];
                        updateScore(score);
                        hasConflict[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updataBoardView()', 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noblockY(k, i, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noblockY(k, i, j, board) && hasConflict[k][j] == false) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflict[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updataBoardView()', 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    //往右移时落脚点从右往左找
    // for (var i = 0; i < 4; i++) {
    //     for (var j = 0; j < 3; j++) {
    //         if (board[i][j] != 0) {
    //             for (var k = j + 1; k < 4; k++) {
    //                 if (board[i][k] == 0 && noblockX(i, j, k, board)) {
    //                     showMoveAnimation(i, j, i, k);
    //                     board[i][k] = board[i][j];
    //                     board[i][j] = 0;
    //                     continue;
    //                 } else if (board[i][k] == board[i][j] && noblockX(i, j, k, board)) {
    //                     showMoveAnimation(i, j, i, k);
    //                     board[i][k] += board[i][j];
    //                     board[i][j] = 0;
    //                     continue;
    //                 }
    //             }
    //         }
    //     }
    // }
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noblockX(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noblockX(i, j, k, board) && hasConflict[i][k] == false) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflict[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updataBoardView()', 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noblockY(i, k, j, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noblockY(i, k, j, board) && hasConflict[k][j] == false) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflict[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updataBoardView()', 200);
    return true;
}

function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert("gameover");
}