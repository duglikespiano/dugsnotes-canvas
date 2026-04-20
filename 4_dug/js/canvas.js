// This page has been folked from 3 - CHRIS COURSES
// grab the <canvas> element from the HTML
const canvas = document.querySelector('canvas');

// get the 2D drawing context — all drawing APIs live on this object
const c = canvas.getContext('2d');

// make the canvas fill the entire browser window
canvas.width = innerWidth;
canvas.height = innerHeight;

// four colors used randomly for particles (blue tones + warm accent)
const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// track whether the mouse button is currently held down
let mouseDown = false;
addEventListener('mousedown', () => {
	mouseDown = true;
}); // pressed
addEventListener('mouseup', () => {
	mouseDown = false;
}); // released

// when the window is resized, resize canvas to match and rebuild particles
addEventListener('resize', () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	init();
});

// ─── Particle class ────────────────────────────────────────────────────────────

class Particle {
	// distance  = how far this particle sits from the center (in pixels)
	// angle     = starting angle in radians (0 = right, PI/2 = bottom, etc.)
	// radius    = visual size of the dot
	// color     = fill color string
	constructor(distance, angle, radius, color) {
		this.distance = distance;
		this.angle = angle;
		this.radius = radius;
		this.color = color;

		// each particle gets its own orbital speed so they don't all move as one block
		// inner particles are slightly faster (smaller distance → higher base speed)
		this.angularSpeed = (0.00001 + Math.random() * 0.0005) * (1 + 1 / (distance * 0.01 + 1));
	}

	update() {
		// advance the angle each frame — this is what makes the particle orbit
		this.angle += this.angularSpeed;

		// convert polar coords (angle + distance) → Cartesian (x, y)
		// Math.cos gives the horizontal component, Math.sin the vertical
		// these x/y are relative to the canvas center (because we translate() below)
		this.x = Math.cos(this.angle) * this.distance;
		this.y = Math.sin(this.angle) * this.distance;

		this.draw();
	}

	draw() {
		c.beginPath(); // start a new drawing path (clears any previous path state)

		// arc(x, y, radius, startAngle, endAngle) — full circle = 0 to 2π
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

		c.shadowColor = this.color; // glow color matches the fill
		c.shadowBlur = 10; // how far the glow spreads outward (pixels)
		c.fillStyle = this.color; // dot fill color
		c.fill(); // actually paint the circle

		c.closePath(); // formally close the path (good practice)
	}
}

// ─── Init ──────────────────────────────────────────────────────────────────────

let particles; // will hold our array of Particle instances

function init() {
	particles = []; // clear any previous particles

	for (let i = 0; i < 400; i++) {
		// spread particles across a region slightly larger than the screen
		const maxDistance = Math.sqrt(
			Math.pow(canvas.width / 2 + 150, 2) + // half-width + padding
				Math.pow(canvas.height / 2 + 150, 2), // half-height + padding
		);

		// random distance from center (0 = dead center, maxDistance = edge)
		const distance = Math.random() * maxDistance;

		// random starting angle anywhere around the full circle
		const angle = Math.random() * Math.PI * 2;

		// random dot size between 0 and 3 pixels
		const radius = 3 * Math.random();

		// pick a random color from our palette
		const color = colors[Math.floor(Math.random() * colors.length)];

		particles.push(new Particle(distance, angle, radius, color));
	}
}

// ─── Animation loop ────────────────────────────────────────────────────────────

// alpha controls how opaque the black "fade" overlay is each frame
// 1 = fully opaque (hard clear), lower values = trails linger longer
let alpha = 1;

function animate() {
	// schedule the next frame before doing any work (smooth 60fps loop)
	requestAnimationFrame(animate);

	// paint a semi-transparent black rectangle over the whole canvas
	// this dims previous frames instead of fully erasing them → motion trail effect
	c.fillStyle = `rgba(10, 10, 10, ${alpha})`;
	c.fillRect(0, 0, canvas.width, canvas.height);

	// move the drawing origin to the center of the canvas
	// all particle x/y coords are relative to this point
	c.save(); // snapshot current transform
	c.translate(canvas.width / 2, canvas.height / 2); // shift origin to center
	particles.forEach((particle) => particle.update()); // update + draw every particle
	c.restore(); // reset transform back to default

	// holding the mouse makes alpha drop → lower alpha = longer trails (ghostly effect)
	if (mouseDown && alpha >= 0.01) {
		alpha -= 0.01; // fade overlay less aggressively → trails persist
	} else if (!mouseDown && alpha < 1) {
		alpha += 0.01; // restore full clear when mouse is released
	}
}

// ─── Kick off ──────────────────────────────────────────────────────────────────

init(); // create all particles
animate(); // start the render loop
