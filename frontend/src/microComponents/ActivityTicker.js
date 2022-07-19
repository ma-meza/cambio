import React from "react";
import { withTranslation } from "react-i18next";
import styles from "public/style/activityTicker.module.css";
class Tickers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyEvents: [],
        }
    }

    componentDidMount() {
        this.setState({
            historyEventsy: [
                {
                    username: "John Doe",
                    type: "RECEIVED",
                    categoryName: "iPhone X",
                    price: 329
                },
                {
                    username: "Ginna12e",
                    type: "PURCHASED",
                    categoryName: "MakerBot 3D Printer",
                    price: 1008
                },
                {
                    username: "John Doe",
                    type: "RECEIVED",
                    categoryName: "iPhone X",
                    price: 329
                },
                {
                    username: "Ginna12e",
                    type: "PURCHASED",
                    categoryName: "MakerBot 3D Printer",
                    price: 1008
                },
                {
                    username: "John Doe",
                    type: "RECEIVED",
                    categoryName: "iPhone X",
                    price: 329
                },
                {
                    username: "Ginna12e",
                    type: "PURCHASED",
                    categoryName: "MakerBot 3D Printer",
                    price: 1008
                },
                {
                    username: "John Doe",
                    type: "RECEIVED",
                    categoryName: "iPhone X",
                    price: 329
                },
                {
                    username: "Ginna12e",
                    type: "PURCHASED",
                    categoryName: "MakerBot 3D Printer",
                    price: 1008
                }
            ],
        });
    }

    render() {
        const { t } = this.props;

        let historyEvents;
        if (this.state.historyEvents.length > 0) {
            historyEvents = this.state.historyEvents.map((event, key) => {
                let sentence;
                if (event.type === "RECEIVED") {
                    return null;
                    sentence = <p className={styles.regularTextNoMargin + " regularText"}><span className={"regularTextMedium"}>{event.username}</span> just received <span className={"regularTextMedium"}>{event.categoryName}</span></p>;
                } else {
                    sentence = <p className={styles.regularTextNoMargin + " regularText"}><span className={"regularTextMedium"}>{event.username}</span> just bought <span className={"regularTextMedium"}>{event.categoryName}</span> for <span className={"regularTextMedium"}>{event.price}</span></p>;
                }
                return (
                    <div className={styles.historyEventCard} key={key}>
                        {sentence}
                    </div>
                );
            });
        } else {
            historyEvents = <p className={"regularText " + styles.regularText + " " + styles.divTitleP}>No items for you yet.</p>
        }


        return (
            <div id={styles.historyTabMainContainer}>
                <p className={styles.divTitleP + " regularTextBold"}>Similar items for you</p>
                {historyEvents}
            </div>
        );
    }
}


export default withTranslation()(Tickers);
