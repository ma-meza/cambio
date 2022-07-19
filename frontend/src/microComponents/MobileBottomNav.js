import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "public/style/mobileBottomNav.module.css";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    render() {
        const { t } = this.props;

        return (
            <div id={styles.mainContainer}>
                <Link to="/index">
                    <div className={styles.iconSeparator}>
                        <div className={styles.iconContainer}>
                            <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/home.svg" />
                        </div>
                        <div className={styles.textContainer}>
                            <p className={"regularText"}>Home</p>
                        </div>
                    </div>
                </Link>

                {/* <div className={styles.iconSeparator}>
                    <div className={styles.iconContainer}>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/comment-discussion-grey.svg" />
                    </div>
                    <div className={styles.textContainer}>
                        <p>Inbox</p>
                    </div>
                </div> */}


                {/*<Link to="/activity">*/}
                {/*    <div className={styles.iconSeparator}>*/}
                {/*        <div className={styles.iconContainer}>*/}
                {/*            <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/flame.svg" />*/}
                {/*        </div>*/}
                {/*        <div className={styles.textContainer}>*/}
                {/*            <p className={"regularText"}>Activity</p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Link>*/}

                <Link to="/new-listing">
                    <div className={styles.iconSeparator}>
                        <div className={styles.iconContainer}>
                            <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/diff-added.svg" />
                        </div>
                        <div className={styles.textContainer}>
                            <p className={"regularText"}>New listing</p>
                        </div>
                    </div>
                </Link>


                {/* <div className={styles.iconSeparator}>
                    <div className={styles.iconContainer}>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/tag-grey.svg" />
                    </div>
                    <div className={styles.textContainer}>
                        <p>Orders</p>
                    </div>
                </div> */}
                {/* <div className={styles.iconSeparator}>
                    <div className={styles.iconContainer}>
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/heart-grey.svg" />
                    </div>
                    <div className={styles.textContainer}>
                        <p>Saved</p>
                    </div>
                </div> */}
                <Link to="/profile">
                    <div className={styles.iconSeparator}>
                        <div className={styles.iconContainer}>
                            <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/person.svg" />
                        </div>
                        <div className={styles.textContainer}>
                            <p className={"regularText"}>Account</p>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}


export default Index;
