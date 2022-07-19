import React from "react";
import axios from "axios";
import queryString from "query-string";
import Spinner from "microComponents/LoaderAnimation";
import styles from "public/style/stripePayment.module.css";
import { integerToMoneyString } from "miscFunctions";
import Footer from "microComponents/Footer.js";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';


const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Larsseit", arial, sans-serif',
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
            buyNowPrice: 0,
            offerAmount: null,
            offerId: -1,
            listingId: -1,
            isTransactionSuccess: false,
            shippingAddress:"",
            shippingAddressInput:""
        }

        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        axios.get(window.api_prefix+"/getShippingAddress").then(resp=>{
            this.setState({
                shippingAddress:resp.data
            })
        }).catch();
        let listingId;
        let offerId;
        if (queryString.parse(window.location.search).listingId && queryString.parse(window.location.search).offerId) {
            listingId = queryString.parse(window.location.search).listingId;
            offerId = queryString.parse(window.location.search).offerId;
            if (offerId == -1) {
                //buy now price
                axios.get(window.api_prefix+"/listingPrice?listingId=" + listingId).then(resp => {
                    this.setState({
                        buyNowPrice: resp.data.listingPrice,
                        offerId: -1,
                        isFormDisabled: false,
                        isDataLoading: false,
                        listingId: listingId
                    });
                }).catch(err => {
                    if (err.response) {
                        this.props.history.push("/");
                    }
                });
            } else {
                //get offer amount
                axios.get(window.api_prefix+"/offerDetails?offerId=" + offerId).then(resp => {
                    this.setState({
                        offerAmount: resp.data.offerDetails.amount,
                        isFormDisabled: false,
                        isDataLoading: false,
                        offerId: offerId,
                        listingId: listingId
                    });
                }).catch(err => {
                    if (err.response) {
                        this.props.history.push("/");
                    }
                });
            }
        } else if (queryString.parse(window.location.search).listingId){
            //buy now price
            listingId = queryString.parse(window.location.search).listingId;
            axios.get(window.api_prefix+"/listingPrice?listingId=" + listingId).then(resp => {
                this.setState({
                    buyNowPrice: resp.data.listingPrice,
                    offerId: -1,
                    isFormDisabled: false,
                    isDataLoading: false,
                    listingId: listingId
                });
            }).catch(err => {
                if (err.response) {
                    this.props.history.push("/");
                }
            });
        }else{
            alert("YO");
            this.props.history.push("/");
        }
    }

    handleInput(e){
        const {name, value} = e.target;
        this.setState({
           [name]:value
        });
    }

    handleSubmit = (event) => {
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

        let shippingAddress = "";
        if(this.state.shippingAddressInput.length>0){
            shippingAddress = this.state.shippingAddressInput;
        }else if(this.state.shippingAddress.length>0){
            shippingAddress = this.state.shippingAddress;
        }else{
            this.setState({
                isFormDisabled: true,
                isDataLoading: true,
                stripeErrorMessage: "Please fill in your shipping address"
            });
            return;
        }


        axios.post(window.api_prefix+"/paymentIntent", { listingId: this.state.listingId, shippingAddress: shippingAddress, offerId: this.state.offerId == -1 ? null : this.state.offerId }).then(async resp => {
            console.log(resp.data.clientSecret);
            const cardElement = elements.getElement(CardElement);

            const result = await stripe.confirmCardPayment(resp.data.clientSecret, {
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
                        stripeErrorMessage: "",
                        isTransactionSuccess: true
                    });
                }
            }
        }).catch(err => {
            if (err.response) {
                this.setState({
                    isFormDisabled: false,
                    isDataLoading: false,
                    stripeErrorMessage: err.response.data.message
                });
            }
        });
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
        if (this.state.isTransactionSuccess == true) {
            content = (
                <div id={styles.formCard}>
                    <p className={"title1 " + styles.regularText}>Purchase successful!</p>
                    <p className={"regularText " + styles.regularText}>Thank you for your purchase. We'll now send you a purchase receipt by email. Hope you like your item.</p>
                    <p className={"regularTextBold " + styles.regularText}>Total: {amount}</p>
                </div>
            );
        } else {
            content = (
                <div id={styles.formCard}>
                    <p className={"title1 " + styles.regularText}>Payment method</p>
                    <p className={"regularText " + styles.regularText}>Once the item purchased, the seller has 3 days to ship your item and upload a tracking number.</p>
                    <form onSubmit={this.handleSubmit}>
                        <div id={styles.formRow}>
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                        <input className={"regularText"} type={"text"} id={styles.textInput} name={"shippingAddressInput"} onChange={this.handleInput} value={this.state.shippingAddressInput} placeholder={this.state.shippingAddress.length>0? this.state.shippingAddress: "Fill in your full shipping address"}/>
                        <button className={"buttonCta " + styles.button} type="submit" disabled={!stripe && this.state.isFormDisabled}>Pay now</button>
                        {this.state.stripeErrorMessage.length > 0 ? <p>{this.state.stripeErrorMessage}</p> : null}
                    </form>
                    <p className={"regularText " + styles.regularTextHalfMargin}>Subtotal: {amount}</p>
                    <p className={"regularText " + styles.regularTextHalfMargin}>Shipping: $0.00</p>
                    <p className={"regularText " + styles.regularTextHalfMargin}>Taxes: !!!!</p>
                    <p className={"regularTextBold " + styles.regularTextHalfMargin}>Total: {amount}</p>
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
        <div>
            <div id={styles.bodyContainer}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <CheckoutForm history={props.history} elements={elements} stripe={stripe} />
                    )}
                </ElementsConsumer>
            </div>
            <Footer />
            <MobileBottomNav {...props} />
            <DesktopTopNav key={new Date().getTime()} {...props} />
        </div>

    );
};

export default InjectedCheckoutForm;