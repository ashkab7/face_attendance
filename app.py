import streamlit as st
import cv2
import numpy as np
from utils import register_user, recognize_face, mark_attendance
import pandas as pd
import time
import os
from datetime import datetime

# -------------------------------
# ADMIN LOGIN CREDENTIALS
# -------------------------------
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "12345"

# ---------------------------------
# SESSION STATE VARIABLES
# ---------------------------------
if "admin_logged_in" not in st.session_state:
    st.session_state.admin_logged_in = False

if "camera_on" not in st.session_state:
    st.session_state.camera_on = False

if "attendance_marked" not in st.session_state:
    st.session_state.attendance_marked = False

if "end_camera" not in st.session_state:
    st.session_state.end_camera = False


# ---------------------------------
# ADMIN LOGIN PAGE
# ---------------------------------
def admin_login_page():
    st.title("🔐 Admin Login")

    username = st.text_input("Username")
    password = st.text_input("Password", type="password")

    if st.button("Login"):
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            st.session_state.admin_logged_in = True
            st.success("Login Successful!")
            st.rerun()
        else:
            st.error("Invalid username or password")


# ---------------------------------
# MAIN UI
# ---------------------------------
st.set_page_config(page_title="Face Attendance System", layout="wide")

st.title("📸 Face Recognition Attendance System")

menu = ["Register User", "Mark Attendance", "Admin Panel"]
choice = st.sidebar.selectbox("Menu", menu)

# Update camera end flag
if choice != "Mark Attendance":
    st.session_state.end_camera = True
else:
    st.session_state.end_camera = False


# ----------------------------------------------------
# 1. REGISTER USER
# ----------------------------------------------------
if choice == "Register User":
    st.header("🧑 Register New User")
    name = st.text_input("Enter Name")

    camera = st.camera_input("Take a Picture")

    if camera and name:
        img = cv2.imdecode(np.frombuffer(camera.getvalue(), np.uint8), cv2.IMREAD_COLOR)
        if register_user(name, img):
            st.success(f"User '{name}' registered successfully!")
        else:
            st.error("❌ No face detected. Try again.")


# ----------------------------------------------------
# 2. MARK ATTENDANCE (FAST & SMOOTH VIDEO)
# ----------------------------------------------------
elif choice == "Mark Attendance":
    st.header("✔ Mark Attendance (Live Camera)")

    start_button = st.button("Start Camera")
    mark_button = st.button("Mark Attendance")

    FRAME = st.empty()

    if start_button:
        st.session_state.camera_on = True
        st.session_state.attendance_marked = False
        st.rerun()

    if st.session_state.camera_on:
        cap = cv2.VideoCapture(0)

        while True:

            # Stop if user navigates away
            if st.session_state.end_camera:
                break

            ret, frame = cap.read()
            if not ret or frame is None:
                continue

            frame = cv2.flip(frame, 1)

            frame, name_detected, box = recognize_face(frame)

            FRAME.image(frame, channels="BGR")

            if mark_button and not st.session_state.attendance_marked:
                if name_detected not in ["Unknown", "No Users Registered"]:
                    mark_attendance(name_detected)
                    st.success(f"Attendance Marked for {name_detected}")
                    st.session_state.attendance_marked = True
                else:
                    st.error("Face Not Recognized!")

        cap.release()


# ----------------------------------------------------
# 3. ADMIN PANEL (LOGIN PROTECTED)
# ----------------------------------------------------
elif choice == "Admin Panel":

    if not st.session_state.admin_logged_in:
        admin_login_page()

    else:
        st.header("📊 Daily Attendance Report")

        date = datetime.now().strftime("%d-%m-%Y")
        file_path = f"Attendance/Attendance_{date}.csv"

        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            st.dataframe(df)
        else:
            st.warning("No attendance found for today.")

        if st.button("Logout"):
            st.session_state.admin_logged_in = False
            st.rerun()
