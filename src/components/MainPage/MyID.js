import React from "react";
import Inbox from "./Inbox";
import Outbox from "./Outbox";
import {searchArray} from "../../services/irc";

export default class MyID extends React.Component{
    state = {inbox:true, outbox:false, messages: [], messageInter:undefined, replytomessage:""}
    componentDidMount(){
        this.getMessages();
        this.state.messageInter = setInterval(this.getMessages, 600000);
    }
    componentWillUnmount(){
        clearInterval(this.state.messageInter);
    }
    getMessages = ()=>{
        fetch("/umc/"+this.props.me.fingerprint, {
            method: "GET"
        }).then((ful)=>{
            ful.json().then((messages)=>{
                this.setState({messages: []});
                messages.forEach((message, index)=>{
                    if (message.from!==this.props.me.fingerprint&&!message.decrypted){
                        this.readMessage(message.message, index, message.from, message.timestamp);
                    }
                })
            })
        })
    }
    verifySignature = (signature, message, publicKey)=>new Promise((res, rej)=>{
        if (!signature){
            res(false);
        }else{
            crypto.subtle.importKey("spki", Buffer.from(publicKey, "base64").buffer, {name:"RSA-PSS", modulusLength:1024, hash:"SHA-256"}, false, ["verify"]).then((key)=>{
                crypto.subtle.digest("SHA-256", message).then((hash)=>{
                    crypto.subtle.verify({name: "RSA-PSS", saltLength: 32}, key, Buffer.from(signature, "base64").buffer, hash).then(res).catch(rej);
                }).catch(rej);
            }).catch(rej);
        }
        
    })
    readMessage = (message, index, from, timestamp)=>{
        const contacts = localStorage.getItem("contacts");
        if (contacts){
        const AES = JSON.parse(message.substring(message.indexOf("-----AES KEY START-----"), message.indexOf("-----AES KEY END-----")).replace("-----AES KEY START-----", "").trim());
        const wrapped = AES.wrapped;
        const iv = Buffer.from(Object.keys(AES.iv).map((key)=>AES.iv[key]));
            this.unwrapAES(wrapped, this.props.me.privateKey).then((AESKey)=>{
                const content = message.split("-----MESSAGE BODY-----")[1].split("-----SENDER SIGNATURE-----")[0];
                this.decryptMessage(AESKey, iv, content).then((body)=>{
                    this.verifySignature(message.split("-----SENDER SIGNATURE-----")[1], body, this.resolveFrom(from).publicKey).then((verified)=>{
                        console.log({verified});
                        this.state.messages.splice(index, 1, {index, message:Buffer.from(body).toString(), decrypted:true, from, timestamp, verified});
                        this.setState({messages: this.state.messages});
                    }).catch(console.log);
                    
                }).catch((err)=>{console.log(err)});
            }).catch((err)=>{console.log(err)});
        }
    }
    unwrapAES = (AES, pkey)=>new Promise((res, rej)=>{
        crypto.subtle.importKey("pkcs8", Buffer.from(pkey, "base64").buffer, {name:"RSA-OAEP", hash:"SHA-256"}, false, ["unwrapKey"]).then((pkey)=>{
            crypto.subtle.unwrapKey("raw", Buffer.from(AES, "base64").buffer, pkey, {name: "RSA-OAEP"}, {name:"AES-GCM"},false, ["decrypt"]).then((ckey)=>{
                res(ckey)
            }).catch((err)=>{rej(err)});
        }).catch((err)=>{rej(err)});
    })
    resolveFrom = (fingerprint)=>{
        const contacts = JSON.parse(localStorage.getItem("contacts"))||[];
        const index = searchArray("fingerprint", fingerprint, contacts);
        if (index!==-1){
            return contacts[index];
        }
        return {fingerprint};
    }
    decryptMessage = (AES, iv, encrypted)=>crypto.subtle.decrypt({name:"AES-GCM", iv}, AES, Buffer.from(encrypted, "base64").buffer);
    render = ()=>(
        <div>
            <div className="IDBar">
                <h4>{this.props.me.alias}</h4><div className="linkContainer"><h5>{this.props.me.fingerprint}</h5></div>
            </div>
            <div className="smallbar">
                <button onClick={()=>{this.setState({inbox: true, outbox: false})}}>Inbox {this.state.messages.length}</button><button onClick={()=>{this.setState({inbox: false, outbox: true})}}>Outbox</button>
            </div>
            <div>
                {this.state.inbox&&<Inbox fingerprint={this.props.me.fingerprint} messages={this.state.messages} resolveFrom={this.resolveFrom} reply={({fingerprint, replytomessage})=>{
                    this.props.setDestination(this.resolveFrom(fingerprint)),
                    this.setState({replytomessage, inbox:false, outbox:true})}}/>}
                {this.state.outbox&&<Outbox privateKey={this.props.me.privateKey} fingerprint={this.props.me.fingerprint} destination={this.props.destination} replytomessage={this.state.replytomessage} finish={()=>{this.setState({replytomessage:""})}}/>}
            </div>
        </div>
        
        )
}
