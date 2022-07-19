import React from "react";
import { withTranslation } from "react-i18next";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/saved.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import queryString from "query-string";
import BodyContainer from "microComponents/BodyContainer";
import Body from "microComponents/BodyContainer";
import { integerToMoneyString } from "miscFunctions";


let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

class Instructions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservationDetails: {},
            dataIsLoading: true,
            sellerEmail: ""
        }
    }

    componentDidMount() {
        let reservationId;
        if (queryString.parse(window.location.search).tra_id) {
            reservationId = queryString.parse(window.location.search).tra_id;
            axios.get(window.api_prefix+"/reservationDetails?id=" + reservationId).then(resp => {

                for (let i = 0; i < resp.data.otherDetails.length; i++) {
                    if (resp.data.otherDetails[i].rows[0].price) {
                        resp.data.details.buynowprice = resp.data.otherDetails[i].rows[0].price;
                    }
                    if (resp.data.otherDetails[i].rows[0].selleremail) {
                        resp.data.details.selleremail = resp.data.otherDetails[i].rows[0].selleremail;
                    }
                }
                console.log(resp.data);
                this.setState({
                    dataIsLoading: false,
                    reservationDetails: resp.data.details,
                    sellerEmail: resp.data.sellerEmail,
                });
            }).catch((err) => {
                if (err.response) {
                    this.props.history.push("/");
                }
            });
        } else {
            this.props.history.push("/");
        }
    }

    render() {
        if (this.state.dataIsLoading === true) {
            return (<p>Loading...</p>);
        }
        let endTimeStamp = new Date(this.state.reservationDetails.timestamp);
        endTimeStamp.setMinutes(endTimeStamp.getMinutes() + 20);
        let niceMinutes = endTimeStamp.getMinutes();
        if (niceMinutes < 10) {
            niceMinutes = "0" + niceMinutes;
        }
        let niceHours = endTimeStamp.getHours();
        if (niceHours < 10) {
            niceHours = "0" + niceHours;
        }

        let amount = this.state.reservationDetails.amount;
        if (amount == null) {
            amount = integerToMoneyString(this.state.reservationDetails.buynowprice);
        } else {
            amount = integerToMoneyString(amount);
        }
        let niceDateString = monthNames[endTimeStamp.getMonth()] + " " + endTimeStamp.getDate() + ", " + endTimeStamp.getFullYear() + " at " + niceHours + ":" + niceMinutes;
        return (
            <div>
                <BodyContainer>
                    <div id={styles.topMainContainer}>
                        <div className={styles.innerMainContainer}>
                            <p ref={this.savedListingsRef} className={styles.sectionTitleP + " title1"}>Payment instructions</p>
                            <p className={styles.sectionTitleP + " regularText"}>Your purchase is not yet confirmed! Kindly send a payment of {amount} through Paypal to {this.state.reservationDetails.selleremail} before {niceDateString}. Otherwise after that time, the listing will be put back for sale and you won't be able to re-purchase it.</p>
                        </div>
                    </div>
                </BodyContainer>
                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
            </div>
        );
    }
}


export default withTranslation()(Instructions);
