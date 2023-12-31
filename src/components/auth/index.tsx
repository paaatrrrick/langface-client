import React, { useState, useEffect } from 'react';
import './auth.css'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import constants from '../../constants';
import { initializeApp } from "firebase/app";
import { useDispatch, useSelector } from 'react-redux';
import constants from "../../constants";
import { actions, RootState } from '../../store';
import '../navController/navController.css'

const firebaseConfig = {
    apiKey: "AIzaSyBdOHXmq235jFOtiAg7KtnXE6zriN8r6xU",
    authDomain: "bloggergpt-154c3.firebaseapp.com",
    projectId: "bloggergpt-154c3",
    storageBucket: "bloggergpt-154c3.appspot.com",
    messagingSenderId: "556522585513",
    appId: "1:556522585513:web:8a525a15f80d0a680898b8",
    measurementId: "G-FW09N6MY24"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

type AuthProps = {
    launch: () => void,
    mask?: string,
    payment?: () => void,
}

const Auth = ({ launch, mask, payment } : AuthProps)  => {
    const { isLoggedIn, user, } = useSelector((state : RootState) => state.main);
    const dispatch = useDispatch();

    const handleGoogle = async () => {
        var result : any = null;
        try {
            result = await signInWithPopup(auth, provider);
        } catch (err) {
            dispatch(actions.setBannerMessage({type: "error", message: "Error logging in with google"}));
            return;
        }
        const res = await fetch(`${constants.url}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: result.user.uid, email: result.user.email, photoURL: result.user.photoURL, name: result.user.displayName }),
        });
        const data = await res.json();
        if (!res.ok) {
            dispatch(actions.setBannerMessage({type: "error", message: "Error logging in with google"}));
            return;
        }
        window.localStorage.setItem("langface-auth", data.token);
        launch();
        //
        if (mask==="true" && payment) payment();
    };

    const signOutClicked = () : void => {
        dispatch(actions.signOut());
    };

    if (isLoggedIn) {
        return (
            <div className="Auth-loggedIn" onClick={signOutClicked} >
                {(user.photoURL) && <img src={user?.photoURL} alt="profile" />}
                Sign out
            </div>
        );
    }
    return (<button className="login-with-google-btn" onClick={handleGoogle}>
            Google Login 
            </button>

    );
}

//{error && <p>{error.message}</p>}
export default Auth;