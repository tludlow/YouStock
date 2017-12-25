import React, {Component} from 'react';
import axios from "axios";
import moment from "moment";

import Navbar from "../components/Navbar/Navbar";
import Checkout from "../components/Post/Checkout";

export default class PostView extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: true,
            error: false,
            post: null,
            comments: null,
            commentCount: 0,
        };
    }

    componentDidMount() {
        axios.get("http://localhost:3001/post/" + this.props.params.id).then((response)=> {
            if(response.data.ok === true) {
                this.setState({loading: false, post: response.data.post, commentCount: response.data.commentCount, comments: response.data.comments});
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
        if(this.state.commentCount === 0) {
            return (
                <div className="post-view">
                    <Navbar />
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-6">
                                <div className="img-holder">
                                    <img src={"http://localhost:3001/img/uploads/" + this.state.post.image} alt={this.state.post.image} />
                                    {this.state.post.sold ? <div className="centered">SOLD</div> : ""}
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <h3 className="title">{this.state.post.title}</h3>
                                <h5>£{this.state.post.cost}</h5>
                                <hr/>
                                <p className="post-body">{this.state.post.body}</p>
                                <hr/>
                                {!this.state.post.sold ? <Checkout title={this.state.post.title} cost={this.state.post.cost} post_id={this.state.post.post_id}/> : <p className="error">You cannot purchase an item that has already been sold.</p>}
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-xs-4">
                                <h4 className="title">Comments</h4>
                                <p>There are no comments on this post.</p>
                            </div>
                        </div>
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
                            <div className="img-holder">
                                <img src={"http://localhost:3001/img/uploads/" + this.state.post.image} alt={this.state.post.image} />
                                {this.state.post.sold ? <div className="centered">SOLD</div> : ""}
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <h3 className="title">{this.state.post.title} <span><small>- Posted {moment(this.state.post.posted_at).fromNow()}</small></span></h3>
                            <h5>£{this.state.post.cost}</h5>
                            <hr/>
                            <p className="post-body">{this.state.post.body}</p>
                            <hr/>
                            {!this.state.post.sold ? <Checkout title={this.state.post.title} cost={this.state.post.cost} post_id={this.state.post.post_id}/> : <p className="error">You cannot purchase an item that has already been sold.</p>}
                            
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-xs-4">
                            <h4 className="title">Comments</h4>
                            <br/>
                            {this.state.comments.map((comment, i)=> (
                                <div className="comment" key={i}>
                                    <h4 className="title">{comment.posted_by} <span><small>- Posted {moment(comment.posted_at).fromNow()}</small></span></h4>
                                    <p>{comment.text}</p>
                                </div>
                            ))}
                            <button>Load More - TODO PAGINATION, CONTINUOUS SCROLLING</button>
                        </div>
                    </div>
                </div>
            </div>
        );
        
    }
	
}
