import React from "react";
import { withTranslation } from "react-i18next";
import styles from "../style/employeeStyle.module.css";
import axios from "axios";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoading: true,
            listings: [],
            errorMessage: ""
        }
        this.verifyListing = this.verifyListing.bind(this);
    }

    componentDidMount() {
        axios.get(window.api_prefix+"/allListingsToVerify").then(resp => {
            this.setState({
                listings: resp.data,
                isDataLoading: false
            });
        });
    }

    verifyListing(key, listingId, decision) {
        axios.post(window.api_prefix+"/verifyListing", { update: { decision: decision, listingId: listingId }, token: this.props.token }).then(resp => {
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
                        <img style={{ height: "200px" }} src={listing.verificationpicture} />
                        <p>Listing id: {listing.id}</p>
                        <p>Type: {listing.title}</p>
                        <p>Paper must contain @{listing.sellerusername} and token {listing.verificationtimestamp}</p>
                        <button onClick={() => { this.verifyListing(key, listing.id, 3) }}>Accept</button>
                        <button onClick={() => { this.verifyListing(key, listing.id, 2) }}>Decline</button>
                    </div>
                );
            });
        }
        return (
            <div>
                <div id={styles.articleContainer}>
                    <p className={"megaTitle"}>Verify listings</p>
                    {listings}
                </div>
            </div>

        );
    }
}

export default withTranslation()(Index);
