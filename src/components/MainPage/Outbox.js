import React from "react";

export default class Outbox extends React.Component{
    
    state={sent:false}
    encryptMessage = (message)=>new Promise((res, rej)=>{
        const iv = crypto.getRandomValues(new Uint8Array(12));
        crypto.subtle.generateKey({name:"AES-GCM", length: 128}, true, ["encrypt", "decrypt"]).then((AES)=>{
            crypto.subtle.encrypt({name: "AES-GCM", iv}, AES, Buffer.from(message).buffer).then((encrypted)=>{
                res({AES, encrypted: Buffer.from(encrypted).toString("base64"), iv});
            }).catch((err)=>{rej(err)});
        }).catch((err)=>{rej(err)});
    })
    wrapAES = (AES, pub)=>new Promise((res, rej)=>{
        crypto.subtle.importKey("spki", Buffer.from(pub, "base64").buffer, {name: "RSA-OAEP", hash:"SHA-256"}, false, ["wrapKey"]).then((bublic)=>{
            crypto.subtle.wrapKey("raw", AES, bublic, "RSA-OAEP").then((wrapped)=>{
                res(Buffer.from(wrapped).toString("base64"));
            }).catch((err)=>{rej(err)});
        }).catch((err)=>{rej(err)});
    })
    submit=(ev)=>{
        ev.preventDefault();
        const subject = ev.target.subject.value;
        const message = subject+"\r\n\n"+ev.target.message.value;
        this.encryptMessage(message).then((cryptInfo)=>{
            const AES = cryptInfo.AES;
            const encrypted = cryptInfo.encrypted;
            const iv = cryptInfo.iv;
            this.wrapAES(AES, this.props.destination.publicKey).then((wrapped)=>{
            this.signMessage(message, this.props.privateKey).then((signature)=>{
                const message = "-----AES KEY START-----\r\n"+JSON.stringify({wrapped, iv})+"\r\n-----AES KEY END-----\r\n-----MESSAGE BODY-----\r\n"+Buffer.from(encrypted).toString()+"\r\n-----SENDER SIGNATURE-----"+signature;
                fetch("/umc/"+this.props.fingerprint+"/"+this.props.destination.fingerprint+"/", {
                method:"POST",
                headers:{"Content-Type":"Application/json"},
                body: JSON.stringify({message})
                }).then((ful)=>{
                    if(ful.status<400){
                        this.setState({sent: true});
                        this.props.finish();
                        setTimeout(()=>{
                            this.setState({sent: false});
                        }, 5000);
                    }
                ful.json().then((ful)=>{
                }).catch((err)=>{console.log(err)})
                }).catch((err)=>{console.log(err)})
            }).catch(console.log)
            }).catch((err)=>{console.log(err)})


        }).catch((err)=>{console.log(err)})                           
    }
    signMessage=(message, privateKey)=>new Promise((res, rej)=>{
        const pkeydat = Buffer.from(privateKey, "base64").buffer;
        crypto.subtle.importKey("pkcs8", pkeydat, {name:"RSA-PSS", modulusLength:1024, publicExponent: new Uint8Array([1, 0, 1]), hash:"SHA-256"}, false, ["sign"]).then((key)=>{
            crypto.subtle.digest("SHA-256", Buffer.from(message).buffer).then((hash)=>{
                crypto.subtle.sign({"name":"RSA-PSS", saltLength:32}, key, hash).then((ful)=>{
                    res(Buffer.from(ful).toString("base64"));
                }).catch(rej);
            }).catch(rej)
        }).catch(rej)
    })
    render(){
        return (
            <div>
                {this.props.destination&&<div className="newMessage">
                <label>Destination: "{this.props.destination.alias}" ({this.props.destination.fingerprint}) </label>
                {!this.state.sent&&<form className="MessageForm" onSubmit={this.submit}>
                    <div className="input-wrapper">
                        <label>Subject</label><input defaultValue={this.props.replytomessage===""?"":("Re: "+this.props.replytomessage.split("\r\n")[0])} type="text" name="subject"></input>
                    </div>
                    <textarea name="message" defaultValue={this.props.replytomessage===""?"":("\r\n\n\n-----previous message from " + this.props.destination.alias+ "-----\r\n\n" + this.props.replytomessage)}></textarea>
                    <input type="submit" value="Send Message"></input>
                </form>}
                {this.state.sent&&<dir>
                    <label>message successfully sent to {this.props.destination.alias}</label>
                    </dir>}
            </div>}
            </div>
        )
    }
}