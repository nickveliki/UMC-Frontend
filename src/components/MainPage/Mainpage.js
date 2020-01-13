import React from "react";
import Contacts from "./Contacts";
import * as irc from "../../services/irc";
import MyID from "./MyID";
import HowTo from "./HowTo";

export default class MainPage extends React.Component{
    state={
        destination: undefined,
        me: undefined
    }
    componentDidMount(){
        irc.register("MainPage");
        const storedstate = irc.getState("MainPage");
        if (storedstate&&Object.keys(storedstate).length>0){
            this.setState(storedstate);
        }
    }
    render(){
        return (<div className="Page">
                <Contacts selectDestination={(destination)=>{
                    this.setState({destination});
                }} myID={()=>this.state.me?this.state.me.fingerprint:undefined}/>
                {this.state.me&&<MyID me={this.state.me} destination={this.state.destination} setDestination={(destination)=>{this.setState({destination})}}/>}
                {!this.state.me&&<HowTo/>}
            </div>)
    }
}