import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/index.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import activityTicker from "microComponents/ActivityTicker";
import ListingCard from "microComponents/ListingCard.js";
import ActivityTicker from "microComponents/ActivityTicker";
import BodyContainer from "microComponents/BodyContainer";
import Modal from "microComponents/Modal";
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      searchSuggestions: [],
      featuredListings: [],
      followedListings: [],
      hotListings: [],
      categories: [],
      categoryCurrentParentId: -1,
      isCategoriesModalDisplayed: false,
      showSearchSuggestion: false,
      listingsIsLoaded: false,

      activeSectionTitle: -1
    }

    this.handleInputChange = this.handleInputChange.bind(this);

    this.searchTopContainer = React.createRef();
    this.categoriesContainerRef = React.createRef();
    this.searchInputRef = React.createRef();
    this.followedListingsRef = React.createRef();
    this.searchSuggestModalRef = React.createRef();
    this.featuredListingsRef = React.createRef();
    this.hotListingsRef = React.createRef();
    this.scrollTopButtonRef = React.createRef();
    this.searchContainerRef = React.createRef();
  }

  componentDidMount() {
    axios.get(window.api_prefix+"/allCategories").then(res => {
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].parentid != null) {
          for (let j = 0; j < res.data.length; j++) {
            if (res.data[i].parentid === res.data[j].id) {
              if (res.data[j].children) {
                res.data[j].children.push(res.data[i]);
              } else {
                res.data[j].children = [res.data[i]];
              }
              res.data.splice(i, 1);
              i--;
              break;
            }
          }
        }
      }
      this.setState({
        categories: res.data
      });
    }).catch();
    axios.get(window.api_prefix+"/customFeed").then(resp => {
      this.setState({
        listingsIsLoaded: true,
        followedListings: resp.data
      });
    }).catch();


    // Get the header
    var featuredListings = this.featuredListingsRef.current;
    var followedListings = this.followedListingsRef.current;
    var hotListings = this.hotListingsRef.current;

    let followedPosition = 2000;
    let featuredPosition = 2000;
    let hotPosition = 2000;
    let prevScrollpos = window.pageYOffset;

    let fixedPositionsRegistered = false;

    window.onscroll = () => {


      let vwWidth = document.documentElement.clientWidth;
      let scrollY = window.pageYOffset || window.scrollY;


      if (vwWidth > 780) {
        if (this.categoriesContainerRef.current) {
          if (scrollY >= 220) {
            this.categoriesContainerRef.current.classList.add(styles.fixedCategoriesContainer);
          } else {
            this.categoriesContainerRef.current.classList.remove(styles.fixedCategoriesContainer)
          }
        }
      }


      if (this.state.listingsIsLoaded == true && vwWidth <= 780) {

        if (fixedPositionsRegistered == false) {
          var stickyFeatured = featuredListings.getBoundingClientRect();
          var stickyFollowed = followedListings.getBoundingClientRect();
          var stickyHot = hotListings.getBoundingClientRect();
          fixedPositionsRegistered = true;
          followedPosition = stickyFollowed.top + scrollY;
          featuredPosition = stickyFeatured.top + scrollY;
          hotPosition = stickyHot.top + scrollY;
        } else {
          if (followedPosition <= scrollY) {
            if (this.state.activeSectionTitle != 2) {
              this.setState({
                activeSectionTitle: 2
              });
            }
          } else if (hotPosition <= scrollY) {
            if (this.state.activeSectionTitle != 1) {
              this.setState({
                activeSectionTitle: 1
              });
            }
          } else if (featuredPosition <= scrollY) {
            if (this.state.activeSectionTitle != 0) {
              this.setState({
                activeSectionTitle: 0
              });
            }
          } else {
            if (this.state.activeSectionTitle != -1) {
              this.setState({
                activeSectionTitle: -1
              });
            }
          }
          if (this.scrollTopButtonRef.current) {
            if ((prevScrollpos <= scrollY) || scrollY < 200) {
              this.scrollTopButtonRef.current.classList.add(styles.displayNone);
            } else {
              this.scrollTopButtonRef.current.classList.remove(styles.displayNone);
            }
          }
          prevScrollpos = scrollY;
        }
      }
    };
  }

  componentWillUnmount() {
    window.onscroll = undefined;
    document.onclick = undefined;
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
        this.setState({
          searchSuggestions: [],
          showSearchSuggestion: true
        });
      }
      // axios.get(window.api_prefix+"/searchInput?search=" + value).then(res => {
      //   this.setState({
      //     searchSuggestions: res.data
      //   });
      // }).catch();
    }
  }

  postCatTrend(catId) {
    axios.post(window.api_prefix+"/categorySearchClick", { catId: catId });
  }

  render() {
    const { t } = this.props;


    let searchSuggestArray = [];
    let searchSuggest;
    let searchQuery = this.state.searchInput.toLowerCase();

    let desktopSearchSuggest;
    let desktopCategoriesList = [];
    if (this.state.categoryCurrentParentId == -1) {
      let seeMoreDiv;
      let catQtity = 0;
      for (let j = 0; j < this.state.categories.length && j <= 4; j++) {
        let cat = this.state.categories[j];
        catQtity++;
        if (cat.children) {
          desktopCategoriesList.push(
            <p className={styles.searchSuggestP + " regularText"} onClick={() => { this.setState({ categoryCurrentParentId: cat.id }) }} key={j}>{cat.name} <img className={styles.chevronImgCategories} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-right.svg" /></p>
          );
        } else {
          desktopCategoriesList.push(
            <Link to={"/search?cat=" + cat.id} onClick={() => { this.postCatTrend(cat.id) }} key={j}>
              <p className={styles.searchSuggestP + " regularText"} >{cat.name}</p>
            </Link>
          );
        }
      }
      if (2 == 2) {
        seeMoreDiv = (
          <div id={styles.seeMoreCats}>
            <p className={styles.regularTextNoMargin + " regularText"} onClick={() => { this.setState({ isCategoriesModalDisplayed: true }); }}>See more</p>
          </div>
        );
      }
      desktopSearchSuggest = (
        <div>
          <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
            <p className={styles.regularTextNoMargin + " regularTextBold"}>Categories</p>
            {desktopCategoriesList}
          </div>
          {seeMoreDiv}
        </div>
      );
    } else {
      let seeMoreDiv;
      for (let i = 0; i < this.state.categories.length; i++) {
        if (this.state.categories[i].id === this.state.categoryCurrentParentId) {
          let parentCategoryName = this.state.categories[i].name;
          let catQtity = 0;
          desktopCategoriesList = this.state.categories[i].children.map((cat, key) => {
            catQtity++;
            return (
              <Link to={"/search?cat=" + cat.id} onClick={() => { this.postCatTrend(cat.id) }} key={key}>
                <p className={styles.searchSuggestP + " regularText"} >{cat.name}</p>
              </Link>
            );
          });
          desktopCategoriesList.push(
            <Link to={"/search?cat=" + this.state.categoryCurrentParentId} onClick={() => { this.postCatTrend(this.state.categoryCurrentParentId) }} key={"cat_all"}>
              <p className={styles.searchSuggestP + " regularText"}>See all {parentCategoryName}</p>
            </Link>
          );
          if (catQtity * 50 > (window.innerHeight - 365)) {
            seeMoreDiv = (
              <div id={styles.seeMoreCats} onClick={() => { this.setState({ isCategoriesModalDisplayed: true }); }}>
                <p className={styles.regularTextNoMargin + " regularText"}>See more</p>
              </div>
            );
          }
          desktopSearchSuggest = (
            <div>
              <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
                <p className={styles.regularTextNoMargin + " regularTextBold " + styles.clickable} onClick={() => { this.setState({ categoryCurrentParentId: -1 }) }}><img className={styles.chevronImgCategories + " " + styles.bottomAlignChevron} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-left.svg" /> {parentCategoryName}</p>
                {desktopCategoriesList}
              </div>
              {seeMoreDiv}
            </div>
          );
          break;
        }
      }
    }


    if (this.state.searchInput.length > 0 && this.state.showSearchSuggestion) {
      if (this.state.searchSuggestions.length > 0) {
        for (let i = 0; i < this.state.searchSuggestions.length; i++) {
          let optionIsFoundForDevice = false;
          for (let j = 0; j < this.state.searchSuggestions[i].storageOptions.length; j++) {
            if (searchQuery.includes(this.state.searchSuggestions[i].storageOptions[j].name)) {
              optionIsFoundForDevice = true;
              searchSuggestArray.push(
                <p className={styles.searchSuggestP + " regularText"} key={i + "_" + j}>{this.state.searchSuggestions[i].name} {this.state.searchSuggestions[i].storageOptions[j].name}GB</p>
              );
            }
          }
          if (!optionIsFoundForDevice) {
            searchSuggestArray.push(
              <p className={styles.searchSuggestP + " regularText"} key={i + "_-1"}>{this.state.searchSuggestions[i].name}</p>
            );
          }
        }
        searchSuggest = (
          <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
            {searchSuggestArray}
          </div>
        );
      } else {
        searchSuggest = (
          <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
            <p className={styles.searchSuggestP + " regularText"}>No results</p>
          </div>
        );
      }
    } else {
      let categoriesList;
      if (this.state.categoryCurrentParentId == -1) {
        let seeMoreDiv;
        let catQtity = 0;
        categoriesList = [];
        for (let j = 0; j < this.state.categories.length; j++) {
          let cat = this.state.categories[j];
          catQtity++;
          if (cat.children) {
            categoriesList.push(
              <p className={styles.searchSuggestP + " regularText"} onClick={() => { this.setState({ categoryCurrentParentId: cat.id }) }} key={j}>{cat.name} <img className={styles.chevronImgCategories} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-right.svg" /></p>
            );
          } else {
            categoriesList.push(
              <Link to={"/search?cat=" + cat.id} onClick={() => { this.postCatTrend(cat.id) }} key={j}>
                <p className={styles.searchSuggestP + " regularText"} >{cat.name}</p>
              </Link>
            );
          }
        }
        // if (2 == 2) {
        //   seeMoreDiv = (
        //     <div id={styles.seeMoreCats}>
        //       <p className={styles.regularTextNoMargin + " regularText"} onClick={() => { this.setState({ isCategoriesModalDisplayed: true }); }}>See more</p>
        //     </div>
        //   );
        // }
        searchSuggest = (
          <div>
            <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
              <p className={styles.regularTextNoMargin + " regularTextBold"}>Categories</p>
              {categoriesList}
            </div>
            {seeMoreDiv}
          </div>
        );
      } else {
        let seeMoreDiv;
        for (let i = 0; i < this.state.categories.length; i++) {
          if (this.state.categories[i].id === this.state.categoryCurrentParentId) {
            let parentCategoryName = this.state.categories[i].name;
            let catQtity = 0;
            categoriesList = this.state.categories[i].children.map((cat, key) => {
              catQtity++;
              return (
                <Link to={"/search?cat=" + cat.id} onClick={() => { this.postCatTrend(cat.id) }} key={key}>
                  <p className={styles.searchSuggestP + " regularText"} >{cat.name}</p>
                </Link>
              );
            });
            categoriesList.push(
              <Link to={"/search?cat=" + this.state.categoryCurrentParentId} onClick={() => { this.postCatTrend(this.state.categoryCurrentParentId) }} key={"cat_all"}>
                <p className={styles.searchSuggestP + " regularText"}>See all {parentCategoryName}</p>
              </Link>
            );
            if (catQtity * 50 > (window.innerHeight - 365)) {
              seeMoreDiv = (
                <div id={styles.seeMoreCats} onClick={() => { this.setState({ isCategoriesModalDisplayed: true }); }}>
                  <p className={styles.regularTextNoMargin + " regularText"}>See more</p>
                </div>
              );
            }
            searchSuggest = (
              <div>
                <div ref={this.searchSuggestModalRef} className={styles.searchSuggestMainContainer}>
                  <p className={styles.regularTextNoMargin + " regularTextBold " + styles.clickable} onClick={() => { this.setState({ categoryCurrentParentId: -1 }) }}><img className={styles.chevronImgCategories + " " + styles.bottomAlignChevron} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-left.svg" /> {parentCategoryName}</p>
                  {categoriesList}
                </div>
                {seeMoreDiv}
              </div>
            );
            break;
          }
        }
      }
    }



    let featuredListings = <p className={styles.emptyStateMessageP}>No featured listings yet.</p>
    if (this.state.featuredListings.length > 0) {
      featuredListings = this.state.featuredListings.map((listing, key) => {
        return (
          <ListingCard key={key} listing={listing} />
        );
      });
    }

    let followedListings = <p className={styles.emptyStateMessageP}>No followed listings yet.</p>
    if (this.state.followedListings.length > 0) {
      followedListings = this.state.followedListings.map((listing, key) => {
        return (
          <ListingCard key={key} listing={listing} />
        );
      });
    }

    let hotListings = <p className={styles.emptyStateMessageP}>No hot listings yet.</p>
    if (this.state.hotListings.length > 0) {
      hotListings = this.state.hotListings.map((listing, key) => {
        return (
          <ListingCard key={key} listing={listing} />
        );
      });
    }

    let allCategoriesList = [];
    for (let i = 0; i < this.state.categories.length; i++) {
      allCategoriesList.push(<Link key={i} to={"/search?cat=" + this.state.categories[i].id} onClick={() => { this.postCatTrend(this.state.categories[i].id) }} className={"regularTextMedium " + styles.allCatsTitle}><p>{this.state.categories[i].name}</p></Link>);
      if (this.state.categories[i].children) {
        for (let j = 0; j < this.state.categories[i].children.length; j++) {
          allCategoriesList.push(<Link key={i + "_" + j} to={"/search?cat=" + this.state.categories[i].children[j].id} onClick={() => { this.postCatTrend(this.state.categories[i].children[j].id) }} className={"regularText " + styles.allCatsText}><p>{this.state.categories[i].children[j].name}</p></Link>);
        }
      }
    }

    let mobileStickyHeader;
    if (this.state.activeSectionTitle != -1) {
      let stickyMobileHeaderText;
      switch (this.state.activeSectionTitle) {
        case 0:
          stickyMobileHeaderText = "Featured listings";
          break;
        case 1:
          stickyMobileHeaderText = "Hot finds";
          break;
        case 2:
          stickyMobileHeaderText = "Based on what you follow";
          break;
      }
      mobileStickyHeader = (
        <p ref={this.hotListingsRef} className={styles.sectionTitleP + " title2 " + styles.stickyHeader}>{stickyMobileHeaderText}</p>
      );
    }


    return (
      <div>
        <BodyContainer>
          {mobileStickyHeader}
          <div className={styles.topMainContainer}>
            <div className={styles.topMainContainerInnerContainer}>
              <div id={styles.mobileTopNav}>
                <img id={styles.logoMobileTopNav} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                <img id={styles.searchIconClick} onClick={() => {
                  this.searchContainerRef.current.classList.add(styles.searchContainerVisible);
                  this.searchInputRef.current.focus();
                  document.body.style.overflow = "hidden";
                }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/search-grey.svg" />
              </div>

              <div id={styles.headerImgDiv}>
                <p className={"megaTitle " + styles.regularText + " " + styles.headlineP}>Buy pre-owned electronics you can trust.</p>
                <Link className={styles.linkP + " regularTextMedium"} to="/blog-post/1">See how it works <img style={{ verticalAlign: "middle" }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/arrow-right-orange.svg" /></Link>
              </div>
            </div>
          </div>

          <div className={styles.mainFeedContainers}>
            <div className={styles.innerMainContainer}>
              <p ref={this.featuredListingsRef} className={styles.sectionTitleP + " title2"}>Featured listings</p>
              {featuredListings}
            </div>
          </div>

          <div className={styles.mainFeedContainers}>
            <div className={styles.innerMainContainer}>
              <p ref={this.hotListingsRef} className={styles.sectionTitleP + " title2"}>Hot finds</p>
              {hotListings}
            </div>
          </div>

          <div className={styles.mainFeedContainers}>
            <div className={styles.innerMainContainer}>
              <p ref={this.followedListingsRef} className={styles.sectionTitleP + " title2"}>Based on what you follow</p>
              {followedListings}
            </div>
          </div>
        </BodyContainer>



        <div id={styles.scrollTopButton} className={styles.displayNone} ref={this.scrollTopButtonRef} onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.featuredListingsRef.current.classList.remove(styles.stickyHeader);
          this.featuredListingsRef.current.parentElement.classList.remove(styles.stickyHeaderParent);
          this.followedListingsRef.current.classList.remove(styles.stickyHeader);
          this.followedListingsRef.current.parentElement.classList.remove(styles.stickyHeaderParent);
        }}>
          <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/chevron-up.svg" />
        </div>

        <Footer />
        <MobileBottomNav {...this.props} />
        <DesktopTopNav key={new Date().getTime()} {...this.props} />
        <ActivityTicker />


        <div ref={this.categoriesContainerRef} id={styles.categoriesMainContainer}>
          {desktopSearchSuggest}
        </div>

        <div id={styles.searchTransparentContainer} ref={this.searchContainerRef}>
          <div id={styles.searchMainContainer}>
            <div ref={this.searchTopContainer} id={styles.searchTopContainer}>
              <p className={styles.regularText + " regularTextBold"}>Search</p>
              <img onClick={() => { this.searchContainerRef.current.classList.remove(styles.searchContainerVisible); document.body.style.overflow = "auto"; }} id={styles.searchXImg} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
              <div id={styles.searchInputDiv}>
                <img id={styles.iconTopMobileNav} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/search-grey.svg" />
                <input ref={this.searchInputRef} id={styles.searchInput} value={this.state.searchInput} name="searchInput" onChange={this.handleInputChange} placeholder="Search pre-owned electronics" className={"regularText"} type="text"></input>
              </div>
            </div>
            <div id={styles.searchSuggestScroller}>
              {searchSuggest}
            </div>
          </div>
        </div>

        <Modal title="Categories" closeModal={() => {
          this.setState({
            isCategoriesModalDisplayed: false
          })
        }} show={this.state.isCategoriesModalDisplayed}>
          {allCategoriesList}
        </Modal>
      </div>
    );
  }
}


export default withTranslation()(Index);
