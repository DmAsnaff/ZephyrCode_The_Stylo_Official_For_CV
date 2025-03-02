#baldness_detector.py
import os
import cv2
import numpy as np
from mtcnn import MTCNN

cascade_path = os.path.join(
    os.path.dirname(__file__),
    r'D:\academic\University\Year_3_Project\ZephyrCode_Project_Official\ZephyrCode_Stylo_Backend\ml_service\models\haarcascade_frontalface_default.xml'
)

# Load the cascade classifier
face_cascade = cv2.CascadeClassifier(cascade_path)

def detect_and_crop_face_front(image, face_cascade, target_size=(299, 299), padding=0.4):
    image = cv2.imread(image)
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
    
def detect_and_crop_face_side(image_path):
    # Initialize MTCNN detector
    detector = MTCNN()
    
    # Load the image
    image = cv2.imread(image_path)
    image = cv2.resize(image, (299, 299))  # Resize image to 299x299
    
    # Convert BGR image to RGB (MTCNN expects RGB images)
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Detect faces
    faces = detector.detect_faces(rgb_image)
    
    # Function to extend the bounding box
    def extend_box(box, image_shape, left_extension=0.2, right_extension=1, top_extension=0.5, bottom_extension=0.5):
        x, y, width, height = box
        left_extension = int(width * left_extension)
        right_extension = int(width * right_extension)
        top_extension = int(height * top_extension)
        bottom_extension = int(height * bottom_extension)

        x_new = max(x - left_extension, 0)
        y_new = max(y - top_extension, 0)
        width_new = min(width + left_extension + right_extension, image_shape[1] - x_new)
        height_new = min(height + top_extension + bottom_extension, image_shape[0] - y_new)

        return (x_new, y_new, width_new, height_new)
    
    # Process each detected face
    for face in faces:
        x, y, width, height = face['box']
        extended_box = extend_box(face['box'], image.shape)

        # Draw the extended bounding box (optional for visualization)
        x_ext, y_ext, width_ext, height_ext = extended_box
        cv2.rectangle(image, (x_ext, y_ext), (x_ext+width_ext, y_ext+height_ext), (0, 255, 0), 2)

        # Crop the extended head region
        head_crop = image[y_ext:y_ext+height_ext, x_ext:x_ext+width_ext]
        # cv2.imwrite(r"C:\Users\ASUS\Desktop\pircu8t.jpg", head_crop)
        return head_crop  # Return the cropped head region


# def detect_and_crop_face_side(image_path, target_size=(299, 299), left_extension=0.2, right_extension=0.2, top_extension=0.5, bottom_extension=0.5):
#     # Initialize MTCNN detector
#     detector = MTCNN()
    
#     # Load the image
#     image = cv2.imread(image_path)
#     if image is None:
#         print("Error: Could not load the image.")
#         return None

#     # Convert BGR image to RGB (MTCNN expects RGB images)
#     rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
#     # Detect faces
#     faces = detector.detect_faces(rgb_image)
#     print("Detected faces:", faces)
#     if len(faces) == 0:
#         print("No faces detected.")
#         return None
    
#     # Function to extend the bounding box
#     def extend_box(box, image_shape, left_extension, right_extension, top_extension, bottom_extension):
#         x, y, width, height = box
#         left = int(width * left_extension)
#         right = int(width * right_extension)
#         top = int(height * top_extension)
#         bottom = int(height * bottom_extension)

#         x_new = max(x - left, 0)
#         y_new = max(y - top, 0)
#         x2 = min(x + width + right, image_shape[1])
#         y2 = min(y + height + bottom, image_shape[0])

#         return (x_new, y_new, x2, y2)
    
#     # Process the largest detected face
#     largest_face = max(faces, key=lambda f: f['box'][2] * f['box'][3])  # Select the largest face
#     x, y, x2, y2 = extend_box(largest_face['box'], image.shape, left_extension, right_extension, top_extension, bottom_extension)
#     print("Extended box:", (x, y, x2, y2))

#     # Crop the extended head region
#     head_crop = image[y:y2, x:x2]
#     if head_crop.size == 0:
#         print("Invalid crop dimensions.")
#         return None
    
#     # Resize with preserved aspect ratio and padding
#     def resize_with_padding(image, target_size):
#         old_h, old_w = image.shape[:2]
#         target_h, target_w = target_size

#         scale = min(target_w / old_w, target_h / old_h)
#         new_w, new_h = int(old_w * scale), int(old_h * scale)

