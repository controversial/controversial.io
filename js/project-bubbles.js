/* Lays out my programming projects as bubbles in a vis.js network.

When clicked, each bubble expands on click into a full page of information.
*/

var projects = [
  {
    name: "Wikipedia Map",
    image: "img/wikipedia.png",
    gh: "controversial/wikipedia-map",
    size: 50
  },
  {
    name: "Maze CV",
    image: "img/maze.png",
    gh: "controversial/maze-cv",
    size: 40
  },
  {
    name: "image2ASCII",
    image: "img/ascii.png",
    gh: "controversial/Image2ASCII",
    size: 30
  },
  {
    name: "livejson",
    image: "img/livejson.png",
    gh: "controversial/livejson",
    size: 30
  },
  {
    name: "ui2",
    image: "img/ui2.png",
    gh: "controversial/ui2",
    size: 37
  },
  {
    name: "thedonald",
    image: "img/trump.png",
    gh: "controversial/thedonald",
    size: 20
  },
  {
    name: "Gif Art",
    image: "img/gif-art.png",
    gh: "controversial/Gif-Art",
    size: 20
  },
  {
    name: "TI Spirograph",
    image: "img/ti-spiro.png",
    gh: "controversial/TI-Spirograph",
    size: 30
  }
];


var nodes = new vis.DataSet(projects.map(function(item) {
  item.shape = "circularImage";
  item.id = item.gh.split("/")[1].toLowerCase();
  return item;
}));

var edges = new vis.DataSet();
var data = {nodes: nodes, edges: edges};

console.log(nodes);
