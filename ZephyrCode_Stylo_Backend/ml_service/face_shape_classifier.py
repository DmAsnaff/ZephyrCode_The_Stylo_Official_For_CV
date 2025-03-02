#face_shape_classifier.py
import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import load_model
import os


# Load the pre-trained Xception model for face shape classification
model_path = os.path.join(os.path.dirname(__file__), r'D:\academic\University\Year_3_Project\ZephyrCode_Project_Official\ZephyrCode_Stylo_Backend\ml_service\models\zephyrcode_model_finalxception.h5')
model = load_model(model_path)
# Load the Haarcascade face detector
cascade_path = os.path.join(
    os.path.dirname(__file__),
    r'D:\academic\University\Year_3_Project\ZephyrCode_Project_Official\ZephyrCode_Stylo_Backend\ml_service\models\haarcascade_frontalface_default.xml'
)

# Load the cascade classifier
face_cascade = cv2.CascadeClassifier(cascade_path)

def detect_and_crop_face(image, face_cascade, target_size=(299, 299), padding=0.4):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    if len(faces) == 0:
        return None
    x, y, w, h = max(faces, key=lambda rect: rect[2] * rect[3])
    pad_w = int(w * padding)
    pad_h = int(h * padding)
    x1, y1 = max(0, x - pad_w), max(0, y - pad_h)
    x2, y2 = min(image.shape[1], x + w + pad_w), min(image.shape[0], y + h + pad_h)
    face = image[y1:y2, x1:x2]
    
    return cv2.resize(face, target_size)

def apply_color_jitter(image, brightness=0.2, contrast=0.2):
    # Convert image to float and normalize to [0, 1]
    image = image.astype(np.float32) / 255.0
    
    # Apply brightness adjustment
    image = image + brightness
    image = np.clip(image, 0, 1)
    
    # Apply contrast adjustment
    mean = np.mean(image)
    image = (image - mean) * (1 + contrast) + mean
    image = np.clip(image, 0, 1)
    
    # Convert back to [0, 255]
    image = (image * 255).astype(np.uint8)
    
    return image
  # face_resized_cropped= cv2.resize(face, target_size)
 # cv2.imwrite(r"C:\Users\ASUS\Desktop\pircut.jpg", face_resized_cropped)
def apply_noise_reduction(image, kernel_size=5):
    # Apply Gaussian blur for noise reduction
    return cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)

def classify_face(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"No image found at {image_path}")
    cropped_face = detect_and_crop_face(image, face_cascade)
    if cropped_face is None:
        return "No face detected"
     # Apply color jittering
    jittered_face = apply_color_jitter(cropped_face)
    
    # Apply noise reduction
    denoised_face = apply_noise_reduction(jittered_face)

    img_array = tf.keras.preprocessing.image.img_to_array(denoised_face)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.xception.preprocess_input(img_array)
    predictions = model.predict(img_array)

    face_shape_class = np.argmax(predictions, axis=1)[0]
    face_shape_dict = ['Heart', 'Oblong', 'Oval', 'Round', 'Square']
    predicted_face_shape = face_shape_dict[face_shape_class]

    # shapef = 'Square'
    # return shapef
    return predicted_face_shape
    # face_shape = np.argmax(predictions, axis=1)
    # face_shape_dict = {0: "Heart", 1: "Oblong", 2: "Oval", 3: "Round", 4: "Square"}
    # return face_shape_dict[face_shape[0]]


if __name__ == "__main__":
    import sys
    image_path = sys.argv[1]
    result = classify_face(image_path)
    print(result)
