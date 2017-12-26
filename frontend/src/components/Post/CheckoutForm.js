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
        var name = this.refs.checkoutName.value;
        var address = this.refs.checkoutAddress.value;
        var postcode = this.refs.checkoutPostcode.value;

        this.setState({loading: true, message: "", errors: ""});
        this.props.stripe.createToken().then((response)=> {
            this.createCharge(response, name, address, postcode);
        }).catch((err)=> {
            this.setState({loading: false, errors: err, message: ""});
        });
    }

    createCharge(result, name, address, postcode) {
        const config = {
            headers: {
                'Authorization': `Token ${localStorage.getItem("token")}`
            }
        };

        axios.post("http://localhost:3001/payment/charge", {stripeToken: result.token.id, post_id: this.props.post_id, title: this.props.title, username: this.props.username, name: name, address: address, postcode: postcode}, config).then((response)=> {
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
          <div className="checkout-form">
            <div className="form-group">
                    <label>
                        <span>Name</span>
                        <input id="name" name="name" className="field" ref="checkoutName" placeholder="Jane Doe" required />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <span>Address</span>
                        <input id="address" name="address" className="field" ref="checkoutAddress" placeholder="12 Winchester Road" required/>
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        <span>Postcode</span>
                        <input id="postcode" name="postcode" className="field" ref="checkoutPostcode" placeholder="RE5 HD5" required/>
                    </label>
                </div>
          </div>
          {this.state.errors.length > 0 ? <p className="error">{this.state.errors}</p> : "" }
          {this.state.message.length > 0 ? <p className="approved">{this.state.message}</p> : "" }
          <input type="submit" disabled={this.state.loading} className="submit stripe-submit" value={this.state.loading ? "Processing Payment..." : "Submit Payment (£" + this.props.cost + ")"} />
        </form>
      );
    }
}
const CardForm = injectStripe(_CardForm)
export default CardForm;