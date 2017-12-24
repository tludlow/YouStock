import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';

class Login extends Component {

	onLogin(e) {
		e.preventDefault();
		var username = this.refs.loginFormUsername.value;
		var password = this.refs.loginFormPassword.value;

		this.props.loginUser(username, password);
		//{this.props.user.errors.length > 1 ? <p className="error">{this.state.errors}</p> : ""}
	}
	
	render() {
		return (
            <form className="loginForm" onSubmit={(e)=> this.onLogin(e)}>			
				<fieldset>
					<p>Username</p>
					<input type="text" placeholder="Username" className="username" ref="loginFormUsername" required/>
				</fieldset>
			
				<fieldset>
					<p>Password</p>
					<input type="password" placeholder="Create Password" className="password" ref="loginFormPassword" required/>
				</fieldset>

				{this.props.user.errors.length > 1 ? <p className="error">{this.props.user.errors}</p> : ""}

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