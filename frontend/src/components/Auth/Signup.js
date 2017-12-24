import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';

class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
			view: "signin",
			errors: ""
		};
	}
	
	componentDidMount(){
		this.setState({errors: ""});
	}
	onSignup(e) {
		e.preventDefault();
		var username = this.refs.signUpUsername.value;
		var email = this.refs.signUpEmail.value;
		var password = this.refs.signUpPassword.value;
		var confirmPassword = this.refs.signUpPasswordConfirm.value;

		if(password != confirmPassword) {
			this.setState({errors: "Your password's don't match."});
			return false;
		}
		if(username.length > 28) {
			this.setState({errors: "Your username should not be greater than 28 characters in length."});
			return false;
		}

		this.props.signUpUser(username, email, password);
	}

	render() {
		return (
            <form className="signUpForm" onSubmit={(e)=> this.onSignup(e)}>			
					<fieldset>
						<p>Username</p>
						<input type="text" placeholder="Username" className="username" ref="signUpUsername" required/>
					</fieldset>
					
					<fieldset>
						<p>Email</p>
						<input type="email" placeholder="Email" className="email" ref="signUpEmail" required/>
					</fieldset>

					<fieldset>
						<p>Password</p>
						<input type="password" placeholder="Create Password" className="password" ref="signUpPassword" required/>
					</fieldset>

					<fieldset>
						<p>Confirm Password</p>
						<input type="password" placeholder="Confirm Password" className="password" ref="signUpPasswordConfirm" required/>
					</fieldset>

					{this.state.errors.length > 1 ? <p className="error">{this.state.errors}</p> : ""}
					<button type="submit" className="btn btn-success submit">
						Sign Up
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

var SignUpClass = connect(mapStateToProps, mapDispatchToProps)(Signup);

export default SignUpClass