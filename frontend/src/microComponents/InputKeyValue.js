import React from "react";
const inputKeyValue = (props) => (
    <div>
        <label htmlFor={props.id}>{props.text}</label>
        <input type="text" id="" name={props.text} onChange={(e) => { props.onTextBoxChange(e) }} value={props.value}></input>
    </div>
);
export default inputKeyValue;