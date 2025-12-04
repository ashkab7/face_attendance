import face_recognition
import os
import pickle
import cv2
import numpy as np
import pandas as pd
from datetime import datetime
import shutil

ENCODING_FILE = "data/encodings.pkl"
IMAGE_DIR = "data/user_images/"
ATT_DIR = "Attendance/"

THRESHOLD = 0.45

def ensure_dirs():
    os.makedirs("data", exist_ok=True)
    os.makedirs(IMAGE_DIR, exist_ok=True)
    os.makedirs(ATT_DIR, exist_ok=True)

ensure_dirs()

def load_encodings():
    if os.path.exists(ENCODING_FILE):
        try:
            with open(ENCODING_FILE, "rb") as f:
                return pickle.load(f)
        except:
            pass
    return {"encodings": [], "names": []}

def save_encodings(data):
    with open(ENCODING_FILE, "wb") as f:
        pickle.dump(data, f)

def retrain():
    encodings = []
    names = []

    for user in os.listdir(IMAGE_DIR):
        folder = os.path.join(IMAGE_DIR, user)
        for img_name in os.listdir(folder):
            img_path = os.path.join(folder, img_name)
            img = cv2.imread(img_path)
            if img is None:
                continue

            rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            boxes = face_recognition.face_locations(rgb, model="hog")
            face_enc = face_recognition.face_encodings(rgb, boxes)

            if len(face_enc) > 0:
                encodings.append(face_enc[0])
                names.append(user)

    save_encodings({"encodings": encodings, "names": names})
    return True

def register_user(name, img):
    user_folder = os.path.join(IMAGE_DIR, name)
    os.makedirs(user_folder, exist_ok=True)

    count = len(os.listdir(user_folder)) + 1
    img_path = f"{user_folder}/img_{count}.jpg"

    cv2.imwrite(img_path, img)

    retrain()
    return True

def delete_user(name):
    folder = os.path.join(IMAGE_DIR, name)
    if os.path.exists(folder):
        shutil.rmtree(folder)
        retrain()
        return True
    return False

def recognize_face(frame):
    data = load_encodings()
    encs = data["encodings"]
    names = data["names"]

    if len(encs) == 0:
        return frame, "NO USERS", None

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb, model="hog")
    encodings = face_recognition.face_encodings(rgb, boxes)

    best_match = "Unknown"

    for encode in encodings:
        distances = face_recognition.face_distance(encs, encode)
        idx = np.argmin(distances)

        if distances[idx] < THRESHOLD:
            best_match = names[idx]

    for (top, right, bottom, left) in boxes:
        cv2.rectangle(frame, (left, top), (right, bottom), (0,255,0), 2)
        cv2.putText(frame, best_match, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)

    return frame, best_match, boxes

def mark_attendance(name):
    date = datetime.now().strftime("%d-%m-%Y")
    time = datetime.now().strftime("%H:%M:%S")

    file_path = f"{ATT_DIR}/Attendance_{date}.csv"

    if not os.path.exists(file_path):
        pd.DataFrame(columns=["Name","Time"]).to_csv(file_path, index=False)

    df = pd.DataFrame([[name, time]], columns=["Name","Time"])
    df.to_csv(file_path, mode="a", header=False, index=False)
