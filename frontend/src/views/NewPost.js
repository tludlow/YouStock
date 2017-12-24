import React, {Component} from 'react';

import Navbar from "../components/Navbar/Navbar";
import PostForm from "../components/Post/PostForm";

export default class NewPost extends Component {

    render() {
        return(
            <div className="new-post">
                <Navbar />
                <div className="container">
                    <h3 className="title">Create a new post</h3>
                    <p>Posts are the items you wish to sell to people on YouStock.</p>
                    <hr/>
                    <PostForm />
                </div>
            </div>
        );
    }
	
}
