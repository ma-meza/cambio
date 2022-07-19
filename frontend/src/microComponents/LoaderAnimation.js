import React from "react";
import styles from "public/style/loaderAnimation.module.css";

function Spinner() {
    return (
        <div id={styles.spinnerContainer}>
            <div id={styles.spinnerInnerContainer}>
                <div className={styles.lds_ellipsis}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}

export default Spinner;