const isLogin = async(req, res, next) =>{
    try {
        if (req.session.user_Id) {
            next();
        }
        else {
            return res.redirect('/login');
        }
    } catch (error) {
        console.error(error.message);
    }
};

const isLogout = async(req, res, next) =>{
    try{
        if(req.session.user_Id){
           return res.redirect('/home')
        }
    next()
    }catch(err){
        console.log(err.message);
    }
    }

module.exports ={
    isLogin,
    isLogout,
}
    