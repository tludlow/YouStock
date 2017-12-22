import React, {Component} from 'react';
import axios from "axios";

import Navbar from "../components/Navbar/Navbar";
//Home page, either is the logged in or loggout view.
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

	render() {
		if(this.state.loading) {
			return (
				<div className="homepage">
					<Navbar />
					<p>Loading data...</p>
				</div>
			);
		} else {
			return (
				<div className="homepage">
					<Navbar />
					{this.state.data.map((post, i)=> (
						<div className="post" key={i}>
							<h1>Title: {post.title}</h1>
							<p>{post.body}</p>
							<hr/>
						</div>
					))}
				</div>
			);
		}
	}
}
