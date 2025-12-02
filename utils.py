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

# ------------ LOAD ENCODINGS ----------------
def load_encodings():
    if os.path.exists(ENCODING_FILE):
        with open(ENCODING_FILE, "rb") as f:
            return pickle.load(f)
    return {"encodings": [], "names": []}

# ------------ SAVE ENCODINGS ----------------
def save_encodings(data):
    with open(ENCODING_FILE, "wb") as f:
        pickle.dump(data, f)

# ------------ ADD USER ENCODING -------------
def register_user(name, img):
    if not os.path.exists(IMAGE_DIR):
        os.makedirs(IMAGE_DIR)

    cv2.imwrite(f"{IMAGE_DIR}/{name}.jpg", img)

    enc = face_recognition.face_encodings(img)
    if len(enc) == 0:
        return False

    data = load_encodings()
    data["encodings"].append(enc[0])
    data["names"].append(name)
    save_encodings(data)

    return True

# ------------ MARK ATTENDANCE ---------------
def mark_attendance(name):
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    df = pd.DataFrame([[name, time]], columns=["Name", "Time"])
    df.to_csv(ATTENDANCE_FILE, mode="a", header=False, index=False)

# ------------ RECOGNIZE FACE ----------------
def recognize_face(frame):
    data = load_encodings()

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    locations = face_recognition.face_locations(rgb)
    encodings = face_recognition.face_encodings(rgb, locations)

    for enc in encodings:
        matches = face_recognition.compare_faces(data["encodings"], enc)
        if True in matches:
            idx = matches.index(True)
            return data["names"][idx]

    return "Unknown"
