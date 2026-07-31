import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Scroll Animation
const hiddenElements = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
});

hiddenElements.forEach((el) => {
    el.classList.add("hidden");
    observer.observe(el);
});

// Mobile Menu
const menu = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menu) {
    menu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

// Firebase Gallery
async function loadGallery() {

    const gallery = document.getElementById("galleryGrid");

    if (!gallery) return;

    gallery.innerHTML = "";

    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {

        const data = doc.data();

        const item = document.createElement("div");
        item.className = "gallery-item";

        if (data.type === "video") {

            item.innerHTML = `
                <video controls>
                    <source src="${data.url}">
                </video>
            `;

        } else {

            item.innerHTML = `
    <img src="${data.url}" alt="Gallery" class="gallery-img">
`;

const img = item.querySelector(".gallery-img");

img.onclick = () => {
    popup.style.display = "flex";
    popupImage.src = data.url;
};

        }

        gallery.appendChild(item);

    });

}

loadGallery();
const popup = document.getElementById("imagePopup");
const popupImage = document.getElementById("popupImage");
const closePopup = document.getElementById("closePopup");

if (popup && popupImage && closePopup) {

    closePopup.onclick = () => {
        popup.style.display = "none";
    };

    popup.onclick = (e) => {
        if (e.target === popup) {
            popup.style.display = "none";
        }
    };

}