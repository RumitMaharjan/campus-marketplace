import {requireAuth, signOutUser} from './auth.js';

const displayEmail = document.getElementById('display-email');
const signoutBtn = document.getElementById('signout-btn');

requireAuth((user)=>{
    
    displayEmail.textContent = user.email;
    
    signoutBtn.addEventListener('click',()=>{
        signOutUser()
        .catch((error)=>{
            window.alert("Could not log out. Please try again.");
        });
    });
});


