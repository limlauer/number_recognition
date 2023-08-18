from flask import Flask, request
import tensorflow as tf

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    # Get the image data from the request.
    image_data = request.data

    # Load the model.
    model = tf.saved_model.load("model.h5")

    # Make the prediction.
    prediction = model.predict(image_data)

    # Return the prediction.
    return str(prediction[0])