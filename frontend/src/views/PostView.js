import React, {Component} from 'react';
import axios from "axios";
import moment from "moment";
import {Link} from "react-router";

import Navbar from "../components/Navbar/Navbar";
import Checkout from "../components/Post/Checkout";
import CreateComment from "../components/Post/CreateComment";
import Loading from "../components/Loading/Loading";

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

    checkPurchase() {
        if(!this.props.user.loggedIn) {
            return <p className="error">You must be logged in to purchase items.</p>
        }
        if(this.state.post.sold) {
            return <p className="error">You can't purchase already sold items.</p>
        }
        return <Checkout title={this.state.post.title} cost={this.state.post.cost} post_id={this.state.post.post_id} username={this.props.user.username} />
    }

    commentHandler(){
        if(this.state.commentCount === 0) {
            return <div className="row">
                        <div className="col-xs-4">
                            <h4 className="title">Comments</h4>
                            <CreateComment post_id={this.state.post.post_id} username={this.props.user.username} />
                            <p>There are no comments on this post.</p>
                        </div>
                    </div>
        } else {
            return <div className="row">
                        <div className="col-xs-4">
                            <h4 className="title">Comments</h4>
                            <CreateComment post_id={this.state.post.post_id} username={this.props.user.username} />
                            {this.state.comments.map((comment, i)=> (
                                <div className="comment" key={i}>
                                    <h4 className="title"><Link to={"/profile/" + comment.posted_by}>{comment.posted_by}</Link> {comment.posted_by === this.state.post.posted_by ? <span className="poster">Poster</span> : ""} <span><small>- Posted {moment(comment.posted_at).fromNow()}</small></span></h4>
                                    <p>{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
        }
    }

    render() {
        if(this.state.loading) {
            return(
                <div className="post-view">
                    <Navbar />
                    <div className="container">
                        <Loading />
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
                            <h5>Created by <Link to={"/profile/" + this.state.post.posted_by}>{this.state.post.posted_by}</Link> for £{this.state.post.cost}</h5>
                            <hr/>
                            <p className="post-body">{this.state.post.body}</p>
                            <hr/>
                            {this.checkPurchase()}
                        </div>
                    </div>
                    <br/>
                    {this.commentHandler()}
                </div>
            </div>
        );
        
    }
	
}
