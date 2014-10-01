Conway's Game of Life - Implemented with JavaScript
===
Wikipedia Link:  
http://en.wikipedia.org/wiki/Conway's_Game_of_Life

The game is based on a two dimensional array. A grid is painted on a canvas
element to visualize the array.  

Starting from an initial state, the rules of the game are applied to change the
state of each cell.  

The rules are:  

1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.  

2. Any live cell with two or three live neighbours lives on to the next generation.  

3. Any live cell with more than three live neighbours dies, as if by overcrowding.  

4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.  

Each step is lasting one second and the whole board is evaluated again.  

Project Organisation
===
package.json - used to load all required modules with npm (use the command npm install, install node first)  

gulpfile.js - build process tool (use the command gulp in terminal, install gulp first)  

gulp is using browserify to manage the client side module loading. It takes the js files
of static/js looks for require commands, collects everything in a main.js in the folder dist/js,
all with the help of browserify (maybe I reorganize the static/js/main.js with it).
Gulp also copies the index.html to dist. And it watches for
changes in the static/js folder, so it kicks off the gulp command automatically, but that didn't
work for me. You can also minify and uglify your code here. Todo for me.  

.gitignore - says git what to ignore when you add files to versioning  

views folder - contains the html files which are loaded from web.js  

static folder - contains css and js files we work on. css not used here, but who knows?  

dist folder - contains the from gulp processed js files. We don't work on these, we work on the other stuff.  

web.js - the js file that is called with node web.js to start the webserver (which is based on express),
tell the incoming requests where to find stuff, serves the index.html.
We use Jade to serve the index.html. Could be done differently of course.  
