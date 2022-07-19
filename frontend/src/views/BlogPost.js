import React from "react";
import { withTranslation } from "react-i18next";
import Footer from "microComponents/Footer.js";
import styles from "public/style/articlePage.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";
import axios from "axios";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoading: true,
            post: {}
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
        if (this.props.match.params.id) {
            let postId = this.props.match.params.id;
            axios.get(window.api_prefix+"/blogPost?id=" + postId).then(resp => {
                this.setState({
                    post: resp.data,
                    isDataLoading: false
                });
            });
        } else {
            this.props.history.push("/community");
        }
    }

    componentWillUnmount() {
        window.onscroll = undefined;
        document.onclick = undefined;
    }

    render() {
        const { t } = this.props;

        if (this.state.isDataLoading == true) {
            return <p>Loading...</p>;
        }
        let bodyStringSplit = this.state.post.body.split("<%b%>");
        console.log(bodyStringSplit);
        let paragraphs = bodyStringSplit.map((parag, key) => {
            if (parag.substring(0, 4) == "<p%>") {
                return (
                    <p key={key} className={"regularText " + styles.regularText}>{parag.substring(4, parag.length)}</p>
                );
            } else if (parag.substring(0, 4) == "<t%>") {
                return (
                    <p key={key} className={"title2 " + styles.regularText}>{parag.substring(4, parag.length)}</p>
                );
            } else {
                return null;
            }
        });
        console.log(paragraphs);
        return (
            <div>
                <div id={styles.articleContainer}>
                    <p className={"title1 " + styles.regularText}>{this.state.post.title}</p>
                    {paragraphs}
                </div>
                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
            </div>

        );
    }
}

export default withTranslation()(Index);
