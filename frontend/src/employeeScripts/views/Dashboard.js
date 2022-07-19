import React from "react";
import styles from "../../public/style/authenticationForms.module.css";
import styles2 from "../style/employeeStyle.module.css";

import Spinner from "../../microComponents/LoaderAnimation";
import axios from "axios";
import { Link } from "react-router-dom";

import AllBlogPosts from "./BlogPosts";
import EditBlogPost from "./EditBlogPost";
import AllListings from "./Listings";
import NewGuestUser from "./NewGuestUsers";
import NewGuestListing from "./NewGuestListing";


import PredefinedItems from "./PredefinedItems";
import NewGuestUsers from "./NewGuestUsers";
import ExistingGuestListings from "./ExistingGuestListings";

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 0, //0 = login, 1 = dashboard, 2 = all blog posts, 3 = specifc blog post, 4 = all listings to verify, 5 = new blog post, 6 = new guest user
            email: "",
            password: "",
            loginErrorMessage: "",
            isDataLoading: false,
            token: "",
            userName: "",
            editPostId: -1
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.editSpecificBlogPost = this.editSpecificBlogPost.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleLoginSubmit() {
        this.setState({
            loginErrorMessage: ""
        });
        if (this.state.email.length > 0 && this.state.password.length > 0) {
            if (emailRegex.test(this.state.email) === true) {
                this.setState({ isDataLoading: true });
                let loginObj = { email: this.state.email, password: this.state.password };
                axios.post(window.api_prefix+"/loginEmployee", loginObj).then((resp) => {
                    this.setState({
                        activePage: 1,
                        employeeName: resp.data.name,
                        token: resp.data.token
                    });
                }).catch(err => {
                    if (err.response) {
                        this.setState({
                            loginErrorMessage: err.response.data.message,
                            isDataLoading: false
                        });
                    }
                });
            } else {
                this.setState({
                    loginErrorMessage: "Your email is not valid.",
                    isDataLoading: false
                });
            }
        } else {
            this.setState({
                loginErrorMessage: "Please fill in all the fields.",
                isDataLoading: false
            });
        }
    }

    editSpecificBlogPost(postId) {
        this.setState({
            activePage: 3,
            editPostId: postId
        });
    }


    render() {
        if (this.state.activePage == 0) {
            //login
            let errorMessage;
            if (this.state.loginErrorMessage.length > 0) {
                errorMessage = <p className={"errorText " + styles.regularText}>{this.state.loginErrorMessage}</p>
            }
            return (
                <div>
                    <div id={styles.bodyContainer}>
                        <div id={styles.formCard}>
                            <Link to="/">
                                <img alt="logo" id={styles.logo} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                            </Link>
                            <p className={"title1 " + styles.regularText}>Employee portal</p>
                            <input className={styles.inputText + " inputText regularText"} type="email" name="email" value={this.state.email} onChange={this.handleInputChange} placeholder="Email address"></input>
                            <input className={styles.inputText + " inputText regularText"} type="password" name="password" value={this.state.password} onChange={this.handleInputChange} placeholder="Password"></input>
                            {errorMessage}
                            {/* <p className={"regularText " + styles.regularText}>Don't have an account? <Link to="/signup" className={styles.link + " " + styles.regularText}>Sign up now.</Link></p> */}
                            <button className={styles.button + " buttonCta regularTextMedium"} onClick={this.handleLoginSubmit}>Continue</button>
                        </div>
                    </div>
                    {
                        this.state.isDataLoading == true ?
                            <Spinner />
                            :
                            null
                    }
                </div>

            )
        }
        let content;
        if (this.state.activePage == 1) {
            //dashboard
            content = <p>Welcome {this.state.employeeName}</p>
        } else if (this.state.activePage == 2) {
            //all blog posts
            content = (
                <AllBlogPosts newBlogPost={() => { this.setState({ activePage: 5 }); }} editSpecificBlogPost={this.editSpecificBlogPost} token={this.state.token} />
            );
        } else if (this.state.activePage == 3) {
            //specific blog posts
            content = (
                <EditBlogPost token={this.state.token} returnDashboard={() => { this.setState({ activePage: 1 }); }} postId={this.state.editPostId} />
            );
        } else if (this.state.activePage == 4) {
            //all listings to verify
            content = (
                <AllListings token={this.state.token} />
            );
        } else if(this.state.activePage == 5){
            //new blog post
            content = (
                <PredefinedItems token={this.state.token} />
            );
        }else if(this.state.activePage == 6){
            //new guest user
            content = (
                <NewGuestUser token={this.state.token} />
            );
        }else if(this.state.activePage == 7){
            //new guest listing
            content = (
                <NewGuestListing token={this.state.token} />
            );
        }else if(this.state.activePage == 8){
            content = (
                <ExistingGuestListings token={this.state.token} />
            );
        }

        return (
            <div>
                <div id={styles2.nav}>
                    <Link to="/" className={"regularTextBold"}>Cambio</Link>
                    <p className={"regularTextBold"} onClick={() => { this.setState({ activePage: 1 }); }}>Dashboard</p>
                    <p className={"regularTextBold"} onClick={() => { this.setState({ activePage: 2 }); }}>Blog posts</p>
                    <p className={"regularTextBold"} onClick={() => { this.setState({ activePage: 4 }); }}>Listings to verify</p>
                    <p className={"regularTextBold"} onClick={() => { this.setState({ activePage: 5 }); }}>Predefined items</p>
                    <p className={"regularTextBold"} onClick={() => { this.setState({ activePage: 6 }); }}>New guest user</p>
                    <p className={"regularTextBold"} onClick={() => { this.setState({ activePage: 7 }); }}>New guest listing</p>
                    <p className={"regularTextBold"} onClick={() => { this.setState({ activePage: 8 }); }}>Guest listings & offers</p>
                </div>
                <div>
                    {content}
                </div>
            </div>
        );
    }
}

export default Dashboard;