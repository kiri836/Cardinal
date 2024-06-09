const { createCanvas, loadimage } = require('canvas');
const canvas = createCanvas(200,200);
const ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, 200, 200);
ctx.strokeStyle = 'black'