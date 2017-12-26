import React, { Component } from "react";
import axios from "axios";

export default class CreateComment extends Component {

    submitComment(e) {
        e.preventDefault();
        axios.post("http://localhost:3001/post/createComment", {user: this.props.username, text: this.refs.createCommentText.value, post: this.props.post_id}).then((response)=> {

        }).catch((err)=> {

        });
    }

    render() {
        return (
            <div className="create-comment">
                <form onSubmit={(e)=> this.submitComment(e)}>
                    <input type="text" name="" id="" ref="createCommentText" placeholder="Comment" required />
                    <input type="submit" value="Post Comment" className="submit" />
                </form>
            </div>
        );
    }
}