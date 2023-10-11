const User = require('../models/userModel');
const bcrypt = require('bcrypt');


let products = [{
    image: "https://rukminim1.flixcart.com/image/832/832/l31x2fk0/headphone/m/5/v/-original-image9ehhvpt8vzt.jpeg?q=70",
    CardTitle: " boAt Airdopes 161",
    discription: "ASAP Charge, 10mm Drivers and 17 Hours Playback Bluetooth Headset",
    button: "Add to cart"
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0057/8938/4802/products/245pro4_800x.png?v=1663584969",
    CardTitle: " JBL 230NCTWS",
    discription: "Active Noise Cancellation,40H Playtime,JBL App & Speed Charge Bluetooth Headset",
    button: "Add to cart"
  },
  {
    image: "https://rukminim1.flixcart.com/image/832/832/l31x2fk0/headphone/a/s/h/-original-image9ehehz8amg2.jpeg?q=70",
    CardTitle: "SONY WF-LS900N",
    discription: "Battery Life: 20hours, Noise Cancellation, TWS Bluetooth Headset",
    button: "Add to cart"
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0057/8938/4802/products/245pro4_800x.png?v=1663584969",
    CardTitle: "Sboat WF-LNM",
    discription: "Noise Cancellation, TWS Premium Bluetooth Headset , 20H Playtime Battery Life: 24hours" ,
    button: "Add to cart"
  },
  ]


//generate secure hash of password

const securePassword = async(password)=>{
    try{
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;

    }catch(err){
        console.log(err.message)
    }
}


//load register page

const loadRegister = async (req,res) =>{
    try{
        res.render('registration')

    }catch(err){
        console.log(err.message);
    }
}
// function to handle user registration

const insertUser = async(req,res)=>{
    try{
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:spassword,
            is_admin:0,
        })
    const userData = await user.save();
    if(userData){
        res.render('registration',{message:"Registration Successfully Completed "})
    }else{
        res.render('registration',{message:"Oops! Registration  Failed"})
    }
    }catch(err){
console.log(err.message)
    }
}

//login user methods 

const loginLoad = async (req,res) => {
    try{
        res.render('login')
    }catch(err){
        console.log(err.message)
    }
}

// login verifiction

const verifyLogin = async (req,res) => {
    try{
        const email = req.body.email
        const password = req.body.password 
        const userData = await User.findOne({email:email})

    if(userData){
        const passwordMatch = await bcrypt.compare(password, userData.password)
    if(passwordMatch){
        if(userData.is_admin=== 1){
            res.render('login',{message:"Email and password are incorrect"})
        }else{
            req.session.user_Id= userData._id;
            res.redirect('/home'); 
        } 
}else{
    res.render('login',{message:"Email and password are incorrect"})

}
}else{
    res.render('login',{message:"Email and password are incorrect"})   
}
    }
    catch(err){
        console.log(err.message)
    }

}
// load homepage
const loadHome =async (req, res) =>{
    try{
        res.render('home',{products:products});
    }catch(err){
        console.log(err.message)
    }
}

//logout to login page

const userLogout = async(req, res) =>{
    try{
        req.session.user_Id = null
        res.redirect('/')
    }catch(err){
        console.log(err.message)
    }
}

module.exports ={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}