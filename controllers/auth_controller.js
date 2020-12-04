const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const {updateUser, deleteUser} = require("../utils/auth_utilities")

// helper functions
//const authenticate = passport.authenticate('local');

function registerNew(req, res) {
    //res.render("user/register");
}

function registerCreate(req, res, next) {
    const newUserHandler = (user) => {
        req.login(user, (err) => {
        if(err){
            next(err)
        } else {
            //console.log(user)
            res.send(user);
            //res.redirect("/home")
        }
        })
    }
    const { email, password, name, profile} = req.body;

    UserModel.create({ email, password, name, profile})
        .then(newUserHandler)
        .catch(x => console.log(x))
}

function logOut(req, res) {
    req.logout();
    //res.send("login create hit");
    res.redirect("/home");
}

function loginNew(req, res) {
    //res.render("user/login");
    res.send("this is login new");
}

function loginCreate(req, res) {
    const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET);
    req.session.jwt = token;
    //console.log("token", token)
    //res.send("Hello")
    res.json("login create hit");
}

//Account settings get ROUTE
function editUser(req, res) {
    //res.render("user/:name/account-settings")
    res.send("this is account settings");
}

//Account settings PATCH ROUTE
function editUserReq(req, res) {
    console.log("hit contorls")
    updateUser(req).exec((err, user) => {
        if (err) {
            res.status(500);
            return res.json({
                error: err.message
            });
        }
        console.log(err.message)
        //res.status(200);
        res.json(user)
        //res.redirect(`user/`${res.body.name}`/account-settings`);
    })
}

// async function removeUser (req, res) {
    
//     try{deleteUser(req.session.passport.user).exec(async (err) => {
//         if (err) {
//             res.status(500);
//             return res.json({
//                 error: err.message
//             });
//         }
//         else {res.redirect("/home")}
//     })}
//     catch(err) {console.log(err)}
// }



module.exports = {
    registerNew,
    registerCreate,
    logOut,
    loginNew,
    loginCreate,
    editUser,
    editUserReq
}