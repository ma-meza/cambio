import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styles from "../style/employeeStyle.module.css";
import axios from "axios";
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName:"",
            signupSource:0,
            email:"",
            errorMessage:"",
            description:"",
            signupSourceValues:["organic","guest_fake_supply"],
            allGuestUsers:[],
            guestUserSelect:0
        }
        this.createUser = this.createUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        axios.get(window.api_prefix+"/getAllGuestUsers").then(resp=>{
            this.setState({
                allGuestUsers:resp.data
            });
        }).catch(err=>{
            if(err.response){
                alert("Error retrieving guest users");
            }
        });
    }

    handleChange(e){
        const {name, value} = e.target;
        this.setState({
            [name]:value
        })
    }

    createUser() {
        this.setState({
            errorMessage: ""
        });
        if(this.state.userName.length==0 || this.state.description.length==0){
            return this.setState({
                errorMessage:"Please fill in all fields."
            });
        }
        axios.post(window.api_prefix+"/createGuestUser", { email:this.state.email, username:this.state.userName, description:this.state.description }).then(resp => {
           alert("SUCCESS!");
        }).catch(err => {
            if (err.response) {
                this.setState({
                    errorMessage: err.response.data.message
                });
            }
        });
    }

    render() {
        let allGuestUsers = this.state.allGuestUsers.map((user, key)=>{
            return (
                <option key={key} value={key}>{user.name}</option>
            );
        });
        let guestUserLinkValue = "";
        if(allGuestUsers.length>0){
            guestUserLinkValue = "https://joincambio.com/signup?token=50&pwd="+this.state.allGuestUsers[this.state.guestUserSelect].password+"&uid="+this.state.allGuestUsers[this.state.guestUserSelect].id;
        }
        return (
            <div>
                <div id={styles.articleContainer}>
                    <p className={"regularText " + styles.regularText}>username</p>
                    <input type={"text"} value={this.state.userName} onChange={this.handleChange} name={"userName"} />
                    <p className={"regularText " + styles.regularText}>email</p>
                    <input type={"text"} value={this.state.email} onChange={this.handleChange} name={"email"} />
                    <p className={"regularText " + styles.regularText}>description</p>
                    <textarea value={this.state.description} name={"description"} onChange={this.handleChange}></textarea>
                    {this.state.errorMessage.length > 0 ? this.state.errorMessage : null}
                    <button className={styles.button} onClick={this.createUser}>Create user</button>
                    <p className={"title2"}>Guest user signup link generator</p>
                    <select name="guestUserSelect" value={this.state.guestUserSelect} onChange={this.handleChange}>
                        {allGuestUsers}
                    </select>
                    <input type={"text"} value={guestUserLinkValue} />
                </div>
            </div>
        );
    }
}


export default withTranslation()(Index);
