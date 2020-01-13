import React from "react";


export default class MessageView extends React.Component{
    state={
        show: false
    }
    render(){
    return (
        <div className="MessageBox">
            <button onClick={()=>{this.setState({show:!this.state.show})}}>From: {this.props.from.alias?(this.props.from.alias+(this.props.verified?" verified":" CAUTION: not verified")):"unregistered fingerprint"} {new Date(this.props.timestamp).toLocaleTimeString()} ({this.state.show?"hide":"show"})</button><label>{this.props.from.fingerprint}</label>
            {this.state.show&&<textarea value={this.props.message} readOnly/>}
            {this.state.show&&<button onClick={()=>{this.props.reply({fingerprint:this.props.from.fingerprint, replytomessage:this.props.message})}}>Reply</button>}
        </div>
    )
}
    

}
