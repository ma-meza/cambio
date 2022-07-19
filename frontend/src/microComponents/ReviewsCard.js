import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "public/style/reviewsCard.module.css";


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            rating: 1,
            listingId: 0
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitReview = this.submitReview.bind(this);
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

    submitReview() {
        let comment = this.state.comment;
        let rating = this.state.rating;
        let listingId = this.state.listingId;
        axios.post(window.api_prefix+"/postReview", { comment: comment, rating: rating, listingId: listingId }).then().catch();
        this.props.submitReview();
    }

    render() {
        return (
            <div>
                <div className={styles.rating}>
                    <input type="radio" value="5" onChange={this.handleInputChange} checked={this.state.rating == 5} name="rating" id={styles.rating5} />
                    <label htmlFor={styles.rating5}></label>
                    <input type="radio" value="4" onChange={this.handleInputChange} checked={this.state.rating == 4} name="rating" id={styles.rating4} />
                    <label htmlFor={styles.rating4}></label>
                    <input type="radio" value="3" onChange={this.handleInputChange} checked={this.state.rating == 3} name="rating" id={styles.rating3} />
                    <label htmlFor={styles.rating3}></label>
                    <input type="radio" value="2" onChange={this.handleInputChange} checked={this.state.rating == 2} name="rating" id={styles.rating2} />
                    <label htmlFor={styles.rating2}></label>
                    <input type="radio" value="1" onChange={this.handleInputChange} checked={this.state.rating == 1} name="rating" id={styles.rating1} />
                    <label htmlFor={styles.rating1}></label>
                </div>


                <textarea className={"inputText " + styles.textarea + " regularText"} placeholder="How was the seller?" name="comment" value={this.state.comment} onChange={this.handleInputChange}></textarea>
                <div className="modalSubmitButtonDiv">
                    <button className="modalSubmitButton regularTextMedium buttonCta" onClick={this.submitReview}>Submit</button>
                </div>
            </div>
        );
    }
}


export default withTranslation()(Index);
