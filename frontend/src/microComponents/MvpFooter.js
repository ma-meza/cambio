import React from "react";
import styles from 'public/style/mvpFooter.module.css';
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        // const { t } = this.props;
        return (
            <div id={styles.footer}>
                <ul>
                    <Link to="/">
                        <li className={"regularText " + styles.regularText + " " + styles.link}>Home</li>
                    </Link>
                    <Link to="/about-us">
                        <li className={"regularText " + styles.regularText + " " + styles.link}>About us</li>
                    </Link>
                    <a href="mailto: contact@cambio.com" style={{ textDecoration: "none" }}>
                        <li className={"regularText " + styles.regularText}>contact@joincambio.com</li>
                    </a>
                    <li className={"regularText " + styles.regularText}>© Copyright Cambio {new Date().getFullYear()}</li>
                </ul>
            </div>
        )
    }
}

export default withTranslation()(Footer);

