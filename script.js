import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    serverTimestamp
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

// ==========================
// Load Approved Reviews
// ==========================

async function loadReviews() {

    const reviewsContainer = document.getElementById("reviewsContainer");

    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = "";

    const q = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        reviewsContainer.innerHTML =
        "<p>No reviews yet.</p>";

        return;

    }

    snapshot.forEach((reviewDoc) => {

        const data = reviewDoc.data();

        const card = document.createElement("div");

        card.className = "review-card";

        card.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.review}</p>
        `;

        reviewsContainer.appendChild(card);

    });

}

loadReviews();


// ==========================
// Student Review Submission
// ==========================

const submitBtn = document.getElementById("submitReview");

if (submitBtn) {

    submitBtn.addEventListener("click", async () => {

        const name = document.getElementById("studentName").value.trim();

        const review = document.getElementById("studentReview").value.trim();

        if (!name || !review) {
            alert("Please fill all fields.");
            return;
        }

        await addDoc(collection(db, "pendingReviews"), {

            name,
            review,
            createdAt: serverTimestamp()

        });

        alert("✅ Thank you! Your review has been sent for approval.");

        document.getElementById("studentName").value = "";

        document.getElementById("studentReview").value = "";

    });

}
