import React, {Component} from 'react';
import axios from "axios";
import {browserHistory} from "react-router";

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
        console.log(this.state.salesData);
        return (
            <div className="admin-view">
                <Navbar />
                <div className="container">
                    <h3>Admin View</h3>
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
                </div>
            </div>
        );
        
        
    }
	
}
