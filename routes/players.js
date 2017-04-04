var express = require('express');
var router = express.Router();

/*
* GET users listing.
*/
router.get('/playerslist', function(req, res, next) {
    var db = req.db;
    var collection = db.get('playerlist');

    collection.find({},{},function(e,docs){
        res.json(docs);
        // console.log(docs, typeof(docs));
    });
});


/*
 * POST to adduser.
 */
router.put('/resultupdate', function(req, res) {
    var db = req.db;
    var collection = db.get('playerlist');

    req.body.data.forEach(function(player){
        collection.update({ _id: player._id }, player, {safe:true}, function(err, result){
            console.log(err, 'res', result);
        });
    });

    res.send();
})



/*
 * POST to adduser.
 */
router.post('/addplayer', function(req, res) {
    var db = req.db;
    var collection = db.get('playerlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});



// router.put('/updateplayerwin', function(req, res) {
//     var db = req.db;
//     var collection = db.get('playerlist');
//
//     collection.update(
//         { playername : req.body.playername },
//         { $inc: { gamesplayed: 1, gameswon: 1, totalpoints: 3, averagesubtractedpoints: 3 } },
//         function(err, result){
//             if (result){
//                 res.sendStatus(200)
//             } else {
//                 res.sendStatus(406)
//             }
//         }
//     );
// })
//
// router.put('/updateplayerloss', function(req, res) {
//     var db = req.db;
//     var collection = db.get('playerlist');
//
//     collection.update(
//         { playername : req.body.playername },
//         { $inc: { gamesplayed: 1, gameslost: 1, averagesubtractedpoints: -3 } },
//         function(err, result){
//             if (result){
//                 res.sendStatus(200)
//             } else {
//                 res.sendStatus(406)
//             }
//         }
//     );
// })




module.exports = router;
