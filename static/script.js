let liveStream=null,attendanceInterval=null;

async function startCamera(videoId){
    const video=document.getElementById(videoId);
    if(!video)return;
    try{
        liveStream=await navigator.mediaDevices.getUserMedia({video:true});
        video.srcObject=liveStream;
    }catch(err){console.error(err);}
}

function captureFrame(videoId){
    const v=document.getElementById(videoId);
    if(!v||v.readyState!==4)return null;
    const c=document.createElement("canvas");
    c.width=v.videoWidth;c.height=v.videoHeight;
    c.getContext("2d").drawImage(v,0,0);
    return c.toDataURL("image/jpeg");
}

function startAttendance(){
    const status=document.getElementById("status-text");
    if(attendanceInterval)clearInterval(attendanceInterval);
    attendanceInterval=setInterval(async()=>{
        const img=captureFrame("video-live");
        if(!img)return;
        const r=await fetch("/api/recognize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:img})});
        const out=await r.json();
        status.innerText="Detected: "+out.name;
        if(out.name!=="Unknown"&&out.name!=="NO USERS"){
            status.innerText="Attendance marked for: "+out.name;
            clearInterval(attendanceInterval);
        }
    },900);
}

async function registerUser(){
    const name=document.getElementById("name-input").value.trim();
    const msg=document.getElementById("register-msg");
    if(!name){msg.innerText="Enter a name.";return;}
    const img=captureFrame("video-register");
    if(!img){msg.innerText="Camera not ready.";return;}
    const fd=new FormData();
    fd.append("name",name);
    fd.append("image",img);
    const r=await fetch("/api/register",{method:"POST",body:fd});
    const out=await r.json();
    msg.innerText=out.message;
}

async function deleteUser(name){
    if(!confirm("Delete "+name+"?"))return;
    const fd=new FormData();
    fd.append("name",name);
    const r=await fetch("/api/delete-user",{method:"POST",body:fd});
    const out=await r.json();
    if(out.success)location.reload();
    else alert("Failed");
}

document.addEventListener("DOMContentLoaded",()=>{
    if(document.getElementById("video-live")){
        startCamera("video-live");
        document.getElementById("start-attendance-btn").onclick=startAttendance;
    }
    if(document.getElementById("video-register")){
        startCamera("video-register");
        document.getElementById("register-btn").onclick=registerUser;
    }
});
