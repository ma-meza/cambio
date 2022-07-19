import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { unsubscribeNotificationUser, subscribeUser } from "subscription.js"

import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post(window.api_prefix+"/signupUser", userData)
        .then(res => history.push("/login")) // re-direct to login on successful register
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};
// Login - get user token
export const loginUser = userData => dispatch => {
    axios
        .post(window.api_prefix+"/loginUser", userData)
        .then(res => {
            // Save to localStorage
            // Set token to localStorage
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);

            localStorage.setItem("setupVerif", res.data.isAccountSetup);

            // Set token to Auth header
            setAuthToken(token);
            subscribeUser()
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


//LOGIN EMPLOYEE
export const loginEmployee = userData => dispatch => {
    axios
        .post("/api/loginEmployee", userData)
        .then(res => {
            // Save to localStorage
            // Set token to localStorage
            const { token } = res.data;
            console.log(token);
            localStorage.setItem("employeeToken", token);
            // Set token to Auth header
            // Apply authorization token to every request if logged in
            axios.defaults.headers.common["employeeAuthorization"] = token;
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentEmployee(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const setCurrentEmployee = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};


// User loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};
// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage

    unsubscribeNotificationUser(localStorage.getItem("jwtToken"));

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("setupVerif");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};