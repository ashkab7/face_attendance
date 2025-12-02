import face_recognition
import os
import pickle
import numpy as np
import cv2
import pandas as pd
from datetime import datetime
import winsound  # Sound alert

ENCODING_FILE = "data/encodings.pkl"
IMAGE_DIR = "data/user_images/"
ATTENDANCE_DIR = "Attendance/"
MODEL_NAME = "face_recognition (HOG/CNN)"

# --------------------------------------
# SAFE LOAD ENCODINGS
# --------------------------------------
def load_encodings():
    if not os.path.exists("data"):
        os.makedirs("data")
    if not os.path.exists(IMAGE_DIR):
        os.makedirs(IMAGE_DIR)
    if not os.path.exists(ATTENDANCE_DIR):
        os.makedirs(ATTENDANCE_DIR)

    if os.path.exists(ENCODING_FILE) and os.path.getsize(ENCODING_FILE) > 0:
        try:
            with open(ENCODING_FILE, "rb") as f:
                return pickle.load(f)
        except:
            pass

    return {"encodings": [], "names": []}

# --------------------------------------
# SAVE ENCODINGS
# --------------------------------------
def save_encodings(data):
    with open(ENCODING_FILE, "wb") as f:
        pickle.dump(data, f)

# --------------------------------------
# REGISTER USER
# --------------------------------------
def register_user(name, img):
    img_path = f"{IMAGE_DIR}/{name}.jpg"
    cv2.imwrite(img_path, img)

    encodings = face_recognition.face_encodings(img)
    if len(encodings) == 0:
        return False

    enc = encodings[0]
    data = load_encodings()
    data["encodings"].append(enc)
    data["names"].append(name)
    save_encodings(data)
    return True

# --------------------------------------
# RECOGNIZE FACE + BOUNDING BOXES
# --------------------------------------
def recognize_face(frame):
    data = load_encodings()
    encs = data["encodings"]
    names = data["names"]

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb)
    encodings = face_recognition.face_encodings(rgb, boxes)

    if len(encs) == 0:
        return frame, "No Users Registered", None

    for (top, right, bottom, left), enc in zip(boxes, encodings):
        matches = face_recognition.compare_faces(encs, enc)
        name = "Unknown"

        if True in matches:
            idx = matches.index(True)
            name = names[idx]

        # Draw bounding box
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        return frame, name, boxes

    return frame, "Unknown", None

# --------------------------------------
# MARK ATTENDANCE (daily file)
# --------------------------------------
def mark_attendance(name):
    date = datetime.now().strftime("%d-%m-%Y")
    timestamp = datetime.now().strftime("%H:%M:%S")

    file_path = f"{ATTENDANCE_DIR}/Attendance_{date}.csv"

    if not os.path.exists(file_path):
        pd.DataFrame(columns=["NAME", "TIME"]).to_csv(file_path, index=False)

    df = pd.DataFrame([[name, timestamp]], columns=["NAME", "TIME"])
    df.to_csv(file_path, mode="a", header=False, index=False)

    # Sound alert
    winsound.Beep(1000, 400)
