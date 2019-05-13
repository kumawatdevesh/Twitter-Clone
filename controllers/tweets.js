const Tweets = require('../util/tweet');

const ITEMS_PER_PAGE = 2;
exports.getTweets = (req, res, next) => {
    const page = req.query.page;
    const id = req.params.id;
    let totalTweets;
    const firstName = req.session.user.name;
    const lastName = req.session.user.lastname;
    Tweets.find()
    .countDocuments()
    .then(numTweets => {
        totalTweets = numTweets;
        return Tweets.find()
        .skip(( page - 1 ) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    }).then(tweet => {
        res.render('tweets', {
            t: tweet,
            id: id,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalTweets,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastpage: Math.ceil(totalTweets / ITEMS_PER_PAGE),
            firstName: firstName,
            lastName: lastName
        });
    })
    .catch(err => {
        console.log(err);
    })
    .catch(err => {
        console.log(err);
    })
};

exports.postTweets = (req, res, next) => {
    const tweet = req.body.tweet;
    const id = req.body.id;
    const tweets = new Tweets({
       id: id, 
       tweet: tweet 
    });
    req.session.myTweets = tweets;
    tweets.save();
    res.redirect('/tweets/'+ id);
};