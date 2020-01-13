import React from "react";

const hyphenize = (word)=>{
    let rs = "";
    for (let i = 0; i < word.length/10; i++){
        rs+=word.substr(i*10, 10) + " ";
    }
    return rs;
}
const Contact = (props)=>(
    <div className="mini-container">
        <button onClick={()=>{
            props.onClick(props.contact)
        }}>{props.contact.alias}</button>
    </div>
)
export default Contact;