var canvas = document.getElementById("drawing-canvas");
var ctx = canvas.getContext("2d");

var model;

// Carga el modelo asincrónicamente
tf.loadLayersModel("model.h5").then(loadedModel => {
    model = loadedModel;
    console.log("Modelo cargado exitosamente.");
});

var drawing = [];

function draw(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left;
    var y = event.clientY - canvas.getBoundingClientRect().top;
    drawing.push(x, y);
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 1, 1);
	
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener("mousedown", draw);

function recognize() {
    var image = tf.tensor(drawing);
    image = image.expandDims(0); // Añadir dimensión de lote
    // Aquí redimensionar y normalizar la imagen según las necesidades del modelo
    var prediction = model.predict(image);
    document.getElementById("prediction").innerHTML = prediction.arraySync()[0]; // Convertir tensor a array
}

document.getElementById("erase-button").addEventListener("click", function() {
    drawing = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("recognize-button").addEventListener("click", recognize);

document.getElementById("correct-button").addEventListener("click", function() {
    document.getElementById("prediction").innerHTML = "Correcto";
});

document.getElementById("incorrect-button").addEventListener("click", function() {
    document.getElementById("prediction").innerHTML = "Incorrecto";
});