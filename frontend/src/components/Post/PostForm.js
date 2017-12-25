import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';
import axios from "axios";
import {browserHistory} from "react-router";

class PostForm extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: false,
            description: "",
            errors: "",
            file: null,
            fileSrc: "",
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
        var file = this.state.file;
        var cost = this.refs.postFormCost.value;
        
        if(!file) {
            this.setState({errors: "Please provide a picture for your post."});
            return;
        }
        if(((file.size/1024)/1024).toFixed(4) > 1.5) { //If file is greater than 1.5 MB
            this.setState({errors: "Your file is too large, please dont upload a file larger than 1.5 MB"});
            return;
        }
        var re = new RegExp("^([0-9]{0,2}((.)[0-9]{0,2}))$");
        if(!re.test(cost)) {
            this.setState({errors: "The cost should be a number, it can also contain a period/fullstop."});
            return;
        }
        if(this.state.description.length > 400) {
            this.setState({errors: "Your description is too long. It should be a maximum of 400 characters long."});
            return;
        }


        var formData = new FormData();
        formData.append("title", title);
        formData.append("body", description);
        formData.append("image", this.state.file);
        formData.append("token", this.props.user.token);
        formData.append("posted_by", this.props.user.username);
        formData.append("cost", cost);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
                'Authorization': `Token ${this.props.user.token}`
            }
        };
        axios.post("http://localhost:3001/post/create", formData, config).then((response)=> {
            if(response.data.ok === true) {
                browserHistory.push("/");
            } else {
                console.log(response);
            }
        }).catch((error)=> {
            console.log(error);
        });
    }

    handleFileUpload(e) {
        this.setState({file: e[0]});
        var reader = new FileReader();
        var url = reader.readAsDataURL(e[0]);
        reader.onloadend = function (e) {
            this.setState({fileSrc: [reader.result]});
        }.bind(this);
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
                        {this.state.file ? <p>{this.state.file.name}</p> : ""}
                        {this.state.fileSrc.length > 0 ? <img className="preview-image" src={this.state.fileSrc} alt="picture uploaded" /> : ""}
                        <label htmlFor="postFormFileInput" className="custom-file-upload">
                            Upload File
                        </label>
                        <input type="file" ref="postFormFile" accept=".png, .jpg, .jpeg" id="postFormFileInput" onChange={(e)=> this.handleFileUpload(e.target.files)}/>
                    </fieldset>

                    <fieldset>
                        <p>Cost (£)</p>
                        <small>Can only contain numbers and a fullstop/period. Example 12.99</small>
                        <input type="text" ref="postFormCost" required/>
                    </fieldset>

                    {this.state.errors ? <p className="error">{this.state.errors}</p> : ""}
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