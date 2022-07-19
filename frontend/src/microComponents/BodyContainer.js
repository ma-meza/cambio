import React from "react";
import styles from "public/style/bodyContainer.module.css";

function Body(props) {
    return <div id={styles.mainBody}>
        {props.children}
    </div>
}

export default Body;