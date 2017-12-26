import React, { Component } from "react";
import axios from "axios";

export default class CreateComment extends Component {

    submitComment(e) {
        e.preventDefault();
        axios.post("http://localhost:3001/post/createComment", {user: this.props.username, text: this.refs.createCommentText.value, post: this.props.post_id}).then((response)=> {
            window.location.reload();
        }).catch((err)=> {

        });
    }

    render() {
        return (
            <div className="create-comment">
                <form onSubmit={(e)=> this.submitComment(e)}>
                    <div className="form-group">
                        <label>
                            <input type="text" name="" id="" ref="createCommentText" placeholder="Post new Comment" className="field" required />
                        </label>
                    </div>
                    
                </form>
            </div>
        );
    }
}