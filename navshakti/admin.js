import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const CLOUD_NAME = "b8wu1hn4";
const UPLOAD_PRESET = "navshakti";

// Upload file to Cloudinary
export async function uploadFile(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            alert("Upload Failed!");
            return null;
        }

        return data.secure_url;

    } catch (error) {

        console.error(error);
        alert("Something went wrong while uploading.");
        return null;

    }

}

// Firebase Login
window.login = async function () {

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("error").innerText =
            "Please enter Email and Password.";
        return;
    }

    try {

        await signInWithEmailAndPassword(auth, email, password);

        window.location.href = "dashboard.html";

    } catch (error) {

        document.getElementById("error").innerText =
            "Invalid Email or Password";

        console.error(error);

    }

};