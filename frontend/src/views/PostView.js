import React, {Component} from 'react';
import axios from "axios";

import Navbar from "../components/Navbar/Navbar";

export default class PostView extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: true,
            error: false,
            post: null
        };
    }

    componentDidMount() {
        axios.get("http://localhost:3001/post/" + this.props.params.id).then((response)=> {
            if(response.data.ok === true) {
                this.setState({loading: false, post: response.data.post});
                return;
            }
            this.setState({loading: false, error: true});
        }).catch((err)=> {
            this.setState({error: true});
        });
    }

    render() {
        if(this.state.loading) {
            return(
                <div className="post-view">
                    <Navbar />
                    <div className="container">
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
                        <h3 className="loading">Loading post {this.props.params.id}</h3>
                    </div>
                </div>
            );
        }
        if(this.state.error) {
            return(
                <div className="post-view">
                    <Navbar />
                    <div className="container">
                        <h3>There was an error loading the post with id {this.props.params.id}</h3>
                    </div>
                </div>
            );
        }
        //No error has occured.
        return (
            <div className="post-view">
                <Navbar />
                <div className="container">
                    <div className="row">
                        <div className="col-xs-6">
                            <img src={"http://localhost:3001/img/uploads/" + this.state.post.image} alt={this.state.post.image} />
                        </div>
                        <div className="col-xs-6">
                            <h3 className="title">{this.state.post.title}</h3>
                            <h5>£{this.state.post.cost}</h5>
                            <hr/>
                            <p className="post-body">{this.state.post.body}</p>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-xs-4">
                            <h4 className="title">Comments</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
        
    }
	
}
