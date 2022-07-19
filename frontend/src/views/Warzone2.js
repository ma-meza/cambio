import React from "react";
import axios from "axios";
import queryString from "query-string";
import Spinner from "microComponents/LoaderAnimation";

import { integerToMoneyString } from "miscFunctions";

import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';


const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Lato", arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};

class CheckoutForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFormDisabled: true,
            isDataLoading: true,
            stripeErrorMessage: "",
            intentId: 0,
            stripeClientSecret: 0,
            buyNowPrice: 0,
            offerAmount: 0
        }
    }

    componentDidMount() {
        let intentId;
        if (queryString.parse(window.location.search).intentId) {
            intentId = queryString.parse(window.location.search).intentId;
            axios.get(window.api_prefix+"/paymentIntent?intentId=" + intentId).then(resp => {
                this.setState({
                    stripeClientSecret: resp.data.details.stripeclientsecret,
                    buyNowPrice: resp.data.details.buynowprice,
                    offerAmount: resp.data.offeramount,
                    isFormDisabled: false,
                    isDataLoading: false,
                    intentId: intentId
                });
            }).catch(err => {
                if (err.response) {
                    this.props.history.push("/");
                }
            });
        } else {
            this.props.history.push("/");
        }
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const { stripe, elements } = this.props;
        if (!stripe || !elements) {
            return;
        }
        this.setState({
            isFormDisabled: true,
            isDataLoading: true,
            stripeErrorMessage: ""
        });

        const cardElement = elements.getElement(CardElement);

        const result = await stripe.confirmCardPayment(this.state.stripeClientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Jenny Rosen',
                },
            },
            setup_future_usage: 'off_session'
        });

        if (result.error) {
            this.setState({
                isFormDisabled: false,
                isDataLoading: false,
                stripeErrorMessage: result.error.message
            });
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                this.setState({
                    isFormDisabled: false,
                    isDataLoading: false,
                    stripeErrorMessage: ""
                });
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
            }
        }
    };

    render() {
        const { stripe } = this.props;
        let amount = this.state.offerAmount;
        if (amount == null) {
            amount = integerToMoneyString(this.state.buyNowPrice);
        } else {
            amount = integerToMoneyString(amount);
        }

        let content;
        if (this.state.isDataLoading == false) {
            content = (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <CardElement options={CARD_ELEMENT_OPTIONS} />
                        <button type="submit" disabled={!stripe && this.state.isFormDisabled}>Pay</button>
                        {this.state.stripeErrorMessage.length > 0 ? <p>{this.state.stripeErrorMessage}</p> : null}
                    </form>
                    <p>Total: {amount}</p>
                </div>
            );
        }
        return (
            <div>
                {content}
                {
                    this.state.isDataLoading == true ?
                        <Spinner />
                        :
                        null
                }
            </div>

        );
    }
}

const InjectedCheckoutForm = (props) => {
    return (
        <ElementsConsumer>
            {({ elements, stripe }) => (
                <CheckoutForm history={props.history} elements={elements} stripe={stripe} />
            )}
        </ElementsConsumer>
    );
};

export default InjectedCheckoutForm;