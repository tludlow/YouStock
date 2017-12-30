import React, {Component} from 'react';
import {StripeProvider} from "react-stripe-elements";
import axios from "axios";

import Navbar from "./Navbar/Navbar";

export default class Main extends Component {

    constructor(props) {
        super();
        this.state = {
            didCatch: false,
            error: ""
        };
    }

    componentDidMount() {
        if (this.props.user.loggedIn) {
            var token = this.props.user.token;
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
    }

    componentDidCatch(error, info) {
        this.setState({didCatch: true, error: error});
        console.log("error caught", error);
        console.log("info caught", info);
    }

    //Main component that renders child components.
    render() {
        if(this.state.didCatch) {
            return (
                <div className="base">
                    <Navbar />
                    <div className="container">
                        <h3>There was an error in your program.</h3>
                        <p>{this.state.error}</p>
                    </div>
                </div>
            );
        }
        return (
            <StripeProvider apiKey="pk_test_uRsCi66QQQhKPb5JRUoAR8hh">
                <div>
                    {/* We use cloneElement here so we can auto pass down props to other components within the tree. */}
                    {React.cloneElement(this.props.children, this.props)}
                </div>
            </StripeProvider>
        );
    }

}
