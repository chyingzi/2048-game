function showNumWithAnimation(i, j, randNum) {
    var numbercell = $('#number-cell-' + i + '-' + j);
    numbercell.css('background-color', getNumberBackGroundColor(randNum));
    numbercell.css('color', getNumberColor(randNum));
    numbercell.text(randNum);

    numbercell.animate({
        'width': '100px',
        'height': '100px',
        'top': getPosTop(i, j),
        'left': getPosLeft(i, j)
    }, 50);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
    var numbercell = $('#number-cell-' + fromx + '-' + fromy);
    numbercell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);
}

function updateScore(score) {
    $('#score').text(score);
}