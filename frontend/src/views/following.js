import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "microComponents/Footer.js";
import styles from "public/style/account.module.css";
import DesktopTopNav from "microComponents/DesktopTopNav.js";
import MobileBottomNav from "microComponents/MobileBottomNav.js";

class Following extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            following: [],
            followedUsers: [],
            suggestedTopics: []
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggleFollowing = this.toggleFollowing.bind(this);
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    componentDidMount() {

        axios.get(window.api_prefix+"/usersFollowed").then((resp) => {
            console.log(resp.data);
            this.setState({
                followedUsers: resp.data
            });
        });
        this.setState({
            following: [
                {
                    type: 0,
                    userId: 32323,
                    userPicture: "ddsd",
                    userName: "Mark"
                },
                {
                    type: 0,
                    userId: 32323,
                    userPicture: "ddsd",
                    userName: "John"
                },
                {
                    type: 0,
                    userId: 32323,
                    userPicture: "ddsd",
                    userName: "Mike"
                },
                {
                    type: 0,
                    userId: 32323,
                    userPicture: "ddsd",
                    userName: "Gino"
                },
                {
                    type: 0,
                    userId: 32323,
                    userPicture: "ddsd",
                    userName: "Jane"
                },
                {
                    type: 1,
                    stringValue: "iphone X black 32Gb",
                    filters: [

                    ]
                },
                {
                    type: 1,
                    stringValue: "iphone 7",
                    filters: [

                    ]
                },
                {
                    type: 1,
                    stringValue: "3D print",
                    filters: [

                    ]
                },
                {
                    type: 2,
                    id: 23,
                    stringValue: "3D printer"
                }
            ],
            suggestedTopics: [
                {
                    type: 2,
                    id: 23,
                    stringValue: "3D printer"
                },
                {
                    type: 2,
                    id: 2,
                    stringValue: "Apple"
                }
            ]
        });
    }

    componentWillUnmount() {
        window.onscroll = undefined;
        document.onclick = undefined;
    }
    toggleFollowing(id, indexArray) {
        axios.post(window.api_prefix+"/followUser", { id: id }).then().catch();
        let currentFollowedUsers = this.state.followedUsers;
        currentFollowedUsers.splice(indexArray, 1);
        this.setState({
            followedUsers: currentFollowedUsers
        });
    }

    render() {
        const { t } = this.props;

        let userFollowings = <p>You still don't following any user. Visit people's profile and follow them to have items they post in your feed.</p>
        if (this.state.followedUsers.length > 0) {
            userFollowings = this.state.followedUsers.map((user, key) => {
                return (
                    <div key={key} className={styles.topicContainer}>
                        <p className={"regularText " + styles.regularTextNoMargin}>@{user.name}</p><img onClick={() => { this.toggleFollowing(user.id, key) }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
                    </div>
                );
            });
        }
        // let topicFollowings = <p>No followings.</p>
        // let suggestedTopics = <p>No more topics.</p>
        // let userFollowingsArray = [];
        // let topicFollowingsArray = [];


        // let newSuggestedTopics = this.state.suggestedTopics;
        // for (let i = 0; i < this.state.following.length; i++) {
        //     if (this.state.following[i].type == 0) {
        //         userFollowingsArray.push(
        //             <div className={styles.topicContainer}>
        //                 <p className={"regularText " + styles.regularTextNoMargin}>{this.state.following[i].userName}</p><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
        //             </div>
        //         );
        //     } else if (this.state.following[i].type == 1) {
        //         topicFollowingsArray.push(
        //             <div className={styles.topicContainer}>
        //                 <p className={"regularText " + styles.regularTextNoMargin}>{this.state.following[i].stringValue}</p><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
        //             </div>
        //         );
        //     } else {

        //         for (let j = 0; j < newSuggestedTopics.length; j++) {
        //             if (newSuggestedTopics[j].id === this.state.following[i].id) {
        //                 newSuggestedTopics.splice(j, 1);
        //             }
        //         }
        //         topicFollowingsArray.push(
        //             <div className={styles.topicContainer}>
        //                 <p className={"regularText " + styles.regularTextNoMargin}>{this.state.following[i].stringValue}</p><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
        //             </div>
        //         );
        //     }
        // }

        // let suggestedTopicsArray = newSuggestedTopics.map((topic, key) => {
        //     return (
        //         <div key={key} className={styles.topicContainer}>
        //             <p className={"regularText " + styles.regularTextNoMargin}>{topic.stringValue}</p><img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/plus.svg" />
        //         </div>
        //     );
        // });
        // if (userFollowingsArray.length > 0) {
        //     userFollowings =
        //         <div>
        //             {userFollowingsArray}
        //         </div>
        // }
        // if (topicFollowingsArray.length > 0) {
        //     topicFollowings =
        //         <div>
        //             {topicFollowingsArray}
        //         </div>
        // }
        // if (newSuggestedTopics.length > 0) {
        //     suggestedTopics =
        //         <div>
        //             {suggestedTopicsArray}
        //         </div>
        // }
        return (
            <div>
                <div id={styles.topMainContainer}>
                    <div className={styles.innerMainContainer}>
                        <div className={styles.listingComponentsMainContainer}>
                            <p className={styles.regularText + " title1"}>Users you follow</p>
                        </div>
                        <div className={styles.listingComponentsMainContainer}>
                            {/*<p className={"regularTextMedium " + styles.regularText}>Users you follow</p>*/}
                            {userFollowings}
                        </div>
                        {/* <div className={styles.listingComponentsMainContainer}>
                            <p className={"regularTextMedium " + styles.regularText}>Followed topics</p>
                            {topicFollowings}
                        </div>
                        <div className={styles.listingComponentsMainContainer}>
                            <p className={"regularTextMedium " + styles.regularText}>Suggested topics</p>
                            {suggestedTopics}
                        </div> */}
                    </div>

                </div>

                <Footer />
                <MobileBottomNav {...this.props} />
                <DesktopTopNav key={new Date().getTime()} {...this.props} />
            </div>
        );
    }
}


export default withTranslation()(Following);
