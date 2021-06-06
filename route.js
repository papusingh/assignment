const express = require('express');
const config = require('./config.json');
const https = require('https');
const router = express.Router();

router.post('/v1/getUserDetails', (req, res) => {
    let user_id = req.body.user_id;
    let user = {};
    let album = {};
    let photo = {};
    var result = {};
    try {
        new Promise((resolve, reject) => {
            https.get(config.PROVIDER_URL + config.USERS + user_id, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                })
                res.on('end', () => {
                    user = (JSON.parse(data));
                    resolve(user)
                })
            }).on('error', (err) => {
                reject(err)
            })
        }).then(user => {
            result.user = user;
            var p = new Promise((resolve, reject) => {
                let id = user.id;
                https.get(config.PROVIDER_URL + config.ALBUMS + "?userId=" + id, (res) => {
                    let albumData = "";
                    res.on('data', (chunk) => {
                        albumData += chunk;
                    })
                    res.on('end', () => {
                        album = (JSON.parse(albumData));
                        resolve(album)
                    })
                }).on('error', (err) => {
                    reject(err)
                })
            })
            return p;
        }).then(album => {
            result.user.album = album;
            for (var i = 0; i < album.length; i++) {
                var promise = new Promise((resolve, reject) => {
                    https.get(config.PROVIDER_URL + config.PHOTOS + "?albumId=" + album[i].id, (res) => {
                        let photoData = "";
                        res.on('data', (chunk) => {
                            photoData += chunk;
                        })
                        res.on('end', () => {
                            photo = (JSON.parse(photoData));
                            result.user.album[i].photo = photo;
                            resolve(result)
                        })
                    }).on('error', (err) => {
                        reject(err)
                    })
                })
                return promise;
            }
        }).then(result => {
            res.status(200).send(result);
        }).catch(err => {
            res.status(500).send({ "error ": err })
        })
    } catch (error) {
        res.status(500).send({ "error ": error });
    }
});

module.exports = router;