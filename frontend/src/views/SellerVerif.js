import React from "react";
import axios from "axios";
import InputKeyValue from "microComponents/InputKeyValue";
class Payment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setupBegan: false,
            isLoading: true,
            error: null,
            account: null,
            fieldsNeededForm: {}
        }
        this.beginSetup = this.beginSetup.bind(this);
        this.startAccountSetup = this.startAccountSetup.bind(this);
        this.handleStripeInputChange = this.handleStripeInputChange.bind(this);
        this.handleSubmitFieldsNeeded = this.handleSubmitFieldsNeeded.bind(this);
    }


    componentDidMount() {
        this.fetchStripeAccount();
    }

    startAccountSetup() {
        this.setState({
            isLoading: true
        });
        axios.post(window.api_prefix+"/stripe-createAccount", { country: "CA" }).then(resp => {
            const { success, message, setupBegan } = resp.data;
            if (success) {
                this.fetchStripeAccount();
            } else {
                this.setState({
                    error: message,
                    isLoading: false
                });
            }
        });

    }
    fetchStripeAccount() {
        axios.post(window.api_prefix+"/stripe-getAccount").then(resp => {
            const { success, message, setupBegan, account } = resp.data;
            if (success) {
                this.setState({
                    setupBegan,
                    isLoading: false,
                    account
                });
            } else {
                this.setState({
                    error: message,
                    isLoading: false
                });
            }
        });
    }
    handleStripeInputChange(e) {
        const { name, value } = e.target;
        let fieldsNeededForm = this.state.fieldsNeededForm;
        fieldsNeededForm[name] = value;
        this.setState({
            fieldsNeededForm: fieldsNeededForm
        });
    }

    handleSubmitFieldsNeeded() {
        this.setState({
            isLoading: true
        });
        axios.post(window.api_prefix+"/stripe-saveFieldsNeeded", this.state.fieldsNeededForm).then(resp => {
            const { success, message, setupBegan } = resp.data;
            if (success) {
                console.log("DDNDN");
                this.fetchStripeAccount();
            } else {
                console.log("ERROR");
                this.setState({
                    error: message,
                    isLoading: false
                });
            }
        });
    }

    beginSetup() {
        this.startAccountSetup();
    }
    render() {
        if (this.state.isLoading) {
            return <p>Loading...</p>
        }
        if (!this.state.setupBegan) {
            return (
                <div>
                    {
                        this.state.error ?
                            <p>{this.state.error}</p> :
                            null
                    }
                    <button onClick={this.beginSetup}>Begin Setup</button>
                </div>
            );
        }
        console.log(this.state.account);

        const fieldsNeeded = this.state.account.requirements.currently_due;
        return (
            <div>

                {   this.state.error ?
                    <p>{this.state.error}</p> :
                    null
                }
                {
                    fieldsNeeded.length === 0 ?
                        <p>All set!</p>
                        :
                        (
                            fieldsNeeded.map((field, key) => {
                                let value = this.state.fieldsNeededForm[field] ? this.state.fieldsNeededForm[field] : "";
                                return (
                                    <InputKeyValue text={field} id={field} value={value} key={key} onTextBoxChange={(e) => this.handleStripeInputChange(e)} />
                                )
                            })
                        )
                }
                <button onClick={this.handleSubmitFieldsNeeded}>Submit</button>
            </div>
        );
    }
}

export default Payment;