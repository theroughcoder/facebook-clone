const User = require("../models/userModel.js");

 const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?/)
    
}
 const validateLength = (text, min, max) => {
    if(text.length > max || text.length < min){
        return false;
    }else{
        return true;
    }
}
 const validateUsername = async(username) => {
    let a = false;

    do {
        let check = await User.findOne({username});
        if(check){
            username += (+new Date() * Math.random()).toString().substring(0, 1)
            a = true;
        } else {
            a = false;
        }
    } 
    while(a);
    return username;
}
module.exports = {validateEmail, validateLength, validateUsername}