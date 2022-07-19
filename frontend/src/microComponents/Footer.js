import React from "react";
import styles from 'public/style/footer.module.css';
import { withTranslation } from "react-i18next";
import {Link} from "react-router-dom";
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lang: "fr"
        }
        this.handleLangChange = this.handleLangChange.bind(this);
    }
    componentDidMount() {
        if (localStorage.lang === "fr" || localStorage.lang === "en") {
            this.setState({
                lang: localStorage.lang
            });
        }
    }
    handleLangChange(event) {
        if (typeof (Storage) !== "undefined") {
            if (event.target.value === "en" || event.target.value === "fr") {
                this.props.i18n.changeLanguage(event.target.value);
                localStorage.setItem("lang", event.target.value);
                this.setState({
                    lang: event.target.value
                });
            }
        }
    }
    render() {
        // const { t } = this.props;
        return (
            // <div id={styles.footerContainer}>
            //     {/* <LocaleSelector /> */}
            //     <p className={"regularText"} id={styles.footerText}>
            //         ©{new Date().getFullYear()} {t("hipwork, Inc. All rights reserved.")}
            //     </p>

            //     <select id={styles.langSelect} onChange={this.handleLangChange} value={this.state.lang}>
            //         <option value="en">English</option>
            //         <option value="fr">Français</option>
            //     </select>
            // </div>
            <div id={styles.footer}>
                <div id={styles.footerInnerContainer}>
                    <div className={styles.footerThird}>
                        <p className={"regularTextBold"}>Explore</p>
                        <Link to="/home" className={"regularText"}>Home</Link>
                        <Link to="/login" className={"regularText"}>Login</Link>
                        <Link to="/signup" className={"regularText"}>Signup</Link>
                    </div>
                    <div className={styles.footerThird}>
                        <p className={"regularTextBold"}>About</p>
                        <Link to="/faq" className={"regularText"}>FAQ</Link>
                        <Link to="/home" className={"regularText"}>Terms</Link>
                        <Link to="/home" className={"regularText"}>Privacy policy</Link>
                    </div>
                    <div className={styles.footerThird}>
                        <p className={"regularTextBold"}>Members</p>
                        <Link to="/my-purchases" className={"regularText"}>Buying</Link>
                        <Link to="/my-listings" className={"regularText"}>Selling</Link>
                        <Link to="/new-listing" className={"regularText"}>New listing</Link>
                    </div>
                    <div className={styles.footerThird}>
                        <p className={"regularTextBold"}>Profile</p>
                        <Link to="/following" className={"regularText"}>Following</Link>
                        <Link to="/account" className={"regularText"}>Edit profile</Link>
                    </div>


                    <p className={styles.noMarginText + " body"} style={{ color: "#fff" }}>© {new Date().getFullYear()} Cambio Inc. All Rights Reserved.</p>
                </div>
            </div>
        )
    }
}

export default withTranslation()(Footer);