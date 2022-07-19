import axios from "axios";
import React from "react";
import styles from "public/style/accountSetup.module.css";
import Spinner from "microComponents/LoaderAnimation";


class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lname: "",
            fname: "",
            countryCode: "CA",
            type0ErrorMessage: "",
            currentFormType: 0,
            type1ErrorMessage: "",
            categories: [],
            followedCategories: [],
            isDataLoading: false,
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.followTopic = this.followTopic.bind(this);
        this.unfollowTopic = this.unfollowTopic.bind(this);
    }

    componentDidMount() {
        if ((localStorage.getItem("setupVerif") == "true")) {
            this.props.history.push("/home");
        }else{
            axios.get(window.api_prefix+"/allParentCategories").then(resp => {
                this.setState({
                    categories: resp.data
                });
            });
        }
    }

    followTopic(key) {
        let currentUnfollowedTopics = this.state.categories;
        let swithTopic = currentUnfollowedTopics[key];
        currentUnfollowedTopics.splice(key, 1);
        let currentFollowedTopics = this.state.followedCategories;
        currentFollowedTopics.push(swithTopic);
        this.setState({
            followedCategories: currentFollowedTopics,
            categories: currentUnfollowedTopics
        });
    }
    unfollowTopic(key) {
        let currentUnfollowedTopics = this.state.categories;
        let currentFollowedTopics = this.state.followedCategories;
        let swithTopic = currentFollowedTopics[key];
        currentFollowedTopics.splice(key, 1);
        currentUnfollowedTopics.push(swithTopic);
        this.setState({
            followedCategories: currentFollowedTopics,
            categories: currentUnfollowedTopics
        });
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    submitForm() {
        this.setState({
            type1ErrorMessage: "",
            type0ErrorMessage: ""
        });
        if (this.state.followedCategories.length >= 3) {
            if (this.state.fname.length > 0) {
                if (this.state.lname.length > 0) {
                    this.setState({
                        isDataLoading: true
                    });
                    let reqObj = { lname: this.state.lname, fname: this.state.fname, followedCategories: this.state.followedCategories, countryCode: this.state.countryCode };
                    axios.post(window.api_prefix+"/accountSetup", reqObj).then(resp => {
                        localStorage.setItem("setupVerif", true);
                        this.props.history.push("/home");
                    }).catch(err => {
                        if (err.response) {
                            this.setState({
                                type0ErrorMessage: err.response.data.message,
                                currentFormType: 0,
                                isDataLoading: false
                            });
                        }
                    });
                } else {
                    this.setState({
                        type0ErrorMessage: "Please fill in your last name.",
                        currentFormType: 0
                    });
                }
            } else {
                this.setState({
                    type0ErrorMessage: "Please fill in your first name.",
                    currentFormType: 0
                });
            }
        } else {
            this.setState({
                type1ErrorMessage: "Please pick at least 3 topics.",
                currentFormType: 1
            });
        }
    }
    render() {
        let type0ErrorMessage;
        if (this.state.type0ErrorMessage.length > 0) {
            type0ErrorMessage = <p className={"errorText " + styles.regularText}>{this.state.type0ErrorMessage}</p>
        }

        let type1ErrorMessage;
        if (this.state.type1ErrorMessage.length > 0) {
            type1ErrorMessage = <p className={"errorText " + styles.regularText}>{this.state.type1ErrorMessage}</p>
        }

        let notFollowedCategories = this.state.categories.map((topic, key) => {
            return (
                <div key={key} className={styles.topicContainer}>
                    <p className={"regularText " + styles.regularTextNoMargin}>{topic.name}</p><img onClick={() => { this.followTopic(key) }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/plus.svg" />
                </div>
            );
        });
        let followedCategories = <p className={"regularText " + styles.regularText}>Please pick at least 3 topics</p>;
        if (this.state.followedCategories.length > 0) {
            followedCategories = this.state.followedCategories.map((topic, key) => {
                return (
                    <div key={key} className={styles.topicContainer}>
                        <p className={"regularText " + styles.regularTextNoMargin}>{topic.name}</p><img onClick={() => { this.unfollowTopic(key) }} src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" />
                    </div>
                );
            });
        }

        return (
            <div id={styles.bodyContainer}>
                <div className={this.state.currentFormType == 0 ? styles.formCard + " " + styles.activeForm : styles.formCard}>
                    <p className={"title1 " + styles.regularText}>Account setup (1/2)</p>
                    <p className={"title2 " + styles.regularText}>Please fill in some more details</p>
                    <input className={styles.inputText + " inputText regularText"} name="fname" type={"text"} value={this.state.fname} placeholder="First Name" onChange={this.handleInputChange}></input>
                    <input className={styles.inputText + " inputText regularText"} name="lname" type={"text"} value={this.state.lname} placeholder="Last Name" onChange={this.handleInputChange}></input>
                    <select className={styles.inputText + " inputText regularText"} onChange={this.handleInputChange} name="countryCode" value={this.state.countryCode}>
                        <option value="CA">Canada</option>
                        <option value="US">United States</option>
                        <option value="MX">Mexico</option>
                    </select>
                    {type0ErrorMessage}
                    <button className={styles.button + " buttonCta regularTextMedium"} onClick={() => {
                        if (this.state.lname.length > 0) {
                            if (this.state.fname.length > 0) {
                                this.setState({
                                    currentFormType: 1
                                });
                            } else {
                                this.setState({
                                    type0ErrorMessage: "Please fill in your first name.",
                                    currentFormType: 0
                                });
                            }
                        } else {
                            this.setState({
                                type0ErrorMessage: "Please fill in your last name.",
                                currentFormType: 0
                            });
                        }
                    }}>Continue</button>
                </div>
                <div className={this.state.currentFormType == 1 ? styles.formCard + " " + styles.activeForm : styles.formCard}>
                    <p className={"title1 " + styles.regularText}>Account setup (2/2)</p>
                    <p className={"title2 " + styles.regularText}>Which topics do you like? (pick at least 3)</p>
                    {notFollowedCategories}
                    <p className={"title2 " + styles.regularText}>Followed topics</p>
                    {followedCategories}
                    {type1ErrorMessage}
                    <button className={styles.button + " buttonCta regularTextMedium"} onClick={this.submitForm}>Continue</button>
                </div>
                {
                    this.state.isDataLoading == true ?
                        <Spinner />
                        :
                        null
                }
            </div>
        );
    }
}

export default Setup;