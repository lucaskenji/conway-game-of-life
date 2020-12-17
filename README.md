# Conway's Game of Life

This was one of my first projects using JavaScript. It used to be a project made with jQuery.
On December 16, 2020, I practically remade the entire project due to the amount of mistakes it had.

Here's a summary of what was done during refactoring:
* Fixed unorganized code, applying functions in order to obtain reusability
* Replaced magic numbers with constants
* Fixed bad function and variable naming
* jQuery wasn't needed at all
* Got rid of a lot of hardcode
* Separated HTML and CSS from JS code

## Getting started

To run this project, follow these steps:

1. Use `git clone` to download the repository in your machine
2. Simply open the index.html file on your browser

## Game rules

This specific interpretation of the game contains a 12x12 grid with 144 cells. Players can create or kill cells using the mouse, or simply skip to a next generation.
During each generation, the following can occur:
* Any live cell with two or three live neighbours survives.
* Any dead cell with three live neighbours becomes a live cell.
* All other live cells die in the next generation. Similarly, all other dead cells stay dead.

You can look up the [Wikipedia page](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) for more information.