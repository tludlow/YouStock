import React, {Component} from 'react';
import axios from "axios";
import {browserHistory} from "react-router";

import Navbar from "../components/Navbar/Navbar";
import Frontpage from "../components/Frontpage/Frontpage";
export default class Home extends Component {

	constructor(props) {
		super();
		this.state = {
			loading: true,
			data: {},
			page: 1,
			pageError: "",
		};
	}

	componentDidMount() {
		axios.get("http://localhost:3001/post/frontpage/1").then((response)=> {
			this.setState({loading: false, data: response.data.results});
		}).catch((err)=> {
			console.log(err);
		});
	}

	getNextRows(pageNumber) {
		axios.get("http://localhost:3001/post/frontpage/" + pageNumber).then((response)=> {
			if(response.data.ok === true) {
				this.setState({page: pageNumber, data: [...this.state.data, ...response.data.results]});
				return;
			} else {
				this.setState({pageError: response.data.error});
			}
		}).catch((err)=> {
			this.setState({pageError: err});
		});
	}

	redirectToPost(postID) {
		browserHistory.push("/post/" + postID);
	}

	render() {
		if(!this.props.user.loggedIn) {
			return (
				<Frontpage />
			);
		}
		if(this.state.loading) {
			return (
				<div className="homepage">
					<Navbar />
						<div className="sk-circle">
							<div className="sk-circle1 sk-child"></div>
							<div className="sk-circle2 sk-child"></div>
							<div className="sk-circle3 sk-child"></div>
							<div className="sk-circle4 sk-child"></div>
							<div className="sk-circle5 sk-child"></div>
							<div className="sk-circle6 sk-child"></div>
							<div className="sk-circle7 sk-child"></div>
							<div className="sk-circle8 sk-child"></div>
							<div className="sk-circle9 sk-child"></div>
							<div className="sk-circle10 sk-child"></div>
							<div className="sk-circle11 sk-child"></div>
							<div className="sk-circle12 sk-child"></div>
						</div>
					<h3 className="loading" >Loading data...</h3>
				</div>
			);
		} else if(this.state.data) {
			return (
				<div className="homepage">
					<Navbar />
					<div className="container">
						<h3 className="home-title">The most recent posts on the site curated just for you.</h3>
						<div className="row post-row">
							{this.state.data.map((post, i)=> (
								<div className="col-xs-3" key={i}>
									<div className="post" key={i} onClick={()=> this.redirectToPost(post.post_id)}>
										<div className="img-holder">
											<img src={"http://localhost:3001/img/uploads/" + post.image} alt={post.title}/>
											{post.sold ? <div className="centered-small">SOLD</div> : ""}
										</div>
										<h5>{post.title}</h5>
										<p>£{post.cost}</p>
									</div>
								</div>	
							))}
						</div>
						{this.state.pageError.length > 0 ? <p className="error">{this.state.pageError}</p> : "" }
						<button onClick={()=> this.getNextRows(this.state.page + 1)}>Load More - TODO PAGINATION, CONTINUOUS SCROLLING</button>
					</div>
				</div>
			);
		} else {
			return (
				<div className="homepage">
					<Navbar />
					<div className="container">
						<h3 className="home-title">The most recent posts on the site curated just for you.</h3>
						<div className="row post-row">
							<h3>There are no created posts.</h3>
						</div>
					</div>
				</div>
			);
		}
	}
}
