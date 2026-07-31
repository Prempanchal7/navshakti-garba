import { auth, db } from "./firebase.js";
import { uploadFile } from "./admin.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Check Login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin.html";
  }
});

// DOM Elements
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("file");
const status = document.getElementById("status");
const gallery = document.getElementById("gallery");

// Upload Button
uploadBtn.addEventListener("click", async () => {

  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a photo or video.");
    return;
  }

  status.innerHTML = "Uploading...";

  try {

    const url = await uploadFile(file);

    if (!url) {
      status.innerHTML = "Upload Failed!";
      return;
    }

    await addDoc(collection(db, "gallery"), {
      url: url,
      type: file.type.startsWith("video") ? "video" : "image",
      createdAt: serverTimestamp()
    });

    status.innerHTML = "✅ Upload Successful";

    fileInput.value = "";

    loadGallery();

  } catch (err) {

    console.error(err);
    status.innerHTML = "Upload Failed!";

  }

});

// Load Gallery
async function loadGallery() {

  gallery.innerHTML = "";

  const q = query(
    collection(db, "gallery"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((documentData) => {

    const data = documentData.data();

    const item = document.createElement("div");
    item.className = "gallery-item";

    if (data.type === "image") {

      item.innerHTML = `
        <img src="${data.url}" alt="Gallery Image">
        <br><br>
        <button class="deleteBtn">🗑 Delete</button>
      `;

    } else {

      item.innerHTML = `
        <video controls>
          <source src="${data.url}">
        </video>
        <br><br>
        <button class="deleteBtn">🗑 Delete</button>
      `;

    }

    item.querySelector(".deleteBtn").addEventListener("click", async () => {

      const confirmDelete = confirm("Delete this media?");

      if (!confirmDelete) return;

      await deleteDoc(doc(db, "gallery", documentData.id));

      loadGallery();

    });

    gallery.appendChild(item);

  });

}

// Add Review
const reviewBtn = document.getElementById("reviewBtn");

reviewBtn.addEventListener("click", async () => {

  const name = document.getElementById("reviewName").value.trim();
  const review = document.getElementById("reviewText").value.trim();

  if (!name || !review) {
    alert("Please fill all fields.");
    return;
  }

  await addDoc(collection(db, "reviews"), {
    name,
    review,
    createdAt: serverTimestamp()
  });

  alert("✅ Review Added");

  document.getElementById("reviewName").value = "";
  document.getElementById("reviewText").value = "";

});

// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  window.location.href = "admin.html";

});

// Load Gallery
loadGallery();