import {auth} from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"


const formBtn = document.getElementById('submit-form');

const errorBox = document.getElementById('error-message');

formBtn.addEventListener('click',()=>{

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    errorBox.textContent = "";
    errorBox.classList.add('d-none');

    if(!email || !password){
        showError("Please fill in both email and password fields.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            const user = userCredential.user;
            
            window.location.href = 'index.html';
        })
        .catch((error)=>{
            const errorCode = error.code;
            const errorMessage = error.message;

            if(errorCode === 'auth/invalid-email'){
                showError("Please enter a valid email address.");
            }
            else if(errorCode === 'auth/invalid-credential'){
                showError("Incorrect email or password. Please try again.");
            }
            else if(error.code === 'auth/too-many-requests'){
                showError("Too many failed attempts. Access temporarily blocked.");
            }
            else {
                showError("An unexpected error occurred. Please try again.");
            }
        });

});

function showError(message){
errorBox.textContent = message;
errorBox.classList.remove('d-none');
}

// Password Toggle

const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('toggle-password');
const eyeShow = document.querySelector('.eye-show');
const eyeHide = document.querySelector('.eye-hide');

passwordToggle.addEventListener('click',()=>{
    
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type',isPassword?'text':'password');

    eyeShow.classList.toggle('d-none');
    eyeHide.classList.toggle('d-none');

});
