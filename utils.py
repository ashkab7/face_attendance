import face_recognition, os, pickle, cv2, numpy as np, pandas as pd, shutil
from datetime import datetime

ENCODING_FILE = "data/encodings.pkl"
IMAGE_DIR = "data/user_images"
ATT_DIR = "Attendance"
THRESHOLD = 0.45

def ensure_dirs():
    os.makedirs("data", exist_ok=True)
    os.makedirs(IMAGE_DIR, exist_ok=True)
    os.makedirs(ATT_DIR, exist_ok=True)

ensure_dirs()

def load_encodings():
    if os.path.exists(ENCODING_FILE):
        try:
            return pickle.load(open(ENCODING_FILE, "rb"))
        except:
            pass
    return {"encodings": [], "names": []}

def save_encodings(data):
    pickle.dump(data, open(ENCODING_FILE, "wb"))

def retrain():
    encs, names = [], []
    for user in os.listdir(IMAGE_DIR):
        folder = os.path.join(IMAGE_DIR, user)
        if not os.path.isdir(folder):
            continue
        for img_name in os.listdir(folder):
            img = cv2.imread(os.path.join(folder, img_name))
            if img is None:
                continue
            rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            boxes = face_recognition.face_locations(rgb, model="hog")
            enc = face_recognition.face_encodings(rgb, boxes)
            if len(enc)>0:
                encs.append(enc[0])
                names.append(user)
    save_encodings({"encodings": encs, "names": names})

def register_user(name, img):
    ensure_dirs()
    folder = os.path.join(IMAGE_DIR, name)
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, f"img_{len(os.listdir(folder))+1}.jpg")
    cv2.imwrite(path, img)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb, model="hog")
    enc = face_recognition.face_encodings(rgb, boxes)
    if len(enc)==0:
        os.remove(path)
        return False
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
    if len(data["encodings"])==0:
        return "NO USERS"
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb, model="hog")
    encs = face_recognition.face_encodings(rgb, boxes)
    if len(encs)==0:
        return "Unknown"
    for enc in encs:
        dist = face_recognition.face_distance(data["encodings"], enc)
        i = np.argmin(dist)
        if dist[i]<THRESHOLD:
            return data["names"][i]
    return "Unknown"

def mark_attendance(name):
    ensure_dirs()
    date = datetime.now().strftime("%d-%m-%Y")
    time = datetime.now().strftime("%H:%M:%S")
    file = os.path.join(ATT_DIR, f"Attendance_{date}.csv")
    if not os.path.exists(file):
        pd.DataFrame(columns=["Name","Time"]).to_csv(file, index=False)
    pd.DataFrame([[name,time]], columns=["Name","Time"]).to_csv(file, mode="a", header=False, index=False)

def get_registered_users():
    return sorted([u for u in os.listdir(IMAGE_DIR) if os.path.isdir(os.path.join(IMAGE_DIR,u))])
a