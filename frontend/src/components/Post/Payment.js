import React, {Component} from "react";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';

class Payment extends Component {

    componentDidMount(){
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
                    // Inform the customer that there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    // Send the token to your server
                    var form = document.getElementById('payment-form');
                    var hiddenInput = document.createElement('input');
                    hiddenInput.setAttribute('type', 'hidden');
                    hiddenInput.setAttribute('name', 'stripeToken');
                    hiddenInput.setAttribute('value', result.token.id);
                    form.appendChild(hiddenInput);

                    // Submit the form
                    form.submit();
                }
            });
        });
    }

    render() {
        return (
            <div className="payment">
                <p>Purchase <strong>{this.props.title}</strong> now for <strong>£{this.props.cost}</strong></p>
                <br/>
                <form action="http://localhost:3001/payment/charge" method="post" id="payment-form">
                    <div class="form-row">
                        <label for="card-element">Credit or debit card</label>

                        <div id="card-element">
                        </div>

                        <div id="card-errors" role="alert"></div>
                    </div>
                    <input type="submit" class="submit stripe-submit" value={"Submit Payment (£" + this.props.cost + ")" } />
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