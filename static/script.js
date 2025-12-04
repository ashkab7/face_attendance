let liveStream = null;
let attendanceInterval = null;

// Start camera on given video element
async function startCamera(videoId) {
    const video = document.getElementById(videoId);
    if (!video) return;

    try {
        liveStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = liveStream;
    } catch (err) {
        console.error("Camera error:", err);
        const status = document.getElementById("status-text");
        if (status) status.innerText = "Cannot access camera: " + err;
    }
}

// Capture frame from video to base64
function captureFrame(videoId) {
    const video = document.getElementById(videoId);
    if (!video || video.readyState !== 4) {
        return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg");
}

// Start attendance loop
function startAttendance() {
    const status = document.getElementById("status-text");
    if (status) status.innerText = "Starting attendance...";

    if (attendanceInterval) {
        clearInterval(attendanceInterval);
    }

    attendanceInterval = setInterval(async () => {
        const imgData = captureFrame("video-live");
        if (!imgData) return;

        const res = await fetch("/api/recognize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imgData })
        });

        const out = await res.json();
        const name = out.name || "Unknown";

        if (status) status.innerText = "Detected: " + name;

        if (name !== "Unknown" && name !== "NO USERS") {
            // Stop loop after successful attendance
            clearInterval(attendanceInterval);
            attendanceInterval = null;
            if (status) status.innerText = "Attendance marked for: " + name;
        }
    }, 1000);
}

// Register a new user
async function registerUser() {
    const nameInput = document.getElementById("name-input");
    const msg = document.getElementById("register-msg");

    if (!nameInput) return;

    const name = nameInput.value.trim();
    if (!name) {
        msg.innerText = "Please enter a name.";
        return;
    }

    // Only letters and spaces
    if (!/^[A-Za-z ]+$/.test(name)) {
        msg.innerText = "Name must contain only letters and spaces.";
        return;
    }

    const imgData = captureFrame("video-register");
    if (!imgData) {
        msg.innerText = "Camera not ready. Wait a moment.";
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imgData);

    const res = await fetch("/api/register", {
        method: "POST",
        body: formData
    });

    const out = await res.json();
    msg.innerText = out.message || (out.success ? "Registered!" : "Failed.");
    if (out.success) {
        nameInput.value = "";
    }
}


// Init per page
document.addEventListener("DOMContentLoaded", () => {
    const liveVideo = document.getElementById("video-live");
    const regVideo = document.getElementById("video-register");

    // Home page: mark attendance
    if (liveVideo) {
        startCamera("video-live");
        const btn = document.getElementById("start-attendance-btn");
        if (btn) {
            btn.addEventListener("click", startAttendance);
        }
    }

    // Register page
    if (regVideo) {
        startCamera("video-register");
        const regBtn = document.getElementById("register-btn");
        if (regBtn) {
            regBtn.addEventListener("click", registerUser);
        }
    }
});
