import React from "react";
import styles from "public/style/modal.module.css";
export default class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.outsideClickRef = React.createRef();
    }
    handleOutsideClick(e) {
        if (e.target == this.outsideClickRef.current) {
            this.props.closeModal();
        }
    }
    render() {
        if (!this.props.show) {
            return null;
        }
        return (
            <div ref={this.outsideClickRef} id={styles.modalTransparentBody} onClick={this.handleOutsideClick}>
                <div id={styles.modalBody}>
                    <div className={styles.topContainer}>
                        {
                            this.props.title ?
                                <p className={"title2"} id={styles.modalTitleP}>{this.props.title}</p>
                                :
                                null
                        }
                        <img src="https://staticassets2020.s3.amazonaws.com/octiconsSvg/x.svg" onClick={this.props.closeModal} className={styles.closeButton} />
                    </div>
                    {
                        this.props.description ?
                            <div className={styles.contentContainer}>
                                <p className={"regularText " + styles.regularTextNoMargin}>{this.props.description}</p>
                            </div>
                            :
                            null
                    }
                    <div className={styles.contentContainer}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}