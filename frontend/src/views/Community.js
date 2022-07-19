import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Footer from "microComponents/Footer.js";
import styles from "public/style/community.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import BodyContainer from "microComponents/BodyContainer";
import Modal from "microComponents/Modal";
import axios from "axios";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            displayAccountModel: false,
            categories: [],
            categoryCurrentParentId: -1,
            isCategoriesModalDisplayed: false,
            posts: [],
        }
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
        axios.get(window.api_prefix+"/allBlogPosts").then(resp => {
            this.setState({
                posts: resp.data
            });
        });
    }
    componentWillUnmount() {
        window.onscroll = undefined;
        document.onclick = undefined;
    }

    render() {
        const { t } = this.props;

        let posts = <p>There are no posts for the moment.</p>
        if (this.state.posts.length > 0) {
            posts = this.state.posts.map((post, key) => {
                return (
                    <div className={styles.postCard}>
                        <Link key={key} to={"/blog-post/" + post.id} >
                        <p className={"title2 " + styles.regularText}>{post.title}</p>
                        <p className={"regularText " + styles.regularText}>{post.summary}</p>
                        <p className={styles.linkP + " " + styles.regularTextNoMargin}>read more</p>
                        </Link>
                    </div>
                );
            });
        }

        return (
            <div>
                <BodyContainer>
                    <div className={styles.topMainContainer}>
                        <div className={styles.topMainContainerInnerContainer}>
                            {/* <div id={styles.mobileTopNav}>
                                <img id={styles.logoMobileTopNav} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                                <img id={styles.searchIconClick} onClick={() => {
                                    this.searchContainerRef.current.classList.add(styles.searchContainerVisible);
                                    this.searchInputRef.current.focus();
                                    document.body.style.overflow = "hidden";
                                }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/search-grey.svg" />
                            </div> */}

                            <div id={styles.headerImgDiv}>
                                <p className={"megaTitle " + styles.regularText + " " + styles.headlineP}>How Cambio works</p>
                                <p className={"regularText " + styles.regularText + " " + styles.headlineP}>Cambio is not just another marketplace. It’s a community of tech enthusiasts looking to exchange on today’s tech and buy trustable pre-owned devices.</p>
                            </div>
                        </div>
                    </div>


                    <div className={styles.communitySectionContainer}>
                        <div className={styles.topMainContainerInnerContainer}>
                            {/*<p className={"title1 " + styles.regularText}>Recent posts</p>*/}
                            {posts}
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


                <Modal title="Categories" closeModal={() => {
                    this.setState({
                        isCategoriesModalDisplayed: false
                    })
                }} show={this.state.isCategoriesModalDisplayed}>
                </Modal>
            </div>
        );
    }
}


export default withTranslation()(Index);
