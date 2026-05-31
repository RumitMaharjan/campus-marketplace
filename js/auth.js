import {auth} from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

export function signOutUser(){
    signOut(auth).then(()=>{
        window.location.href = 'login.html';
    })
    .catch((error)=>{
        window.alert("Error signing out!");
    });
};
