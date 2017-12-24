import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';

class PostForm extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: false,
            description: "",
            errors: "",
            file: null,
        };
    }

    descriptionType(e) {
        if(e.target.value.length > 400) {
            this.setState({errors: "Your description is too long. It should be a maximum of 400 characters long."});
        } else {
            this.setState({description: e.target.value});
        }
    }

    formSubmit(e) {
        e.preventDefault();
        var title = this.refs.postFormTitle.value;
        var description = this.refs.postFormDescription.value;
        var file = this.refs.postFormFile;
        var cost = this.refs.postFormCost.value;

        console.log(this.state.file);
    }

    handleFileUpload(e) {
        this.setState({file: e[0]});
    }

    render(){
        return (
            <div className="post-form">
                <form className="postForm" onSubmit={(e)=> this.formSubmit(e)}>
                    <fieldset>
                        <p>Title</p>
                        <input type="text" className="title" ref="postFormTitle" required/>
                    </fieldset>

                    <fieldset>
                        <p>Description {this.state.description.length > 0 ? <span className="description-length">{this.state.description.length} / 400</span> : ""}</p>
                        <textarea id="" cols="30" rows="6" ref="postFormDescription" onChange={(e)=> this.descriptionType(e)} required></textarea>
                    </fieldset>

                    <fieldset>
                        <p>Picture</p>
                        <label htmlFor="postFormFileInput" className="custom-file-upload">
                            Upload File
                        </label>
                        <input type="file" ref="postFormFile" accept=".png, .jpg, .jpeg" id="postFormFileInput" onChange={(e)=> this.handleFileUpload(e.target.files)}/>
                    </fieldset>

                    <fieldset>
                        <p>Cost</p>
                        <input type="text" ref="postFormCost" required/>
                    </fieldset>

                    <button type="submit" className="btn btn-success submit">
					    Create New Post
				    </button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
	return {user: state.user};
}

export function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

var PostFormClass = connect(mapStateToProps, mapDispatchToProps)(PostForm);

export default PostFormClass;