import sys
import numpy as np
from keras.preprocessing import image
from keras.applications.inception_v3 import InceptionV3, preprocess_input, decode_predictions

# Load the pre-trained InceptionV3 model
model = InceptionV3(weights='imagenet')

# Function to predict the breed of a dog image
def predict_dog_breed(image_path):
    img = image.load_img('../rotty.jpg', target_size=(299, 299))  # Resize image to 299x299
    x = image.img_to_array(img)  # Convert image to array
    x = np.expand_dims(x, axis=0)  # Add batch dimension
    x = preprocess_input(x)  # Preprocess the input

    preds = model.predict(x)  # Predict the class probabilities
    decoded_preds = decode_predictions(preds, top=1)[0]  # Decode the predictions
    breed = decoded_preds[0][1]  # Get the predicted breed
    confidence = decoded_preds[0][2]  # Get the confidence score

    return breed, confidence


# Example usage
if __name__ == "__main__":
    image_path = sys.argv[0]
    breed, confidence = predict_dog_breed(image_path)
    print("Predicted breed:", breed, ", Confidence:", confidence)
