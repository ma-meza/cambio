import React from "react";
import { withTranslation } from "react-i18next";
import styles from "../style/employeeStyle.module.css";
import axios from "axios";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDataLoading: true,
            post: [],
            title: "",
            summary: "",
            createPost: false,
            postId: -1
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNameInputChange = this.handleNameInputChange.bind(this);
        this.savePost = this.savePost.bind(this);
    }

    componentDidMount() {
        if (this.props.createPost) {
            this.setState({
                createPost: true,
                isDataLoading: false
            });
        } else if (this.props.postId) {
            let postId = this.props.postId;
            axios.get(window.api_prefix+"/blogPost?id=" + postId).then(resp => {
                let bodyStringSplit = resp.data.body.split("<%b%>");
                let postInputs = bodyStringSplit.map((parag, key) => {
                    if (parag.substring(0, 4) == "<p%>") {
                        return {
                            content: parag.substring(4, parag.length),
                            type: "p"
                        }
                    } else if (parag.substring(0, 4) == "<t%>") {
                        return {
                            content: parag.substring(4, parag.length),
                            type: "t"
                        }
                    } else {
                        return null;
                    }
                });
                this.setState({
                    post: postInputs,
                    isDataLoading: false,
                    title: resp.data.title,
                    summary: resp.data.summary
                });
            });
        }
    }
    handleNameInputChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleInputChange(key, event) {
        let currentPosts = this.state.post;
        currentPosts[key].content = event.target.value;
        this.setState({
            post: currentPosts
        });
    }

    handleRemoveSection(key, event) {
        let currentPosts = this.state.post;
        currentPosts.splice(key, 1);
        this.setState({
            post: currentPosts
        });
    }

    addSection(type) {
        let currentPosts = this.state.post;
        if (type == "t") {
            currentPosts.push({ content: "", type: type });
        } else if (type = "p") {
            currentPosts.push({ content: "", type: type });
        }
        this.setState({
            post: currentPosts
        });
    }

    savePost() {
        let reqObj = { title: this.state.title, summary: this.state.summary, postId: this.props.postId };
        let bodyString = "";
        for (let i = 0; i < this.state.post.length; i++) {
            let post = this.state.post[i];
            if (post.type == "t") {
                bodyString += "<t%>" + post.content + "<%b%>"
            } else {
                bodyString += "<p%>" + post.content + "<%b%>"
            }
        }
        bodyString = bodyString.substring(0, bodyString.length - 5);
        reqObj.body = bodyString;
        if (this.state.createPost == true) {
            axios.post(window.api_prefix+"/createBlogPost", { token: this.props.token, post: reqObj }).then(resp => {
                this.props.returnDashboard();
            }).catch((err) => {
                if (err.response) {
                    this.setState({
                        errorMessage: err.response.data.message
                    });
                }
            });
        } else {
            axios.post(window.api_prefix+"/updateBlogPost", { token: this.props.token, post: reqObj }).then(resp => {
                this.props.returnDashboard();
            }).catch((err) => {
                if (err.response) {
                    this.setState({
                        errorMessage: err.response.data.message
                    });
                }
            });
        }
    }

    render() {
        const { t } = this.props;
        if (this.state.isDataLoading == true) {
            return <p>Loading...</p>;
        }
        let paragraphs = this.state.post.map((parag, key) => {
            if (parag.type == "p") {
                return (
                    <div>
                        <p className={styles.regularText + " title2"}>Section text</p>
                        <textarea className={styles.textareaNoMargin} key={key} type="text" onChange={this.handleInputChange.bind(this, key)} value={parag.content} />
                        <button className={styles.button} onClick={this.handleRemoveSection.bind(this, key)} > Remove</button>
                    </div>

                );
            } else if (parag.type == "t") {
                return (
                    <div>
                        <p className={styles.regularText + " title2"}>Section title</p>
                        <textarea className={styles.textareaNoMargin} key={key} type="text" onChange={this.handleInputChange.bind(this, key)} value={parag.content} />
                        <br />
                        <button className={styles.button} onClick={this.handleRemoveSection.bind(this, key)}>Remove</button>
                    </div>
                );
            } else {
                return null;
            }
        });
        return (
            <div>
                <div id={styles.articleContainer}>
                    <p className={styles.regularText + " title2"}>Post title</p>
                    <textarea className={styles.textarea} type="text" name="title" value={this.state.title} onChange={this.handleNameInputChange} />
                    <p className={styles.regularText + " title2"}>Post summary</p>
                    <textarea className={styles.textarea} type="text" name="summary" value={this.state.summary} onChange={this.handleNameInputChange} />
                    {paragraphs}
                    <button className={styles.inlineButton} onClick={() => { this.addSection("t") }}>Add section title</button>
                    <button className={styles.inlineButton} onClick={() => { this.addSection("p") }}>Add section text</button>
                    <br />
                    <button className={styles.button} onClick={this.savePost}>Save post</button>
                </div>
            </div>

        );
    }
}

export default withTranslation()(Index);
