import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/saved.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import ListingCard from "microComponents/ListingCardSmallCard.js";
class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            savedListings: []
        }
    }

    componentDidMount() {
        this.setState({
            savedListings: [
                {
                    title: "iPhone 8 64GB - black",
                    condition: "Like new",
                    price: 330,
                    seller: {
                        username: "John Doe",
                        rating: 3.5,
                        nbRatings: 7
                    }
                },
                {
                    title: "iPhone 8 64GB - black",
                    condition: "Like new",
                    price: 330,
                    seller: {
                        username: "John Doe",
                        rating: 3.5,
                        nbRatings: 7
                    }
                },
                {
                    title: "iPhone 8 64GB - black",
                    condition: "Like new",
                    price: 330,
                    seller: {
                        username: "John Doe",
                        rating: 3.5,
                        nbRatings: 7
                    }
                }
            ]
        });
    }

    render() {
        const { t } = this.props;


        let savedListings = <p>No listings.</p>
        if (this.state.savedListings.length > 0) {
            savedListings = this.state.savedListings.map((listing, key) => {
                return (
                    <ListingCard key={key} listing={listing} />
                );
            });
        }


        return (
            <div>




                <div id={styles.topMainContainer}>
                    <div className={styles.innerMainContainer}>
                        <p ref={this.savedListingsRef} className={styles.sectionTitleP + " title1 "}>Saved listings</p>
                        {savedListings}
                    </div>
                </div>

                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
            </div>
        );
    }
}


export default withTranslation()(Saved);
