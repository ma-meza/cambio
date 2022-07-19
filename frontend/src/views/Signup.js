import React from "react";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../reduxActions/authActions";
import styles from "public/style/authenticationForms.module.css";
import Spinner from "microComponents/LoaderAnimation";
import axios from "axios";
import queryString from "query-string";


const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            username: "",
            formErrorMessage: "",
            isDataLoading: false,
            serverErrorMessage: "",
            usernameErrorMessage: "",
            usernameSuccessMessage: "",
            unameIsValid: false,
            isLoading: true,
            tokenValue: null,
            waitlistSuccessMessage: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.verifyUsername = this.verifyUsername.bind(this);
        this.handleWaitlistSubmit = this.handleWaitlistSubmit.bind(this);
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/home");
        }
        if (queryString.parse(window.location.search).token) {
            let tokenValue = queryString.parse(window.location.search).token;
            this.setState({
                isLoading: false,
                tokenValue: tokenValue
            });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.errors && nextProps.errors.message) {
            return { serverErrorMessage: nextProps.errors.message, isDataLoading: false };
        } else {
            return null;
        }
    }


    handleInputChange(e) {
        const { name, value } = e.target;
        if (name === "username") {
            this.setState({
                [name]: value,
                unameIsValid: false
            });
        } else {
            this.setState({
                [name]: value
            });
        }

    }

    verifyUsername() {
        this.setState({
            usernameSuccessMessage: "",
            usernameErrorMessage: ""
        });
        if (this.state.username.length > 0) {
            axios.get(window.api_prefix+"/usernameIsValid?uname=" + this.state.username).then(resp => {
                if (parseInt(resp.data.count) > 0) {
                    this.setState({
                        usernameSuccessMessage: "",
                        usernameErrorMessage: "This username is already taken.",
                        unameIsValid: false
                    });
                } else {
                    this.setState({
                        usernameSuccessMessage: "Congrats, this username is stil available.",
                        usernameErrorMessage: "",
                        unameIsValid: true
                    });
                }
            });
        }
    }

    handleWaitlistSubmit() {
        this.setState({
            formErrorMessage: "",
        });
        if (this.state.email.length > 0) {
            if (emailRegex.test(this.state.email) === true) {
                if (this.state.email.length >= 6 && this.state.email.length < 255) {
                    this.setState({
                        isDataLoading: true
                    });
                    let signupObj = { email: this.state.email };
                    axios.post(window.api_prefix+"/addUserToWaitlist", signupObj).then(resp => {
                        this.setState({
                            isDataLoading: false,
                            waitlistSuccessMessage: "You have successfully been added to our waitlist! Check your emails regularly."
                        });
                    }).catch(err => {
                        this.setState({
                            formErrorMessage: "There has been a server error, please try again."
                        });
                        this.setState({
                            isDataLoading: false
                        });
                    });
                } else {
                    this.setState({
                        formErrorMessage: "Your email should have between 6 and 255 characters."
                    });
                    this.setState({
                        isDataLoading: false
                    });
                }
            } else {
                this.setState({
                    formErrorMessage: "Your email is not valid."
                });
                this.setState({
                    isDataLoading: false
                });
            }
        } else {
            this.setState({
                formErrorMessage: "Please fill in all the fields."
            });
        }
    }

    handleFormSubmit() {
        this.setState({
            formErrorMessage: "",
        });
        if (this.state.email.length > 0 && this.state.password.length > 0 && this.state.username.length > 0 && this.state.tokenValue != null) {
            if (emailRegex.test(this.state.email) === true) {
                if (this.state.email.length >= 6 && this.state.email.length < 255) {
                    if (this.state.password.length >= 6 && this.state.password.length < 255) {
                        if (this.state.username.length < 255) {
                            if (this.state.unameIsValid == true) {
                                this.setState({
                                    isDataLoading: true
                                });
                                let signupObj = { token: this.state.tokenValue, email: this.state.email, password: this.state.password, username: this.state.username };
                                let queryStringValues = queryString.parse(window.location.search);
                                if(typeof queryStringValues.pwd != "undefined" && typeof queryStringValues.uid != "undefined"){
                                    signupObj.guestUserPassword = queryStringValues.pwd;
                                    signupObj.guestUserId = queryStringValues.uid;
                                }


                                this.props.registerUser(signupObj, this.props.history);
                            } else {
                                this.setState({
                                    formErrorMessage: "Please pick a valid username."
                                });
                            }
                        } else {
                            this.setState({
                                formErrorMessage: "Your last name should have less than 255 characters."
                            });
                        }
                    } else {
                        this.setState({
                            formErrorMessage: "Your password should have between 6 and 255 characters."
                        });
                    }
                } else {
                    this.setState({
                        formErrorMessage: "Your email should have between 6 and 255 characters."
                    });
                }
            } else {
                this.setState({
                    formErrorMessage: "Your email is not valid."
                });
            }
        } else {
            this.setState({
                formErrorMessage: "Please fill in all the fields."
            });
        }
    }
    render() {

        let errorMessage;
        if (this.state.formErrorMessage.length > 0) {
            errorMessage = <p className={"errorText " + styles.regularText}>{this.state.formErrorMessage}</p>
        } else if (this.state.serverErrorMessage.length > 0) {
            errorMessage = <p className={"errorText " + styles.regularText}>{this.state.serverErrorMessage}</p>
        }

        let usernameMessage;
        if (this.state.usernameErrorMessage.length > 0) {
            usernameMessage = <p className={"errorText " + styles.regularText}>{this.state.usernameErrorMessage}</p>;
        } else if (this.state.usernameSuccessMessage.length > 0) {
            usernameMessage = <p className={styles.regularText} style={{ color: "green" }}>{this.state.usernameSuccessMessage}</p>;
        }


        if (this.state.isLoading == true) {
            return <p>Loading...</p>
        }
        if (this.state.waitlistSuccessMessage.length > 0) {
            return (
                <div>
                    <div id={styles.bodyContainer}>
                        <div id={styles.formCard}>
                            <Link to="/">
                                <img alt="logo" id={styles.logo} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                            </Link>
                            <p className={"title1 " + styles.regularText}>We're currently still in beta release and it looks like you weren't on our waitlist!</p>
                            <p className={"regularTextMedium " + styles.regularText}>{this.state.waitlistSuccessMessage}</p>
                        </div>
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
        if (this.state.tokenValue == null) {
            return (
                <div>
                    <div id={styles.bodyContainer}>
                        <div id={styles.formCard}>
                            <Link to="/">
                                <img alt="logo" id={styles.logo} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                            </Link>
                            <p className={"title1 " + styles.regularText}>We're currently still in beta release and it looks like you weren't on our waitlist!</p>
                            <p className={"regularTextMedium " + styles.regularText}>Join our waitlist now to be the next member of our community.</p>
                            <input className={styles.inputText + " inputText regularText"} type="email" name="email" value={this.state.email} onChange={this.handleInputChange} placeholder="Email address"></input>
                            {errorMessage}
                            <p className={"regularText " + styles.regularText}>Already have an account? <Link to="/login" className={styles.link + " " + styles.regularText}>Sign in now.</Link></p>
                            <button className={styles.button + " buttonCta regularTextMedium"} onClick={this.handleWaitlistSubmit}>Continue</button>
                        </div>
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


        return (
            <div>
                <div id={styles.bodyContainer}>
                    <div id={styles.formCard}>
                        <Link to="/">
                            <img alt="logo" id={styles.logo} src="https://staticassets2020.s3.amazonaws.com/logos/logoV1orangeTransparent.png" />
                        </Link>
                        <p className={"title1 " + styles.regularText}>Let's get started!</p>
                        <input className={styles.inputText + " inputText regularText"} type="text" name="username" value={this.state.username} onChange={this.handleInputChange} onBlur={this.verifyUsername} placeholder="Pick a username"></input>
                        {usernameMessage}
                        <div id={styles.invSpace}></div>
                        <input className={styles.inputText + " inputText regularText"} type="email" name="email" value={this.state.email} onChange={this.handleInputChange} placeholder="Email address"></input>
                        <input className={styles.inputText + " inputText regularText"} type="password" name="password" value={this.state.password} onChange={this.handleInputChange} placeholder="Password"></input>
                        {errorMessage}
                        <p>By registering, you agree to our <Link className={styles.link + " " + styles.regularText}>Privacy policy</Link> and <Link className={styles.link + " " + styles.regularText}>Terms and conditions</Link></p>
                        <p className={"regularText " + styles.regularText}>Already have an account? <Link to="/login" className={styles.link + " " + styles.regularText}>Sign in now.</Link></p>
                        <button className={styles.button + " buttonCta regularTextMedium"} onClick={this.handleFormSubmit}>Continue</button>
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
}



Signup.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});


export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(withTranslation()(Signup)));