import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/profile.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import queryString from "query-string";
import ListingCardSmallCard from "../microComponents/ListingCardSmallCard";
import ActivityTicker from "microComponents/ActivityTicker";
import BodyContainer from "microComponents/BodyContainer";
import {integerToMoneyString} from "../miscFunctions";
let conditionsOptionsArray = ["New (sealed)", "Like new", "Lightly used", "Used", "Broken", "For parts"];
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataIsLoading: true,
            id: "",
            name: "",
            reviews: [],
            signupDate: new Date(),
            avgRating: 1,
            description: "",
            picture: "",
            activeListings: [],
            recentPurchases: [],
            errorMessage: "",
            displayLoginPopup: false,
            userIsFollowed: false,
            isOwnProfile: false
        }
        this.followUser = this.followUser.bind(this);
    }

    componentDidMount() {
        let userId;
        if (queryString.parse(window.location.search).id) {
            userId = queryString.parse(window.location.search).id;
        } else {
            this.props.history.push("/");
        }

        axios.get(window.api_prefix+"/userReviewsReceived?id=" + userId).then((resp) => {
            this.setState({
                reviews: resp.data,
            })
        });

        axios.get(window.api_prefix+"/userFromIdActiveListings?userId=" + userId).then((resp) => {
            this.setState({
                activeListings: resp.data,
            })
        });

        axios.get(window.api_prefix+"/userFromIdPurchaseHistory?userId=" + userId).then((resp) => {
            console.log(resp);
            this.setState({
                recentPurchases: resp.data,
            })
        });

        axios.get(window.api_prefix+"/userProfile?id=" + userId).then((res) => {
            let info = res.data.userInfos;
            this.setState({
                id: userId,
                userIsFollowed: res.data.followedInfo && res.data.followedInfo.length > 0 ? true : false,
                dataIsLoading: false,
                isOwnProfile: this.props.auth.user.id == userId,
                signupDate: new Date(info.signupdate),
                name: info.name,
                avgRating: info.avgrating,
                profilePicture: info.profilepicture ? info.profilepicture : "",
                description: info.bio ? info.bio : "",
            });
        }).catch((err) => {
            if (err.response) {
                this.setState({
                    dataIsLoading: false,
                    errorMessage: err.response.data.message
                });
            }
        });
    }

    followUser() {
        if (this.props.auth.isAuthenticated === true) {
            this.setState(prevState => ({
                userIsFollowed: !prevState.userIsFollowed
            }));
            axios.post(window.api_prefix+"/followUser", { id: this.state.id }).then((resp) => {
                this.setState({
                    userIsFollowed: resp.data.isFollowing
                });
            }).catch((err) => {
                if (err.response) {
                    this.setState(prevState => ({
                        userIsFollowed: !prevState.userIsFollowed
                    }));
                }
            });
        } else {
            this.setState({
                displayLoginPopup: true
            });
        }
    }

    render() {
        const { t } = this.props;

        let reviewsList = <p>No reviews yet.</p>;

        if (this.state.reviews.length > 0) {
            reviewsList = this.state.reviews.map((review, key) => {
                let reviewRating = review.rating;
                let reviewRatingStarArray;
                if (reviewRating == 0 || reviewRating == null || typeof reviewRating == "undefined") {
                    reviewRatingStarArray = "No ratings yet.";
                }else{
                    reviewRatingStarArray = [];
                    let nbFullStars = Math.floor(reviewRating);
                    for(let i = 0;i<nbFullStars;i++){
                        reviewRatingStarArray.push(
                            <img className={styles.starIcon} src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow.svg"} />
                        );
                    }
                    if(nbFullStars != reviewRating){
                        reviewRatingStarArray.push(
                            <img className={styles.starIcon} src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow-half.svg"} />
                        );
                    }
                }
                return (
                    <div key={key} className={styles.reviewCardContainer}>
                        <Link to={"/user?id=" + review.reviewerid}>
                            <div className={styles.reviewCardInnerContainer}>
                                <div className={styles.profilePictureImg} style={{
                                    backgroundImage: !review.profilePicture || review.profilePicture.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg')" : "url('" + review.profilePicture + "')"
                                }}></div>
                                < p className={" regularText"} > {review.name}</p>
                            </div>
                        </Link>
                        <div className={styles.reviewCardInnerContainer}>
                            <p className={styles.regularTextNoMargin + " regularText"}>{review.comment}</p>
                        </div>
                        <div className={styles.reviewCardInnerContainer}>
                            <p className={styles.regularTextNoMargin + " regularText"}>{reviewRatingStarArray}</p>
                        </div>
                    </div>
                );
            });
        }

        if (this.state.dataIsLoading === true) {
            return <p>Loading...</p>
        } else {
            if (this.state.errorMessage.length > 0) {
                return <p>{this.state.errorMessage}</p>
            }

            let activeListings = <p>No listings.</p>;
            if (this.state.activeListings.length > 0) {
                activeListings = this.state.activeListings.map((listing, key) => {
                    console.log(listing);
                    return (
                        <ListingCardSmallCard key={key} listing={listing} />
                    );
                });
            }

            let recentPurchases = <p>No recent purchases.</p>;
            if (this.state.recentPurchases.length > 0) {
                recentPurchases = this.state.recentPurchases.map((listing, key) => {
                    return (
                        <Link key={key} to={"/listing?id=" + listing.id}>
                            <div className={styles.listingSmallCard}>
                                <div className={styles.listingPicture} style={{ backgroundImage: !listing.pictures || listing.pictures.length == 0 ? "url('/https://staticassets2020.s3.amazonaws.com/octiconsSvg/image.svg')" : "url('" + listing.pictures[0] + "')" }}><p className={styles.listingPrice + " regularTextBold"}>{integerToMoneyString(listing.price)}</p></div>
                                <p className={styles.regularTextHalfMargin + " regularTextBold"}>{listing.title}</p>
                                <p className={styles.regularTextHalfMargin + " regularText"}>{conditionsOptionsArray[listing.condition]}</p>
                            </div>
                        </Link>
                    );
                });
            }

            let profilePicture;
            if (this.state.profilePicture.length > 0) {
                profilePicture = <div className={styles.profilePictureImg} style={{ backgroundImage: "url('" + this.state.profilePicture + "')" }}></div>;
            } else {
                profilePicture = <div className={styles.profilePictureImg}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg" /></div>
            }

            let followButton;
            if (this.state.isOwnProfile === false && (this.props.auth.isAuthenticated == true)) {
                followButton = (
                    <div className={styles.followButtonMainContainer}>
                        {this.state.userIsFollowed === true ? <button className={"secondaryButton " + styles.buttonCta} onClick={this.followUser}>Following <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/check-inactive.svg"/></button> : <button className={"secondaryButton " + styles.buttonCta} onClick={this.followUser}>Follow <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/plus.svg"/></button>}
                        {/* <button className={"buttonCta " + styles.buttonCta}>Message</button> */}
                    </div>
                );
            }


            let avgRating = this.state.avgRating;
            let sellerRatingStarArray;
            if (avgRating == 0 || avgRating == null || typeof avgRating == "undefined") {
                sellerRatingStarArray = "No ratings yet.";
            }else{
                sellerRatingStarArray = [];
                let nbFullStars = Math.floor(avgRating);
                for(let i = 0;i<nbFullStars;i++){
                    sellerRatingStarArray.push(
                        <img className={styles.starIcon} src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow.svg"} />
                    );
                }
                if(nbFullStars != avgRating){
                    sellerRatingStarArray.push(
                        <img className={styles.starIcon} src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow-half.svg"} />
                    );
                }
            }

            return (
                <div>
                    <BodyContainer>
                        <div className={styles.innerMainContainer}>
                            <div className={styles.listingComponentsMainContainer}>
                                {profilePicture}

                                {followButton}
                                <div id={styles.sellerTextMainContainer}>
                                    <div>
                                        <p className={"title2 " + styles.regularTextNoMargin}>@{this.state.name}</p>
                                    </div>
                                    <div>
                                        <p className={styles.regularTextNoMargin + " regularText"}>{sellerRatingStarArray}</p>
                                    </div>
                                </div>
                                <div style={{padding:"20px 0 0 0", minHeight:"100px"}}>
                                    <p className={styles.regularTextNoMargin + " regularTextMedium"}>Member since {new Date(this.state.signupDate).getFullYear()}</p>
                                    <p className={styles.regularTextNoMargin + " regularText"}>{this.state.description}</p>
                                </div>
                            </div>

                            <div className={styles.separatorLine}></div>
                            <p className={styles.regularText + " title2"}>Active listings ({this.state.activeListings.length})</p>
                            <div className={styles.listingCarousel}>
                                {activeListings}
                            </div>

                            {/*<div className={styles.separatorLine}></div>*/}
                            {/*<p className={styles.regularText + " regularTextBold"}>Recent purchases</p>*/}
                            {/*<div className={styles.listingCarousel}>*/}
                            {/*    {recentPurchases}*/}
                            {/*</div>*/}


                            <div className={styles.separatorLine}></div>
                            <p className={styles.regularText + " title2"}>Reviews ({this.state.reviews.length})</p>
                            {reviewsList}
                        </div>
                    </BodyContainer>
                    <Footer />
                    <MobileBottomNav {...this.props} />
                    <DesktopTopNav key={new Date().getTime()} {...this.props} />
                </div>
            );
        }
    }
}

Profile.propTypes = {
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(Profile);