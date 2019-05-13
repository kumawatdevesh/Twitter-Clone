const Register = require('../util/register');

exports.getProfile = (req, res, next) => {

    const id = req.session.user.id;
    const firstName = req.session.user.name;
    const lastName = req.session.user.lastName;
    const myTweet = req.session.myTweets.tweet;
    console.log('profile', id);
    Register.findOne({id: id})
    .then(user =>{
        res.render('profile',{
            user: user,
            id: id,
            firstName: firstName,
            lastName: lastName,
            tweets: myTweet
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.postProfile = (req, res, next) => {
    const id = req.body.id;
    res.redirect('/login/' + id);
};

exports.getEditProfile = (req, res, next) => {
    //const edit = req.query.edit;
    const id = req.params.id;
    // if(!query){
    //     res.redirect('/profile');
    // }
    Register.findOne({id: id})
    .then(user => {
        if(!user){
            res.redirect('/login');
        }else{
            res.render('edit-profile',{
                user: user,
                id: id
            });
        }
    });
};

exports.getPostProfile = (req, res, next) => {
    const id = req.session.user.id;
    console.log(id);
    const updatedName = req.body.name;
    const updatedLastName = req.body.lastName;
    const updatedEmail = req.body.email;

    Register.findOne({id: id})
    .then(user => {
        if(req.session.user.id !== user.id){
            res.redirect('/login');
        }else{
        user.id = req.session.user.id;
        user.name = updatedName;
        user.lastname = updatedLastName;
        user.email = updatedEmail;
        user.password = req.session.user.password;
        return user.save();
        }
    })
    .then(result => {
        res.redirect('/tweets/'+ req.session.user.id);
        console.log('updated');
    })
};