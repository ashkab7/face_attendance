// Start webcam
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    let video = document.getElementById("video");
    if (video) video.srcObject = stream;
});

// Attendance Recognition
setInterval(async () => {
    let video = document.getElementById("video");
    if (!video) return;

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    let imageData = canvas.toDataURL("image/jpeg");

    let res = await fetch("/api/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData })
    });

    let out = await res.json();
    if (document.getElementById("status"))
        document.getElementById("status").innerText = out.name;

}, 700);

// Register User
async function registerUser() {
    let name = document.getElementById("name").value;
    let video = document.getElementById("video");

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);
    let imageData = canvas.toDataURL("image/jpeg");

    let formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageData);

    let res = await fetch("/api/register", { method: "POST", body: formData });
    let out = await res.json();

    document.getElementById("msg").innerText =
        out.success ? "User registered!" : "Face not detected!";
}

// Delete User
async function deleteUser(name) {
    let form = new FormData();
    form.append("name", name);

    let res = await fetch("/api/delete", { method: "POST", body: form });
    let out = await res.json();

    document.getElementById("adminStatus").innerText =
        out.success ? "User deleted." : "Error deleting.";

    location.reload();
}

// Retrain Model
async function retrainModel() {
    await fetch("/api/retrain", { method: "POST" });
    document.getElementById("adminStatus").innerText = "Model retrained!";
}
