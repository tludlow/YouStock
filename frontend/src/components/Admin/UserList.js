import React, {Component} from "react";

export default class UserList extends Component {

    render() {
        return(
            <div className="user-list">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.userInformation.map((user, i)=> (
                            <tr key={i}>
                                <th scope="row">{user.user_id}</th>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }


}