#         resized_image = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
#         delta_w, delta_h = target_w - new_w, target_h - new_h
#         top, bottom = delta_h // 2, delta_h - (delta_h // 2)
#         left, right = delta_w // 2, delta_w - (delta_w // 2)

#         padded_image = cv2.copyMakeBorder(resized_image, top, bottom, left, right, cv2.BORDER_CONSTANT, value=[0, 0, 0])
#         return padded_image
    
#     cropped_resized = resize_with_padding(head_crop, target_size)
    
#     cv2.imwrite(r"C:\Users\ASUS\Desktop\paa.jpg", cropped_resized)

#     # return cropped_resized

def preprocess_image(image_path):
#     image = cv2.imread(image_path)
    gray = cv2.cvtColor(image_path, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    return blurred

def apply_threshold(image):
    _, thresholded = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresholded

def extract_roi(image, face_orientation='side'):
    height, width = image.shape
    if face_orientation == 'side':
        # roi = image[height//4:height//2, width//2:width]
        roi = image[height//10:height//3, width//2:3*width//4]
        # roi = image[height//10:height//3, width//3:3*width//4]

    elif face_orientation == 'front':
        # roi = image[height//4:3*height//4, width//4:3*width//4]
        roi = image[0:height//2, width//4:3*width//4]  # Adjust these values based on your needs

    else:
        raise ValueError("Unsupported face orientation. Supported values are 'side' and 'front'.")
    return roi

def analyze_roi(roi):
    white_pixels = np.sum(roi == 255)
    black_pixels = np.sum(roi == 0)
    if black_pixels > white_pixels:
        return "No Bald"
    else:
        return "Bald"

def detect_baldness_side(image_path, face_orientation='side'):
    image= detect_and_crop_face_side(image_path)
    preprocessed_image = preprocess_image(image)
    thresholded_image = apply_threshold(preprocessed_image)
    roi = extract_roi(thresholded_image, face_orientation)
    result = analyze_roi(roi)
    return result

def detect_baldness_front(image_path, face_orientation='front'):
    image= detect_and_crop_face_front(image_path,face_cascade)
    preprocessed_image = preprocess_image(image)
    thresholded_image = apply_threshold(preprocessed_image)
    roi = extract_roi(thresholded_image, face_orientation)
    result = analyze_roi(roi)
    return result


import sys

if __name__ == "__main__":
#  a= [r"C:\Users\ASUS\Desktop\download (1).jpeg", 'front']
 import sys
 if len(sys.argv) < 3:
        print("Usage: python baldness_detector.py image_path face_orientation")
        sys.exit(1)
 image_path = sys.argv[1]
 face_orientation = sys.argv[2]
    
#  image_path = a[0]
#  face_orientation = a[1]
    
if face_orientation == 'front':
   result = detect_baldness_front(image_path, face_orientation)
   print(result)

elif face_orientation == 'side':
   result = detect_baldness_side(image_path, face_orientation)
   print(result)



























# #baldness_detector.py

# import cv2
# import numpy as np

# def preprocess_image(image_path):
#     image = cv2.imread(image_path)
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
#     blurred = cv2.GaussianBlur(gray, (5, 5), 0)
#     return blurred

# def apply_threshold(image):
#     _, thresholded = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
#     return thresholded

# def extract_roi(image, face_orientation='side'):
#     height, width = image.shape
#     if face_orientation == 'side':
#         roi = image[height//4:height//2, width//2:width]
#     elif face_orientation == 'front':
#         roi = image[height//4:3*height//4, width//4:3*width//4]
#     else:
#         raise ValueError("Unsupported face orientation. Supported values are 'side' and 'front'.")
#     return roi

# def analyze_roi(roi):
#     white_pixels = np.sum(roi == 255)
#     black_pixels = np.sum(roi == 0)
#     if black_pixels > white_pixels:
#         return "No Bald"
#     else:
#         return "Bald"

# def detect_baldness(image_path, face_orientation='side'):
#     preprocessed_image = preprocess_image(image_path)
#     thresholded_image = apply_threshold(preprocessed_image)
#     roi = extract_roi(thresholded_image, face_orientation)
#     result = analyze_roi(roi)
#     return result

# if __name__ == "__main__":
#     import sys
#     # import os

#     # currnet_dir = os.getcwd()
#     # print(currnet_dir)
#     image_path = sys.argv[1]
#     face_orientation = sys.argv[2]
#     result = detect_baldness(image_path, face_orientation)
#     print(result)