import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
			view: "signin"
		};
    }

	render() {
		return (
            <form className="loginForm">			
				<fieldset>
					<p>Username</p>
					<input type="text" placeholder="Username" className="username" ref="loginFormUsername" required/>
				</fieldset>
			
				<fieldset>
					<p>Password</p>
					<input type="password" placeholder="Create Password" className="password" ref="loginFormPasswrd" required/>
				</fieldset>

				<button type="submit" className="btn btn-success submit">
					Login
				</button>
			</form>
        );
	}
}


//These functions below connect the component to the internal redux state in this component without having to pass data down through the component hierarchy
function mapStateToProps(state) {
	return {user: state.user};
}

export function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

var LoginClass = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginClass;