import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/account.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username:"",
            bio: "",
            profilePicture: null,
            bioInput: "",
            profilePictureInput: null,
            profilePicturePreview: "",
            shippingAddress:"",
            shippingInput:""
        }
        this.pictureInputRef = React.createRef();

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.removePicture = this.removePicture.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    componentDidMount() {
        axios.get(window.api_prefix+"/loggedInUserProfile").then((res) => {
            let info = res.data;
            let profilePic = info.profilepicture ? info.profilepicture : null;
            this.setState({
                username:info.name,
                profilePicture: profilePic,
                bio: info.bio ? info.bio : "",
                profilePictureInput: profilePic,
                profilePicturePreview: profilePic,
                bioInput: info.bio ? info.bio : "",
                shippingInput: info.shippingaddress ? info.shippingaddress:"",
                shippingAddress: info.shippingaddress ? info.shippingaddress:""
            });
        }).catch((err) => {
            if (err.response) {
                this.setState({
                    dataIsLoading: false,
                    errorMessage: err.response.data.message
                });
            }
        });
    }

    saveChanges(e) {
        let reqObj = {};
        if (this.state.bio != this.state.bioInput) {
            reqObj.bio = this.state.bioInput;
        }
        if(this.state.shippingAddress != this.state.shippingInput){
            reqObj.shippingAddress = this.state.shippingInput;
        }
        this.setState((prevState) => ({
            bio: prevState.bioInput,
            shippingAddress: prevState.shippingInput
        }));
        axios.post(window.api_prefix+"/updateProfile", reqObj).then(resp => {

        }).catch(err => {

        });
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    removePicture() {
        this.setState({
            profilePictureInput: null,
            profilePicturePreview: ""
        });
        axios.post(window.api_prefix+"/removeProfilePicture").then(resp => {

        }).catch(err => {

        });
    }

    handleImageUpload(e) {
        let file = e.target.files;

        try {
            if (!file) {
                throw new Error('Select a file first!');
            }
            const formData = new FormData();
            formData.append('file', file[0]);
            axios.post(window.api_prefix+`/uploadProfilePicture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(resp => {
                console.log(resp);
            });
            this.setState({
                profilePictureInput: this.pictureInputRef.current.files[0],
                profilePicturePreview: URL.createObjectURL(this.pictureInputRef.current.files[0])
            });
            this.pictureInputRef.current.value = null;
        } catch (error) {
            // handle error
        }
    }

    componentWillUnmount() {
        window.onscroll = undefined;
        document.onclick = undefined;
    }

    render() {
        const { t } = this.props;

        let profilePictureDiv;
        if (this.state.profilePictureInput != null) {
            profilePictureDiv = (
                <div>
                    <label style={{ display: "inline-block", position: "relative", verticalAlign: "middle" }} htmlFor={styles.fileInput}>
                        <div className={styles.pictureSquare} style={{ backgroundImage: "url('" + this.state.profilePicturePreview + "')" }}>
                            <div>
                                <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/pencil.svg" />
                            </div>
                        </div>
                    </label>
                    <button id={styles.deletePicButton} className={"regularTextMedium buttonCta"} onClick={this.removePicture}>Delete picture</button>
                </div>

            );
        } else {
            profilePictureDiv = (
                <div>
                    <label id={styles.fileInputLabel} htmlFor={styles.fileInput}>
                        <div>
                            <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/plus.svg" />
                        </div>
                    </label>
                </div>
            );
        }

        let saveButton;
        if (this.state.bio !== this.state.bioInput || this.state.shippingInput != this.state.shippingAddress) {
            saveButton = (
                <div id={styles.saveButtonContainer}>
                    <button className={"buttonCta"} onClick={this.saveChanges}>Save changes</button>
                </div>
            );
        }
        return (
            <div>
                <div id={styles.topMainContainer}>
                    <div className={styles.innerMainContainer}>
                        <div className={styles.listingComponentsMainContainer}>
                            <p className={styles.regularText + " title1"}>Edit @{this.state.username}'s profile</p>
                        </div>

                        <div className={styles.listingComponentsMainContainer}>
                            <p className={"regularText " + styles.regularText}>Your profile picture</p>
                            {profilePictureDiv}
                            <input id={styles.fileInput} onChange={this.handleImageUpload} ref={this.pictureInputRef} type="file" accept=".jpg, .jpeg, .png, .svg"></input>

                        </div>
                        <div className={styles.listingComponentsMainContainer}>
                            <p className={"regularText " + styles.regularText}>Default shipping address</p>
                            <input type={"text"} onChange={this.handleInputChange} name="shippingInput" className={"regularText inputText"} id={styles.regularTextInput} value={this.state.shippingInput}></input>

                            <p className={"regularText " + styles.regularText}>Your bio</p>
                            <textarea onChange={this.handleInputChange} name="bioInput" className={"regularText inputText"} id={styles.bioTextarea} value={this.state.bioInput}></textarea>
                        </div>
                        {saveButton}
                    </div>
                </div>

                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
            </div>
        );
    }
}


export default withTranslation()(Profile);
