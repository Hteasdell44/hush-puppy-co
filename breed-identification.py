import numpy as np
import pandas as pd 
import os
from itertools import chain
import random
import matplotlib.pyplot as plt
from matplotlib.image import imread
from sklearn.preprocessing import LabelEncoder
from keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from keras.preprocessing.image import img_to_array, load_img
from keras import models
from keras import layers
from keras.optimizers import Adam
from keras.layers import GlobalAveragePooling2D, Dense, Flatten, Dropout
from keras.applications.inception_v3 import InceptionV3
from keras.utils import to_categorical
from keras.utils import plot_model
from keras.callbacks import ModelCheckpoint, EarlyStopping

# Display the Folders/Classes
dog_classes = os.listdir('breed-dataset/images/Images/')

# Get the dog labels
breeds = [breed.split('-',1)[-1] if '-' in breed else breed for breed in dog_classes]

X = []
y = []

fullpaths = ['breed-dataset/images/Images/{}'.format(dog_class) for dog_class in dog_classes]

for counter, fullpath in enumerate(fullpaths):
    # Check if the current fullpath is a directory
    if os.path.isdir(fullpath):
        for imgname in os.listdir(fullpath):
            X.append([fullpath + '/' + imgname])
            y.append(breeds[counter])

X = list(chain.from_iterable(X))

combined = list(zip(X, y))
random.shuffle(combined)

X[:], y[:] = zip(*combined)

X = X[:4000]
y = y[:4000]

le = LabelEncoder()
le.fit(y)
y_ohe = to_categorical(le.transform(y), len(breeds))
y_ohe = np.array(y_ohe)

img_data = np.array([img_to_array(load_img(img, target_size=(299,299)))
                     for img in X]) # load, resize images, and store as array

x_train, x_test, y_train, y_test = train_test_split(img_data, y_ohe,
                                                   test_size=0.2,
                                                   stratify=np.array(y), # stratify makes sure that proportion of each class in the output is same as the input
                                                   random_state=2) 

x_train, x_val, y_train, y_val = train_test_split(x_train, y_train,
                                                 test_size=0.2,
                                                 stratify=np.array(y_train),
                                                 random_state=2)

base_model = InceptionV3(weights='imagenet', include_top=False, input_shape=(299,299,3))

model = models.Sequential()
model.add(base_model)
model.add(GlobalAveragePooling2D())
model.add(Dropout(0.3))
model.add(Dense(512, activation='relu'))
model.add(Dense(512, activation='relu'))
model.add(Dense(len(breeds), activation='softmax'))

model.layers[0].trainable = False

model.compile(Adam(learning_rate=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

# Define callbacks
checkpoint = ModelCheckpoint("best_model.keras", monitor='val_accuracy', verbose=1, save_best_only=True, mode='max')
early_stopping = EarlyStopping(monitor='val_loss', patience=3, verbose=1, restore_best_weights=True)

train_steps_per_epoch = x_train.shape[0] 
val_steps_per_epoch = x_val.shape[0]
epochs = 20

history = model.fit(x_train, y_train,
                    steps_per_epoch=train_steps_per_epoch,
                    validation_data=(x_val, y_val),
                    validation_steps=val_steps_per_epoch,
                    epochs=epochs, verbose=1, callbacks=[checkpoint, early_stopping])

model.save('breed_identification_model.keras')

# Display a grid of 30 randomly selected testing images with their actual and predicted breed labels, along with the confidence of the prediction
x_test1 = x_test / 255. # rescale to 0-1. Divide by 255 as it's the max RGB value
test_predictions = model.predict(x_test1)

# Get model predictions
predictions = le.classes_[np.argmax(test_predictions, axis=1)] # get labels and reverse back to get the text labels
# Get target labels
target_labels = le.classes_[np.argmax(y_test, axis=1)]

# Store in a dataframe
predict_df = pd.DataFrame({'Target_Labels': target_labels, 'Predictions': predictions})

# Calculate confidence scores
confidence_scores = np.max(test_predictions, axis=1)

# Display a grid of 30 randomly selected testing images
plt.figure(figsize=(30, 40))
for counter, i in enumerate(random.sample(range(0, len(y_test)), 30)): # random 30 images
    plt.subplot(6, 5, counter+1)
    plt.subplots_adjust(hspace=0.6)
    actual = str(target_labels[i])
    predicted = str(predictions[i])
    conf = str(confidence_scores[i])
    plt.imshow(x_test[i]/255.0)
    plt.axis('off')
    plt.title('Actual: ' + actual + '\nPredict: ' + predicted + '\nConf: ' + conf, fontsize=18)
    
plt.show()
