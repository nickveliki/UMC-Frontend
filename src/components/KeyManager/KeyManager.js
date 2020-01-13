import React from "react";
import * as irc from "../../services/irc";

export default class KeyManager extends React.Component{
    state={
        publicKey: "",
        privateKey: "",
        fingerprint: "",
        alias:"",
        password:""
    }
    setMainPageState = (stateobj)=>{
        irc.setState(stateobj, "MainPage");
    }
    formSubmit = (ev)=>{
        ev.preventDefault();
        if (this.state.alias&&this.state.publicKey){
            fetch("/umc/", {
            method: "POST",
            body: JSON.stringify({key: this.state.publicKey, alias: this.state.alias}),
            headers:{"Content-Type":"Application/json"}
        }).then((response)=>{
            response.arrayBuffer().then((ful)=>{
                const fingerprint = JSON.parse(Buffer.from(ful).toString()).fingerprint;
                this.setState({fingerprint});
            })
        }).catch((err)=>{console.log(err)});
        }
        
    }
    allAvailable = ()=>{
        if (this.state.fingerprint!==""&&this.state.privateKey!==""&&this.state.publicKey!==""&&this.state.alias!==""){
        this.setMainPageState({me:{fingerprint: this.state.fingerprint, publicKey: this.state.publicKey, privateKey: this.state.privateKey, alias: this.state.alias}});
        }
    }
    readFile = (ev)=>{
        ev.target.files[0].arrayBuffer().then((res)=>{
           const text = Buffer.from(res).toString();
           const privateKey = text.substring(text.indexOf("-----BEGIN RSA PRIVATE KEY-----"),
           text.indexOf("-----END RSA PRIVATE KEY-----")).replace("-----BEGIN RSA PRIVATE KEY-----", "").trim();
           const publicKey = text.substring(text.indexOf("-----BEGIN PUBLIC KEY-----"),
           text.indexOf("-----END PUBLIC KEY-----")).replace("-----BEGIN PUBLIC KEY-----", "").trim();
           const fingerprint = text.substring(text.indexOf("-----BEGIN FINGERPRINT-----"),
           text.indexOf("-----END FINGERPRINT-----")).replace("-----BEGIN FINGERPRINT-----", "").trim();
           const alias = text.substring(text.indexOf("-----BEGIN ALIAS-----"),
           text.indexOf("-----END ALIAS-----")).replace("-----BEGIN ALIAS-----", "").trim();
           this.setState({privateKey, publicKey, fingerprint, alias});
        }).catch((err)=>{console.log(err)});
    }
    componentDidUpdate(){
        if (this.state.publicKey&&this.state.privateKey&&this.state.fingerprint){
            this.writeFile();
        }
        this.allAvailable();
    }
    writeFile = ()=>{
        let B = new Blob(["-----BEGIN RSA PRIVATE KEY-----\r\n", this.state.privateKey, "\r\n-----END RSA PRIVATE KEY-----\r\n", "-----BEGIN PUBLIC KEY-----\r\n", this.state.publicKey, "\r\n-----END PUBLIC KEY-----\r\n", "-----BEGIN FINGERPRINT-----\r\n", this.state.fingerprint, "\r\n-----END FINGERPRINT-----", "\r\n-----BEGIN ALIAS-----\r\n", this.state.alias, "\r\n-----END ALIAS-----"]);
        const download = document.getElementById("exflink");
        download.href=URL.createObjectURL(B);
        download.download=this.state.alias+".umc";
    }
    deriveKey = ()=>new Promise((res, rej)=>{
            crypto.subtle.importKey("raw",
            Buffer.from(this.state.password).buffer, 
            {name: "PBKDF2"},
            false,
            ["deriveBits", "deriveKey"]).then((keyMaterial)=>{
                crypto.subtle.deriveKey(
                    {
                        "name": "PBKDF2",
                        salt: Buffer.from("rock").buffer,
                        "iterations": 100000,
                        "hash": "SHA-256"
                      },
                      keyMaterial,
                      { "name": "AES-GCM", "length": 256},
                      true,
                      [ "encrypt", "decrypt" ]
                ).then((key)=>{
                    crypto.subtle.deriveBits(
                        {
                            "name": "PBKDF2",
                            salt:Buffer.from("salt").buffer,
                            "iterations":100000,
                            "hash":"SHA-256"
                        },
                        keyMaterial,
                        256
                    ).then((iv)=>{
                        res({key, iv});
                    }).catch(rej);
                }).catch(rej);
            }).catch(rej);
    })
    encodePkey = (ev)=>{
        ev.preventDefault();
        if (this.state.password!=""&&this.state.privateKey!=""){
            this.deriveKey().then((sec)=>{
                crypto.subtle.encrypt({"name":"AES-GCM", iv: sec.iv}, sec.key, Buffer.from(this.state.privateKey, "base64").buffer).then((AB)=>{
                    const privateKey = Buffer.from(AB).toString("base64");
                    this.setState({privateKey});
                })
            }).catch(console.log);
        }
    }
    decodePKey = (ev)=>{
        ev.preventDefault();
        if (this.state.password!=""&&this.state.privateKey!=""){
            this.deriveKey().then((sec)=>{
                crypto.subtle.decrypt({"name":"AES-GCM", iv: sec.iv}, sec.key, Buffer.from(this.state.privateKey, "base64").buffer).then((AB)=>{
                    const privateKey = Buffer.from(AB).toString("base64");
                    this.setState({privateKey});
                })
            }).catch(console.log)
        }
    }
    generateKeys = () =>{
        
        crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 1024,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, true, ["encrypt", "decrypt"]).then((ful)=>{
            crypto.subtle.exportKey("pkcs8", ful.privateKey).then((ful)=>{
                this.setState({privateKey: Buffer.from(ful).toString("base64")})
            })
            crypto.subtle.exportKey("spki", ful.publicKey).then((ful)=>{
                this.setState({publicKey: Buffer.from(ful).toString("base64")})
            })
        })
    }
    render(){
        return (<div>
                <form onSubmit={this.formSubmit} className="KeyForm">
                    <textarea placeholder="paste private key here or import from file" className="KeyBox" value={this.state.privateKey} onChange={(ev)=>{this.setState({privateKey: ev.target.value})}}></textarea>
                    <textarea placeholder="paste public key here or import from file" className="KeyBox" value={this.state.publicKey} onChange={(ev)=>{this.setState({publicKey: ev.target.value})}}></textarea>
                    <textarea placeholder="paste key fingerprint here or import from file" className="fingerprint" value={this.state.fingerprint} onChange={(ev)=>{this.setState({fingerprint: ev.target.value})}}></textarea>
                    <div className="buttonContainer">
                        <div className="smallField">
                            <label htmlFor="file-upload" className="file-input">
                            import file
                            </label>
                            <input className="submitPkey" type="submit" value="register public key"></input>
                        </div>
                        <div className="smallField">
                            <label style={{margin:"1rem"}} >Your Alias <input value={this.state.alias} type="text" onChange={(ev)=>{
                                this.setState({alias: ev.target.value});
                            }}/></label>
                            <a style={{margin:"1rem"}} href="/" id="exflink" download>export file</a>
                            <div className="input-wrapper-column">
                                <label>Password for Private Key</label>
                                <input type="text" value={this.state.password} onChange={(ev)=>{this.setState({password:ev.target.value})}}></input>
                                <div className="input-wrapper">
                                    <button className="submitPkey" onClick={this.encodePkey}>encode</button><button className="submitPkey" onClick={this.decodePKey}>decode</button>
                                </div>
                                </div>
                            </div>
                        </div>
                        <input id="file-upload" type="file" onChange={this.readFile}/>
                </form>
                <div>
                    <button onClick={this.generateKeys}>Generate Keypair (RSA1024)</button>
                </div>
            </div>)

    }

}