import React, {Component} from 'react';
import {Link} from "react-router";

import Navbar from "../components/Navbar/Navbar";

export default class FourOFour extends Component {

    render() {
        return(
            <div className="FourOFour">
                <Navbar />
                <div className="container" style={{textAlign: "center"}}>
                    <h4>This page doesnt not exist...</h4>
                    <Link to="/">Go Back Home</Link>
                </div>
            </div>
        );
    }
	
}
