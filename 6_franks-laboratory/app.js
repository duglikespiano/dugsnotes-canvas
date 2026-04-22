const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
	constructor(effect, x, y, color) {
		this.effect = effect;
		this.x = Math.random() * this.effect.canvasWidth;
		this.y = Math.random() * this.effect.canvasHeight;
		this.color = color;
		this.originX = x;
		this.originY = y;
		this.size = this.effect.gap - 5;
		this.dx = 0;
		this.dy = 0;
		this.vx = 0;
		this.vy = 0;
		this.force = 0;
		this.angle = 0;
		this.distance = 0;
		this.friction = Math.random() * 0.6 * 0.15;
		this.ease = Math.random() * 0.1 + 0.005;
	}
	draw() {
		this.effect.context.fillStyle = this.color;
		this.effect.context.fillRect(this.x, this.y, this.size, this.size);
	}
	update() {
		this.dx = this.effect.mouse.x - this.x;
		this.dy = this.effect.mouse.y - this.y;
		this.distance = this.dx * this.dx + this.dy * this.dy;
		this.force = -this.effect.mouse.radius / this.distance;

		if (this.distance < this.effect.mouse.radius) {
			this.angle = Math.atan2(this.dy, this.dx);
			this.vx += this.force * Math.cos(this.angle);
			this.vy += this.force * Math.sin(this.angle);
		}

		this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
		this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
	}
}

class Effect {
	constructor(context, canvasWidth, canvasHeight) {
		this.context = context;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.textX = this.canvasWidth / 2;
		this.textY = this.canvasHeight / 2;
		this.fontSize = 200;
		this.lineHeight = this.fontSize * 0.8;
		this.maxTextWidth = this.canvasWidth / 2;
		this.textInput = document.querySelector('input');
		this.textInput.addEventListener('keyup', (e) => {
			if (e.key !== ' ') {
				this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
				this.wrapText(e.target.value);
			}
		});

		//particle text
		this.particles = [];
		this.gap = 10;
		this.mouse = {
			radius: 200000,
			x: 0,
			y: 0,
		};
		window.addEventListener('mousemove', (e) => {
			this.mouse.x = e.x;
			this.mouse.y = e.y;
		});
	}
	wrapText(text) {
		// canvas settings
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0.3, 'red');
		gradient.addColorStop(0.5, 'yellow');
		gradient.addColorStop(0.7, 'blue');
		this.context.fillStyle = gradient;
		this.context.textAlign = 'center';
		this.context.textBaseline = 'middle';
		this.context.font = `${this.fontSize}px Helvetica`;
		this.context.lineWidth = 5;
		this.context.strokeStyle = 'white';
		// break multiline text
		const linesArray = [];
		let words = text.split(' ').filter(Boolean);
		let lineCounter = 0;
		let line = '';
		for (let i = 0; i < words.length; i++) {
			let testLine = line + words[i] + ' ';
			if (this.context.measureText(testLine).width > this.maxTextWidth) {
				line = words[i] + ' ';
				lineCounter++;
			} else {
				line = testLine;
			}
			linesArray[lineCounter] = line;
		}
		let textHeight = this.lineHeight * lineCounter;
		this.textY = this.canvasHeight / 2 - textHeight / 2;
		linesArray.forEach((el, index) => {
			this.context.fillText(el, this.textX, this.textY + index * this.lineHeight);
			this.context.strokeText(el, this.textX, this.textY + index * this.lineHeight);
		});
		this.convertToParticles();
	}
	convertToParticles() {
		this.particles = [];
		const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		for (let y = 0; y < this.canvasHeight; y += this.gap) {
			for (let x = 0; x < this.canvasWidth; x += this.gap) {
				const i = (y * this.canvasWidth + x) * 4;
				const alpha = pixels[i + 3];
				if (alpha > 0) {
					const red = pixels[i];
					const green = pixels[i + 1];
					const blue = pixels[i + 2];
					const color = `rgb(${red}, ${green}, ${blue})`;
					this.particles.push(new Particle(this, x, y, color));
				}
			}
		}
		// console.log(this.particles);
	}
	render() {
		// console.log('check');
		this.particles.forEach((particle) => {
			particle.update();
			particle.draw();
		});
	}
	resize(width, height) {
		this.canvasWidth = width;
		this.canvasHeight = height;
		this.textX = this.canvasWidth / 2;
		this.textY = this.canvasHeight / 2;
		this.maxTextWidth = this.canvasWidth * 0.8;
	}
}

const effect = new Effect(ctx, canvas.width, canvas.height);
effect.wrapText(effect.textInput.value);

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	effect.render();
	requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	effect.resize(canvas.width, canvas.height);
	effect.wrapText(effect.textInput.value);
});

animate();

// animate();

// ctx.lineWidth = 5;

// Vertical center line
// ctx.strokeStyle = 'red';
// ctx.beginPath();
// ctx.moveTo(canvas.width / 2, 100);
// ctx.lineTo(canvas.width / 2, canvas.height);
// ctx.stroke();

// // Horizontal center line
// ctx.strokeStyle = 'green';
// ctx.beginPath();
// ctx.moveTo(0, canvas.height / 2);
// ctx.lineTo(canvas.width, canvas.height / 2);
// ctx.stroke();

// // Text
// const text = 'Hello!!!!';
// const textX = canvas.width / 2;
// const textY = canvas.height / 2;
// const maxTextWidth = canvas.width / 2;
// const lineHeight = 70;
// const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
// gradient.addColorStop(0.3, 'red');
// gradient.addColorStop(0.5, 'yellow');
// gradient.addColorStop(0.7, 'blue');
// ctx.fillStyle = gradient;
// ctx.strokeStyle = 'orangered';
// ctx.font = `${lineHeight}px Helvetica`;
// ctx.textAlign = 'center';
// ctx.textBaseline = 'middle';
// // ctx.fillText(text, textX, textY);
// // ctx.strokeText(text, textX, textY);

// function wrapText(text) {
// 	const linesArray = [];
// 	let lineCounter = 0;
// 	let line = '';
// 	const words = text.split(' ');
// 	for (let i = 0; i < words.length; i++) {
// 		let testLine = line + words[i] + ' ';
// 		if (ctx.measureText(testLine).width > maxTextWidth) {
// 			line = words[i] + ' ';
// 			lineCounter++;
// 		} else {
// 			line = testLine;
// 		}
// 		linesArray[lineCounter] = line;
// 	}
// 	let textHeight = lineHeight * lineCounter;
// 	let textY = canvas.height / 2 - textHeight / 2;
// 	linesArray.forEach((el, i) => {
// 		ctx.fillText(el, canvas.width / 2, textY + i * lineHeight);
// 	});
// }

// // wrapText('Hello World Yes Gooo What a nice day today');

// textInput.addEventListener('input', (e) => {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	wrapText(e.target.value);
// });
