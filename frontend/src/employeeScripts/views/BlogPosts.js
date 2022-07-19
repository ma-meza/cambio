import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "../style/employeeStyle.module.css";
import axios from "axios";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            errorMessage: ""
        }
    }


    componentDidMount() {
        axios.get(window.api_prefix+"/allBlogPosts").then(resp => {
            this.setState({
                posts: resp.data
            });
        });
    }

    deleteBlogPost(postId, key) {
        this.setState({
            errorMessage: ""
        });
        axios.post(window.api_prefix+"/deleteBlogPost", { postId: postId, token: this.props.token }).then(resp => {
            let currentPosts = this.state.posts;
            currentPosts.splice(key, 1);
            this.setState({
                posts: currentPosts
            });
        }).catch(err => {
            if (err.response) {
                this.setState({
                    errorMessage: err.response.data.message
                });
            }
        });
    }

    render() {
        const { t } = this.props;

        let posts = <p>There are no posts for the moment.</p>
        if (this.state.posts.length > 0) {
            posts = this.state.posts.map((post, key) => {
                return (
                    <div style={{ border: "1px solid #000", padding: "20px", marginBottom: "50px" }} key={key} className={styles.postCard}>
                        <p className={"title2 " + styles.regularText}>{post.title}</p>
                        <p className={"regularText " + styles.regularText}>{post.summary}</p>
                        <button style={{ margin: "0 20px 0 0" }} onClick={() => { this.props.editSpecificBlogPost(post.id) }} className={styles.linkP + " " + styles.regularTextNoMargin}>Edit</button>
                        <button onClick={() => { this.deleteBlogPost(post.id, key) }} className={styles.linkP + " " + styles.regularTextNoMargin}>Delete</button>
                    </div>
                );
            });
        }

        return (
            <div>
                <div id={styles.articleContainer}>
                    <p className={"title1 " + styles.regularText}>All posts</p>
                    {this.state.errorMessage.length > 0 ? this.state.errorMessage : null}
                    <button className={styles.button} onClick={this.props.newBlogPost}>NEW BLOG POST</button>
                    {posts}
                </div>
            </div>
        );
    }
}


export default withTranslation()(Index);
