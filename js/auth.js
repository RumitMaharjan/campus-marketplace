import {auth} from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Require auth for the user
export function requireAuth(callback){
    onAuthStateChanged(auth, (user)=>{
        if(!user){
            window.location.href = 'login.html';
        }
        else{
            callback(user);
        }
    });
};

// Signout
export function signOutUser(){
    signOut(auth).then(()=>{
        window.location.href = 'login.html';
    })
    .catch((error)=>{
        window.alert("Error signing out!");
    });
};
