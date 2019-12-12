/**
 * @desc
 * A Closure with all private properties & methods. Everything in the HTML document is built with pure JS to achieve complete abstraction.
 */
(function (window, document) {
    let rows = 3,
        cols = 3,
        originalArray = [],
        randomArray = [];

	/**
	 * @name createButton
	 * @typicalname createButton
	 * @param {Node} footer  - footer node
	 * @param {string} text  - text to be displayed on button
	 * @param {function} fun  - function name
	 * @param {number|null} gridConfig - for row*col specification
	 * @desc - To create a button element and appends to footer
	 * @usage
	 * createButton(tagname)
	 */
	function createButton(footer, text, fun, gridConfig) {
		let btn = document.createElement('a');
		btn.innerHTML = text;
		btn.href = 'javascript:;';
		btn.className = 'btn';
		btn.addEventListener("click", function() {
			if (!gridConfig) {
				(fun) ? fun() : window.location.reload();
			}
			else {
				fun(gridConfig);
			}
		});
		footer.appendChild(btn);
	}


	/**
	 * @name resetBoard
	 * @typicalname resetBoard
	 * @desc To reset the currently saved board to initial state
	 * @usage
	 * resetBoard()
	 */
	function resetBoard() {
        setGrid(rows);
		localStorage.clear();
	}


	/**
	 * @name saveState
	 * @typicalname saveState
	 * @desc - To save the state of the board into localstorage
	 * @usage
	 * saveState()
	 */
	function saveState() {
		let board = {
			'rows': rows,
			'cols': cols
            },
            blocks = [],
            arr = document.getElementsByClassName('block');

		for (let item = 0; item < arr.length; item++) {
			if (arr[item]) {
				let blockObj = {};
				blockObj['id'] = arr[item].id;
				blockObj['color'] = arr[item].style.backgroundColor;
				blocks.push(blockObj);
			}
		}
		board['blocks'] = blocks;
		localStorage.setItem('my-board', JSON.stringify(board));
		alert("Board state saved successfully !");
    };
    

    /**
	 * @name createRandomArray
	 * @typicalname createRandomArray
	 * @desc To create random array with given max limit
	 * @usage
	 * createRandomArray()
	 */
    function createRandomArray(max) {
        for(let i=0;i<max;i++) {
            originalArray.push(i);
        }
        randomArray = (originalArray.slice(0)).sort(() => Math.random() - 0.5);
    }


    /**
	 * @name moveBlock
	 * @typicalname moveBlock
	 * @desc To swap element block value with blank space if elment is having neighbour blank block
	 * @usage
	 * moveBlock()
	 */
    function moveBlock(e) {
        let sourceId = e.target.id,
            sourceElement = document.getElementById(sourceId),
            innerValue = e.target.innerHTML,
            min = parseInt(sourceId.split('-')[0]),
            max = parseInt(sourceId.split('-')[1]),
            possibilities = [];

        if(min-1 >= 0) {
            possibilities.push((min-1)+'-'+max);
        }
        if((max-1 >= 0 && max-1 < cols )) {
            possibilities.push(min+'-'+(max-1));
        }
        if(min+1 <rows) {
            possibilities.push((min+1)+'-'+max)
        }
        if(max+1 < cols) {
            possibilities.push(min+'-'+(max+1));
        }

        for(let i=0;i<possibilities.length;i++) {
            let targetElement = document.getElementById(possibilities[i]);
            if(targetElement && targetElement.innerHTML == '') {
                targetElement.innerHTML = innerValue;
                targetElement.style.background = 'white';
                sourceElement.innerHTML = '';
                sourceElement.style.background = 'red';
                if(sourceId == (rows-1)+'-'+(cols-1) && checkGameWinning()) {
                   alert('you won the game');
                } 
                break;
            }
        }
    }


    /**
	 * @name checkGameWinning
	 * @typicalname checkGameWinning
	 * @desc To check whether user won the game or not
	 * @usage
	 * checkGameWinning()
	 */
    function checkGameWinning() {
        let counter = 0;
        for(let i= 0;i<rows;i++) {
            for(let j = 0;j<cols;j++) {
                let targetValue = document.getElementById(i+'-'+j).innerHTML;
                if(originalArray[counter] != targetValue) {
                    return false;
                }
                counter++;
            }
        }
        return true;
    }

	/**
	 * @name createBlocks
	 * @typicalname createBlocks
	 * @param {number} row  - number of rows
	 * @param {number} col  - number of cols
	 * @param {object|null} blocks  - Blocks object with saved color codes
	 * @desc - To create the board according to the data
	 * @usage
	 * createBlocks(5, 5, {});
	 */
	function createBlocks(row, col, blocks) {
		rows = row;
		cols = col;
		let len = (blocks) ? blocks.length : rows * cols;
		let frag = document.createDocumentFragment(),
		    board = document.createElement('div');
		board.className = 'board';
        board.style.width = 75 * cols + "px";
        originalArray.length = 0;
        randomArray.length = 0;
        createRandomArray(row*col);

        for(let i = 0;i < row; i++) {
            for(let j = 0; j<col; j++) {
                let block = document.createElement('div');
                block.className = 'block';
                let innerData = randomArray.pop();
                if(innerData == 0) {
                    block.innerHTML = '';
                    block.style.background = 'red';
                } else {
                    block.innerHTML = innerData;
                }
                block.id = i+'-'+j;
                block.addEventListener("click", moveBlock);
                board.appendChild(block);
            }
        }

		frag.appendChild(board);
		let mainContent = document.getElementById('main-content');
		mainContent.appendChild(frag);

    }
    
	/**
	 * @name setGrid
	 * @typicalname setGrid
	 * @param {number} num config  - Creating a grid according to the given measurment
	 * @desc - To create a button element and appends to footer
	 * @usage
	 * createButton(tagname)
	 */
	function setGrid (num) {
        rows = cols = num;
		document.getElementById('main-content').innerHTML = '';
		localStorage.clear();
		createBlocks(num, num);
	}


	if (localStorage.getItem('my-board')) {
		let board = JSON.parse(localStorage.getItem('my-board'));
		createBlocks(board.rows, board.cols, board.blocks);
	}
	else {
		createBlocks(rows, cols);
	}

	let footer = document.getElementById('footer');
	let gridConf = document.getElementById('grid-config');

	createButton(footer, 'Reset', resetBoard);
	createButton(footer, 'Save state', saveState);
	createButton(footer, 'Refresh page');


	createButton(gridConf, 'Easy Level', setGrid , 3);
	createButton(gridConf, 'Medium Level', setGrid, 4);
	createButton(gridConf, 'Hard Level', setGrid , 5);

	return {};

})(window, document);