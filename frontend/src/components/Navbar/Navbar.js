import React, {Component} from 'react';
import {Link, browserHistory} from "react-router";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';
import { DropdownButton, MenuItem } from "react-bootstrap";

class Navbar extends Component {

	logoutUser() {
		this.props.logoutUser();
		browserHistory.push("/");
	}
	navigateUser(path) {
		browserHistory.push(path);
	}
	adminNavigate() {
		if(this.props.user.rank === "admin")  {
			browserHistory.push("/admin");
			return;
		}		
	}

	dropdown() {
		if(this.props.user.loggedIn) {
			return <DropdownButton id="dropdown" title={this.props.user.username} className={"user-dropdown"}>
						<MenuItem onClick={()=> this.adminNavigate()} className={this.props.user.rank + "-rank"}>{this.props.user.rank === "admin" ? "Admin Dashboard" : this.props.user.rank.charAt(0).toUpperCase() + this.props.user.rank.slice(1)}</MenuItem>
						<MenuItem onClick={()=> this.navigateUser("/profile/" + this.props.user.username)}>Profile</MenuItem>
						<MenuItem divider />
						<MenuItem onClick={()=> this.logoutUser()}>Logout</MenuItem>
					</DropdownButton>
		}
		//{this.props.user.loggedIn ? <li className="nav-username">{this.props.user.username} </li> : ""}
		//{this.props.user.loggedIn ? <li onClick={()=> this.logoutUser()}><i className="fa fa-arrow-down logout-button"></i></li> : ""}
	}
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
								<li><Link to="/">Home</Link></li>
								{this.props.user.loggedIn === false ? <li><Link to="/user">Login / Signup</Link></li> : ""}
								{this.dropdown()}
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {user: state.user};
}

export function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

var NavbarClass = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default NavbarClass;