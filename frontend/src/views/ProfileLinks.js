import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "public/style/profileLinks.module.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../reduxActions/authActions";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
class ProfileLinks extends React.Component {
    constructor() {
        super();
        this.state = {
            userName: "",
            profilePicture: ""
        }
    }

    componentDidMount() {
        axios.get(window.api_prefix+"/loggedInUserProfile").then(resp => {
            this.setState({
                userName: resp.data.name,
                profilePicture: resp.data.profilepicture
            });
        });
    }

    render() {
        return (
            <div id={styles.pageBody}>
                <div id={styles.topBar}>
                    <div style={{
                        backgroundImage: !this.state.profilePicture || this.state.profilePicture.length == 0 ? "url('https://staticassets2020.s3.amazonaws.com/octiconsSvg/smiley.svg')" : "url('" + this.state.profilePicture + "')"
                    }}></div>
                    <p className={"regularTextMedium"}>@{this.state.userName}</p>
                </div>
                <div id={styles.mainBody}>
                    <Link to="/new-listing">
                        <p className={"regularTextMedium"}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/diff-added.svg" />Create a listing</p>
                    </Link>
                    <Link to="/my-purchases">
                        <p className={"regularTextMedium"}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/tag.svg" />Buying</p>
                    </Link>
                    <Link to="/my-listings">
                        <p className={"regularTextMedium"}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/list-unordered.svg" />Selling</p>
                    </Link>
                    <Link to="/account">
                        <p className={"regularTextMedium"}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/person.svg" />Edit profile</p>
                    </Link>
                    <Link to="/following">
                        <p className={"regularTextMedium"}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/people.svg" />Following</p>
                    </Link>
                    <Link to="/faq">
                        <p className={"regularTextMedium"}><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/unverified.svg" />FAQ</p>
                    </Link>
                    <p className={"regularText"}>About</p>
                    <p className={"regularText"}>Contact: contact@joincambio.com</p>
                </div>
                <div id={styles.bottomBar} onClick={this.props.logoutUser}>
                    <p className={"regularText"} >Logout</p>
                </div>
                <MobileBottomNav {...this.props} />
            </div>
        );
    }
}


ProfileLinks.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(ProfileLinks);