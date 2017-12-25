import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';

import axios from "axios";

class Payment extends Component {

    constructor(props) {
        super();
        this.state = {
            loading: false,
            errors: "",
            message: ""
        };

        this.postPayment = this.postPayment.bind(this);
    }

    postPayment(result) {
        this.setState=({loading: true});
        axios.post("http://localhost:3001/payment/charge", {stripeToken: result.token.id}).then((response)=> {
            if(response.data.ok === false) {
                this.setState({loading: false, errors: response.data.error});
            } else {
                this.setState({loading: false, message: response.data.message});
            }
        }).catch((err)=> {
            this.setState({loading: false, errors: err});
        });
    }

    componentDidMount(){
        //4000008260000000
        var style = {
            base: {
                color: '#32325d',
                lineHeight: '18px',
                fontFamily: '"Montserrat", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };
        var stripe = window.Stripe("pk_test_uRsCi66QQQhKPb5JRUoAR8hh");
        var elements = stripe.elements();
        var card = elements.create("card", {style});
        card.mount("#card-element");

        card.addEventListener('change', function(event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
              displayError.textContent = event.error.message;
            } else {
              displayError.textContent = '';
            }
        });

        var form = document.getElementById('payment-form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            stripe.createToken(card).then(function(result) {
                if (result.error) {
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    //postPayment(result).bind(this);
                }
            });
        });
    }

    handleSubmit() {

    }

    render() {
        return (
            <div className="payment">
                <p>Purchase <strong>{this.props.title}</strong> now for <strong>£{this.props.cost}</strong></p>
                <br/>
                <form action="http://localhost:3001/payment/charge" method="post"id="payment-form">
                    <div className="form-row">
                        <label htmlFor="card-element">Credit or debit card</label>

                        <div id="card-element">
                        </div>

                        <div id="card-errors" role="alert"></div>
                        <div id="card-errors2" role="alert">
                            {this.state.errors.length > 0 ? <p>{this.state.errors}</p> : ""}
                        </div>
                    </div>
                    {this.state.message.length > 0 ? <p>{this.state.message}</p> : ""}
                    <input type="submit" disabled={this.state.loading} className="submit stripe-submit" value={"Submit Payment (£" + this.props.cost + ")" } />
                </form>
            </div>
        );
    }
    
}

function mapStateToProps(state) {
	return {user: state.user};
}

export function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

var PaymentClass = connect(mapStateToProps, mapDispatchToProps)(Payment);

export default PaymentClass;