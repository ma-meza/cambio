import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "public/style/desktopTopNav.module.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../reduxActions/authActions";
import Modal from "microComponents/Modal.js";
import LoginCard from "microComponents/LoginCard.js";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            displayAccountModel: false,
            searchSuggestions: [],
            showProfileModal: false,
            allowClickOutsideProfileModal: true,
            isLoginModalDisplayed: false,
            showSearchSuggestion: false
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.closeSearchInput = this.closeSearchInput.bind(this);


        this.searchSuggestModalRef = React.createRef();
        this.searchInputRef = React.createRef();
        this.searchInputDivRef = React.createRef();
        this.profileModalRef = React.createRef();
    }
    componentDidMount() {
        if ((this.props.auth.isAuthenticated == true) && !(localStorage.getItem("setupVerif") == "true")) {
            this.props.history.push("/account-setup");
        }
        document.onclick = (e) => {
            if (this.searchInputRef.current && this.searchInputDivRef.current) {


                if (this.searchSuggestModalRef.current) {
                    //search suggest is active
                    if (e.target !== this.searchInputRef.current && e.target !== this.searchSuggestModalRef.current && e.target.id !== styles.iconTopMobileNav && !e.target.classList.contains(styles.searchSuggestP) && e.target !== this.searchInputDivRef.current) {
                        this.closeSearchInput();
                    }
                } else {
                    if (e.target !== this.searchInputRef.current && e.target.id !== styles.iconTopMobileNav && e.target !== this.searchInputDivRef.current) {
                        this.closeSearchInput();
                    }
                }
            }
            if (this.state.allowClickOutsideProfileModal === false && this.profileModalRef.current && e.target !== this.profileModalRef.current) {
                this.setState({
                    showProfileModal: false,
                    allowClickOutsideProfileModal: true
                });
            }
        }

        document.onresize = (e) => {
            if (this.searchSuggestModalRef.current) {
                let leftValue = this.searchInputDivRef.current.offsetLeft;
                let widthValue = this.searchInputDivRef.current.offsetWidth;
                this.searchSuggestModalRef.style.left = leftValue;
                this.searchSuggestModalRef.style.width = widthValue;
            }
        }
    }
    componentWillUnmount() {
        document.onclick = undefined;
        document.onresize = undefined;
    }
    closeSearchInput() {
        this.searchInputDivRef.current.classList.remove(styles.searchInputActive);
        this.setState({
            searchSuggestions: [],
            showSearchSuggestion: false
        });
    }
    handleInputChange(e) {
        const { name, value } = e.target;

        this.setState({
            [name]: value
        });

        if (name === "searchInput") {
            if (value.length == 0) {
                this.setState({
                    searchSuggestions: [],
                    showSearchSuggestion: false
                });
            } else {
                axios.get(window.api_prefix+"/searchQuerySuggest?q="+value).then(resp=>{
                    this.setState({
                        searchSuggestions: resp.data,
                        showSearchSuggestion: true
                    });
                }).catch(err=>{
                    if(err.response){
                        this.setState({
                            searchSuggestions: [],
                            showSearchSuggestion: true
                        });
                    }
                });
            }
        }
    }


    render() {
        const { t } = this.props;
        let searchSuggestArray = [];
        let searchSuggest;

        if (this.searchInputDivRef.current && this.state.showSearchSuggestion) {
            let leftValue = this.searchInputDivRef.current.offsetLeft;
            let widthValue = this.searchInputDivRef.current.offsetWidth;
            if ((this.state.searchSuggestions.categories.length > 0 || this.state.searchSuggestions.predefItems.length >0) && this.state.searchInput.length > 0) {
                let nbCategories = this.state.searchSuggestions.categories.length;
                for (let i = 0; i < this.state.searchSuggestions.predefItems.length && nbCategories+i <= 6; i++) {
                    searchSuggestArray.push(
                        <p onClick={()=>{this.props.history.push("/search?predefType="+this.state.searchSuggestions.predefItems[i].id); this.props.history.go();}} className={styles.searchSuggestP} key={i + "_-1"}>{this.state.searchSuggestions.predefItems[i].title}</p>
                    );
                }
                for(let i = 0; i < nbCategories; i++){
                    searchSuggestArray.push(
                        <p onClick={()=>{this.props.history.push("/search?cat="+this.state.searchSuggestions.categories[i].id); this.props.history.go();}} className={styles.searchSuggestP} key={i + "_-2"}>{this.state.searchSuggestions.categories[i].name}</p>
                    );
                }


                searchSuggest = (
                    <div ref={this.searchSuggestModalRef} style={{ left: leftValue, width: widthValue }} id={styles.searchSuggestMainContainer}>
                        {searchSuggestArray}
                    </div>
                );
            } else {
                searchSuggest = (
                    <div ref={this.searchSuggestModalRef} style={{ left: leftValue, width: widthValue }} id={styles.searchSuggestMainContainer}>
                        No results.
                    </div>
                );
            }
        }


        let profileModal;
        if (this.state.showProfileModal === true) {
            profileModal = (
                <div ref={this.profileModalRef} id={styles.profileModalMainContainer}>
                    <div className={styles.arrow_example + " " + styles.arrow_border_example}></div>
                    <div className={styles.arrow_example}></div>
                    <Link to="/new-listing">
                        <p className={styles.profileModalText + " regularTextMedium"}>Create a listing</p>
                    </Link>
                    <Link to="/my-purchases">
                        <p className={styles.profileModalText + " regularTextMedium"}>Buying</p>
                    </Link>

                    <Link to="/my-listings">
                        <p className={styles.profileModalText + " regularTextMedium"}>Selling</p>
                    </Link>

                    <Link to="/account">
                        <p className={styles.profileModalText + " regularTextMedium"}>Edit profile</p>
                    </Link>

                    <Link to="/following">
                        <p className={styles.profileModalText + " regularTextMedium"}>Following</p>
                    </Link>
                    <p className={styles.profileModalText + " regularTextMedium"} onClick={this.props.logoutUser}>Logout</p>
                </div>
            );
        }

        let profileIcon;
        if (this.props.auth.isAuthenticated === true) {
            profileIcon = (
                <div className={styles.iconSeparator} onClick={() => {
                    if (this.state.allowClickOutsideProfileModal === true) {
                        this.setState({ showProfileModal: true });
                        setTimeout(() => { this.setState({ allowClickOutsideProfileModal: false }); }, 100);
                    } else {
                        this.setState({
                            showProfileModal: false,
                            allowClickOutsideProfileModal: true
                        });
                    }

                }}>
                    <div className={styles.iconContainer}>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/person.svg" />
                    </div>
                </div>
            );
        } else {
            profileIcon = (
                <div className={styles.iconSeparator} onClick={() => {
                    this.setState({
                        isLoginModalDisplayed: true
                    })
                }}>
                    <div className={styles.iconContainer}>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/person.svg" />
                    </div>
                </div>
            );
        }


        let homeLink = "/";
        if (this.props.auth.isAuthenticated === true) {
            homeLink = "/home"
        }
        return (
            <div>
                <div id={styles.desktopTopNav} >
                    <div id={styles.desktopTopNavInnerContainer}>
                        <Link to={homeLink}>
                            <img id={styles.logoDesktopTopNav} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                        </Link>
                        <div id={styles.searchInputDiv} ref={this.searchInputDivRef}>
                            <img ref={this.searchIconRef} id={styles.iconTopMobileNav} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/search-grey.svg" />
                            <input id={styles.searchInput} ref={this.searchInputRef} value={this.state.searchInput} name="searchInput" onChange={this.handleInputChange} placeholder="search Cambio" className={"regularText"} type="text"></input>
                        </div>
                        {searchSuggest}
                        <div id={styles.desktopTopNavIconsContainer}>
                            <Link to="/faq">
                                <div className={styles.iconSeparator}>
                                    <div className={styles.textContainer}>
                                        <p className="regularText">FAQ</p>
                                    </div>
                                </div>
                            </Link>
                            {/* <Link to="/inbox">
                            <div className={styles.iconSeparator}>
                                <div className={styles.iconContainer}>
                                    <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/comment-discussion-grey.svg" />
                                </div>
                                <div className={styles.textContainer}>
                                    <p>Inbox</p>
                                </div>
                            </div>
                        </Link> */}
                            {/* <div className={styles.iconSeparator}>
                    <div className={styles.iconContainer}>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/tag-grey.svg" />
                    </div>
                    <div className={styles.textContainer}>
                        <p>Orders</p>
                    </div>
                </div> */}
                            {/* <Link to="/saved">
                            <div className={styles.iconSeparator}>
                                <div className={styles.iconContainer}>
                                    <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/heart-grey.svg" />
                                </div>
                                <div className={styles.textContainer}>
                                    <p>Saved</p>
                                </div>

                            </div>
                        </Link> */}
                            {profileIcon}
                        </div>
                    </div>
                    {profileModal}
                </div>
                <Modal closeModal={() => {
                    this.setState({
                        isLoginModalDisplayed: false,
                    })
                }} show={this.state.isLoginModalDisplayed} >
                    <LoginCard {...this.props} />
                </Modal>
            </div>
        );
    }
}


Index.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(Index);