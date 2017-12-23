import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';

class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
			view: "signin"
		};
    }

	render() {
		return (
            <form className="signUpForm">			
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