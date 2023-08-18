var canvas = document.getElementById("drawing-board");
var ctx = canvas.getContext("2d");

var model = tf.loadModel("model.h5");

var drawing = [];

function draw(event) {
    drawing.push(event.x, event.y);
    ctx.fillStyle = "black";
    ctx.fillRect(event.x, event.y, 1, 1);
	
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", draw);

function recognize() {
    var image = tf.image.arrayToTensor(drawing);
    image = tf.expandDims(image, 0);
    var prediction = model.predict(image);
    document.getElementById("prediction").innerHTML = prediction[0];
}

document.getElementById("erase-button").addEventListener("click", function() {
    drawing = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("recognize-button").addEventListener("click", recognize);

document.getElementById("correct-button").addEventListener("click", function() {
    document.getElementById("prediction").innerHTML = "Correct";
});

document.getElementById("incorrect-button").addEventListener("click", function() {
    document.getElementById("prediction").innerHTML = "Incorrect";
});