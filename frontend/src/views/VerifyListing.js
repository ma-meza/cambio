import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/saved.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import SpecialCard from "microComponents/SpecialListingCard.js";
import BodyContainer from "microComponents/BodyContainer";
import Body from "microComponents/BodyContainer";
import Modal from "microComponents/Modal.js";
import ReviewsCard from "microComponents/ReviewsCard.js";
import Spinner from "microComponents/LoaderAnimation";
import Snackbar from "microComponents/SnackBar.js";
import queryString from "query-string";

class VerifyListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listingId: 0,
            verificationTimestamp: 0,
            username: "",
            isLoading: true,
            formError: "",
            picture: null,
            isUploadingPic: false
        }

        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.removePicture = this.removePicture.bind(this);
        this.submitVerification = this.submitVerification.bind(this);

        this.pictureInputRef = React.createRef();

        this.snackbarRef = React.createRef();
    }

    componentDidMount() {

        if (queryString.parse(window.location.search).id) {
            let listingId = queryString.parse(window.location.search).id;

            axios.get(window.api_prefix+"/listingVerifCode?id=" + listingId).then(resp => {
                console.log(resp.data);
                this.setState({
                    listingId: listingId,
                    verificationTimestamp: resp.data.verificationTimestamp,
                    username: resp.data.username,
                    isLoading: false
                });
            }).catch();
        } else {
            this.props.history.push("/my-listings?activeTab=1");
        }
    }

    removePicture() {
        this.setState({
            picture: null
        });
        this.pictureInputRef.current.value = null;

    }

    handleImageUpload(e) {
        let currentPicture = this.state.picture;
        if (currentPicture == null) {
            let file = e.target.files;
            try {
                if (!file) {
                    throw new Error('Select a file first!');
                }
                const formData = new FormData();
                formData.append('file', file[0]);
                this.setState({
                    isUploadingPic: true
                });
                axios.post(window.api_prefix+`/uploadListingVerification`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(resp => {
                    this.setState({
                        picture: resp.data.Location,
                        isUploadingPic: false
                    });
                });

                this.pictureInputRef.current.value = null;
            } catch (error) {
                this.setState({
                    formError: "There has been a server error, please try again.",
                    isUploadingPic: false
                });
            }
        } else {
            this.setState({
                formError: "Please remove your picture before uploading it again.",
                isUploadingPic: false
            });
        }
    }

    submitVerification() {
        if (this.state.picture != null) {
            this.setState({
                isUploadingPic: true
            });
            axios.post(window.api_prefix+"/submitListingVerification", { picture: this.state.picture, listingId: this.state.listingId }).then(resp => {
                this.props.history.push("/my-listings?activeTab=1");
            }).catch((err) => {
                if (err.response) {
                    this.setState({
                        formError: "There has been a server error, please try again.",
                        isUploadingPic: false
                    });
                }
            }
            );
        } else {
            this.setState({
                formError: "Please upload your picture.",
                isUploadingPic: false
            });
        }
    }
    render() {
        const { t } = this.props;
        if (this.state.isLoading == true) {
            return (
                <div>
                    <BodyContainer>
                        <div className={styles.innerMainContainer}>
                            Loading...
                        </div>
                    </BodyContainer>

                    <Footer />
                    <MobileBottomNav {...this.props} />
                    <DesktopTopNav key={new Date().getTime()} {...this.props} />
                </div>
            );
        }

        let picturePreviews;
        if (this.state.picture != null) {
            picturePreviews = (
                <div className={styles.pictureSquare} onClick={() => this.removePicture()} style={{ backgroundImage: "url('" + this.state.picture + "')" }}>
                    <div>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
                    </div>
                </div>
            );
        }

        return (
            <div>
                <BodyContainer>
                    <div className={styles.innerMainContainer}>
                        <p ref={this.activeOffersRef} className={styles.sectionTitleP + " title1 "}>Let's verify your listing.</p>
                        <p ref={this.activeOffersRef} className={styles.sectionTitleP + " regularText"}>Please upload a picture showing your item and a paper where you will have written your username <span className="regularTextBold">@{this.state.username}</span> and the numbers <span className="regularTextBold">{this.state.verificationTimestamp}</span>.</p>
                        {picturePreviews}
                        {
                            this.state.picture == null ?
                                <label id={styles.fileInputLabel} htmlFor={styles.fileInput}>
                                    <div>
                                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/plus.svg" />
                                    </div>
                                </label>
                                :
                                null
                        }
                        <div className={styles.paddedContainer}>
                            <input id={styles.fileInput} onChange={this.handleImageUpload} ref={this.pictureInputRef} type="file" accept=".jpg, .jpeg, .png, .svg"></input>
                            <button className={styles.ctaButton + " buttonCta"} onClick={this.submitVerification}>Submit</button>
                            <p>{this.state.formError}</p>
                        </div>
                    </div>
                </BodyContainer>

                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
                {
                    this.state.isUploadingPic == true ?
                        <Spinner />
                        :
                        null
                }
                <Snackbar ref={this.snackbarRef} />
            </div>
        );
    }
}


export default withTranslation()(VerifyListing);
