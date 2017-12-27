import React, {Component} from 'react';
import axios from "axios";
import {browserHistory} from "react-router";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";

export default class AdminView extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: true,
        }
    }

    componentDidMount(){
        const config = {headers: {'Authorization': `Token ${this.props.user.token}`}};
        axios.get("http://localhost:3001/admin/adminCheck", config).then((response)=> {
            console.log(response);
            if(response.data.ok === false) {
                browserHistory.push("/");
                return;
            }
            this.setState({loading: false});
        }).catch((err)=> {
            browserHistory.push("/");
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

        return (
            <div className="admin-view">
                <Navbar />
                <div className="container">
                    <h3>Admin View</h3>
                    <p>Be careful, anything done on this page has a serious effect on this website.</p>
                </div>
            </div>
        );
    }
	
}
