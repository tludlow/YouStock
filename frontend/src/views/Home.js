import React, {Component} from 'react';
import axios from "axios";
import {browserHistory, Link} from "react-router";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";
import ImageComponent from "../components/ImageComponent/ImageComponent";

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
		if(this.state.loading) {
			return (
				<div className="homepage">
					<Navbar />
						<Loading />
					<h3 className="loading" >Loading data...</h3>
				</div>
			);
		} else if(this.state.data) {
			return (
				<div className="homepage">
					<Navbar />
					<div className="container">
						<h3 className="home-title">The most recent posts on the site curated just for you.</h3>
						<h5><Link to="/newpost">Create your own post</Link></h5>
						<div className="row post-row">
							{this.state.data.map((post, i)=> (
								<div className="col-xs-3" key={i}>
									<div className="post" key={i} onClick={()=> this.redirectToPost(post.post_id)}>
										<div className="img-holder">
											<ImageComponent imageSrc={"http://localhost:3001/img/uploads/" + post.image} imageAlt={post.title} />
											{post.sold ? <div className="centered-small">SOLD</div> : ""}
										</div>
										<h5>{post.title}</h5>
										<p>£{post.cost}</p>
									</div>
								</div>	
							))}
						</div>
						{this.state.pageError.length > 0 ? <p className="error">{this.state.pageError}</p> : "" }
						<button onClick={()=> this.getNextRows(this.state.page + 1)}>Load More</button>
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
							<h3>There are no created posts. <Link to="/newpost">Why dont you create one?</Link></h3>
						</div>
					</div>
				</div>
			);
		}
	}
}
