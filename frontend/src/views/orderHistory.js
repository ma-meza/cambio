import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/saved.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import SpecialCard from "microComponents/SpecialListingCard.js";
import BodyContainer from "microComponents/BodyContainer";
import Body from "microComponents/BodyContainer";
import Modal from "microComponents/Modal.js";
import ReviewsCard from "microComponents/ReviewsCard.js";
import Spinner from "microComponents/LoaderAnimation";
import Snackbar from "microComponents/SnackBar.js";
import { integerToMoneyString } from "miscFunctions";
class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOffers: [],
            pastPurchases: [],
            waitingPurchases: [],
            isCounterOfferModalDisplayed: false,
            counterOfferId: -1,
            counterOfferArrayIndex: -1,
            counterOfferValue: 1,
            reviewsListingIndex: -1,
            isReviewsModalDisplayed: false,
            isDoingReservation: false,
            currentPage: 0,

            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsPurchaseHistory:-1,
            mobileMoreOptionsAwaitingPayments:-1
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitCounterOffer = this.submitCounterOffer.bind(this);

        this.snackbarRef = React.createRef();
    }

    componentDidMount() {

        axios.get(window.api_prefix+"/listingsAwaitingYourPayment").then(resp => {
            this.setState({
                waitingPurchases: resp.data
            });
        }).catch();

        axios.get(window.api_prefix+"/purchaseHistory").then(resp => {
            this.setState({
                pastPurchases: resp.data
            });
        }).catch();

        axios.get(window.api_prefix+"/offers").then(resp => {
            this.setState({
                activeOffers: resp.data
            });
        }).catch();
    }

    acceptOffer(arrayIndex) {
        let currentActiveOffers = this.state.activeOffers;
        let currentWaitingPurchases = this.state.waitingPurchases;
        let offerId = currentActiveOffers[arrayIndex].id;
        let acceptedOffer = currentActiveOffers[arrayIndex];
        acceptedOffer.id = acceptedOffer.listingid;
        currentWaitingPurchases.push(acceptedOffer);
        currentActiveOffers.splice(arrayIndex, 1);
        this.setState({
            activeOffers: currentActiveOffers,
            waitingPurchases: currentWaitingPurchases,
            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsPurchaseHistory:-1,
            mobileMoreOptionsAwaitingPayments:-1
        });
        axios.post(window.api_prefix+"/acceptOffer", { offerId: offerId }).then().catch();
    }
    counterOffer(arrayIndex) {
        let currentActiveOffers = this.state.activeOffers;
        let offerId = currentActiveOffers[arrayIndex].id;
        this.setState({
            counterOfferArrayIndex: arrayIndex,
            counterOfferId: offerId,
            isCounterOfferModalDisplayed: true,
            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsPurchaseHistory:-1,
            mobileMoreOptionsAwaitingPayments:-1
        });
    }
    declineOffer(arrayIndex) {
        let currentActiveOffers = this.state.activeOffers;
        let offerId = currentActiveOffers[arrayIndex].id;
        currentActiveOffers.splice(arrayIndex, 1);
        this.setState({
            activeOffers: currentActiveOffers,
            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsPurchaseHistory:-1,
            mobileMoreOptionsAwaitingPayments:-1
        });
        axios.post(window.api_prefix+"/declineOffer", { offerId: offerId }).then().catch();
    }
    submitCounterOffer() {
        let currentActiveOffers = this.state.activeOffers;
        currentActiveOffers.splice(this.state.counterOfferArrayIndex, 1);
        this.setState({
            activeOffers: currentActiveOffers,
            counterOfferId: -1,
            counterOfferArrayIndex: -1,
            counterOfferValue: 1,
            isCounterOfferModalDisplayed: false
        });
        axios.post(window.api_prefix+"/submitCounterOffer", { offerId: this.state.counterOfferId, offerValue: this.state.counterOfferValue }).then().catch();
    }

    handleInputChange(e) {
        const { value, name } = e.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        const { t } = this.props;
        let currentPage;
        if (this.state.currentPage == 0) {
            //payments awaiting
            let waitingPurchases = <p className={styles.regularTextNoMargin + " regularText"}>No purchases waiting for payment.</p>;
            let mobileWaitingPurchases = <p className={styles.regularTextNoMargin + " regularText"}>No purchases waiting for payment.</p>
            if (this.state.waitingPurchases.length > 0) {
                mobileWaitingPurchases = [];
                waitingPurchases = this.state.waitingPurchases.map((listing, key) => {



                    let fullDate = new Date(listing.timestamp);
                    fullDate.setDate(fullDate.getDate() + 4);
                    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    let limitDate = months[fullDate.getMonth()] + " " + fullDate.getDate();

                    mobileWaitingPurchases.push(
                        <div className={styles.mobileCardSellingBuying}>
                            <div className={styles.mobileCardSellingBuyingLeftContainer}>
                                <p className={styles.regularTextHalfMargin+" regularTextMedium"}>{listing.title}</p>
                                <p className={styles.regularTextHalfMargin+" regularText"}>{integerToMoneyString(listing.amount)}</p>
                            </div>
                            <div className={styles.mobileCardSellingBuyingRightContainer}>
                                <div className={styles.kebabContainer} onClick={()=>{
                                    this.setState({
                                        mobileMoreOptionsActiveOffers:-1,
                                        mobileMoreOptionsPastPurchases:-1,
                                        mobileMoreOptionsAwaitingPayments:key
                                    })
                                }}>
                                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/kebab-horizontal.svg"} />
                                </div>
                            </div>
                        </div>

                    );

                    return (
                        <tr>
                            <td>
                                {listing.title}
                            </td>
                            <td>
                                {integerToMoneyString(listing.amount)}
                            </td>
                            <td>
                                <button className={styles.buttonCta + ' regularTextMedium'} onClick={() => {
                                    this.props.history.push("/pay?listingId="+listing.id+"&offerId="+listing.offerid);
                                    // this.setState({ isDoingReservation: true });
                                    // axios.post("/reserveProduct", { listingId: listing.listingid, buyNow: false, offerId: listing.offerid }).then(resp => {
                                    //     this.setState({ isDoingReservation: false });
                                    //     this.props.history.push("/payment-details?tra_id=" + resp.data.reservationId);
                                    // }).catch(err => {
                                    //     this.setState({ isDoingReservation: false });
                                    //     this.snackbarRef.current.openSnackBar('This item is being purchased by someone else at the moment. Please come back later.');
                                    // });
                                }}>Pay now</button>
                            </td>
                        </tr>
                    );
                });
            }

            currentPage = (
                <div>
                    <div id={styles.tableContainer}>
                        <p className={"title1 "+styles.regularText+" "+styles.hideMobile}>Awaiting payments</p>
                        <p className={styles.regularText}>Offers you have made for an item that were accepted by the seller or offers from a seller that you accepted will appear here for you to pay. Beware, other users can still purchase the item so hurry up.</p>
                        <table className={styles.dataTable+" "+styles.hideMobile}>
                            <thead className={styles.tableTHead}>
                            <td className={"regularTextMedium"}>
                                Item
                            </td>
                            <td className={"regularTextMedium"}>
                                Price
                            </td>
                            <td className={"regularTextMedium"}>
                                Actions
                            </td>
                            </thead>
                            <tbody className={styles.tableTBody}>
                            {waitingPurchases}
                            </tbody>
                        </table>
                        <div className={styles.mobileCardSellingBuyingContainer}>
                            {mobileWaitingPurchases}
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.currentPage == 1) {
            //active offers
            let activeOffers = <p className={styles.regularTextNoMargin + " regularText"}>No active offers.</p>;
            let mobileActiveOffers = <p className={styles.regularTextNoMargin + " regularText"}>No active offers.</p>;
            if (this.state.activeOffers.length > 0) {
                mobileActiveOffers = [];
                activeOffers = this.state.activeOffers.map((offer, key) => {

                    let fullDate = new Date(offer.timestamp);
                    fullDate.setDate(fullDate.getDate() + 4);
                    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    let limitDate = months[fullDate.getMonth()] + " " + fullDate.getDate();


                    mobileActiveOffers.push(
                        <div className={styles.mobileCardSellingBuying}>
                            <div className={styles.mobileCardSellingBuyingLeftContainer}>
                                <p className={styles.regularTextHalfMargin+" regularTextMedium"}>{offer.title}</p>
                                <p className={styles.regularTextHalfMargin+" regularText"}>{integerToMoneyString(offer.amount)}</p>
                            </div>
                            <div className={styles.mobileCardSellingBuyingRightContainer}>
                                <div className={styles.kebabContainer} onClick={()=>{
                                    this.setState({
                                        mobileMoreOptionsActiveOffers:key,
                                        mobileMoreOptionsAwaitingPayments:-1,
                                        mobileMoreOptionsPurchaseHistory:-1
                                    })
                                }}>
                                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/kebab-horizontal.svg"} />
                                </div>
                            </div>
                        </div>
                    );

                    return (
                        <tr>
                            <td>
                                {offer.title}
                            </td>
                            <td>
                                {integerToMoneyString(offer.amount)}
                            </td>
                            <td>
                                @{offer.sendername}
                            </td>
                            <td>
                                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.counterOffer(key) }}>Counter offer</button>
                                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.acceptOffer(key) }}>Accept</button>
                                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.declineOffer(key) }}>Decline</button>
                            </td>
                        </tr>
                    );
                });
            }

            currentPage = (
                <div>
                    <div id={styles.tableContainer}>
                        <p className={"title1 "+styles.regularText+" "+styles.hideMobile}>Active offers</p>
                        {/*<p className={styles.regularText}>Sellers having made a counter offer for a product you want to buy will appear here. You only have 24 hours to accept/decline/counter-offer or it will automatically be declined.</p>*/}
                        <p className={styles.regularText}>Sellers having made a counter offer for a product you want to buy will appear here.</p>
                        <table className={styles.dataTable+" "+styles.hideMobile}>
                            <thead className={styles.tableTHead}>
                            <td className={"regularTextMedium"}>
                                Item
                            </td>
                            <td className={"regularTextMedium"}>
                                Seller offer
                            </td>
                            <td className={"regularTextMedium"}>
                                Seller
                            </td>
                            <td className={"regularTextMedium"}>
                                Actions
                            </td>
                            </thead>
                            <tbody className={styles.tableTBody}>
                            {activeOffers}
                            </tbody>
                        </table>
                        <div className={styles.mobileCardSellingBuyingContainer}>
                            {mobileActiveOffers}
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.currentPage == 2) {
            //past purchases
            let pastPurchases = <p className={styles.regularTextNoMargin + " regularText"}>No purchases yet.</p>;
            let mobilePastPurchases = <p className={styles.regularTextNoMargin + " regularText"}>No purchases yet.</p>;
            if (this.state.pastPurchases.length > 0) {
                mobilePastPurchases = [];
                pastPurchases = this.state.pastPurchases.map((listing, key) => {


                    let fullDate = new Date(listing.timestamp);
                    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    let purchaseDate = months[fullDate.getMonth()] + " " + fullDate.getDate() + ", " + fullDate.getFullYear();
                    let purchasePrice = listing.buynowprice;
                    if (listing.offeramount) {
                        purchasePrice = listing.offeramount;
                    }
                    let transactionStatus = "";
                    if(listing.status == 0){
                        transactionStatus = "No tracking number added yet";
                    }else if(listing.status == 1){
                        transactionStatus  = "Shipped"
                    }else{
                        transactionStatus = "Delivered"
                    }


                    mobilePastPurchases.push(
                        <div className={styles.mobileCardSellingBuying}>
                            <div className={styles.mobileCardSellingBuyingLeftContainer}>
                                <p className={styles.regularTextHalfMargin+" regularText"}>Order# {listing.ordernb}</p>
                                <p className={styles.regularTextHalfMargin+" regularTextMedium"}>{listing.title} ({integerToMoneyString(purchasePrice)})</p>
                                <p className={styles.regularTextHalfMargin+" regularText"}>{transactionStatus}</p>
                                <p className={styles.regularTextHalfMargin+" regularText"}>{purchaseDate}</p>
                                {listing.receiptlink && listing.receiptlink.length>0 ? <Link to={listing.receiptlink} target="_blank" className={styles.regularTextHalfMargin+" regularText"}>listing.receiptlink</Link> : <p className={styles.regularTextHalfMargin+" regularText"}>Generating receipt...</p>}
                            </div>
                            <div className={styles.mobileCardSellingBuyingRightContainer}>
                                <div className={styles.kebabContainer} onClick={()=>{
                                    this.setState({
                                        mobileMoreOptionsActiveOffers:-1,
                                        mobileMoreOptionsAwaitingPayments:-1,
                                        mobileMoreOptionsPurchaseHistory:key
                                    })
                                }}>
                                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/kebab-horizontal.svg"} />
                                </div>
                            </div>
                        </div>
                    );

                    return (
                        <tr>
                            <td>
                                {listing.ordernb}
                            </td>
                            <td>
                                {listing.title}
                            </td>
                            <td>
                                {integerToMoneyString(purchasePrice)}
                            </td>
                            <td>
                                {transactionStatus}
                            </td>
                            <td>
                                {purchaseDate}
                            </td>
                            <td>
                                {listing.receiptlink && listing.receiptlink.length>0 ? <Link to={listing.receiptlink} target={"_blank"}>listing.receiptlink</Link> : "Generating receipt..."}
                            </td>
                            <td>
                                    {
                                        listing.issellerreviewed == true ?
                                            null
                                            :
                                            <button className={styles.buttonCta + ' regularTextMedium'} onClick={()=>{
                                                this.setState({
                                                    reviewsListingIndex: key,
                                                    isReviewsModalDisplayed: true
                                                });}
                                            }>Review seller</button>
                                    }
                            </td>
                        </tr>
                    );
                });
            }

            currentPage = (
                <div>
                    <div id={styles.tableContainer}>
                        <p className={"title1 "+styles.regularText +" "+styles.hideMobile}>Purchase history</p>
                        <table className={styles.dataTable +" "+styles.hideMobile}>
                            <thead className={styles.tableTHead}>
                            <td className={"regularTextMedium"}>
                                Order #
                            </td>
                            <td className={"regularTextMedium"}>
                                Item
                            </td>
                            <td className={"regularTextMedium"}>
                                Price
                            </td>
                            <td className={"regularTextMedium"}>
                                Status
                            </td>
                            <td className={"regularTextMedium"}>
                                Date
                            </td>
                            <td className={"regularTextMedium"}>
                                Receipt
                            </td>
                            <td className={"regularTextMedium"}>
                                Actions
                            </td>
                            </thead>
                            <tbody className={styles.tableTBody}>
                            {pastPurchases}
                            </tbody>
                        </table>
                        <div className={styles.mobileCardSellingBuyingContainer}>
                            {mobilePastPurchases}
                        </div>
                    </div>
                </div>
            );
        }





        let mobileMoreOptions = null;
        let mobileMoreOptionsCta = [];
        if(this.state.mobileMoreOptionsActiveOffers != -1){
            mobileMoreOptionsCta = [
                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.counterOffer(this.state.mobileMoreOptionsActiveOffers) }}>Counter offer</button>,
                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.acceptOffer(this.state.mobileMoreOptionsActiveOffers) }}>Accept</button>,
                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.declineOffer(this.state.mobileMoreOptionsActiveOffers) }}>Decline</button>
            ]
            mobileMoreOptions = (
                <div onClick={this.handleMobileMoreOptionsOutsideClick} ref={this.handleMobileMoreOptionsRef} id={styles.mobileMoreOptionsFullPageContainer}>
                    <div id={styles.mobileMoreOptionsContainer}>
                        {mobileMoreOptionsCta}
                    </div>
                </div>
            );
        }else if(this.state.mobileMoreOptionsPurchaseHistory != -1){
            if(this.state.pastPurchases[this.state.mobileMoreOptionsPurchaseHistory].issellerreviewed != true){
                mobileMoreOptionsCta.push(
                    <button className={styles.buttonCta + " regularTextMedium"} onClick={()=>{
                        this.setState({
                            reviewsListingIndex: this.state.mobileMoreOptionsPurchaseHistory,
                            isReviewsModalDisplayed: true,
                            mobileMoreOptionsActiveOffers:-1,
                            mobileMoreOptionsPurchaseHistory:-1,
                            mobileMoreOptionsAwaitingPayments:-1
                        });}
                    }>Review seller</button>
                );
            }

            mobileMoreOptions = (
                <div onClick={this.handleMobileMoreOptionsOutsideClick} ref={this.handleMobileMoreOptionsRef} id={styles.mobileMoreOptionsFullPageContainer}>
                    <div id={styles.mobileMoreOptionsContainer}>
                        {mobileMoreOptionsCta}
                    </div>
                </div>
            );
        }else if(this.state.mobileMoreOptionsAwaitingPayments != -1){
            mobileMoreOptionsCta.push(
                <button className={styles.buttonCta + ' regularTextMedium'} onClick={() => {
                    this.props.history.push("/pay?listingId="+this.state.waitingPurchases[this.state.mobileMoreOptionsAwaitingPayments].id+"&offerId="+this.state.waitingPurchases[this.state.mobileMoreOptionsAwaitingPayments].offerid);
                    // this.setState({ isDoingReservation: true });
                    // axios.post("/reserveProduct", { listingId: listing.listingid, buyNow: false, offerId: listing.offerid }).then(resp => {
                    //     this.setState({ isDoingReservation: false });
                    //     this.props.history.push("/payment-details?tra_id=" + resp.data.reservationId);
                    // }).catch(err => {
                    //     this.setState({ isDoingReservation: false });
                    //     this.snackbarRef.current.openSnackBar('This item is being purchased by someone else at the moment. Please come back later.');
                    // });
                }}>Pay now</button>
            );
            mobileMoreOptions = (
                <div onClick={this.handleMobileMoreOptionsOutsideClick} ref={this.handleMobileMoreOptionsRef} id={styles.mobileMoreOptionsFullPageContainer}>
                    <div id={styles.mobileMoreOptionsContainer}>
                        {mobileMoreOptionsCta}
                    </div>
                </div>
            );
        }


        return (
            <div>
                <BodyContainer>
                    <div className={styles.innerMainContainer}>
                        <div id={styles.bodyLeftSeparator}>
                            <p className={styles.noDisplayDesktop + " title1 " + styles.pageTitle}>Manage purchases</p>
                            <div id={styles.categoriesMainContainer}>
                                <p className={styles.regularTextNoMargin + " regularTextBold " + styles.noDisplayMobile}>Manage purchases</p>
                                <p className={this.state.currentPage === 0 ? styles.searchSuggestP + " " + styles.activeLink : styles.searchSuggestP} onClick={() => { this.setState({ currentPage: 0 }); }}>Awaiting payments</p>
                                <p className={this.state.currentPage === 1 ? styles.searchSuggestP + " " + styles.activeLink : styles.searchSuggestP} onClick={() => { this.setState({ currentPage: 1 }); }}>Active offers</p>
                                <p className={this.state.currentPage === 2 ? styles.searchSuggestP + " " + styles.activeLink : styles.searchSuggestP} onClick={() => { this.setState({ currentPage: 2 }); }}>Purchase history</p>
                            </div>
                        </div>
                        <div id={styles.bodyRightSeparator}>
                            {currentPage}
                        </div>
                    </div>
                </BodyContainer>

                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
                <Modal title="Counter offer" closeModal={() => {
                    this.setState({
                        isCounterOfferModalDisplayed: false,
                        counterOfferArrayIndex: -1,
                        counterOfferId: -1,
                        counterOfferValue: 1
                    })
                }} show={this.state.isCounterOfferModalDisplayed} description={this.state.counterOfferId != -1 && this.state.counterOfferArrayIndex != -1 ? "The seller currently offer is " + integerToMoneyString((this.state.activeOffers[this.state.counterOfferArrayIndex]).amount) + ". Send your counter offer." : ""}>
                    <input name="counterOfferValue" value={this.state.counterOfferValue} onChange={this.handleInputChange} type="number" min="1" step="0.01" placeholder="Counter offer" />
                    <div className="modalSubmitButtonDiv">
                        <button className="modalSubmitButton regularTextMedium buttonCta" onClick={this.submitCounterOffer}>Submit</button>
                    </div>
                </Modal>
                <Modal title="Review the seller" closeModal={() => {
                    this.setState({
                        isReviewsModalDisplayed: false,
                        reviewsListingIndex: -1
                    })
                }} show={this.state.isReviewsModalDisplayed}>
                    <ReviewsCard listingId={this.state.reviewsListingIndex == -1 ? -1 : this.state.pastPurchases[this.state.reviewsListingIndex].id} submitReview={() => {
                        let reviewListings = this.state.pastPurchases;
                        reviewListings[this.state.reviewsListingIndex].issellerreviewed = true;
                        this.setState({
                            isReviewsModalDisplayed: false,
                            reviewsListingIndex: -1,
                            pastPurchases: reviewListings
                        })
                    }}></ReviewsCard>
                </Modal>

                {mobileMoreOptions}
                {
                    this.state.isDoingReservation == true ?
                        <Spinner />
                        :
                        null
                }
                <Snackbar ref={this.snackbarRef} />
            </div>
        );
    }
}


export default withTranslation()(Saved);
