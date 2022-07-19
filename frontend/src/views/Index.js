import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";

import styles from "public/style/index.module.css"
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      displayAccountModel: false,
      searchSuggestions: []
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.displayAccountModal = this.displayAccountModal.bind(this);
    this.modalContainerClickHandle = this.modalContainerClickHandle.bind(this);

    this.accountModalRef = React.createRef();
    this.searchSuggestModalRef = React.createRef();
    this.searchInputRef = React.createRef();
  }

  componentDidMount() {
    document.onclick = (e) => {
      if (this.searchSuggestModalRef.current && this.searchInputRef.current && e.target !== this.searchSuggestModalRef.current && e.target !== this.searchInputRef.current && !e.target.classList.contains(styles.searchSuggestP)) {
        this.setState({
          searchSuggestions: []
        });
      }
    }
  }

  displayAccountModal() {
    document.body.style.overflow = "hidden";
    this.setState(prevState => ({
      displayAccountModal: !prevState.displayAccountModal
    }));
  }

  handleInputChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });

    if (name === "searchInput") {
      axios.get(window.api_prefix+"/searchInput?search=" + value).then(res => {
        this.setState({
          searchSuggestions: res.data
        });
      }).catch();
    }
  }

  modalContainerClickHandle(e) {
    if (this.accountModalRef.current && e.target === this.accountModalRef.current) {
      document.body.style.overflow = "auto";
      this.setState({
        displayAccountModal: false
      });
    }
  }
  render() {
    const { t } = this.props;


    let accountModal;
    if (this.state.displayAccountModal === true) {
      accountModal = (
        <div ref={this.accountModalRef} onClick={this.modalContainerClickHandle} id={styles.modalTransparentContainer}>
          <div id={styles.modalContainer}>
            <Link className={styles.accountModalLink + " regularTextBold " + styles.buttonStyle}>Register</Link>
            <Link className={styles.accountModalLink + " regularTextBold " + styles.regularAccountModalLink}>Login</Link>
          </div>
        </div>
      );
    }


    let searchSuggestArray = [];
    let searchSuggest;
    let searchQuery = this.state.searchInput.toLowerCase();
    if (this.state.searchSuggestions.length > 0 && this.state.searchInput.length > 0) {
      for (let i = 0; i < this.state.searchSuggestions.length; i++) {
        let optionIsFoundForDevice = false;
        console.log(this.state.searchSuggestions[i]);
        for (let j = 0; j < this.state.searchSuggestions[i].storageOptions.length; j++) {
          if (searchQuery.includes(this.state.searchSuggestions[i].storageOptions[j].name)) {
            optionIsFoundForDevice = true;
            searchSuggestArray.push(
              <p className={styles.searchSuggestP} key={i + "_" + j}>{this.state.searchSuggestions[i].name} {this.state.searchSuggestions[i].storageOptions[j].name}GB</p>
            );
          }
        }
        if (!optionIsFoundForDevice) {
          searchSuggestArray.push(
            <p className={styles.searchSuggestP} key={i + "_-1"}>{this.state.searchSuggestions[i].name}</p>
          );
        }
      }

      searchSuggest = (
        <div ref={this.searchSuggestModalRef} id={styles.searchSuggestMainContainer}>
          {searchSuggestArray}
        </div>
      );
    }





    return (
      <div>
        <div id={styles.navBar}>
          <img alt="" onClick={this.displayAccountModal} className={styles.navIcon} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/person-green.svg" />
        </div>
        <div id={styles.mainHeader}>
          <div id={styles.innerHeader} style={{ backgroundImage: "url('assets/landingPage/lp1.jpg')" }} >
            <p className={"title1"}>{t("The best way to sell and buy electronics you can trust")}</p>
          </div>
          <input id={styles.searchInput} ref={this.searchInputRef} value={this.state.searchInput} name="searchInput" onChange={this.handleInputChange} placeholder="Search pre-owned electronics" className={"inputText regularText"} type="text"></input>
          {searchSuggest}
        </div>
        <div id={styles.categoriesMainContainer}>
          <div id={styles.categoriesInnerContainer}>
            <Link to="/search?type=mob">
              <div className={styles.categoryContainer}>
                <img alt="" src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/device-mobile.svg" />
                <p className={"regularText"}>Mobile</p>
              </div>
            </Link>
            <Link to="/search?type=comp">
              <div className={styles.categoryContainer}>
                <img alt="" src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/device-desktop.svg" />
                <p className={"regularText"}>Laptops &amp; desktops</p>
              </div>
            </Link>
            <Link to="/search?type=tab">
              <div className={styles.categoryContainer}>
                <img alt="" src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/device-tablet.svg" />
                <p className={"regularText"}>Tablets</p>
              </div>
            </Link>
          </div>
        </div>

        <div className={styles.regularContainer}>
          <p className={"title2"}>{t("Featured iPhones")}</p>
          <div id={styles.cardsContainer}>
            <div className={styles.productCard}>
              <div className={styles.productCardMainImage} style={{ backgroundImage: "url('assets/landingPage/stockPic1.jpg')" }}></div>
              <img alt="" className={styles.productCardHeartIcon} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/heart-fill-white.svg" />
              <p className={"regularTextBold " + styles.productCardText}>iPhone 8 128gb</p>
              <p className={"regularText " + styles.productCardText}>Slightly used</p>
              <p className={"regularTextBold " + styles.productCardText}>$320</p>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productCardMainImage} style={{ backgroundImage: "url('assets/landingPage/stockPic2.jpg')" }}></div>
              <img alt="" className={styles.productCardHeartIcon} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/heart-fill-white.svg" />
              <p className={"regularTextBold " + styles.productCardText}>iPhone 7 64gb</p>
              <p className={"regularText " + styles.productCardText}>Like new</p>
              <p className={"regularTextBold " + styles.productCardText}>$220</p>
            </div>
            <div className={styles.productCard}>
              <div className={styles.productCardMainImage} style={{ backgroundImage: "url('assets/landingPage/stockPic4.jpg')" }}></div>
              <img alt="" className={styles.productCardHeartIcon} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/heart-fill-white.svg" />
              <p className={"regularTextBold " + styles.productCardText}>iPhone 7 Plus 128gb</p>
              <p className={"regularText " + styles.productCardText}>Like new</p>
              <p className={"regularTextBold " + styles.productCardText}>$350</p>
            </div>
          </div>
          <p className={"regularTextBold " + styles.linkText}>See all <img alt="" style={{ verticalAlign: "middle" }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/arrow-right-green.svg" /></p>
        </div>



        <div className={styles.regularContainer + " " + styles.centeredText} style={{ backgroundColor: "#f8f5f2" }}>
          <img alt="" className={styles.illustration + " " + styles.centeredText} src="assets/landingPage/handshakeIllu.svg" />
          <p className={"title2"}> {t("With ____, you get exactly what you're expecting, from a community of trusted sellers.")}</p>
          <p className={"regularText"}><img alt="" src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/check-circle-green.svg" style={{ verticalAlign: "middle", margin: "0 20px 0 0" }} />Verified buyers &amp; sellers</p>
          <p className={"regularText"}><img alt="" src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/check-circle-green.svg" style={{ verticalAlign: "middle", margin: "0 20px 0 0" }} />Inspected devices</p>
          <p className={"regularText"}><img alt="" src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/check-circle-green.svg" style={{ verticalAlign: "middle", margin: "0 20px 0 0" }} />Buyer's protection policy</p>
        </div>




        <div className={styles.regularContainer}>
          <p className={"title2 " + styles.centeredText}>{t("Looking to sell your device?")}</p>
          <p className={"regularTextBold " + styles.linkText + " " + styles.centeredText}>Get started now <img alt="" style={{ verticalAlign: "middle" }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/arrow-right-green.svg" /></p>
        </div>

        <div className={styles.regularContainer} style={{ backgroundColor: "#f8f5f2" }}>
          <p className={"title2"}>{t("How ___ works")}</p>
          <div className={styles.howWorksBox}>
            <p className={"title1 " + styles.linkText}>1</p>
            <p className={"title2"}>Browse pre-owned devices</p>
            <p>Find the device you want by filtering conditions, prices, colors, storages, etc.</p>
          </div>
          <div className={styles.divSeparator}></div>
          <div className={styles.howWorksBox}>
            <p className={"title1 " + styles.linkText}>2</p>
            <p className={"title2"}>Purchase your device</p>
            <p>No need to meet in person. Pay safely on our platform to be covered by our buyer's protection policy.</p>
          </div>
          <div className={styles.divSeparator}></div>
          <div className={styles.howWorksBox}>
            <p className={"title1 " + styles.linkText}>3</p>
            <p className={"title2"}>Sit back and relax</p>
            <p>We'll now take care of the rest and get your device delivered to you quickly.</p>
          </div>
        </div>

        {accountModal}

        <Footer />
      </div>
    );
  }
}


export default withTranslation()(Index);
