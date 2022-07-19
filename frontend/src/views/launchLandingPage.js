import React from "react";
import { withTranslation } from "react-i18next";
import styles from "public/style/launchLandingPage.module.css";
import axios from "axios";
import Footer from "microComponents/MvpFooter";
import queryString from "query-string";
import { Helmet } from "react-helmet";


const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


class landingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainInput: "",
            userHasJoined: false,
            joinErrorMessage: "",
            shareLink: "",
            linkIsCopied: false,
            refEmail: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitButton = this.submitButton.bind(this);
        this.copyReferralLink = this.copyReferralLink.bind(this);

        this.linkInput = React.createRef();
    }

    handleInputChange(e) {
        const { value, name } = e.target;
        this.setState({
            [name]: value
        });
    }

    submitButton() {
        this.setState({
            joinErrorMessage: ""
        });
        if (this.state.mainInput.length > 0) {
            if (emailRegex.test(this.state.mainInput) === true) {
                let requestObj = {};
                requestObj.email = this.state.mainInput;
                if (queryString.parse(window.location.search).ref) {
                    requestObj.refToken = queryString.parse(window.location.search).ref;
                }
                axios.post(window.api_prefix+'/addUserToWaitlist', requestObj).then(resp => {
                    let refEmail = "";
                    if (resp.data.referralEmail) {
                        refEmail = resp.data.referralEmail;
                    }
                    this.setState({
                        userHasJoined: true,
                        joinErrorMessage: "",
                        shareLink: "www.joinCambio.com?ref=" + resp.data.shareToken,
                        referralEmail: refEmail
                    });
                }).catch(err => {
                    if (err.response) {
                        if (err.response.status === 403) {
                            this.setState({
                                joinErrorMessage: "This email address is already on our waitlist.",
                                userHasJoined: false
                            });
                        } else {
                            this.setState({
                                joinErrorMessage: "There has been a server error, please try again.",
                                userHasJoined: false
                            });
                        }
                    }
                });
            } else {
                this.setState({
                    joinErrorMessage: "Please enter a valid email address."
                });
            }
        } else {
            this.setState({
                joinErrorMessage: "Please fill in your email address."
            });
        }
    }


    copyReferralLink() {
        if (this.linkInput.current) {
            let input = this.linkInput.current;
            input.select();
            input.setSelectionRange(0, 99999);
            document.execCommand("copy");
            if (window.getSelection) { window.getSelection().removeAllRanges(); }
            else if (document.selection) { document.selection.empty(); }
            this.setState({
                linkIsCopied: true
            });
        }
    }

    render() {

        let inputs;
        if (this.state.userHasJoined === false) {
            let errorMessage;
            if (this.state.joinErrorMessage.length > 0) {
                errorMessage = <p className={"errorText " + styles.regularText}>{this.state.joinErrorMessage}</p>
            }
            inputs = (
                <div>
                    <p className={"regularText " + styles.regularText}>Join our waitlist to be in the first batch of users</p>
                    <input className={"inputText " + styles.input} placeholder="Email address" value={this.state.mainInput} name="mainInput" onChange={this.handleInputChange} type="email"></input>
                    <button id={styles.submitButton} className={"regularTextMedium"} onClick={this.submitButton}>Join</button>
                    <p className={"smallText " + styles.regularText}>Don't worry we won't spam you, promise!</p>
                    {errorMessage}
                </div>
            );
        } else {
            let middleSentence;
            if (this.state.referralEmail.length > 0) {
                middleSentence = <p className={"regularText " + styles.regularText}>Thanks for joining Cambio's waitlist, one referral has been added to {this.state.referralEmail}. <span className={"regularTextBold"}>Refer 5 users </span>and skip the waitlist when we launch!</p>
            } else {
                middleSentence = <p className={"regularText " + styles.regularText}>Thanks for joining Cambio's waitlist. <span className={"regularTextBold"}>Refer 5 users </span>to skip the waitlist when we launch!</p>
            }


            let twitterHref = "https://twitter.com/share?url=" + this.state.shareLink + "&text=Join Cambio's waitlist to purchase affordable pre-owned electronics you can trust.";
            let whatsappHref = "https://wa.me/?text=Join Cambio's waitlist to purchase affordable pre-owned electronics you can trust. " + this.state.shareLink;

            inputs = (
                <div>
                    <p className={"title2 " + styles.regularText}>Hooray!</p>
                    {middleSentence}
                    <div id={styles.mainShareContainer}>
                        <div id={styles.topShareContainer}>
                            <input ref={this.linkInput} readOnly type="text" className={"inputText"} value={this.state.shareLink}></input><button onClick={this.copyReferralLink} className={"regularTextMedium"}>{this.state.linkIsCopied == true ? "Copied" : "Copy"}</button>
                        </div>
                        <div id={styles.bottomShareContainer}>
                            <p className={"regularText"}>Share on:</p>
                            <a href={twitterHref} target="_blank">
                                <img className={styles.shareIcons} src="https://staticassets2020.s3.amazonaws.com/icons/twitter-white.svg" />
                            </a>
                            <a href={whatsappHref} target="_blank">
                                <img className={styles.shareIcons} src="https://staticassets2020.s3.amazonaws.com/icons/whatsapp-white.svg" />
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div id={styles.mainContainer}>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Cambio - Pre-owned electronics you can trust</title>
                    <meta name="description" content="Purchase affordable pre-owned electronics you can trust. No stolen devices. No sketchy transactions. Every pucharse is covered under our buyer's warranty." />

                    <link rel="canonical" href="http://joincambio.com" />
                </Helmet>
                <div id={styles.header}>
                    <a href="https://twitter.com/joinCambio">
                        <svg className={styles.socialIcon} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 72 72" fill="#1da1f2">
                            <path d="M67.812 16.141a26.246 26.246 0 01-7.519 2.06 13.134 13.134 0 005.756-7.244 26.127 26.127 0 01-8.313 3.176A13.075 13.075 0 0048.182 10c-7.229 0-13.092 5.861-13.092 13.093 0 1.026.118 2.021.338 2.981-10.885-.548-20.528-5.757-26.987-13.679a13.048 13.048 0 00-1.771 6.581c0 4.542 2.312 8.551 5.824 10.898a13.048 13.048 0 01-5.93-1.638c-.002.055-.002.11-.002.162 0 6.345 4.513 11.638 10.504 12.84a13.177 13.177 0 01-3.449.457c-.846 0-1.667-.078-2.465-.231 1.667 5.2 6.499 8.986 12.23 9.09a26.276 26.276 0 01-16.26 5.606A26.21 26.21 0 014 55.976a37.036 37.036 0 0020.067 5.882c24.083 0 37.251-19.949 37.251-37.249 0-.566-.014-1.134-.039-1.694a26.597 26.597 0 006.533-6.774z">
                            </path>
                        </svg>
                    </a>
                </div>
                <div id={styles.mainInnerContainer}>
                    <div className={styles.halfDiv}>
                        <img id={styles.logo} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orange.png" />
                        <p className={"title1 " + styles.regularText}>Find affordable pre-owned electronics you can trust.</p>
                        {inputs}
                    </div>
                    <div className={styles.halfDiv}>
                        <img alt="mockup" id={styles.mockupImg} src="https://staticassets2020.s3.amazonaws.com/landingPageAssets/mockup.png" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withTranslation()(landingPage);