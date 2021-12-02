class Connect4 {
    constructor(selector) {
        this.COL = 7;
        this.ROW = 6;
        this.player = 'rouges';
        this.selector = selector;
        this.GameOver = false;
        this.onPlayerMove = function(){};
        this.createGrid();
        this.setupEventListener();
    }
    // faire la grille
    createGrid() {
        const $board = $(this.selector);
        $board.empty();
        this.player = 'rouges';
        this.GameOver = false;
        for (let row = 0; row < this.ROW; row++) {
            const $row = $('<div>')
                .addClass('row');

            for (let col = 0; col < this.COL; col++) {

                const $col = $('<div>')
                    .addClass('col empty')
                    .attr('data-col', col)
                    .attr('data-row', row);
                $row.append($col);

            }
            $board.append($row);
        }

    }

    setupEventListener() {
        const $board = $(this.selector);
        const that = this;

        function findLastEmptyCellul(col) {
            const cells = $(`.col[data-col='${col}']`);
            for (let i = cells.length - 1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass('empty')) {
                    return $cell;
                }

            }
            return null;
        }

        $board.on('mouseenter', '.col.empty', function () {
            const col = $(this).data('col');
            const $lastEmptyCellul = findLastEmptyCellul(col);
            $lastEmptyCellul.addClass(`next-${that.player}`);
        })

        $board.on('mouseleave', '.col', function () {
            $('.col').removeClass(`next-${that.player}`);
        })
        $board.on('click', '.col.empty', function () {
            if(that.GameOver) return;
            const col = $(this).data('col');
            const $lastEmptyCellul = findLastEmptyCellul(col);
            $lastEmptyCellul.removeClass(`empty next-${that.player}`);
            $lastEmptyCellul.addClass(that.player);
            $lastEmptyCellul.data('player', that.player);

            const winner = that.checkForWinner(
                $lastEmptyCellul.data('row'),
                $lastEmptyCellul.data('col'));

            if (winner) {
                that.GameOver = true;
                alert(`Partie terminée, les ${that.player} ont gagné !
Si vouliez-vous jouer à nouveau, cliquez sur le button restart en dessous!`);
                $('.col.empty').removeClass('empty');
                return
            }

          
            that.player = (that.player === 'rouges') ? 'jaunes' : 'rouges';
            that.onPlayerMove();
            $(this).trigger('mouseenter');
        })


    }
    checkForWinner(row, col) {
        const that = this;

        function $getCell(i, j) {
            return $(`.col[data-row='${i}'][data-col='${j}']`);
        }

        function checkDirection(direction) {
            let total = 0;
            let i = row + direction.i;
            let j = col + direction.j;
            let $next = $getCell(i, j);
            while (i >= 0 &&
                i < that.ROW &&
                j >= 0 &&
                j < that.COL &&
                $next.data('player') === that.player) {
                total++;
                i += direction.i;
                j += direction.j;
                $next = $getCell(i, j)
            }
            return total;
        }

        function checkWin(directionA, directionB) {

            const total = 1 +
                checkDirection(directionA) +
                checkDirection(directionB);
            if (total >= 4) {
                return that.player;
            } else {
                return null;
            }
        }

        function checkVertical() {
            return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
        }

        function diagonalRight(){
            return checkWin({ i: 1, j: -1 }, { i: 1, j: 1 });
        }

        function checkHorizontal() {
            return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
        }

        function diagonalLeft(){
            return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 });
        }

        return checkVertical() || checkHorizontal() || diagonalRight() || diagonalLeft();
    }

    restart(){
        this.createGrid();
    }
}