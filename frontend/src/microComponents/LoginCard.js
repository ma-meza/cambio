import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../reduxActions/authActions";
import styles from "public/style/authenticationForms.module.css";
import Spinner from "microComponents/LoaderAnimation";
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
        this.setState({
            listingId: this.props.listingId
        });
    }

    handleInputChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.auth.isAuthenticated) {
            nextProps.history.push("/home"); // push user to dashboard when they login
            return null;
        } else if (nextProps.errors && nextProps.errors.message) {
            return { serverErrorMessage: nextProps.errors.message, isDataLoading: false };
        } else {
            return null;
        }
    }

    handleFormSubmit() {
        this.setState({
            formErrorMessage: "",
        });
        if (this.state.email.length > 0 && this.state.password.length > 0) {
            if (emailRegex.test(this.state.email) === true) {
                this.setState({ isDataLoading: true });
                let loginObj = { email: this.state.email, password: this.state.password };
                this.props.loginUser(loginObj);
            } else {
                this.setState({
                    formErrorMessage: "Your email is not valid."
                });
            }
        } else {
            alert("yo");
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
                <p className={"title1 " + styles.regularText}>Welcome back!</p>
                <input className={styles.inputText + " inputText regularText"} type="email" name="email" value={this.state.email} onChange={this.handleInputChange} placeholder="Email address"></input>
                <input className={styles.inputText + " inputText regularText"} type="password" name="password" value={this.state.password} onChange={this.handleInputChange} placeholder="Password"></input>
                {errorMessage}
                <p className={"regularText " + styles.regularText}>Don't have an account? <Link to="/signup" className={styles.link + " " + styles.regularText}>Sign up now.</Link></p>
                <button className={styles.button + " buttonCta regularTextMedium"} onClick={this.handleFormSubmit}>Continue</button>
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
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { loginUser }
)((Login));