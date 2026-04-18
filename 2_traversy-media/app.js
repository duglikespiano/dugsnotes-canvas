// From: https://youtu.be/gm1QtePAYTM?si=peRIZ7x9XgPLVTWG

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill
// fillRect()
// Order matters, fillStyle must be before fillRect()
// ctx.fillStyle = 'red';
// ctx.fillRect(20, 20, 150, 100);

// ctx.fillStyle = 'blue';
// ctx.fillRect(200, 20, 150, 100);

// // strokeRect()
// ctx.lineWidth = 5;
// ctx.strokeStyle = 'green';
// ctx.strokeRect(100, 200, 150, 100);

// // clearRect()
// ctx.clearRect(25, 25, 140, 90);

// // fillText()
// ctx.font = '30px Arial';
// ctx.fillStyle = 'white';
// ctx.fillText('Hello Canvas!', 400, 50);

// // strokeText()
// ctx.lineWidth = 1.5;
// ctx.strokeText('Hello World!', 400, 100);

// Paths
// Triangle
// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.lineTo(150, 50);
// ctx.strokeStyle = 'white';
// ctx.lineTo(100, 200);
// // ctx.lineTo(50, 50);
// ctx.closePath();
// ctx.stroke();
// ctx.fillStyle = 'coral';
// ctx.fill();

// ctx.beginPath();
// ctx.moveTo(200, 50);
// ctx.lineTo(150, 200);
// ctx.lineTo(250, 200);
// ctx.closePath();
// ctx.stroke();

// // Rectangle
// ctx.beginPath();
// ctx.rect(300, 50, 150, 100);
// ctx.fillStyle = 'teal';
// ctx.fill();

// // Arc(circles)
// const smileCenter = { x: 150, y: 350 };
// // Outer circle
// ctx.beginPath();
// ctx.arc(smileCenter.x, smileCenter.y, 100, 0, Math.PI * 2);
// ctx.moveTo(smileCenter.x + 50, smileCenter.y);
// // Mouth
// ctx.arc(smileCenter.x, smileCenter.y, 50, 0, Math.PI, false);
// // Left eye
// ctx.moveTo(smileCenter.x - 25, smileCenter.y - 30);
// ctx.arc(smileCenter.x - 40, smileCenter.y - 30, 15, 0, Math.PI * 2);
// // Right eye
// ctx.moveTo(smileCenter.x + 55, smileCenter.y - 30);
// ctx.arc(smileCenter.x + 40, smileCenter.y - 30, 15, 0, Math.PI * 2);
// ctx.stroke();

// Animation 1 = bouncing ball
// const circle = { x: 200, y: 200, size: 30, dx: 5, dy: 4 };
// function drawCircle() {
// 	ctx.beginPath();
// 	ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
// 	ctx.fillStyle = 'purple';
// 	ctx.fill();
// }

// function update() {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	drawCircle();
// 	// change position
// 	circle.x += circle.dx;
// 	circle.y += circle.dy;

// 	// detect side walls
// 	if (circle.x + circle.size > canvas.width || circle.x - circle.size < 0) {
// 		circle.dx *= -1;
// 	} else if (circle.y + circle.size > canvas.height || circle.y - circle.size < 0) {
// 		circle.dy *= -1;
// 	}
// 	requestAnimationFrame(update);
// }
// update();

// Animation 2 - Character
const object = document.querySelector('.object');

const player = {
	w: 100,
	h: 100,
	x: 20,
	y: 200,
	speed: 5,
	dx: 0,
	dy: 0,
};

function drawObject() {
	ctx.drawImage(object, player.x, player.y, player.w, player.h);
}

function newPosition() {
	player.x += player.dx;
	player.y += player.dy;
	detectWalls();
}

function detectWalls() {
	// Left wall
	if (player.x < 0) {
		player.x = 0;
	}
	// Right wall
	if (player.x + player.w > canvas.width) {
		player.x = canvas.width - player.w;
	}
	// Top wall
	if (player.y < 0) {
		player.y = 0;
	}
	// Bottom wall
	if (player.y + player.h > canvas.height) {
		player.y = canvas.height - player.h;
	}
}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawObject();
	newPosition();
	requestAnimationFrame(update);
}

update();

function moveUp() {
	player.dy = -player.speed;
}
function moveDown() {
	player.dy = player.speed;
}
function moveLeft() {
	player.dx = -player.speed;
}
function moveRight() {
	player.dx = player.speed;
}

function keyDown(e) {
	if (e.key === 'ArrowRight' || e.key === 'Right') {
		moveRight();
	} else if (e.key === 'ArrowLeft' || e.key === 'Left') {
		moveLeft();
	} else if (e.key === 'ArrowUp' || e.key === 'Up') {
		moveUp();
	} else if (e.key === 'ArrowDown' || e.key === 'Down') {
		moveDown();
	}
}

function keyUp(e) {
	if (
		e.key === 'ArrowRight' ||
		e.key === 'Right' ||
		e.key === 'ArrowLeft' ||
		e.key === 'Left' ||
		e.key === 'ArrowUp' ||
		e.key === 'Up' ||
		e.key === 'ArrowDown' ||
		e.key === 'Down'
	) {
		player.dx = 0;
		player.dy = 0;
	}
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
