import React, { Component } from "react";
import {CardElement, injectStripe, } from "react-stripe-elements";
import axios from "axios";

class _CardForm extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: false,
            errors: "",
            message: ""
        };
    }

    onSubmit(event) {
        event.preventDefault();

        this.setState({loading: true, message: ""});
        this.props.stripe.createToken().then((response)=> {
            this.createCharge(response);
        }).catch((err)=> {
            this.setState({loading: false, errors: err, message: ""});
        });
    }

    createCharge(result) {
        const config = {
            headers: {
                'Authorization': `Token ${localStorage.getItem("token")}`
            }
        };

        axios.post("http://localhost:3001/payment/charge", {stripeToken: result.token.id, post_id: this.props.post_id, title: this.props.title, username: this.props.username}, config).then((response)=> {
            console.log(response);
            if(response.data.ok === false) {
                this.setState({loading: false, errors: response.data.error, message: ""});
            } else {
                this.setState({loading: false, message: response.data.message});
            }
        }).catch((err)=> {
            this.setState({loading: false, errors: err, message: ""});
        });
    }

    render() {
      return (
        <form onSubmit={(e)=> this.onSubmit(e)}>
          <CardElement />
          {this.state.errors.length > 0 ? <p className="error">{this.state.errors}</p> : "" }
          {this.state.message.length > 0 ? <p className="approved">{this.state.message}</p> : "" }
          <input type="submit" disabled={this.state.loading} className="submit stripe-submit" value={this.state.loading ? "Processing Payment..." : "Submit Payment (£" + this.props.cost + ")"} />
        </form>
      );
    }
}
const CardForm = injectStripe(_CardForm)
export default CardForm;