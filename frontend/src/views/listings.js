import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/saved.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import ListingCard from "microComponents/ListingCardSmallCard.js";
import SpecialCard from "microComponents/SpecialListingCard.js";
import BodyContainer from "microComponents/BodyContainer";
import Modal from "microComponents/Modal";
import ReviewsCard from "microComponents/ReviewsCard";
import Spinner from "microComponents/LoaderAnimation";
import { integerToMoneyString } from "miscFunctions";
import queryString from "query-string";
class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeListings: [],
            activeListingsIsLoaded: false,
            soldListings: [],
            soldListingsIsLoaded: false,
            activeOffers: [],
            activeOffersIsLoaded: false,
            currentPage: 0,
            loading: true,
            isCounterOfferModalDisplayed: false,
            isDeleteConfirmModalDisplayed: false,
            isPickBuyerModalDisplayed: false,
            pickBuyerListingIndex: -1,
            counterOfferArrayIndex: -1,
            counterOfferValue: 1,
            confirmDeleteListingIndex: -1,
            isReviewsModalDisplayed: false,
            reviewsListingIndex: -1,
            isFetchingData: false,
            markAsSoldBuyersDetails: [],
            isTrackingNumberModalDisplayed: false,
            trackingNumberListingIndex: -1,
            carrierNameValue: "",
            trackingNumberValue: "",

            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsActiveListings:-1,
            mobileMoreOptionsSoldItems:-1
        }

        this.submitCounterOffer = this.submitCounterOffer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.deleteListing = this.deleteListing.bind(this);

        this.handleMobileMoreOptionsRef = React.createRef();

        this.handleMobileMoreOptionsOutsideClick = this.handleMobileMoreOptionsOutsideClick.bind(this);
    }

    componentDidMount() {
        if (typeof queryString.parse(window.location.search).activeTab != "undefined" && !isNaN(queryString.parse(window.location.search).activeTab)) {
            let activeTab = parseInt(queryString.parse(window.location.search).activeTab);
            if (activeTab >= 0 && activeTab <= 2) {
                this.setState({
                    currentPage: activeTab
                });
            }
        }
        axios.get(window.api_prefix+"/sellingHistory").then(res => {
            this.setState({
                soldListings: res.data,
                soldListingsIsLoaded: true
            });
        }).catch();

        axios.get(window.api_prefix+"/userActiveListings").then(res => {
            this.setState({
                activeListings: res.data,
                activeListingsIsLoaded: true
            });
        }).catch();

        axios.get(window.api_prefix+"/activeListingsOffers").then(res => {
            this.setState({
                activeOffers: res.data,
                activeOffersIsLoaded: true
            });
        }).catch();
    }

    handleMobileMoreOptionsOutsideClick(e){
        if(e.target == this.handleMobileMoreOptionsRef.current){
            this.setState({
                mobileMoreOptionsActiveOffers:-1,
                mobileMoreOptionsActiveListings:-1,
                mobileMoreOptionsSoldItems:-1
            })
        }
    }


    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    acceptOffer(arrayIndex) {
        let currentActiveOffers = this.state.activeOffers;
        let offerId = currentActiveOffers[arrayIndex].id;
        currentActiveOffers.splice(arrayIndex, 1);
        this.setState({
            activeOffers: currentActiveOffers,
            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsActiveListings:-1,
            mobileMoreOptionsSoldItems:-1
        });
        axios.post(window.api_prefix+"/acceptOffer", { offerId: offerId }).then().catch();

    }
    counterOffer(arrayIndex) {
        alert(arrayIndex);
        this.setState({
            counterOfferArrayIndex: arrayIndex,
            isCounterOfferModalDisplayed: true
        });
    }
    declineOffer(arrayIndex) {
        let currentActiveOffers = this.state.activeOffers;
        let offerId = currentActiveOffers[arrayIndex].id;
        currentActiveOffers.splice(arrayIndex, 1);
        this.setState({
            activeOffers: currentActiveOffers,
            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsActiveListings:-1,
            mobileMoreOptionsSoldItems:-1
        });
        axios.post(window.api_prefix+"/declineOffer", { offerId: offerId }).then().catch();
    }
    submitCounterOffer() {
        let currentActiveOffers = this.state.activeOffers;
        let counterOfferId = currentActiveOffers[this.state.counterOfferArrayIndex].id;
        currentActiveOffers.splice(this.state.counterOfferArrayIndex, 1);
        this.setState({
            activeOffers: currentActiveOffers,
            counterOfferArrayIndex: -1,
            counterOfferValue: 1,
            isCounterOfferModalDisplayed: false,
            mobileMoreOptionsActiveOffers:-1,
            mobileMoreOptionsActiveListings:-1,
            mobileMoreOptionsSoldItems:-1
        });
        axios.post(window.api_prefix+"/submitCounterOffer", { offerId: counterOfferId, offerValue: this.state.counterOfferValue }).then().catch();
    }

    deleteListing() {
        let activeListings = this.state.activeListings;
        let listingId = this.state.activeListings[this.state.confirmDeleteListingIndex].id;
        activeListings.splice(this.state.confirmDeleteListingIndex, 1);
        this.setState({
            activeListings: activeListings,
            isDeleteConfirmModalDisplayed: false,
            confirmDeleteListingIndex: -1
        });
        axios.post(window.api_prefix+"/deleteListing", { listingId: listingId });
    }

    render() {
        const { t } = this.props;
        let currentPage;
        if (this.state.currentPage === 0 && this.state.activeListingsIsLoaded && this.state.activeOffersIsLoaded) {
            let desktopOffersArray = <p className={styles.regularTextNoMargin + " regularText"}>No offers yet.</p>;
            let mobileOffersArray = <p className={styles.regularTextNoMargin + " regularText"}>No offers yet.</p>;
            if (this.state.activeOffers.length > 0 && this.state.activeListings.length > 0) {
                mobileOffersArray = [];
                desktopOffersArray = [];

                let activeListings = [];
                for (let v = 0; v < this.state.activeListings.length; v++) {
                    let newObj = this.state.activeListings[v];
                    newObj.offers = [];
                    activeListings.push(newObj);
                }


                for (let i = 0; i < this.state.activeOffers.length; i++) {
                    for (let j = 0; j < activeListings.length; j++) {
                        if (activeListings[j].id == this.state.activeOffers[i].listingid) {
                            let offer = this.state.activeOffers[i];
                            offer.arrayIndex = i;
                            activeListings[j].offers.push(offer);
                            break;
                        }
                    }
                }

                for (let i = 0; i < activeListings.length; i++) {
                    if (activeListings[i].offers.length > 0) {
                        for (let j = 0; j < activeListings[i].offers.length; j++) {
                            desktopOffersArray.push(
                                <tr key={j+"_"+i}>
                                    <td>
                                        {activeListings[i].title}
                                    </td>
                                    <td>
                                        {integerToMoneyString(activeListings[i].offers[j].amount)}
                                    </td>
                                    <td>
                                        {integerToMoneyString(activeListings[i].price)}
                                    </td>
                                    <td>
                                        @{activeListings[i].offers[j].sendername}
                                    </td>
                                    <td>
                                        <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.counterOffer(activeListings[i].offers[j].arrayIndex) }}>Counter offer</button>
                                        <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.acceptOffer(activeListings[i].offers[j].arrayIndex) }}>Accept</button>
                                        <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.declineOffer(activeListings[i].offers[j].arrayIndex) }}>Decline</button>
                                    </td>
                                </tr>
                            );

                            mobileOffersArray.push(
                            <div key={j+"_"+i+"2"} className={styles.mobileCardSellingBuying}>
                                <div className={styles.mobileCardSellingBuyingLeftContainer}>
                                    <p className={styles.regularTextHalfMargin+" regularTextMedium"}>{activeListings[i].title}</p>
                                    <p className={styles.regularTextHalfMargin+" regularText"}>@{activeListings[i].offers[j].sendername}</p>
                                    <p className={styles.regularTextHalfMargin+" regularText"}>{integerToMoneyString(activeListings[i].offers[j].amount)}</p>
                                </div>
                                <div className={styles.mobileCardSellingBuyingRightContainer}>
                                    <div className={styles.kebabContainer} onClick={()=>{
                                        this.setState({
                                            mobileMoreOptionsActiveOffers:activeListings[i].offers[j].arrayIndex,
                                            mobileMoreOptionsActiveListings:-1,
                                            mobileMoreOptionsSoldItems:-1
                                        })
                                    }}>
                                        <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/kebab-horizontal.svg"} />
                                    </div>
                                </div>
                            </div>
                            );
                        }
                    } else {
                        continue;
                    }
                }
            }
            currentPage = (
                <div>
                    <div id={styles.tableContainer}>
                        <p className={"title1 "+styles.regularText +" "+styles.hideMobile}>Active offers</p>
                        <p className={styles.regularText}>Offers or counter offers made by buyers for a product you’re selling will appear here. You only have 24 hours to accept/decline/counter-offer or it will automatically be declined.</p>
                        <table className={styles.dataTable+" "+styles.hideMobile}>
                            <thead className={styles.tableTHead}>
                            <tr>
                                <th className={"regularTextMedium"}>
                                    Item
                                </th>
                                <th className={"regularTextMedium"}>
                                    Seller offer
                                </th>
                                <th className={"regularTextMedium"}>
                                    Original price
                                </th>
                                <th className={"regularTextMedium"}>
                                    Buyer
                                </th>
                                <th className={"regularTextMedium"}>
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className={styles.tableTBody}>
                            {desktopOffersArray}
                            </tbody>
                        </table>
                        {/*<p className={"title1 "+styles.regularText}>Pending offers</p>*/}
                        {/*<p className={styles.regularText}>Offers or counter offers made by buyers for a product you’re selling will appear here. You only have 24 hours to accept/decline/counter-offer or it will automatically be declined.</p>*/}
                        <div className={styles.mobileCardSellingBuyingContainer}>
                            {mobileOffersArray}
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.currentPage === 1 && this.state.activeListingsIsLoaded) {
            let activeListings = <p className={styles.regularTextNoMargin + " regularText"}>No listings yet.</p>;
            let mobileListingsArray = <p className={styles.regularTextNoMargin + " regularText"}>No listings yet.</p>;
            if (this.state.activeListings.length > 0) {
                mobileListingsArray = [];
                activeListings = this.state.activeListings.map((listing, key) => {
                    let fullDate = new Date(listing.timestamp);
                    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    let listingDate = months[fullDate.getMonth()] + " " + fullDate.getDate() + ", " + fullDate.getFullYear();

                    let verificationStatusValues = ["Not verified", "Verification in progress...", "Verification not approved", "Verification approved"];
                    let verificationStatus = verificationStatusValues[listing.verificationstatus];
                    let verifyButton;

                    mobileListingsArray.push(
                        <div className={styles.mobileCardSellingBuying}>
                            <div className={styles.mobileCardSellingBuyingLeftContainer}>
                                <p className={styles.regularTextHalfMargin+" regularTextMedium"}>{listing.title}</p>

                                <p className={styles.regularTextHalfMargin+" regularText"}>{verificationStatus}</p>
                                <p className={styles.regularTextHalfMargin+" regularText"}>{listingDate}</p>
                            </div>
                            <div className={styles.mobileCardSellingBuyingRightContainer}>
                                <div className={styles.kebabContainer} onClick={()=>{
                                    this.setState({
                                        mobileMoreOptionsActiveOffers:-1,
                                        mobileMoreOptionsActiveListings:key,
                                        mobileMoreOptionsSoldItems:-1
                                    })
                                }}>
                                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/kebab-horizontal.svg"} />
                                </div>
                            </div>
                        </div>
                    );
                    return (
                        <tr key={key}>
                            <td>
                                {listing.title}
                            </td>
                            <td>
                                {/*price*/}
                            </td>
                            <td>
                                {listingDate}
                            </td>
                            <td>
                                {verificationStatus}
                            </td>
                            <td>
                                <Link to={"/new-listing?listingid=" + listing.id + "&listingmode=1"}>
                                    <button className={styles.buttonCta + " regularTextMedium"}>Edit</button>
                                </Link>
                                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.setState({ isDeleteConfirmModalDisplayed: true, confirmDeleteListingIndex: key }) }}>Delete</button>

                                {verifyButton}
                            </td>
                        </tr>
                    );
                });
            }
            currentPage = (
                <div>
                    <div id={styles.tableContainer}>
                        <p className={"title1 "+styles.regularText+" "+styles.hideMobile}>Active listings</p>
                        <table className={styles.dataTable+" "+styles.hideMobile}>
                            <thead className={styles.tableTHead}>
                            <tr>
                                <th className={"regularTextMedium"}>
                                    Item
                                </th>
                                <th className={"regularTextMedium"}>
                                    Price
                                </th>
                                <th className={"regularTextMedium"}>
                                    Date
                                </th>
                                <th className={"regularTextMedium"}>
                                    Status
                                </th>
                                <th className={"regularTextMedium"}>
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className={styles.tableTBody}>
                            {activeListings}
                            </tbody>
                        </table>
                        <div className={styles.mobileCardSellingBuyingContainer}>
                            {mobileListingsArray}
                        </div>
                    </div>
                </div>

            );
        } else if (this.state.soldListingsIsLoaded) {
            let soldListings = <p className={styles.regularText + " regularText"}>No sold items yet.</p>
            let mobileSoldArray = <p className={styles.regularTextNoMargin + " regularText"}>No listings yet.</p>;
            if (this.state.soldListings.length > 0) {
                mobileSoldArray = [];
                soldListings = this.state.soldListings.map((listing, key) => {
                    let fullDate = new Date(listing.timestamp);
                    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    let listingDate = months[fullDate.getMonth()] + " " + fullDate.getDate() + ", " + fullDate.getFullYear();

                    let transactionStatus = "";
                    if(listing.status == 0){
                        transactionStatus = "No tracking number added yet";
                    }else if(listing.status == 1){
                        transactionStatus  = "Shipped"
                    }else{
                        transactionStatus = "Delivered"
                    }

                    mobileSoldArray.push(
                         <div className={styles.mobileCardSellingBuying}>
                            <div className={styles.mobileCardSellingBuyingLeftContainer}>
                                <p className={styles.regularTextHalfMargin+" regularText"}>Order #{listing.ordernb}</p>
                                <p className={styles.regularTextHalfMargin+" regularTextMedium"}>{listing.title}</p>
                                <p className={styles.regularTextHalfMargin+" regularText"}>{transactionStatus}</p>
                                <p className={styles.regularTextHalfMargin+" regularText"}>{listingDate}</p>
                                {listing.sellerreceiptlink && listing.sellerreceiptlink.length>0 ? <Link>{listing.sellerreceiptlink}</Link> : <p>Generating receipt...</p>}
                            </div>
                            <div className={styles.mobileCardSellingBuyingRightContainer}>
                                <div className={styles.kebabContainer} onClick={()=>{
                                    this.setState({
                                        mobileMoreOptionsActiveOffers:-1,
                                        mobileMoreOptionsActiveListings:-1,
                                        mobileMoreOptionsSoldItems:key
                                    })
                                }}>
                                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/kebab-horizontal.svg"} />
                                </div>
                            </div>
                        </div>
                    );
                    return (
                            <tr key={key}>
                                <td>
                                    {listing.ordernb}
                                </td>
                                <td>
                                    {listing.title}
                                </td>
                                {/*<td>*/}
                                {/*    /!*price*!/*/}
                                {/*</td>*/}
                                <td>
                                    {transactionStatus}
                                </td>
                                <td>
                                    {listingDate}
                                </td>
                                <td>
                                    {listing.sellerreceiptlink && listing.sellerreceiptlink.length>0 ? <Link>listing.sellerreceiptlink</Link> : "Generating receipt..."}

                                </td>
                                <td>
                                    {
                                        listing.isbuyerreviewed == true ?
                                            null
                                            :
                                            <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.setState({ isReviewsModalDisplayed: true, reviewsListingIndex: key }) }}>Review buyer</button>
                                    }
                                    {
                                        listing.trackingnumber ?
                                            null
                                            :
                                            <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.setState({ isTrackingNumberModalDisplayed: true, trackingNumberListingIndex: key }) }}>Add tracking number</button>
                                    }
                                </td>
                            </tr>
                    );
                });
            }
            currentPage = (
                <div>
                    <div id={styles.tableContainer}>
                        <p className={"title1 "+styles.regularText+" "+styles.hideMobile}>Sold items</p>
                        <table className={styles.dataTable +" "+styles.hideMobile}>
                            <thead className={styles.tableTHead}>
                                <tr>
                                    <th className={"regularTextMedium"}>
                                        Order #
                                    </th>
                                    <th className={"regularTextMedium"}>
                                        Item
                                    </th>
                                    {/*<th className={"regularTextMedium"}>*/}
                                    {/*    Price*/}
                                    {/*</th>*/}
                                    <th className={"regularTextMedium"}>
                                        Status
                                    </th>
                                    <th className={"regularTextMedium"}>
                                        Date
                                    </th>
                                    <th className={"regularTextMedium"}>
                                        Receipt
                                    </th>
                                    <th className={"regularTextMedium"}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableTBody}>
                            {soldListings}
                            </tbody>
                        </table>
                        <div className={styles.mobileCardSellingBuyingContainer}>
                            {mobileSoldArray}
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }

        let buyersListDetails = [];
        if (this.state.markAsSoldBuyersDetails.length > 0 && this.state.isPickBuyerModalDisplayed == true) {
            buyersListDetails = this.state.markAsSoldBuyersDetails.map((buyer, key) => {

                let price = " paying the original buy now price."
                if (buyer.offeramount != null) {
                    price = " paying " + integerToMoneyString(buyer.offeramount);
                }
                return (
                    <div key={key} className={styles.buyersListRow} onClick={() => {
                        this.setState({
                            isFetchingData: true
                        });
                        axios.post(window.api_prefix+"/markListingAsSold", { reservationId: buyer.reservationid, buyerId: buyer.buyerid, listingId: this.state.activeListings[this.state.pickBuyerListingIndex].id }).then(resp => {
                            let listingArrayIndex = this.state.pickBuyerListingIndex;
                            let currentListings = this.state.activeListings;
                            let soldListing = currentListings[listingArrayIndex];
                            currentListings.splice(currentListings, 1);
                            let currentSoldListings = this.state.soldListings;
                            currentSoldListings.push(soldListing);
                            this.setState({
                                isFetchingData: false,
                                isPickBuyerModalDisplayed: false,
                                pickBuyerListingIndex: -1,
                                activeListings: currentListings,
                                soldListings: currentSoldListings
                            });
                        }).catch(err => {
                            this.setState({
                                isFetchingData: false,
                                isPickBuyerModalDisplayed: false,
                                pickBuyerListingIndex: -1
                            });
                        });
                    }}>
                        <p>@{buyer.buyername + price}</p>
                    </div>
                );
            });
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
        }else if(this.state.mobileMoreOptionsActiveListings != -1){
            mobileMoreOptionsCta.push(
                <Link style={{textDecoration:"none"}} to={"/new-listing?listingid=" + this.state.activeListings[this.state.mobileMoreOptionsActiveListings].id + "&listingmode=1"}>
                    <button className={styles.buttonCta + " regularTextMedium"}>Edit</button>
                </Link>,
                <button className={styles.buttonCta + " regularTextMedium"} onClick={() => { this.setState({ isDeleteConfirmModalDisplayed: true, confirmDeleteListingIndex: this.state.mobileMoreOptionsActiveListings, mobileMoreOptionsActiveOffers:-1, mobileMoreOptionsActiveListings:-1, mobileMoreOptionsSoldItems:-1 }) }}>Delete</button>
            );
            if (this.state.activeListings[this.state.mobileMoreOptionsActiveListings].verificationstatus == 0 || this.state.activeListings[this.state.mobileMoreOptionsActiveListings].verificationstatus == 2) {
                    mobileMoreOptionsCta.push(
                        <Link style={{textDecoration:"none"}} to={"/verifyListing?id=" + this.state.activeListings[this.state.mobileMoreOptionsActiveListings].id}>
                            <button className={styles.buttonCta + " regularTextMedium"}>Verify now</button>
                        </Link>
                    );
            }
            mobileMoreOptions = (
                <div onClick={this.handleMobileMoreOptionsOutsideClick} ref={this.handleMobileMoreOptionsRef} id={styles.mobileMoreOptionsFullPageContainer}>
                    <div id={styles.mobileMoreOptionsContainer}>
                        {mobileMoreOptionsCta}
                    </div>
                </div>
            );
        }else if(this.state.mobileMoreOptionsSoldItems != -1){
            if(this.state.soldListings[this.state.mobileMoreOptionsSoldItems].isbuyerreviewed != true){
                mobileMoreOptionsCta.push(<button className={styles.buttonCta + " regularTextMedium"} onClick={() => {
                    this.setState({
                        isReviewsModalDisplayed: true,
                        reviewsListingIndex: this.state.mobileMoreOptionsSoldItems,
                        mobileMoreOptionsActiveOffers:-1,
                        mobileMoreOptionsActiveListings:-1,
                        mobileMoreOptionsSoldItems:-1
                    })
                }}>Review buyer</button>)
            }
            if(!this.state.soldListings[this.state.mobileMoreOptionsSoldItems].trackingnumber || this.state.soldListings[this.state.mobileMoreOptionsSoldItems].trackingnumber.length==0){
                mobileMoreOptionsCta.push(<button className={styles.buttonCta + " regularTextMedium"} onClick={() => {
                    this.setState({
                        isTrackingNumberModalDisplayed: true,
                        trackingNumberListingIndex: this.state.mobileMoreOptionsSoldItems,
                        mobileMoreOptionsActiveOffers:-1,
                        mobileMoreOptionsActiveListings:-1,
                        mobileMoreOptionsSoldItems:-1
                    })
                }}>Add tracking number</button>);
            }
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
                            <p className={styles.noDisplayDesktop + " title1 " + styles.pageTitle}>Selling</p>
                            <div id={styles.categoriesMainContainer}>
                                <p className={styles.regularTextNoMargin + " regularTextBold " + styles.noDisplayMobile}>Selling</p>
                                <p className={this.state.currentPage === 0 ? styles.searchSuggestP + " " + styles.activeLink : styles.searchSuggestP} onClick={() => { this.setState({ currentPage: 0 }); }}>Active offers</p>
                                <p className={this.state.currentPage === 1 ? styles.searchSuggestP + " " + styles.activeLink : styles.searchSuggestP} onClick={() => { this.setState({ currentPage: 1 }); }}>Active listings</p>
                                <p className={this.state.currentPage === 2 ? styles.searchSuggestP + " " + styles.activeLink : styles.searchSuggestP} onClick={() => { this.setState({ currentPage: 2 }); }}>Sold items</p>
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
                        counterOfferValue: 1
                    })
                }} show={this.state.isCounterOfferModalDisplayed} description={this.state.counterOfferArrayIndex != -1 ? "The buyer offered " + integerToMoneyString(this.state.activeOffers[this.state.counterOfferArrayIndex].amount) + ". Send your counter offer." : ""}>
                    <input name="counterOfferValue" value={this.state.counterOfferValue} onChange={this.handleInputChange} type="number" min="1" step="0.01" placeholder="Counter offer" />
                    <div className="modalSubmitButtonDiv">
                        <button className="modalSubmitButton regularTextMedium buttonCta" onClick={this.submitCounterOffer}>Submit offer</button>
                    </div>
                </Modal>



                <Modal title="Confirm listing's deletion" closeModal={() => {
                    this.setState({
                        isDeleteConfirmModalDisplayed: false,
                        confirmDeleteListingIndex: -1
                    })
                }} show={this.state.isDeleteConfirmModalDisplayed} description="Do you really want to delete this listing?">
                    <div className="modalSubmitButtonDiv">
                        <button className="modalCancelButton regularText" onClick={() => { this.setState({ isDeleteConfirmModalDisplayed: false, confirmDeleteListingIndex: -1 }) }}>Cancel</button>
                        <button className="modalSubmitButton regularTextMedium buttonCta" onClick={this.deleteListing}>Confirm</button>
                    </div>
                </Modal>

                <Modal title="Who bought your item?" closeModal={() => {
                    this.setState({
                        isPickBuyerModalDisplayed: false,
                        pickBuyerListingIndex: -1
                    })
                }} show={this.state.isPickBuyerModalDisplayed && this.state.markAsSoldBuyersDetails.length > 0}>
                    <div>
                        {buyersListDetails}
                    </div>
                    <div className="modalSubmitButtonDiv">
                        <button className="modalCancelButton regularText" onClick={() => { this.setState({ isPickBuyerModalDisplayed: false, pickBuyerListingIndex: -1 }) }}>Cancel</button>
                    </div>
                </Modal>

                <Modal title="Review the buyer" closeModal={() => {
                    this.setState({
                        isReviewsModalDisplayed: false,
                        reviewsListingIndex: -1
                    })
                }} show={this.state.isReviewsModalDisplayed}>
                    <ReviewsCard listingId={this.state.reviewsListingIndex == -1 ? -1 : this.state.soldListings[this.state.reviewsListingIndex].id} submitReview={() => {
                        let reviewListings = this.state.soldListings;
                        reviewListings[this.state.reviewsListingIndex].isbuyerreviewed = true;
                        this.setState({
                            isReviewsModalDisplayed: false,
                            reviewsListingIndex: -1,
                            soldListings: reviewListings
                        })
                    }}></ReviewsCard>
                </Modal>

                <Modal title="Add a tracking number" closeModal={() => {
                    this.setState({
                        isTrackingNumberModalDisplayed: false,
                        trackingNumberListingIndex: -1
                    })
                }} show={this.state.isTrackingNumberModalDisplayed} description={"Add the parcel's shipping carrier and tracking number so us and the buyer can track it."}>
                    <input name="carrierNameValue" value={this.state.carrierNameValue} onChange={this.handleInputChange} type="text" placeholder="Shipping carrier name" />
                    <input name="trackingNumberValue" value={this.state.trackingNumberValue} onChange={this.handleInputChange} type="text" placeholder="Tracking  number" />
                    <div className="modalSubmitButtonDiv">
                        <button className="modalCancelButton regularText" onClick={() => { this.setState({ isTrackingNumberModalDisplayed: false, trackingNumberListingIndex: -1 }) }}>Cancel</button>
                        <button className="modalSubmitButton regularTextMedium buttonCta" onClick={() => {
                            axios.post(window.api_prefix+"/addTrackingNumber", { carrierName: this.state.carrierNameValue, trackingNumber: this.state.trackingNumberValue, listingId: this.state.soldListings[this.state.trackingNumberListingIndex].id });
                            let currentSoldListings = this.state.soldListings;
                            currentSoldListings[this.state.trackingNumberListingIndex].trackingnumber = "222";
                            this.setState({
                                isTrackingNumberModalDisplayed: false,
                                trackingNumberListingIndex: -1,
                                soldListings: currentSoldListings
                            });
                        }}>Confirm</button>
                    </div>
                </Modal>
                {mobileMoreOptions}
                {
                    this.state.isFetchingData == true ?
                        <Spinner />
                        :
                        null
                }
            </div>
        );

    }
}


export default withTranslation()(Saved);
