//Switch statemeent to handle all user redux actions.
function auth(state = {}, action) {
	switch (action.type) {
		case 'USER_SIGNUP_REQUEST':
			return {...state, loading: true}
		default:
			return state;
	}
}

export default auth;