const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");

let model;

tf.loadLayersModel("./model.keras").then(loadedModel => {
    model = loadedModel;
    console.log("Modelo cargado exitosamente.");
});

let drawing = false;

function setup() {
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mouseleave", endDrawing);
}

function startDrawing(event) {
    drawing = true;
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    drawing = true;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 10, 10);
    canvas.addEventListener("mousemove", draw);
}

function draw(event) {
    if (!drawing) return;
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 10, 10);
}

function endDrawing() {
    drawing = false;
    canvas.removeEventListener("mousemove", draw);
}

function recognize() {
    if (!model) {
        console.log("El modelo no se ha cargado correctamente.");
        return;
    }

    const imageData = getImageDataFromCanvas();
    const tensor = preprocessImage(imageData);
    const prediction = model.predict(tensor);
    const predictionArray = prediction.dataSync();
    const recognizedNumber = predictionArray.indexOf(Math.max(...predictionArray));
    
    document.getElementById("prediction").textContent = `Número reconocido: ${recognizedNumber}`;
    
    // Comprobar si el reconocimiento es correcto
    const correctNumber = 7; // Número correcto esperado
    const feedbackElement = document.getElementById("feedback");
    if (recognizedNumber === correctNumber) {
        feedbackElement.textContent = "¡Correcto!";
    } else {
        feedbackElement.textContent = "Incorrecto. Inténtalo de nuevo.";
    }
}

function getImageDataFromCanvas() {
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function preprocessImage(imageData) {
    const tensor = tf.browser.fromPixels(imageData);
    const resized = tf.image.resizeBilinear(tensor, [28, 28]);
    const grayScale = resized.mean(2);
    const inverted = grayScale.sub(255).mul(-1);
    const normalized = inverted.div(255);
    const reshaped = normalized.reshape([1, 28, 28, 1]);
    return reshaped;
}

document.getElementById("erase-button").addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("prediction").textContent = "";
    document.getElementById("feedback").textContent = "";
});

document.getElementById("recognize-button").addEventListener("click", recognize);

setup();