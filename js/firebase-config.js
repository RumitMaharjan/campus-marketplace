import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBlYQOgm3vaV6cf9S9r7NnuvSMpZQ6hstU",
    authDomain: "campus-marketplace-9b763.firebaseapp.com",
    projectId: "campus-marketplace-9b763",
    storageBucket:  "campus-marketplace-9b763.firebasestorage.app",
    messagingSenderId: "563778257349",
    appId: "1:563778257349:web:8f2d822301e05262438bac"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
