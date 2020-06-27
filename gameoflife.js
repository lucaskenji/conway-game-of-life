$(document).ready(function() {
	// Draw grid
	let rows = Array(20);
	let cols = Array(400);
	for (let i = 0; i < 20; i++) {
		rows[i] = "<tr id=\"row" + String(i) + "\"></tr>";
		for (let j = 0; j < 20; j++) {
			cols[j + (i * 20)] = "<td class=\"cell\" id=\"cell" + String(j + (i*20)) + "\">&nbsp;</td>";
		}
	}
	$("#grade").html(rows.join(""));
	for (let i = 0; i < 20; i++) {
		$("#row" + String(i)).html(cols.slice(i * 20, i * 20 + 20));			
	}
	$(".cell").css("background-color","darkgray");
	// Create grid as array
	// "grade" is a bidimensional array, with 20 rows each with 20 columns
	// "pregrade" is an auxiliar array, a copy of "grade", because it's necessary during each generation.
	let grade = Array(20);
	let pregrade = Array(20);
	for (let i = 0; i < 20; i++) {
		grade[i] = Array(20);
		pregrade[i] = Array(20);
		for (let j = 0; j < 20; j++) {
			grade[i][j] = false;
			pregrade[i][j] = false;
		}
	}
	// Basic setup, 1 cell on the middle
	$("#cell209").css("background-color", "green");
	grade[10][9] = true;
	let gen_number = 0;
	let cell_number = 1;
	
	function howManyNeighbours(x, y) {
		let count = 0;
		// Check top neighbours
		if (x > 0) {
			if (y > 0) {
				if (pregrade[x-1][y-1] == true) {
					count++;
				}
			}
			if (y < 19) {
				if (pregrade[x-1][y+1] == true) {
					count++;
				}
			}
			if (pregrade[x-1][y] == true) {
				count++;
			}
		}
		// Check neighbours on the same level
		if (y > 0) {
			if (pregrade[x][y-1] == true) {
				count++;
			}
		}
		if (y < 19) {
			if (pregrade[x][y+1] == true) {
				count++;
			}
		}
		// Check neighbours on the bottom level
		if (x < 19) {
			if (y > 0) {
				if (pregrade[x+1][y-1] == true) {
					count++;
				}
			}
			if (y < 19) {
				if (pregrade[x+1][y+1] == true) {
					count++;
				}
			}
			if (pregrade[x+1][y] == true) {
				count++;
			}
		}
		return count;
	};
	
	function changeState(x, y) {
		// If the cell is dead but there's 3 neighbours, reproduction insues
		let state = pregrade[x][y];
		let neighbours = howManyNeighbours(x, y);
		if (state == false && neighbours == 3) {
			grade[x][y] = true;
			cell_number++;
			return;
		}
		// If a cell is alive
		if (state) {
			if (neighbours < 2) {
				// less than 2 alive neighbours, dies from starvation(?)
				cell_number--;
				grade[x][y] = false;
			} else if (neighbours > 3) {
				// more than 3 alive neighbours, dies from overpopulation
				cell_number--;
				grade[x][y] = false;
			}
			// With 2 or 3 neighbours, remains alive.
			return;
		}
	}
	
	function updateGrade(repeat) {
		for (let k = 0; k < repeat; k++) {
			gen_number++;
			for (let i = 0; i < 20; i++) {
				for (let j = 0; j < 20; j++) {
					pregrade[i][j] = grade[i][j];
				}
			}
			for (let i = 0; i < 20; i++) {
				for (let j = 0; j < 20; j++) {
					changeState(i, j);
					if (grade[i][j] == false) {
						$("#cell" + String((i * 20) + j)).css("background-color", "darkgray");
					} else {
						$("#cell" + String((i * 20) + j)).css("background-color", "green");
					}
				}
			}
		}
	}
	
	function updateValues() {
		$("#gen_number").text(String(gen_number));
		$("#cell_number").text(String(cell_number));
	}
	
	$("#botao").click(function() {
		updateGrade(1);
		updateValues();
	});
	
	$("#botao10").click(function() {
		updateGrade(10);
		updateValues();
	});
	
	$("#botaoclear").click(function() {
		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 20; j++) {
				grade[i][j] = false;
				pregrade[i][j] = false;
				$("#cell" + String((i * 20) + j)).css("background-color", "darkgray");
			}
		}
		cell_number = 0;
		gen_number = 0;
		updateValues();
	});
	
	$(".cell").click(function() {
		let id_clicked = Number($(this).attr("id").replace("cell", ""));
		// Gets row and column position of clicked cell
		let pos_r = 0;
		let pos_c = 0;
		if (((id_clicked - (id_clicked % 10))/10) % 2 == 0) {
			pos_c = id_clicked % 10;
			pos_r = (id_clicked - (id_clicked % 10)) / 20;
		} else {
			pos_c = id_clicked % 10 + 10;
			pos_r = ((id_clicked - (id_clicked % 10)) / 20) - 0.5;
		}
		// Kills or gives birth to cell in said position
		grade[pos_r][pos_c] = !grade[pos_r][pos_c];
		if (grade[pos_r][pos_c] == true) {
			$(this).css("background-color", "green");
			cell_number++;
		} else {
			$(this).css("background-color", "darkgray");
			cell_number--;
		}
		updateValues();
	});
});