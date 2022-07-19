import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/listingPage.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import queryString from "query-string";
// import ActivityTicker from "microComponents/ActivityTicker";
import BodyContainer from "microComponents/BodyContainer";
import Modal from "microComponents/Modal.js";
import Snackbar from "microComponents/SnackBar.js";
import Spinner from "microComponents/LoaderAnimation";
import { integerToMoneyString } from "miscFunctions";
import LoginCard from "../microComponents/LoginCard";


let conditionsOptionsArray = [
    {
        id: 0,
        name: "New (sealed)"
    },
    {
        id: 1,
        name: "Like new"
    },
    {
        id: 2,
        name: "Lightly used"
    },
    {
        id: 3,
        name: "Used"
    },
    {
        id: 4,
        name: "Broken"
    },
    {
        id: 5,
        name: "For parts"
    }
];


class Listing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataIsLoading: true,
            isDoingReservation: false,
            errorMessage: "",
            id: "",
            title: "",
            seller: {
                name: "",
                reviews: [],
                avgRating: 0,
                profilePicture: ""
            },

            status: 0,
            price: 0,
            description: "",
            tags: [],
            isOwnListing: false,
            pictures: [],
            displayLoginPopup: false,
            makeOfferamount: 1,
            isOfferModalDisplayed: false,
            isListingFound: false,
            sellerReviews: [],
            filters: [],
            isGuestListing:true,
            condition:0,

            activePictureCarousel:-1,

            swipeStart:0,
            swipeEnd:0,
            activeDesktopImgCarousel:-1,

            isAnOfferMade:false,

            buyType:0 //0 = buy now, 1 = offer
        }
        this.makeOffer = this.makeOffer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.snackbarRef = React.createRef();
        this.shareLinkRef = React.createRef();
    }

    componentDidMount() {
        let listingId;
        if (queryString.parse(window.location.search).id) {
            listingId = queryString.parse(window.location.search).id;
        } else {
            this.props.history.push("/");
        }
        axios.get(window.api_prefix+"/listingDetails?id=" + listingId).then((res) => {
            let info = res.data.listingDetails;
            if (info) {
                this.setState({
                    filters: res.data.filters,
                    isListingFound: true,
                    isGuestListing:info.isguestlisting,
                    id: listingId,
                    isOwnListing: this.props.auth.user.id == info.sellerid,
                    title: info.title,
                    price: info.price,
                    pictures: info.pictures,
                    status: info.status,
                    seller: {
                        id: info.sellerid,
                        name: info.name,
                        avgRating: info.avgrating,
                        profilePicture: info.profilepicture ? info.profilepicture : ""
                    },
                    description: info.description,
                    condition:info.condition,
                    dataIsLoading: false,
                    predefType:info.predeftype
                });

                axios.get(window.api_prefix+"/userReviewsReceived?id=" + info.sellerid).then((resp) => {
                    this.setState({
                        sellerReviews: resp.data
                    })
                });

            } else {
                this.props.history.push("/home");
            }

        }).catch((err) => {
            if (err.response) {
                this.setState({
                    dataIsLoading: false,
                    errorMessage: err.response.data.message
                });
            }
        });
    }

    componentWillUnmount() {
        window.onscroll = undefined;
        document.onclick = undefined;
    }

    // handleTouchMove(e){
    //     // console.log(e.changedTouches[0].clientX);
    // }
    // handleTouchStart(e){
    //     this.setState({
    //         swipeStart:e.changedTouches[0].clientX
    //     });
    // }
    // handleTouchEnd(e){
    //     this.setState({
    //         swipeEnd:e.changedTouches[0].clientX
    //     });
    // }

    makeOffer() {
        if (this.props.auth.isAuthenticated === true) {
            this.setState({
                isOfferModalDisplayed: false,
                makeOfferAmount: "",
                isAnOfferMade:true
            });
            axios.post(window.api_prefix+"/makeOffer", { listingId: this.state.id, amount: this.state.makeOfferAmount }).then((resp) => {
            }).catch((err) => {
                if (err.response) {

                }
            });
        } else {
            this.setState({
                displayLoginPopup: true
            });
        }
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    render() {
        const { t } = this.props;
        if (this.state.dataIsLoading === true) {
            return <p>Loading...</p>
        }
        if (this.state.errorMessage.length > 0) {
            return <p>{this.state.errorMessage}</p>;
        }
        if (this.state.isListingFound == false) {
            return <p>Listing not found</p>;
        }
        let smallPictures = [];
        //start from second picture
            for (let i = 1; i < 4 && i < this.state.pictures.length; i++) {
                smallPictures.push(<div onClick={()=>{
                    this.setState({
                        activeDesktopImgCarousel:i
                    });
                }} key={i} style={{ backgroundImage: "url('" + this.state.pictures[i] + "')" }} className={styles.smallPictureImg}></div>);
            }
            if(this.state.pictures.length == 5){
                smallPictures.push(<div onClick={()=>{
                    this.setState({
                        activeDesktopImgCarousel:4
                    });
                }} key={4} style={{ backgroundImage: "url('" + this.state.pictures[4] + "')" }} className={styles.smallPictureImg}></div>);
            }else if(this.state.pictures.length > 5){
                smallPictures.push(
                    <div onClick={()=>{
                        this.setState({
                            activeDesktopImgCarousel:5
                        });
                    }} key={5} className={styles.smallPictureImg}>
                        <p>More </p>
                    </div>
                );
            }

        let carouselDots = [];
        for(let i=0;i<this.state.pictures.length;i++){
            carouselDots.push(
                <div className={this.state.activePictureCarousel == i?styles.carouselDot+" "+styles.activeCarouselDot:styles.carouselDot}></div>
            );
        }

        let mobilePics = this.state.pictures.map((pic, key)=>{
            return (
                <div key={key} className={styles.mainPictureImg} style={{ backgroundImage: "url('" + pic + "')" }}></div>
            );
        });
        let mainListingPicture;
        if (this.state.pictures.length > 0) {
            mainListingPicture = (
                <div id={styles.mainPictureContainer}>
                    <div onClick={()=>{
                        this.setState({
                            activeDesktopImgCarousel:0
                        });
                    }} className={styles.mainPictureImg} id={styles.mobileNoShow} style={{ backgroundImage: "url('" + this.state.pictures[0] + "')" }}></div>
                    {mobilePics}
                </div>
            );
        } else {
            mainListingPicture = (
                <div id={styles.mainPictureImg}>
                    <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/image.svg" />
                </div>
            );
        }


        let reviewsList;
        if (this.state.sellerReviews.length > 0) {
            reviewsList = this.state.sellerReviews.map((review, key) => {
                let starsArray = [];
                let nbFullStars = Math.floor(review.rating);
                for(let i = 0;i<nbFullStars;i++){
                    starsArray.push(
                        <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow.svg"} />
                    );
                }
                if(nbFullStars != review.rating){
                    starsArray.push(
                        <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow-half.svg"} />
                    );
                }
                return (
                    <div key={key} className={styles.reviewCardContainer}>
                        <Link to={"/user?id=" + review.reviewerid}>
                            <div className={styles.reviewCardInnerContainer}>
                                <div className={styles.profilePictureImg} style={{
                                    backgroundImage: !review.profilepicture || review.profilepicture.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg')" : "url('" + review.profilepicture + "')"
                                }}></div>
                                < p className={" regularText"} >@{review.name}</p>
                            </div>
                        </Link>
                        <div className={styles.reviewCardInnerContainer}>
                            <p className={styles.regularTextNoMargin + " regularText"}>{review.comment}</p>
                        </div>
                        <div className={styles.reviewCardInnerContainer}>
                            {/* <p className={styles.regularTextNoMargin + " regularText"}>{review.rating} stars</p> */}
                            <p className={styles.regularTextNoMargin + " regularText "+styles.starP}>{starsArray}</p>
                        </div>
                    </div>
                );
            });
        } else {
            reviewsList = <p>No reviews yet.</p>
        }

        let sellerProfilePicture;
        if (this.state.seller.profilePicture.length > 0) {
            sellerProfilePicture = (
                sellerProfilePicture = <div className={styles.profilePictureImg} style={{ backgroundImage: "url('" + this.state.seller.profilePicture + "')" }}></div>
            );
        } else {
            sellerProfilePicture = <div className={styles.profilePictureImg}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg" /></div>
        }

        let actionButtons;
        let actionButtonsArray = [];
        if(this.state.isGuestListing == false){
            actionButtonsArray.push(
                <button className={"secondaryButton " + styles.floatingButtonCta} id={styles.floatingButtonRight} onClick={() => {
                    this.props.history.push("/pay?listingId="+this.state.id);
                }}>Buy now</button>
            );
            actionButtonsArray.push(
                <button className={"secondaryButton " + styles.floatingButtonCta} id={styles.floatingButtonLeft} onClick={() => { this.setState({ isOfferModalDisplayed: true }) }}>Make offer</button>
            );
        }else{
            actionButtonsArray.push(
                <button className={"secondaryButton " + styles.floatingButtonFullWidth} onClick={() => { this.setState({ isOfferModalDisplayed: true }) }}>Make offer</button>
            );
        }
        if (this.state.isOwnListing === false && this.state.status != 1 && this.state.status != 2) {
            actionButtons = (
                <div className={styles.listingComponentsMainContainer}>
                    {actionButtonsArray}
                </div>
            );
        }
        let listingUrl = "https://joincambio.com/listing?id=" + this.state.id;
        let twitterShareLink = "https://twitter.com/share?url=" + listingUrl + "&text=" + this.state.title + "... " + this.state.description;
        let fbShareLink = "https://www.facebook.com/sharer/sharer.php?u=" + listingUrl;


        let bigImgsDesktopCarousel = [];
        let carouselArrows = [];
        if(this.state.activeDesktopImgCarousel != -1){
            if(this.state.activeDesktopImgCarousel != 0){
                //past element
                bigImgsDesktopCarousel.push(
                    <div id={styles.carouselLeftPic} style={{backgroundImage:"url("+this.state.pictures[this.state.activeDesktopImgCarousel - 1]+")"}}></div>
                );
                carouselArrows.push(
                    <div id={styles.carouselArrowLeft} onClick={()=>{this.setState(prev=>({activeDesktopImgCarousel:prev.activeDesktopImgCarousel-1}))}} style={{backgroundImage:"url(https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-left.svg)"}}></div>
                );
            }

            //current element
            bigImgsDesktopCarousel.push(
                <div id={styles.carouselMiddlePic} style={{backgroundImage:"url("+this.state.pictures[this.state.activeDesktopImgCarousel]+")"}}></div>
            );

            //future element
            if(this.state.activeDesktopImgCarousel != this.state.pictures.length-1){
                bigImgsDesktopCarousel.push(
                    <div id={styles.carouselRightPic} style={{backgroundImage:"url("+this.state.pictures[this.state.activeDesktopImgCarousel + 1]+")"}}></div>
                );
                carouselArrows.push(
                    <div id={styles.carouselArrowRight} onClick={()=>{this.setState(prev=>({activeDesktopImgCarousel:prev.activeDesktopImgCarousel+1}))}} style={{backgroundImage:"url(https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-right.svg)"}}></div>
                );
            }
        }

        let avgRating = this.state.seller.avgRating;
        let sellerRatingStarArray;
        if (avgRating == 0 || avgRating == null || typeof avgRating == "undefined") {
            sellerRatingStarArray = "No ratings yet.";
        }else{
            sellerRatingStarArray = [];
            let nbFullStars = Math.floor(avgRating);
            for(let i = 0;i<nbFullStars;i++){
               sellerRatingStarArray.push(
                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow.svg"} />
                );
            }
            if(nbFullStars != avgRating){
                sellerRatingStarArray.push(
                    <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow-half.svg"} />
                );
            }
        }

        return (
            <div>
                <BodyContainer>


                    <div id={styles.desktopLeftSide}>
                        <div id={styles.topMainContainer}>
                            <div className={styles.listingComponentsMainContainer}>
                                <p className={"megaTitle " + styles.regularTextHalfMargin}><Link to={"/search?predefType="+this.state.predefType} style={{color:"black", textDecoration:"underline"}}>{this.state.title}</Link></p>
                                <p className={"title1 " + styles.regularTextHalfMargin}>{integerToMoneyString(this.state.price)}</p>
                                <p className={"regularText " + styles.regularTextHalfMargin} style={{color: "grey"}}>{conditionsOptionsArray[this.state.condition].name}</p>
                                <p className={styles.regularText + " regularText"}>{this.state.description.length>0 ? this.state.description.length : "No defects, problems, or missing parts." }</p>
                                <Link to={"/user?id=" + this.state.seller.id} style={{ color: "#000", textDecoration: "none" }}>
                                    {sellerProfilePicture}
                                    <div id={styles.sellerTextMainContainer}>
                                        <div>
                                            <p className={styles.regularTextNoMargin + " regularTextMedium"}>@{this.state.seller.name}</p>
                                        </div>
                                        <div>
                                            {/* <p className={styles.regularTextNoMargin + " regularText"}>{this.state.seller.avgRating} stars ({this.state.sellerReviews.length})</p> */}
                                            <p className={styles.regularTextNoMargin + " regularText "+styles.starPSmall}>{sellerRatingStarArray}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className={styles.innerMainContainer}>
                                {mainListingPicture}
                                <div className={styles.smallPicturesContainer}>
                                    {smallPictures}
                                </div>
                            </div>
                        </div>


                        <div className={styles.mainFeedContainers}>
                            <div className={styles.innerMainContainer+" "+styles.sidePadding}>
                                {actionButtons}
                                <div id={styles.shareIconsBar}>
                                    <a href={twitterShareLink} target="_blank">
                                        <img className={styles.shareIcons} src="https://staticassets2020.s3.amazonaws.com/icons/twitter-black.svg" />
                                    </a>
                                    <a href={fbShareLink} target="_blank">
                                        <img className={styles.shareIcons} src="https://staticassets2020.s3.amazonaws.com/icons/fb-black.svg" />
                                    </a>
                                    <img onClick={() => {
                                        var copyText = this.shareLinkRef.current;

                                        /* Select the text field */
                                        copyText.select();
                                        copyText.setSelectionRange(0, 99999); /* For mobile devices */

                                        /* Copy the text inside the text field */
                                        document.execCommand("copy");


                                        this.snackbarRef.current.openSnackBar('Listing link copied!');
                                    }} src="https://staticassets2020.s3.amazonaws.com/icons/link-darkGrey.svg" />
                                    <input style={{ position:"absolute", left:"-100%", opacity:0, pointerEvents:"none" }} aria-hidden={true} readOnly ref={this.shareLinkRef} type="text" value={listingUrl} />
                                </div>


                                <p className={styles.regularText + " title2"}>Seller reviews</p>
                                {reviewsList}
                            </div>
                        </div>
                    </div>

                    <div id={styles.desktopRightSide}>
                        <div id={styles.paymentSidebarContainer}>
                            {
                                this.state.isGuestListing == true ?
                                    <p className={"regularTextMedium "+styles.regularText}>Make an offer</p>
                                    :
                                    <div id={styles.buyTypeSelectorContainer}>
                                        <div>
                                            <div style={{margin:"0 10px 0 0"}} id={this.state.buyType == 0? styles.selectedBuyType: styles.unselectedBuyType} onClick={()=>{this.setState({buyType:0})}}>
                                                <p className={"regularText "+styles.regularTextNoMargin}>Buy now</p>
                                            </div>
                                            <div id={this.state.buyType == 0? styles.unselectedBuyType: styles.selectedBuyType} onClick={()=>{this.setState({buyType:1})}}>
                                                <p className={"regularText "+styles.regularTextNoMargin}>Make offer</p>
                                            </div>
                                        </div>
                                    </div>

                            }
                            {
                                this.state.buyType == 0 && this.state.isGuestListing == false?
                                    <div>
                                        <p className={"regularText "+styles.regularText}>Item price: <span className={"regularTextMedium"} style={{float:"right"}}>{integerToMoneyString(this.state.price)}</span></p>
                                        <p className={"regularText "+styles.regularText}>Shipping: <span className={"regularTextMedium"} style={{float:"right"}}>FREE</span></p>
                                        <p className={"regularText "+styles.regularText}>Taxes: <span className={"regularTextMedium"} style={{float:"right"}}>{integerToMoneyString(this.state.price *0.15)}</span></p>
                                        <p className={"regularText "+styles.regularText}>Total: <span className={"regularTextMedium"} style={{float:"right"}}>{integerToMoneyString(this.state.price*1.15)}</span></p>
                                        <button className={"buttonCta regularTextMedium"} onClick={() => {
                                            this.props.history.push("/pay?listingId="+this.state.id);
                                        }}>Proceed to checkout</button>
                                    </div>
                                    :
                                    this.state.isAnOfferMade == false?
                                        <div>
                                        <p className={"regularText "+styles.regularText}>Make an offer for this item. While the seller accepts your offer, the item can still be purchased by someone else.</p>
                                        <input name="makeOfferAmount" style={{margin:"0 0 20px 0"}} className={"inputText " + styles.inputText + " regularText"} value={this.state.makeOfferAmount} onChange={this.handleInputChange} type="number" min="1" step="0.01" placeholder="Offer" />
                                        <button className={"buttonCta regularTextMedium"} onClick={this.makeOffer}>Send offer</button>
                                        </div>
                                    :
                                        <div>
                                        <p className={"regularText "+styles.regularText}>Thank you for making an offer. You will be able to view the offer in your buyer dashboard only when and if the seller accepts your offer.</p>
                                        </div>

                            }
                        </div>
                    </div>


                    <div id={styles.topMainContainer} className={styles.hideDesktop}>
                        <div className={styles.innerMainContainer}>
                            {mainListingPicture}
                            <div className={styles.smallPicturesContainer}>
                                {smallPictures}
                            </div>
                        </div>
                    </div>








                    <div className={styles.mainFeedContainers +" "+styles.hideDesktop}>
                        <div className={styles.innerMainContainer+" "+styles.sidePadding}>
                            <div className={styles.listingComponentsMainContainer}>
                                <p className={"title1 " + styles.regularText}><Link to={"/search?predefType="+this.state.predefType} style={{color:"black", textDecoration:"underline"}}>{this.state.title}</Link></p>
                                <p className={"title2 " + styles.regularText}>{integerToMoneyString(this.state.price)}</p>
                                <p className={"regularText " + styles.regularText} style={{color: "grey"}}>{conditionsOptionsArray[this.state.condition].name}</p>
                            </div>


                            <div className={styles.listingComponentsMainContainer}>
                                <Link to={"/user?id=" + this.state.seller.id} style={{ color: "#000", textDecoration: "none" }}>
                                {sellerProfilePicture}
                                <div id={styles.sellerTextMainContainer}>
                                    <div>
                                        <p className={styles.regularTextNoMargin + " regularTextMedium"}>@{this.state.seller.name}</p>
                                    </div>
                                    <div>
                                        {/* <p className={styles.regularTextNoMargin + " regularText"}>{this.state.seller.avgRating} stars ({this.state.sellerReviews.length})</p> */}
                                        <p className={styles.regularTextNoMargin + " regularText "+styles.starPSmall}>{sellerRatingStarArray}</p>
                                    </div>
                                </div>
                                </Link>
                            </div>
                            {actionButtons}
                            <div className={styles.listingComponentsMainContainer}>
                                <p className={styles.regularTextNoMargin + " regularText"} style={{ minHeight: "100px" }}>{this.state.description.length>0 ? this.state.description.length : "No defects, problems, or missing parts." }</p>
                            </div>

                            <div className={styles.separatorLine}></div>

                            <div id={styles.shareIconsBar}>
                                <a href={twitterShareLink} target="_blank">
                                    <img className={styles.shareIcons} src="https://staticassets2020.s3.amazonaws.com/icons/twitter-black.svg" />
                                </a>
                                <a href={fbShareLink} target="_blank">
                                    <img className={styles.shareIcons} src="https://staticassets2020.s3.amazonaws.com/icons/fb-black.svg" />
                                </a>
                                <img onClick={() => {
                                    var copyText = this.shareLinkRef.current;

                                    /* Select the text field */
                                    copyText.select();
                                    copyText.setSelectionRange(0, 99999); /* For mobile devices */

                                    /* Copy the text inside the text field */
                                    document.execCommand("copy");


                                    this.snackbarRef.current.openSnackBar('Listing link copied!');
                                }} src="https://staticassets2020.s3.amazonaws.com/icons/link-darkGrey.svg" />
                                <input style={{ position:"absolute", left:"-100%", opacity:0, pointerEvents:"none" }} aria-hidden={true} readOnly ref={this.shareLinkRef} type="text" value={listingUrl} />
                            </div>


                            <div className={styles.separatorLine}></div>
                            <p className={styles.regularText + " title2"}>Seller reviews</p>
                            {reviewsList}

                        </div>
                    </div>
                </BodyContainer>
                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
                {/*<ActivityTicker />*/}

                <Modal title="Make offer" closeModal={() => {
                    this.setState({
                        isOfferModalDisplayed: false,
                        makeOfferamount: 1
                    })
                }} show={this.state.isOfferModalDisplayed} description="Offer a certain amount for this product. If accepted by the seller, you will have 4 days to pay the item before your offer expires. It can still be purchased by someone else in the meantime.">
                    <input name="makeOfferAmount" className={"inputText " + styles.inputText + " regularText"} value={this.state.makeOfferAmount} onChange={this.handleInputChange} type="number" min="1" step="0.01" placeholder="Offer" />
                    <div className="modalSubmitButtonDiv">
                        <button className="modalSubmitButton regularTextMedium buttonCta" onClick={this.makeOffer}>Submit</button>
                    </div>
                </Modal>




                <div id={styles.bigImgDesktopCarouselContainer} className={this.state.activeDesktopImgCarousel == -1 ? styles.desktopCarouselIsInactive : null}>
                    {bigImgsDesktopCarousel}
                    {carouselArrows}
                    <div onClick={()=>{this.setState({activeDesktopImgCarousel:-1})}} style={{backgroundImage:"url(https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg)"}} id={styles.carouselX}>

                    </div>
                </div>



                {
                    this.state.isDoingReservation == true ?
                        <Spinner />
                        :
                        null
                }
                <Modal closeModal={() => {
                    this.setState({
                        displayLoginPopup: false,
                    })
                }} show={this.state.displayLoginPopup} >
                    <LoginCard {...this.props} />
                </Modal>
                <Snackbar ref={this.snackbarRef} />
            </div>
        );
    }
}

Listing.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(Listing);