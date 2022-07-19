import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "public/style/listingCard.module.css";
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
            isLoading: true
        }
    }

    componentDidMount() {
        this.setState({
            listing: this.props.listing,
            isLoading: false
        });
    }


    render() {
        const { t } = this.props;
        if (this.state.isLoading === true) {
            return null;
        } else {

            let conditionsOptionsArray = [
                {
                    id: 0,
                    name: "New",
                    color:"#ff7700"
                },
                {
                    id: 1,
                    name: "Like new",
                    color:"#ff7700"
                },
                {
                    id: 2,
                    name: "Lightly used",
                    color:"#ff7700"
                },
                {
                    id: 3,
                    name: "Used",
                    color:"#ff7700"
                },
                {
                    id: 4,
                    name: "Broken",
                    color:"#ff7700"
                },
                {
                    id: 5,
                    name: "For parts",
                    color:"#ff7700"
                }
            ];

            let avgRating;
            if (this.state.listing.avgrating == 0 || this.state.listing.avgrating == null || typeof this.state.listing.avgrating == "undefined") {
                avgRating = "No ratings yet.";
            }else{
                avgRating = [];
                let rating = this.state.listing.avgrating;
                let nbFullStars = Math.floor(rating);
                for(let i = 0;i<nbFullStars;i++){
                    avgRating.push(
                        <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow.svg"} />
                    );
                }
                if(nbFullStars != rating){
                    avgRating.push(
                        <img src={"https://staticassets2020.s3.amazonaws.com/octiconsSvg/star-yellow-half.svg"} />
                    );
                }
            }
            return (
                <div id={styles.mainContainer}>
                    <Link to={"/listing?id=" + this.state.listing.id}>
                        <div className={styles.mainDivisors}>
                            <div id={styles.productPicture} style={{ backgroundImage: !this.state.listing.pictures || this.state.listing.pictures.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/image.svg')" : "url('" + this.state.listing.pictures[0] + "')" }}>
                                {/*<p className={"regularTextMedium "+styles.mediumBigText}>{integerToMoneyString(this.state.listing.price)} • <span style={{color:"grey"}} className={"regularText"}>{conditionsOptionsArray[this.state.listing.condition].name}</span></p>*/}
                                <div id={styles.itemStateContainer} style={{backgroundColor:conditionsOptionsArray[this.state.listing.condition].color}}><p className={"regularText"}>{conditionsOptionsArray[this.state.listing.condition].name}</p></div>
                            </div>
                        </div>
                        <div className={styles.mainDivisors}>
                            <div id={styles.productTextContainer}>
                                <div style={{minHeight:"90px"}}>
                                    <p className={"regularTextMedium "+styles.listingTitle}>{this.state.listing.title}</p>
                                    <p id={styles.priceP} className={"regularTextMedium"}>{integerToMoneyString(this.state.listing.price)}</p>
                                </div>

                                <div className={styles.userInfoDivisor}>
                                    <div id={styles.userPicture} style={{
                                        backgroundImage: !this.state.listing.sellerprofilepicture || this.state.listing.sellerprofilepicture.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg')" : "url('" + this.state.listing.sellerprofilepicture + "')"
                                    }}></div>
                                    <Link to={"/user?id=" + this.state.listing.sellerid}>
                                        <div id={styles.userTextContainer}>
                                            <p className={styles.noMarginP + " regularTextMedium"}>@{this.state.listing.sellername}</p>
                                            {/*<div><p className={styles.noMarginP + " regularText"} id={styles.starP} style={{ color: "#f9f9f9" }}>{avgRating}</p></div>*/}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        }
    }
}


export default withTranslation()(Index);
