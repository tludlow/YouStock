import React, {Component} from 'react';

import Navbar from "../components/Navbar/Navbar";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";

export default class UserAuth extends Component {

    constructor(props) {
        super();
        this.state = {
            progress: 0
        };
    }

    changeProgress(state) {
        this.setState({progress: state});
    }

    render() {
        if(this.state.progress === 0) {
            return(
                <div className="user-auth">
                    <Navbar />
                    <div className="container">
                        <h3 className="title">Would you like to login or sign up?</h3>
                        <div className="row">
                            <div className="col-xs-2">
                                <p className="auth-button" onClick={()=> this.changeProgress(1)}>Login</p>
                            </div>
                            <div className="col-xs-2 col-offset-xs-1">
                                <p className="auth-button" onClick={()=> this.changeProgress(2)}>Sign Up</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
       else if(this.state.progress === 1) {
        return(
            <div className="user-auth">
                <Navbar />
                <div className="container">
                    <h3 className="title">Login</h3>
                    <div className="row">
                        <div className="col-xs-2">
                            <p className="auth-button" onClick={()=> this.changeProgress(0)}>Back</p>
                        </div>
                    </div>
                    <Login />
                </div>
            </div>
        );
       } else {
        return(
            <div className="user-auth">
                <Navbar />
                <div className="container">
                    <h3 className="title">Sign Up</h3>
                    <div className="row">
                        <div className="col-xs-2">
                            <p className="auth-button" onClick={()=> this.changeProgress(0)}>Back</p>
                        </div>
                    </div>
                    <Signup />
                </div>
            </div>
        ); 
       } 
    }
	
}
