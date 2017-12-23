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

//Create a new user on form submit.
export function signUpUser(username, password, email) {
    return dispatch => {
        dispatch(userSignUpRequest());
        return axios.post('http://localhost:7770/user/signup', {username, password, email}).then((response) => {
            localStorage.setItem("token", response.data.token);
            dispatch(userSignUpSuccess(response.data));
            browserHistory.push("/");
        }).catch((err2) => {
            dispatch(userSignUpFailure("An error occured creating your user."));
        });
    };
}