import axios from "axios";
import {browserHistory} from "react-router";

//Actions created to handle the creation of users.
export function userSignUpRequest() {
    return {type: 'USER_SIGNUP_REQUEST'}
}
export function userSignUpSuccess(user) {
    return {type: 'USER_SIGNUP_SUCCESS', data: user}
}
export function userSignUpFailure(err) {
    return {type: 'USER_SIGNUP_FAILURE', error: err}
}
export function userLoginRequest() {
    return {type: 'USER_LOGIN_REQUEST'}
}
export function userLoginSuccess(user) {
    return {type: 'USER_LOGIN_SUCCESS', data: user}
}
export function userLoginFailure(err) {
    return {type: 'USER_LOGIN_FAILURE', error: err}
}
export function userLogout() {
    return {type: 'USER_LOGOUT'}
}
export function clearUserStateOfErrors() {
    return {type: 'REFRESH_ERROR_STATE'}
}

//Create a new user on form submit.
export function signUpUser(username, email, password) {
    return dispatch => {
        dispatch(userSignUpRequest());
        return axios.post('http://localhost:3001/user/signup', {username, password, email}).then((response) => {
            if(response.data.ok === false) {
                dispatch(userSignUpFailure(response.data.error));
            } else {
                localStorage.setItem("token", response.data.token);
                dispatch(userSignUpSuccess(response.data));
                browserHistory.push("/");
            }
        }).catch((err2) => {
            dispatch(userSignUpFailure("An error occured creating your user."));
        });
    };
}

export function loginUser(username, password) {
    return dispatch => {
        return axios.post('http://localhost:3001/user/login', {username, password}).then((response) => {
            if(response.data.ok === false) {
                if(response.data.error === "You have been banned.") {
                    dispatch(userLoginFailure("You have been banned. Reason: " + response.data.reason + " You will be unbanned on the " + response.data.unban_date.split("T")[0] + " (YYYY-MM-DD)"));
                } else {
                    dispatch(userLoginFailure(response.data.error));
                }
            } else {
                localStorage.setItem("token", response.data.token);
                dispatch(userLoginSuccess(response.data));
                browserHistory.push("/");
            }
        }).catch((err2) => {
            dispatch(userLoginFailure("An error occured logging in your user."));
        });
    }
}

export function logoutUser() {
    localStorage.removeItem("token");
    browserHistory.push("/");
    return {type: 'USER_LOGOUT'}
}