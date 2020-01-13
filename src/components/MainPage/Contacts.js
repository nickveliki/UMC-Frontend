import React from 'react';
import Contact from './Contact';

export default class Contacts extends React.Component{

    state = {
        contacts: [],
        interval: 0
    }
    getContacts = ()=>{
        fetch("/umc/", {
            method: "GET"
        }).then((ful)=>{
            ful.json().then((contacts)=>{
            this.setState({contacts: contacts.filter((contact)=>!(this.props.myID&&this.props.myID()&&contact.fingerprint==this.props.myID()))});
            localStorage.setItem("contacts", JSON.stringify(contacts));
            }).catch((err)=>{console.log(err)});
            
        }).catch(()=>{
            this.setState({contacts:[]})
        })
    }
    componentDidMount(){
        this.getContacts();
        this.state.interval=setInterval(this.getContacts, 60000);
    }
    componentWillUnmount(){
        clearInterval(this.state.interval);
    }
    render(){
        return (<div className="PanelLeft">
               <h3> Contacts</h3>
                {this.state.contacts.map((contact, i)=><Contact contact={contact} key={i} onClick={this.props.selectDestination}/>)}
            </div>)
    }
}