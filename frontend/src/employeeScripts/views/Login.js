import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginEmployee } from "../../reduxActions/authActions";
import styles from "../../public/style/authenticationForms.module.css";
import Spinner from "../../microComponents/LoaderAnimation";

const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            formErrorMessage: "",
            isDataLoading: false,
            serverErrorMessage: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }


    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isEmployeeAuthenticated) {
            this.props.history.push("/home");
        }
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        console.log(nextProps.auth);
        if (nextProps.auth.isEmployeeAuthenticated) {
            nextProps.history.push("/home"); // push user to dashboard when they login
            return null;
        } else if (nextProps.errors && nextProps.errors.message) {
            console.log(nextProps);
            return { serverErrorMessage: nextProps.errors.message, isDataLoading: false };
        } else {
            return null;
        }
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleFormSubmit() {
        this.setState({
            formErrorMessage: ""
        });
        if (this.state.email.length > 0 && this.state.password.length > 0) {
            if (emailRegex.test(this.state.email) === true) {
                this.setState({ isDataLoading: true });
                let loginObj = { email: this.state.email, password: this.state.password };
                this.props.loginEmployee(loginObj);
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

Login.propTypes = {
    loginEmployee: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { loginEmployee }
)(withTranslation()(Login));