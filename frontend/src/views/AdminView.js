import React, {Component} from 'react';
import axios from "axios";
import {browserHistory} from "react-router";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";

import UserList from "../components/Admin/UserList";

export default class AdminView extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: true,
            userData: null,
            error: "",
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
            } else {
                this.setState({loading: false, userData: response.data.userData});
            }
        }).catch((err)=> {
            this.setState({loading: false, error: "There was an error getting the page data."});
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
                    <h3>Admin View</h3>
                    <p>Be careful, anything done on this page has a serious effect on this website.</p>
                    <hr/>
                    <h5 className="title">Users</h5>
                    <div className="row">
                        <div className="col-xs-5">
                            <UserList userInformation={this.state.userData} />
                        </div>
                    </div>
                </div>
            </div>
        );
        
    }
	
}
