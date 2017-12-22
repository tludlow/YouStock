import React, {Component} from 'react';
import {Link, browserHistory} from "react-router";;

export default class Navbar extends Component {


	
	render() {

		//Render the html navbar to the user.
		return (
			<div>
				<nav id="mainNav" className="navbar navbar-default navbar-custom">
					<div className="container">
						<div className="navbar-header page-scroll">
							<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<div className="navbar-brand-container">
                                <i className="fa fa-wheelchair" aria-hidden="true"></i>
								<Link to="/" className="navbar-brand">Youstock</Link>
							</div>
						</div>
						<div className="collapse navbar-collapse clearfix" id="bs-example-navbar-collapse-1">
							<ul className="nav navbar-nav navbar-right">
								<li className="hidden"><a href="#page-top">Page Top</a></li>
								<li>Home</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}