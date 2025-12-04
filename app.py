from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
import base64
import os
from utils import (
    register_user, recognize_face, mark_attendance,
    retrain, delete_user
)

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/admin")
def admin_login():
    return render_template("admin_login.html")

@app.route("/dashboard")
def dashboard():
    users = sorted(os.listdir("data/user_images/"))
    return render_template("admin_dashboard.html", users=users)

# Recognize API
@app.route("/api/recognize", methods=["POST"])
def api_recognize():
    data = request.json["image"]
    img_bytes = base64.b64decode(data.split(",")[1])
    frame = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

    frame, name, box = recognize_face(frame)
    if name not in ["Unknown", "NO USERS"]:
        mark_attendance(name)

    return jsonify({"name": name})

# Register API
@app.route("/api/register", methods=["POST"])
def api_register():
    name = request.form["name"]
    img_data = request.form["image"]

    img_bytes = base64.b64decode(img_data.split(",")[1])
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)

    success = register_user(name, img)
    return jsonify({"success": success})

# Delete User
@app.route("/api/delete", methods=["POST"])
def api_delete():
    name = request.form["name"]
    return jsonify({"success": delete_user(name)})

# Retrain
@app.route("/api/retrain", methods=["POST"])
def api_retrain():
    retrain()
    return jsonify({"success": True})

app.run(debug=True)
