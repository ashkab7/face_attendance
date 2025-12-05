from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import cv2, numpy as np, base64, os, pandas as pd
from utils import register_user, recognize_face, mark_attendance, retrain, delete_user, get_registered_users, ATT_DIR

app = Flask(__name__)
app.secret_key = "super-secret-key-change-this"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register")
def register_page():
    return render_template("register.html")

@app.route("/admin-login", methods=["GET", "POST"])
def admin_login():
    msg = None
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()
        if username == "admin" and password == "1234":
            session["admin"] = True
            return redirect(url_for("admin_dashboard"))
        msg = "Invalid credentials."
    return render_template("admin_login.html", message=msg)

@app.route("/admin")
def admin_dashboard():
    if not session.get("admin"):
        return redirect(url_for("admin_login"))
    users = get_registered_users()
    attendance_records = []
    if os.path.exists(ATT_DIR):
        for fname in sorted(os.listdir(ATT_DIR)):
            if fname.startswith("Attendance_") and fname.endswith(".csv"):
                date_str = fname.replace("Attendance_", "").replace(".csv", "")
                df = pd.read_csv(os.path.join(ATT_DIR, fname))
                for _, row in df.iterrows():
                    attendance_records.append({"date": date_str, "name": row.get("Name",""), "time": row.get("Time","")})
    return render_template("admin_dashboard.html", users=users, attendance=attendance_records)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))

@app.route("/api/recognize", methods=["POST"])
def api_recognize():
    data = request.json
    img_data = data.get("image","")
    if "," in img_data:
        img_data = img_data.split(",")[1]
    img_bytes = base64.b64decode(img_data)
    frame = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    name = recognize_face(frame)
    if name not in ["Unknown","NO USERS"]:
        mark_attendance(name)
    return jsonify({"name": name})

@app.route("/api/register", methods=["POST"])
def api_register():
    name = request.form.get("name","").strip()
    img_data = request.form.get("image","")
    if not name or not all(c.isalpha() or c.isspace() for c in name):
        return jsonify({"success": False, "message": "Name must contain only letters and spaces."})
    if "," in img_data:
        img_data = img_data.split(",")[1]
    img_bytes = base64.b64decode(img_data)
    img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        return jsonify({"success": False, "message": "Invalid image."})
    ok = register_user(name, img)
    if not ok:
        return jsonify({"success": False, "message": "No face detected. Try again."})
    return jsonify({"success": True, "message": f"User '{name}' registered successfully!"})

@app.route("/api/delete-user", methods=["POST"])
def api_delete_user():
    if not session.get("admin"):
        return jsonify({"success": False, "message": "Unauthorized"})
    name = request.form.get("name","")
    return jsonify({"success": delete_user(name)})

if __name__ == "__main__":
    app.run(debug=True)
