import React, {Component} from 'react';
import axios from "axios";
import {browserHistory} from "react-router";
import { Modal, Button } from "react-bootstrap";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";

import UserList from "../components/Admin/UserList";
import SalesList from "../components/Admin/SalesList";

export default class AdminView extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: true,
            userData: null,
            salesData: null,
            error: "",
            findError: "",
            showModalRemovePost: false,
            modalPost_id: 0,
            modalTitle: "Loading",
            modalPosted_by: "ExampleUser",
            removeError: "",
        }
    }

    componentDidMount(){
        const config = {headers: {'Authorization': `Token ${this.props.user.token}`}};
        axios.get("http://localhost:3001/admin/adminCheck", config).then((response)=> {
            if(response.data.ok === false) {
                browserHistory.push("/");
                return;
            }
            this.generateAdminData();
        }).catch((err)=> {
            browserHistory.push("/");
        });
    }

    generateAdminData() {
        const config = {headers: {'Authorization': `Token ${this.props.user.token}`}};
        axios.get("http://localhost:3001/admin/getData", config).then((response)=> {
            if(response.data.ok === false) {
                this.setState({loading: false, error: response.data.error});
                return;
            } 
            this.setState({loading: false, userData: response.data.userData, salesData: response.data.salesData});
            return;
        }).catch((err)=> {
            this.setState({loading: false, error: "There was an error getting the page data."});
        });
    }

    closeModal() {
        this.setState({showModalRemovePost: false});
    }

    submitModalRemovePost(e) {
        e.preventDefault();

        var reason = this.refs.removePostReason.value;

        const config = {headers: {'Authorization': `Token ${this.props.user.token}`}};
        axios.post("http://localhost:3001/admin/removePost", {reason, post_id: this.state.modalPost_id}, config).then((response)=> {
            if(response.data.ok === false) {
                this.setState({removeError: response.data.error});
                return;
            }
            this.setState({showModalRemovePost: false});
        }).catch((err)=> {
            this.setState({removeError: err});
        });
    }

    removePostModal() {
        //<Modal.Footer>
        //<Button onClick={()=> this.closeModal()}>Close</Button>
        //</Modal.Footer>
        return <div className="modal-container">
            <Modal show={this.state.showModalRemovePost} onHide={()=> this.closeModal()} container={this} aria-labelledby="contained-modal-title">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">Remove post {this.state.modalPost_id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You are trying to remove the post titled: <strong>{this.state.modalTitle}</strong></p>
                    <p>This post was created by: <strong>{this.state.modalPosted_by}</strong></p>
                    <br/>
                    <form onSubmit={(e)=> this.submitModalRemovePost(e)}>
                        <p>What is the reason for you removing this post?</p>
                        <input type="text" className="placeholder-center" ref="removePostReason"/>
                        {this.state.removeError ?<p className="error">{this.state.removeError}</p> : ""}
                        <input type="submit" value="Remove Post" className="btn btn-success submit" />
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    }

    findRemovalPostInfo(e) {
        e.preventDefault();
        const config = {headers: {'Authorization': `Token ${this.props.user.token}`}};
        axios.get("http://localhost:3001/admin/getRemovalInfo/" + this.refs.removePostGetId.value, config).then((response)=> {
            if(response.data.ok === false) {
                this.setState({findError: response.data.error});
                return;
            }
            this.setState({showModalRemovePost: true, modalPost_id: response.data.post_id, modalPosted_by: response.data.posted_by, modalTitle: response.data.title});
        }).catch((err)=> {
            this.setState({findError: "There was an error finding the post data for the post with id " + this.refs.removePostGetId.value});
        });
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="admin-view">
                    <Navbar />
                    <div className="container">
                        <Loading />
                    </div>
                </div> 
            );
        }
        if(this.state.error.length > 0){
            return (
                <div className="admin-view">
                    <Navbar />
                    <div className="container">
                        <h2 className="error title">{this.state.error}</h2>
                    </div>
                </div> 
            );
        }
        return (
            <div className="admin-view">
                <Navbar />
                <div className="container">
                    <h3 className="title">Admin View</h3>
                    <p>Be careful, anything done on this page has a serious effect on this website.</p>
                    <hr/>
                    <div className="row">
                        <div className="col-xs-5">
                            <h5 className="title">Users</h5>
                            <UserList userInformation={this.state.userData} />
                        </div>
                        <div className="col-xs-offset-1 col-xs-6">
                            <h5 className="title">Sales</h5>
                            <SalesList salesInformation={this.state.salesData} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-4">
                            <h5 className="title">Remove Post</h5>
                            <br/>
                            <p>Please type the id of the post you want to remove.</p>
                            <p>This can be found in the url of the post <strong>'/post/ID_HERE</strong>'</p>
                            {this.state.findError ? <p className="error">{this.state.findError}</p> : ""}
                            <form onSubmit={(e)=> this.findRemovalPostInfo(e)}>
                                <input type="number" ref="removePostGetId" />
                            </form>
                        </div>
                    </div>
                    {this.removePostModal()}
                </div>
            </div>
        );
        
        
    }
	
}
