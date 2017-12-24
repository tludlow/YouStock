import React, {Component} from 'react';

import Navbar from "../Navbar/Navbar";

export default class Frontpage extends Component {
	
	render() {
		return (
           <div className="frontpage">
                <Navbar />
                <div className="container">
                    <h3>Welcome to youstock.</h3>
                </div>
           </div>
        );
	}
}