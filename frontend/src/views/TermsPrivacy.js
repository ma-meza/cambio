import React from "react";
import { withTranslation } from "react-i18next";
import styles from "public/style/aboutUs.module.css";
import Footer from "microComponents/MvpFooter";
class aboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }


    render() {

        return (
            <div id={styles.mainContainer}>

                <div id={styles.header}>
                    <a href="https://twitter.com">
                        <svg className={styles.socialIcon} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 72 72" fill="#1da1f2">
                            <path d="M67.812 16.141a26.246 26.246 0 01-7.519 2.06 13.134 13.134 0 005.756-7.244 26.127 26.127 0 01-8.313 3.176A13.075 13.075 0 0048.182 10c-7.229 0-13.092 5.861-13.092 13.093 0 1.026.118 2.021.338 2.981-10.885-.548-20.528-5.757-26.987-13.679a13.048 13.048 0 00-1.771 6.581c0 4.542 2.312 8.551 5.824 10.898a13.048 13.048 0 01-5.93-1.638c-.002.055-.002.11-.002.162 0 6.345 4.513 11.638 10.504 12.84a13.177 13.177 0 01-3.449.457c-.846 0-1.667-.078-2.465-.231 1.667 5.2 6.499 8.986 12.23 9.09a26.276 26.276 0 01-16.26 5.606A26.21 26.21 0 014 55.976a37.036 37.036 0 0020.067 5.882c24.083 0 37.251-19.949 37.251-37.249 0-.566-.014-1.134-.039-1.694a26.597 26.597 0 006.533-6.774z">
                            </path>
                        </svg>
                    </a>
                </div>
                <div id={styles.mainInnerContainer}>
                    <div className={styles.halfDiv}>
                        <p className={"title2"} id={styles.headlineText}>Terms and conditions</p>
                        <p className={"regularText " + styles.regularText} id={styles.headlineText}>terms and conditions</p>

                        <p className={"title2"} id={styles.headlineText}>Privacy policy</p>
                        <p className={"regularText " + styles.regularText} id={styles.headlineText}>Privacy policy</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}

export default withTranslation()(aboutUs);