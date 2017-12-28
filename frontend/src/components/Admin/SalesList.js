import React, {Component} from "react";
import moment from "moment";

export default class SalesList extends Component {

    render() {
        return(
            <div className="user-list">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Sold</th>
                            <th>Title</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.salesInformation.map((sale, i)=> (
                            <tr key={i}>
                                <th scope="row">{sale.sale_id}</th>
                                <td>{sale.username}</td>
                                <td>{moment(sale.sold_at).fromNow()}</td>
                                <td>{sale.title}</td>
                                <td>£{sale.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }


}