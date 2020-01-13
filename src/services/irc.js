const registeredComponents = [];
const register = (name)=>{
    if (searchArray("name", name, registeredComponents)==-1){
        registeredComponents.push({name, pickupstate:{}});
    }
}
const update = (oldobject, newobject)=>{
    Object.keys(newobject).forEach((key)=>{
        oldobject[key]=newobject[key];
    })
}
const setState = (stateobject, name)=>{
    let index = searchArray("name", name, registeredComponents);
    if(index!=-1){   
    update(registeredComponents[index].pickupstate, stateobject)
    }
}
const getState = (name)=>{
    let index = searchArray("name", name, registeredComponents);
    if(index!=-1){
        const returnstatement = registeredComponents[index].pickupstate;
        registeredComponents[index].pickupstate = {};
        return returnstatement;
    }
}
const searchArray = (searchkey, searchvalue, array)=>{
    let search = array.map((item)=>item);
    let bound = Math.round(search.length/2);
    while(search.length>1){
        if (searchvalue<search[bound][searchkey]){
            search.splice(bound, search.length-bound);
        }else{
            search.splice(0, bound);
        }
        bound=Math.round(search.length/2);
    }
    if (search[0]&&search[0][searchkey]===searchvalue){
        return array.indexOf(search[0]);
    }
    return -1;
}
module.exports={
    setState,
    register,
    searchArray,
    getState
}