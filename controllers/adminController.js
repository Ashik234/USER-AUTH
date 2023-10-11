const User = require("../models/userModel");
const bcrypt = require("bcrypt");


const loadLogin =async(req,res) => {
try{
    res.render('login')
}catch(err){
    console.log(err.message)
}

}

//verifyLogin
const verifyLogin = async (req, res) => {

  try{
    const email = req.body.email
    const password = req.body.password
    const userData = await User.findOne({email:email})
if(userData){
    const passwordMatch = await bcrypt.compare(password,userData.password)
    if(passwordMatch){
        if(userData.is_admin ===0){
            res.render("login",{message:"Email and Password invalid"});
        }else{
            req.session.user_id = userData.id;
            res.redirect("/admin/home");
        }
    }else{
        res.render("login",{message:"Invalid Credentials"});
    }


}else{
    res.render("login",{message:"Invalid Credentials"});
}

  }catch(err){
    console.log(err.message)
  }
    
}
//dashboard
const loadDashboard =async (req,res)=>{
    try{

        res.render('home');
    
    }catch(err){
        console.log(err.message)
    }
}


const adminDashboard =async(req, res)=>{
    try{
       const usersData = await User.find({is_admin:0})
    res.render('dashboard',{users:usersData})
    }catch(err){
        console.log(err.message)
    }
}
//Add a new user
const newUserLoad = async(req, res)=>{
    try{
        res.render('new-user')
    }catch(err){

        console.log(err.message)
    }
}

const securePassword = async(password)=>{
    try{
    const passwordHash = await bcrypt.hash(password,10);
    return passwordHash;
    }catch(error){
        console.log(error.message)
    }  
    }


const addUser = async(req,res)=>{
try{

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const spassword = await securePassword(password)

    const user = new User({
    name: name,
    email: email,
    password: spassword,
    is_admin:0
    });

    const userData = await user.save();
   
   
    if(userData){
    res.redirect('/admin/dashboard')
    }else{
        res.render('new-user',{message:'Something went wrong'})
    }

}catch(err){
    console.log(err.message)
}

}

// edit user
const editUserLoad = async(req, res)=>{
    try{
        const id = req.query.id;
        const userData = await  User.findById({_id:id});
      if(userData){
        res.render('edit-user',{user:userData})

      }else{
        res.redirect('/admin/dashboard')

      }
    }catch(err){
        console.log(err.message)
    }
}

const updateUsers = async(req,res)=>{
try{
   const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}}) 
    
    res.redirect('/admin/dashboard')
}catch(err){
    console.log(err.message)

}
}
// delete user
const deleteUser = async(req, res) => {
    try{
        const id = req.query.id;
        await User.deleteOne({_id:id})
        res.redirect('/admin/dashboard')
    }catch(err){
        console.log(err.message)

    }
}

const logout = async(req,res)=>{
    try{
        req.session.user_id = null
        res.redirect("/admin");

    }catch(err){
        console.log(err.message)
    }
}

module.exports ={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}