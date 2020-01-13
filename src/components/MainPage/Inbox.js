import React from "react";
import MessageView from "./MessageView";

export default (props)=>(
            <div className="MessagePanel">
                {props.messages.map((message, i)=><MessageView from={props.resolveFrom(message.from)} message={message.message} timestamp={message.timestamp} key={i} verified={message.verified} reply={props.reply}/>)}
            </div>
)