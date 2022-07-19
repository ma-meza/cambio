import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "public/style/profileLinks.module.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../reduxActions/authActions";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
class Activity extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div id={styles.pageBody}>
                <div id={styles.topBar}>
                    <p className={"title2"}>Activity</p>
                </div>
                <div id={styles.mainBody}>
                    <p className={styles.emptyStateMessageP + " regularTextMedium"}>No transactions activity yet.</p>
                </div>
                <MobileBottomNav {...this.props} />
            </div>
        );
    }
}


export default Activity;