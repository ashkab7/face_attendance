import streamlit as st
import cv2
import numpy as np
from utils import register_user, recognize_face, mark_attendance
import pandas as pd
import time

st.set_page_config(page_title="Face Attendance System", layout="wide")

st.title("📸 Face Recognition Attendance System")

menu = ["Register User", "Mark Attendance", "Admin Panel"]
choice = st.sidebar.selectbox("Menu", menu)

# ----------------------------------------------------
# 1. USER REGISTRATION
# ----------------------------------------------------
if choice == "Register User":
    st.header("🧑 Register New User")
    name = st.text_input("Enter Name")

    camera = st.camera_input("Take a picture")

    if camera and name:
        img = cv2.imdecode(np.frombuffer(camera.getvalue(), np.uint8), cv2.IMREAD_COLOR)

        if register_user(name, img):
            st.success(f"User '{name}' registered successfully!")
        else:
            st.error("Face not detected! Try taking a clearer photo.")

# ----------------------------------------------------
# 2. MARK ATTENDANCE
# ----------------------------------------------------
elif choice == "Mark Attendance":
    st.header("✔ Mark Attendance (Live Camera)")

    FRAME_WINDOW = st.image([])

    camera = cv2.VideoCapture(0)

    st.info("Looking for faces... Press Ctrl+C in terminal to stop if stuck.")

    while True:
        ret, frame = camera.read()
        frame = cv2.flip(frame, 1)

        name = recognize_face(frame)

        cv2.putText(frame, name, (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        FRAME_WINDOW.image(frame, channels="BGR")

        if name not in ["Unknown", "No Users Registered"]:
            mark_attendance(name)
            st.success(f"Attendance marked for {name}")
            time.sleep(2)
            break

    camera.release()

# ----------------------------------------------------
# 3. ADMIN PANEL
# ----------------------------------------------------
elif choice == "Admin Panel":
    st.header("📊 Attendance Records")

    try:
        df = pd.read_csv("attendance.csv")
        st.dataframe(df)
    except:
        st.warning("No attendance file found yet.")
