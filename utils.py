import face_recognition
import os
import pickle
import numpy as np
import cv2
import pandas as pd
from datetime import datetime

ENCODING_FILE = "data/encodings.pkl"
IMAGE_DIR = "data/user_images/"
ATTENDANCE_FILE = "attendance.csv"

# --------------------------------------
# SAFE LOAD ENCODINGS
# --------------------------------------
def load_encodings():
    # Create directories if missing
    if not os.path.exists("data"):
        os.makedirs("data")
    if not os.path.exists(IMAGE_DIR):
        os.makedirs(IMAGE_DIR)

    # If file exists AND is not empty
    if os.path.exists(ENCODING_FILE) and os.path.getsize(ENCODING_FILE) > 0:
        try:
            with open(ENCODING_FILE, "rb") as f:
                return pickle.load(f)
        except Exception:
            pass  # corrupted, ignore and recreate

    # Default empty structure
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
    if not os.path.exists(IMAGE_DIR):
        os.makedirs(IMAGE_DIR)

    # Save user image
    img_path = f"{IMAGE_DIR}/{name}.jpg"
    cv2.imwrite(img_path, img)

    # Extract encoding
    encodings = face_recognition.face_encodings(img)
    if len(encodings) == 0:
        return False  # No face found

    enc = encodings[0]

    # Load existing encodings
    data = load_encodings()

    # Append new data
    data["encodings"].append(enc)
    data["names"].append(name)

    # Save
    save_encodings(data)

    return True

# --------------------------------------
# RECOGNIZE FACE
# --------------------------------------
def recognize_face(frame):
    data = load_encodings()
    known_encodings = data["encodings"]
    known_names = data["names"]

    if len(known_encodings) == 0:
        return "No Users Registered"

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb)
    encodings = face_recognition.face_encodings(rgb, face_locations)

    for encoding in encodings:
        matches = face_recognition.compare_faces(known_encodings, encoding)
        if True in matches:
            idx = matches.index(True)
            return known_names[idx]

    return "Unknown"

# --------------------------------------
# MARK ATTENDANCE
# --------------------------------------
def mark_attendance(name):
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Create file if not exists
    if not os.path.exists(ATTENDANCE_FILE):
        pd.DataFrame(columns=["Name", "Time"]).to_csv(ATTENDANCE_FILE, index=False)

    df = pd.DataFrame([[name, time]], columns=["Name", "Time"])
    df.to_csv(ATTENDANCE_FILE, mode="a", header=False, index=False)

