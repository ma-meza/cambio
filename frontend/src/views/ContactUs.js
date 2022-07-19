import React from "react";
import { withTranslation } from "react-i18next";
import styles from "public/style/contactUs.module.css";
import axios from "axios";
import Footer from "microComponents/MvpFooter";
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


class contactUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailInput: "",
            nameInput: "",
            messageInput: "",
            formIsSubmitted: false,
            formErrorMessage: ""
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitButton = this.submitButton.bind(this);
    }

    handleInputChange(e) {
        const { value, name } = e.target;
        this.setState({
            [name]: value
        });
    }

    submitButton() {
        this.setState({
            formErrorMessage: ""
        });
        if (this.state.emailInput.length > 0 && this.state.nameInput.length > 0 && this.state.messageInput.length > 0) {
            if (emailRegex.test(this.state.emailInput) === true) {
                axios.post(window.api_prefix+'/submitContactUsForm', { email: this.state.emailInput, name: this.state.nameInput, message: this.state.messageInput }).then(resp => {
                    this.setState({
                        formIsSubmitted: true,
                        formErrorMessage: ""
                    });
                }).catch(err => {
                    if (err.response) {
                        this.setState({
                            formErrorMessage: "There has been a server error, please try again.",
                            formIsSubmitted: false
                        });
                    }
                });
            } else {
                this.setState({
                    formErrorMessage: "Please enter a valid email address."
                });
            }
        } else {
            this.setState({
                formErrorMessage: "Please fill in all the fields."
            });
        }
    }

    render() {

        let form;
        if (this.state.formIsSubmitted === false) {
            let errorMessage;
            if (this.state.formErrorMessage.length > 0) {
                errorMessage = <p className={"errorText " + styles.regularText}>{this.state.formErrorMessage}</p>
            }
            form = (
                <div>
                    <p className={"regularText " + styles.regularText}>Email</p>
                    <input className={"inputText " + styles.input} placeholder="me@email.com" value={this.state.emailInput} name="emailInput" onChange={this.handleInputChange} type="text"></input>
                    <p className={"regularText " + styles.regularText}>Name</p>
                    <input className={"inputText " + styles.input} placeholder="John Doe" value={this.state.nameInput} name="nameInput" onChange={this.handleInputChange} type="text"></input>
                    <p className={"regularText " + styles.regularText}>Message</p>
                    <textarea className={"inputText"} id={styles.textArea} placeholder="" value={this.state.messageInput} name="messageInput" onChange={this.handleInputChange}></textarea>
                    <button id={styles.submitButton} onClick={this.submitButton}>Submit</button>
                    {errorMessage}
                </div>
            );
        } else {
            form = <p className={"title2 " + styles.regularText}>Thanks for contacting us! We'll get back to you as soon as possible.</p>
        }

        return (
            <div id={styles.mainContainer}>

                <div id={styles.header}>
                    <a href="https://twitter.com">
                        <svg className={styles.socialIcon} xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 72 72" fill="#1da1f2">
                            <path d="M67.812 16.141a26.246 26.246 0 01-7.519 2.06 13.134 13.134 0 005.756-7.244 26.127 26.127 0 01-8.313 3.176A13.075 13.075 0 0048.182 10c-7.229 0-13.092 5.861-13.092 13.093 0 1.026.118 2.021.338 2.981-10.885-.548-20.528-5.757-26.987-13.679a13.048 13.048 0 00-1.771 6.581c0 4.542 2.312 8.551 5.824 10.898a13.048 13.048 0 01-5.93-1.638c-.002.055-.002.11-.002.162 0 6.345 4.513 11.638 10.504 12.84a13.177 13.177 0 01-3.449.457c-.846 0-1.667-.078-2.465-.231 1.667 5.2 6.499 8.986 12.23 9.09a26.276 26.276 0 01-16.26 5.606A26.21 26.21 0 014 55.976a37.036 37.036 0 0020.067 5.882c24.083 0 37.251-19.949 37.251-37.249 0-.566-.014-1.134-.039-1.694a26.597 26.597 0 006.533-6.774z">
                            </path>
                        </svg>
                    </a>
                </div>
                <div id={styles.mainInnerContainer}>
                    <div className={styles.halfDiv}>
                        <p className={"title1"} id={styles.headlineText}>We'd love to hear from you.</p>
                        {form}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}

export default withTranslation()(contactUs);