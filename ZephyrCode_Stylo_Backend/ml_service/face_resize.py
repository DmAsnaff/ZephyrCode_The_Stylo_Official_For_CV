import cv2
import sys
import os

# Load the Haarcascade face detector
cascade_path = os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml')
face_cascade = cv2.CascadeClassifier(cascade_path)

def resize_face(image_path, output_path="resized_face.jpg", target_size=(299, 299), padding=0.4):
    image = cv2.imread(image_path)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        print("No face detected")
        return None

    x, y, w, h = max(faces, key=lambda rect: rect[2] * rect[3])
    pad_w = int(w * padding)
    pad_h = int(h * padding)
    x1, y1 = max(0, x - pad_w), max(0, y - pad_h)
    x2, y2 = min(image.shape[1], x + w + pad_w), min(image.shape[0], y + h + pad_h)

    face = image[y1:y2, x1:x2]
    resized_face = cv2.resize(face, target_size)

    cv2.imwrite(output_path, resized_face)
    print(output_path)  # Return the new file path to Node.js

if __name__ == "__main__":
    image_path = sys.argv[1]
    output_path = "resized_" + os.path.basename(image_path)
    resize_face(image_path, output_path)
