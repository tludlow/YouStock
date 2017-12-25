import React, { Component } from "react";
import { Elements } from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";

export default class Checkout extends Component {
    render() {
      return (
        <div className="Checkout">
          <h4 className="title">Purchase {this.props.title} for £{this.props.cost}</h4>
          <p>Test card: 4000008260000000</p>
          <Elements>
            <CheckoutForm title={this.props.title} cost={this.props.cost} post_id={this.props.post_id} username={this.props.username} />
          </Elements>
        </div>
      )
    }
  }