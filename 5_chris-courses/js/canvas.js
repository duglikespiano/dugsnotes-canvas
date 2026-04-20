// https://youtu.be/R_CnWF3a_ks?si=aWA2OmtyJI7qysK9

import utils from './utils.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Event Listeners
addEventListener('mousemove', (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

const gravity = 0.025;
const friction = 1;

// Objects
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.velocity = velocity;
		this.alpha = 1;
	}

	draw() {
		c.save();
		c.globalAlpha = this.alpha;
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	}

	update() {
		this.draw();
		this.velocity.x *= friction;
		this.velocity.y *= friction;
		this.velocity.y += gravity;
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.alpha -= 0.002;
	}
}

// Implementation
let particles;
function init() {
	particles = [];
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(0, 0, 0, 0.07)';
	c.fillRect(0, 0, canvas.width, canvas.height);
	// c.clearRect(0, 0, canvas.width, canvas.height);
	particles = particles.filter((particle) => particle.alpha > 0);
	particles.forEach((particle) => {
		particle.update();
	});
}

init();
animate();

window.addEventListener('click', () => {
	if (particles.length > 1) {
		return;
	}

	mouse.x = event.clientX;
	mouse.y = event.clientY;

	const particleCount = 500;
	const angleIncrement = (Math.PI * 2) / particleCount;
	const power = 6;

	for (let i = 0; i < particleCount; i++) {
		particles.push(
			new Particle(mouse.x, mouse.y, Math.random() * 2, `hsl(${Math.random() * 360}, 50%, 50%)`, {
				x: Math.cos(angleIncrement * i) * Math.random() * power,
				y: Math.sin(angleIncrement * i) * Math.random() * power,
			}),
		);
	}
});
