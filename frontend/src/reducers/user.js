//Switch statemeent to handle all user redux actions.
function user(state = {}, action) {
	switch (action.type) {
		case 'USER_LOGOUT':
			return {...state, loggedIn: false, loading: false, username: "", token: ""}
		case 'USER_SIGNUP_REQUEST':
			return {...state, loading: true}
		case 'USER_SIGNUP_FAILURE':
			return {...state, loading: false, errors: action.error}
		case 'USER_SIGNUP_SUCCESS':
			return {...state, loading: false, loggedIn: true, token: action.data.token, username: action.data.username}
		case 'USER_LOGIN_REQUEST':
			return {...state, loading: true}
		case 'USER_LOGIN_FAILURE':
			return {...state, loading: false, errors: action.error}
		case 'USER_LOGIN_SUCCESS':
			return {...state, loading: false, loggedIn: true, token: action.data.token, username: action.data.username}
		default:
			return state;
	}
}

export default user;