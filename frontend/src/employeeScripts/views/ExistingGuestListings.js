import React from "react";
import { withTranslation } from "react-i18next";
import styles from "../style/employeeStyle.module.css";
import axios from "axios";
import {integerToMoneyString} from "../../miscFunctions";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoading: true,
            listings: [],
            offers:[],
            errorMessage: ""
        }
        this.deleteListing = this.deleteListing.bind(this);
    }

    componentDidMount() {
        axios.get(window.api_prefix+"/getAllGuestListings").then(resp => {
            this.setState({
                listings: resp.data,
                isDataLoading: false
            });
        });

        axios.get(window.api_prefix+"/getGuestOffers").then(resp => {
            this.setState({
                offers: resp.data,
                isDataLoading: false
            });
        });
    }

    deleteListing(key, listingId) {
        axios.post(window.api_prefix+"/deleteGuestListing", { id:  listingId, token: this.props.token }).then(resp => {
            let currentListings = this.state.listings;
            currentListings.splice(key, 1);
            this.setState({
                listings: currentListings
            });
        }).catch(err => {
            if (err.response) {
                this.setState({
                    errorMessage: err.response.data.message
                });
            }
        });
    }

    acceptOffer(key, offerId) {
        axios.post(window.api_prefix+"/declineGuestOffer", { id:  offerId, token: this.props.token }).then(resp => {
            let currentOffers = this.state.offers;
            currentOffers.splice(key, 1);
            this.setState({
                offers: currentOffers
            });
        }).catch(err => {
            if (err.response) {
                this.setState({
                    errorMessage: err.response.data.message
                });
            }
        });
    }
    declineOffer(key, offerId) {
        axios.post(window.api_prefix+"/acceptGuestOffer", { id:  offerId, token: this.props.token }).then(resp => {
            let currentOffers = this.state.offers;
            currentOffers.splice(key, 1);
            this.setState({
                offers: currentOffers
            });
        }).catch(err => {
            if (err.response) {
                this.setState({
                    errorMessage: err.response.data.message
                });
            }
        });
    }
    render() {
        const { t } = this.props;

        if (this.state.isDataLoading == true) {
            return <p>Loading...</p>;
        }
        let listings = <p>No listings to verify</p>;
        if (this.state.listings.length > 0) {
            listings = this.state.listings.map((listing, key) => {
                return (
                    <div key={key} style={{ marginBottom: "50px", border: "1px solid #000", padding: "20px" }}>
                        <p>Listing id: {listing.id}</p>
                        <p>Seller: @{listing.sellername}</p>
                        <p>Type: {listing.title}</p>
                        <button onClick={() => { this.deleteListing(key, listing.id) }}>Delete</button>
                    </div>
                );
            });
        }

        let offers = <p>No offers to accept</p>
        if (this.state.offers.length > 0) {
            offers = this.state.offers.map((offer, key) => {
                return (
                    <div key={key} style={{ marginBottom: "50px", border: "1px solid #000", padding: "20px" }}>
                        <p>offer id: {offer.id}</p>
                        <p>Amount: {integerToMoneyString(offer.amount)}</p>
                        <p>Seller description:</p>
                        <p>@{offer.sellername}</p>
                        <p>{offer.sellerdescription}</p>
                        <button onClick={() => { this.acceptOffer(key, offer.id) }}>Accept</button>
                        <button onClick={() => { this.declineOffer(key, offer.id) }}>Decline</button>
                    </div>
                );
            });
        }
        return (
            <div>
                <div id={styles.articleContainer}>
                    <p className={"megaTitle"}>Guest listings</p>
                    {listings}
                    <p className={"megaTitle"}>Guest listings offers</p>
                    {offers}
                </div>
            </div>

        );
    }
}

export default withTranslation()(Index);
