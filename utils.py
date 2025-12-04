import face_recognition
import os
import pickle
import cv2
import numpy as np
import pandas as pd
from datetime import datetime
import shutil

ENCODING_FILE = "data/encodings.pkl"
IMAGE_DIR = "data/user_images"
ATT_DIR = "Attendance"
THRESHOLD = 0.45  # lower = stricter match

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
        except Exception:
            pass
    return {"encodings": [], "names": []}

def save_encodings(data):
    with open(ENCODING_FILE, "wb") as f:
        pickle.dump(data, f)

def retrain():
    """Rebuild encodings from all stored user images."""
    encodings = []
    names = []

    if not os.path.exists(IMAGE_DIR):
        save_encodings({"encodings": [], "names": []})
        return True

    for user in os.listdir(IMAGE_DIR):
        user_folder = os.path.join(IMAGE_DIR, user)
        if not os.path.isdir(user_folder):
            continue

        for img_name in os.listdir(user_folder):
            img_path = os.path.join(user_folder, img_name)
            img = cv2.imread(img_path)
            if img is None:
                continue

            rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            boxes = face_recognition.face_locations(rgb, model="hog")
            encs = face_recognition.face_encodings(rgb, boxes)
            if len(encs) > 0:
                encodings.append(encs[0])
                names.append(user)

    save_encodings({"encodings": encodings, "names": names})
    return True

def register_user(name: str, img_bgr) -> bool:
    """
    Save user's image & update encodings.
    Returns True on success, False if no face found.
    """
    ensure_dirs()
    user_folder = os.path.join(IMAGE_DIR, name)
    os.makedirs(user_folder, exist_ok=True)

    count = len(os.listdir(user_folder)) + 1
    img_path = os.path.join(user_folder, f"img_{count}.jpg")
    cv2.imwrite(img_path, img_bgr)

    # Check face is there
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb, model="hog")
    encs = face_recognition.face_encodings(rgb, boxes)
    if len(encs) == 0:
        # remove the saved image if no face
        os.remove(img_path)
        return False

    retrain()
    return True

def delete_user(name: str) -> bool:
    user_folder = os.path.join(IMAGE_DIR, name)
    if os.path.exists(user_folder):
        shutil.rmtree(user_folder)
        retrain()
        return True
    return False

def recognize_face(frame_bgr):
    """
    Given a BGR frame, return (best_name).
    """
    data = load_encodings()
    known_encs = data["encodings"]
    known_names = data["names"]

    if len(known_encs) == 0:
        return "NO USERS"

    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb, model="hog")
    encodings = face_recognition.face_encodings(rgb, boxes)

    if len(encodings) == 0:
        return "Unknown"

    best_name = "Unknown"
    for enc in encodings:
        distances = face_recognition.face_distance(known_encs, enc)
        idx = np.argmin(distances)
        if distances[idx] < THRESHOLD:
            best_name = known_names[idx]

    return best_name

def mark_attendance(name: str):
    """
    Append attendance to Attendance/Attendance_dd-mm-YYYY.csv
    """
    ensure_dirs()
    date_str = datetime.now().strftime("%d-%m-%Y")
    time_str = datetime.now().strftime("%H:%M:%S")
    file_path = os.path.join(ATT_DIR, f"Attendance_{date_str}.csv")

    if not os.path.exists(file_path):
        pd.DataFrame(columns=["Name", "Time"]).to_csv(file_path, index=False)

    df = pd.DataFrame([[name, time_str]], columns=["Name", "Time"])
    df.to_csv(file_path, mode="a", header=False, index=False)

def get_registered_users():
    """
    Returns list of registered user names (folder names).
    """
    ensure_dirs()
    users = []
    for entry in os.listdir(IMAGE_DIR):
        full = os.path.join(IMAGE_DIR, entry)
        if os.path.isdir(full):
            users.append(entry)
    return sorted(users)
