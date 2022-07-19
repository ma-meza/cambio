import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "public/style/specialListingCard.module.css";
import { integerToMoneyString } from "miscFunctions";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            displayAccountModel: false,
            searchSuggestions: [],
            historyEvents: [],
            listing: {},
            isLoading: true,
            cardType: "offer" //offer, purchase, 
        }
    }

    componentDidMount() {
        this.setState({
            listing: this.props.listing,
            isLoading: false,
            cardType: this.props.cardType
        });
    }

    render() {
        const { t } = this.props;
        if (this.state.isLoading === true) {
            return null;
        } else {
            console.log(this.state.listing);
            if (this.state.cardType === "waiting-payment") {
                let fullDate = new Date(this.state.listing.timestamp);
                fullDate.setDate(fullDate.getDate() + 4);
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let limitDate = months[fullDate.getMonth()] + " " + fullDate.getDate();
                return (
                    <div className={styles.historyCardContainer}>
                        <div id={styles.historyTopContainer}>
                            <div style={{ backgroundImage: this.state.listing.pictures[0] && this.state.listing.pictures[0].length > 0 ? "url('" + this.state.listing.pictures[0] + "')" : "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/image.svg')" }} className={styles.listingMainPicture}></div>
                            <div className={styles.historyTitleContainer}>
                                <p className={"title2 " + styles.regularText}>{this.state.listing.title}</p>
                                <p className={"regularText " + styles.regularText}>Pay before {limitDate}</p>
                            </div>
                        </div>
                        <div id={styles.historyTotalContainer}>
                            <p className={"regularText " + styles.regularText}>Waiting for your response</p>
                            <p className={"regularTextBold " + styles.regularText}>Accepted price: {integerToMoneyString(this.state.listing.amount)}</p>
                        </div>
                        <div id={styles.historyBottomContainer}>
                            <button className={styles.historyHalfCta + ' regularTextMedium'} onClick={() => {
                                this.props.loadSpinner();
                                axios.post(window.api_prefix+"/reserveProduct", { listingId: this.state.listing.listingid, buyNow: false, offerId: this.state.listing.offerid }).then(resp => {
                                    this.props.removeLoadSpinner();
                                    this.props.history.push("/payment-details?tra_id=" + resp.data.reservationId);
                                }).catch(err => {
                                    this.props.removeLoadSpinner();
                                    this.props.showErrorSnackbar();
                                });
                            }}>Pay now</button>
                        </div>
                    </div>
                );
            } else if (this.state.cardType === "offer") {
                let fullDate = new Date(this.state.listing.timestamp);
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let offerDate = months[fullDate.getMonth()] + " " + fullDate.getDate() + ", " + fullDate.getFullYear();
                return (
                    <div className={styles.historyCardContainer}>
                        <div id={styles.historyTopContainer}>
                            <div style={{ backgroundImage: this.state.listing.pictures[0] && this.state.listing.pictures[0].length > 0 ? "url('" + this.state.listing.pictures[0] + "')" : "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/image.svg')" }} className={styles.listingMainPicture}></div>
                            <div className={styles.historyTitleContainer}>
                                <p className={"title2 " + styles.regularText}>{this.state.listing.title}</p>
                                <p className={"regularText " + styles.regularText}>{offerDate}</p>

                            </div>
                        </div>
                        <div id={styles.historyTotalContainer}>
                            <p className={"regularText " + styles.regularText}>Waiting for your response</p>
                            <p className={"regularTextBold " + styles.regularText}>Current offer: {integerToMoneyString(this.state.listing.amount)}</p>
                        </div>
                        <div id={styles.historyBottomContainer}>
                            <div id={styles.historySellerInfoContainer}>
                                <div id={styles.historySellerPicture} style={{
                                    backgroundImage: !this.state.listing.profilepicture || this.state.listing.profilepicture.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg')" : "url('" + this.state.listing.profilepicture + "')"
                                }}></div>
                                <p className={"regularText"}>{this.state.listing.sendername}</p>
                            </div>
                            <Link>
                                <button className={styles.historyHalfCta + ' regularTextMedium'} onClick={this.props.acceptOffer}>Accept</button>
                                <button className={styles.historyHalfCta + ' regularTextMedium'} onClick={this.props.declineOffer}>Decline</button>
                                <button className={styles.historyHalfCta + ' regularTextMedium'} onClick={this.props.counterOffer}>Counter offer</button>
                            </Link>
                        </div>
                    </div>
                );
            } else if (this.state.cardType === "offer-to-me") {
                let fullDate = new Date(this.state.listing.timestamp);
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let offerDate = months[fullDate.getMonth()] + " " + fullDate.getDate() + ", " + fullDate.getFullYear();
                return (
                    <div className={styles.historyCardContainer}>
                        <div id={styles.historyTopContainer}>
                            <div style={{ backgroundImage: this.state.listing.pictures[0] && this.state.listing.pictures[0].length > 0 ? "url('" + this.state.listing.pictures[0] + "')" : "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/image.svg')" }} className={styles.listingMainPicture}></div>
                            <div className={styles.historyTitleContainer}>
                                <p className={"title2 " + styles.regularText}>{this.state.listing.title}</p>
                                <p className={"regularText " + styles.regularText}>{offerDate}</p>
                            </div>
                        </div>
                        <div id={styles.historyTotalContainer}>
                            <p className={"regularText " + styles.regularText}>Waiting for your response</p>
                            <p className={"regularTextBold " + styles.regularText}>Current offer: {integerToMoneyString(this.state.listing.amount)}</p>
                        </div>
                        <div id={styles.historyBottomContainer}>
                            <div id={styles.historySellerInfoContainer}>
                                <div id={styles.historySellerPicture} style={{
                                    backgroundImage: !this.state.listing.profilepicture || this.state.listing.profilepicture.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg')" : "url('" + this.state.listing.profilepicture + "')"
                                }}></div>
                                <p className={"regularText"}>{this.state.listing.sendername}</p>
                            </div>
                            <Link>
                                <button className={styles.historyHalfCta + ' regularTextMedium'}>Accept</button>
                                <button className={styles.historyHalfCta + ' regularTextMedium'}>Decline</button>
                            </Link>
                        </div>
                    </div>
                );
            } else if (this.state.cardType === "purchase") {
                let fullDate = new Date(this.state.listing.timestamp);
                let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                let purchaseDate = months[fullDate.getMonth()] + " " + fullDate.getDate() + ", " + fullDate.getFullYear();
                let purchasePrice = this.state.listing.buynowprice;
                if (this.state.listing.offeramount) {
                    purchasePrice = this.state.listing.offeramount;
                }
                return (
                    <div className={styles.historyCardContainer}>
                        <div id={styles.historyTopContainer}>
                            <div style={{ backgroundImage: this.state.listing.pictures[0] && this.state.listing.pictures[0].length > 0 ? "url('" + this.state.listing.pictures[0] + "')" : "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/image.svg')" }} className={styles.listingMainPicture}></div>
                            <div className={styles.historyTitleContainer}>
                                <p className={"title2 " + styles.regularText}>{this.state.listing.title}</p>
                                <p className={"regularText " + styles.regularText}>{purchaseDate}</p>
                            </div>
                        </div>
                        <div id={styles.historyTotalContainer}>
                            {/* <p className={"regularText " + styles.regularText}>Received</p> */}
                            <p className={"regularTextBold " + styles.regularText}>Total: {integerToMoneyString(purchasePrice)}</p>
                            <p className={"regularText " + styles.regularText}>Generating receipt...</p>
                        </div>
                        <div id={styles.historyBottomContainer}>
                            <Link to={"/user?id=" + this.state.listing.sellerid}>
                                <div id={styles.historySellerInfoContainer}>
                                    <div id={styles.historySellerPicture} style={{
                                        backgroundImage: !this.state.listing.profilepicture || this.state.listing.profilepicture.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg')" : "url('" + this.state.listing.profilepicture + "')"
                                    }}></div>
                                    <p className={"regularText"}>{this.state.listing.name}</p>
                                </div>
                            </Link>
                            <Link>
                                {
                                    this.state.listing.issellerreviewed == true ?
                                        null
                                        :
                                        <button className={styles.historyCta + ' regularTextMedium'} onClick={this.props.reviewSeller}>Review seller</button>
                                }
                            </Link>
                        </div>
                    </div>
                );
            } else {
                return null;
            }
        }
    }
}


export default withTranslation()(Index);
