import React, {Component} from 'react';
import axios from "axios";
import {browserHistory} from "react-router";

import Navbar from "../components/Navbar/Navbar";
export default class Home extends Component {

	constructor(props) {
		super();
		this.state = {
			loading: true,
			data: {}
		};
	}

	componentDidMount() {
		axios.get("http://localhost:3001/post/frontpage").then((response)=> {
			this.setState({loading: false, data: response.data.results});
		}).catch((err)=> {
			console.log(err);
		});
	}

	redirectToPost(postID) {
		browserHistory.push("/post/" + postID);
	}

	render() {
		if(this.state.loading) {
			return (
				<div className="homepage">
					<Navbar />
					<div className="container">
						<div class="sk-circle">
								<div class="sk-circle1 sk-child"></div>
								<div class="sk-circle2 sk-child"></div>
								<div class="sk-circle3 sk-child"></div>
								<div class="sk-circle4 sk-child"></div>
								<div class="sk-circle5 sk-child"></div>
								<div class="sk-circle6 sk-child"></div>
								<div class="sk-circle7 sk-child"></div>
								<div class="sk-circle8 sk-child"></div>
								<div class="sk-circle9 sk-child"></div>
								<div class="sk-circle10 sk-child"></div>
								<div class="sk-circle11 sk-child"></div>
								<div class="sk-circle12 sk-child"></div>
							</div>
						<h3 className="loading" >Loading data...</h3>
					</div>
				</div>
			);
		} else {
			return (
				<div className="homepage">
					<Navbar />
					<div className="container">
						<div className="row post-row">
							{this.state.data.map((post, i)=> (
								<div className="col-xs-3">
									<div className="post" key={i} onClick={()=> this.redirectToPost(post.post_id)}>
										<img src={"http://via.placeholder.com/150x150"} alt={post.title}/>
										<h5>{post.title}</h5>
										<p>£{post.cost}</p>
									</div>
								</div>	
							))}
						</div>
					</div>
				</div>
			);
		}
	}
}
