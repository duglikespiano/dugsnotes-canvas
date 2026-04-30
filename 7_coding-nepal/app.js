// Reference from
// https://youtu.be/y84tBZo8GFo?si=reQ9j6BYP765AV-U

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const toolButtons = document.querySelectorAll('.tool');
const fillColorButton = document.querySelector('#fill-color');
const sizeSlider = document.querySelector('#size-slider');
const colorButtons = document.querySelectorAll('.colors .option');
const colorPicker = document.querySelector('#color-picker');
const clearCanvasButton = document.querySelector('.clear-canvas');
const saveImageButton = document.querySelector('.save-img');

let brushWidth = 5;
let prevMouseX;
let prevMouseY;
let snapshot;
let isDrawing = false;
let selectedTool = 'brush';
let selectedColor = '#000';

window.addEventListener('load', () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	setCanvasBackground();
});

function setCanvasBackground() {
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = selectedColor;
}

function startDrawing(e) {
	isDrawing = true;
	prevMouseX = e.offsetX;
	prevMouseY = e.offsetY;
	ctx.beginPath();
	ctx.lineWidth = brushWidth;
	ctx.strokeStyle = selectedColor;
	ctx.fillStyle = selectedColor;
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawRectangle(e) {
	if (!fillColorButton.checked) {
		ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
	} else {
		ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
	}
}

function drawCircle(e) {
	ctx.beginPath();
	let radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
	ctx.stroke();
	fillColorButton.checked ? ctx.fill() : ctx.stroke();
}

function drawTriangle(e) {
	ctx.beginPath();
	ctx.moveTo(prevMouseX, prevMouseY);
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
	ctx.closePath();
	ctx.stroke();
	fillColorButton.checked ? ctx.fill() : ctx.stroke();
}

function drawing(e) {
	if (!isDrawing) return;
	ctx.putImageData(snapshot, 0, 0);
	if (selectedTool === 'brush' || selectedTool === 'eraser') {
		ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	} else if (selectedTool === 'rectangle') {
		drawRectangle(e);
	} else if (selectedTool === 'circle') {
		drawCircle(e);
	} else {
		drawTriangle(e);
	}
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => (isDrawing = false));

toolButtons.forEach((button) => {
	button.addEventListener('click', () => {
		document.querySelector('.options .active').classList.remove('active');
		button.classList.add('active');
		selectedTool = button.id;
	});
});

colorButtons.forEach((button) => {
	button.addEventListener('click', () => {
		document.querySelector('.options .selected').classList.remove('selected');
		button.classList.add('selected');
		selectedColor = window.getComputedStyle(button).getPropertyValue('background-color');
	});
});

sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value));
colorPicker.addEventListener('change', () => {
	colorPicker.parentElement.style.backgroundColor = colorPicker.value;
	colorPicker.parentElement.click();
});

clearCanvasButton.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	setCanvasBackground();
});

saveImageButton.addEventListener('click', () => {
	const link = document.createElement('a');
	link.download = `${Date.now()}.jpg`;
	link.href = canvas.toDataURL(); // passing canvasData as link href value
	link.click();
});
