import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";

export default class ProfileView extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: true,
            errors: "",
            profile: null,
        }
    }

    componentDidMount() {
        axios.get("http://localhost:3001/user/profile/" + this.props.params.id).then((response)=> {
            if(response.data.ok === false) {
                this.setState({loading: false, errors: response.data.error});
                return;
            }
            this.setState({loading: false, profile: response.data.profile});
        }).catch((err)=> {
            this.setState({loading: false, errors: err});
        });
    }

    render(){
        if(this.state.loading) {
            return(
                <div className="profile-view">
					<Navbar />
						<Loading />
					<h3 className="loading" >Loading data...</h3>
				</div>
            );
        }
        if(this.state.errors.length > 0) {
            return(
                <div className="profile-view">
                    <Navbar />
                    <div className="container">
                        <h4>There was an error loading the profile for {this.props.params.id}</h4>
                        <p>Error: {this.state.errors}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="profile-view">
                <Navbar />
                <div className="container">
                    <h4 className="title">Profile for {this.props.params.id}</h4>
                    <p><strong>Rank:</strong> {this.state.profile.rank}</p>
                    <p><strong>Created</strong> {moment(this.state.profile.created_at).fromNow()}</p>
                </div>
            </div>
        );

    }
}