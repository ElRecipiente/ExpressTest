const express = require('express');
const router = express.Router();

const Artist = require('../models/artist')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const artists = await Artist.find({})
  res.send(artists);
});

router.get('/name/:name', async function (req, res, next) {
  const artists = await Artist.find({ "name": { "$regex": req.params.name } })
  res.send(artists);
});

router.get('/name', async function (req, res, next) {
  const artists = await Artist.find({ "name": "John Doe" })
  res.send(artists);
});

router.get('/:id/albums/:n', async (req, res, next) => {
  const artist = await Artist.findOne({ "_id": req.params.id })
  const album = artist.albums[req.params.n]
  res.send(album)
})

router.get('/:name/albums', async function (req, res, next) {
  const artists = await Artist.find({ "name": req.params.name })
  res.send(artists);
});

router.get('/albums/:n', async function (req, res, next) {
  const y = parseInt(req.params.n)
  const artists = await Artist.find({ "albums.year": { "$gte": y } })
  res.send(artists);
});

router.get('/:nation', async function (req, res, next) {
  const artists = await Artist.find({ "country": req.params.nation })
  res.send(artists);
});


router.get('/:name/filter', async function (req, res, next) {
  const artists = await Artist.findOne({ "name": req.params.name })
  const filtered = artists.sort(function (a, b) { a - b })
  res.send(filtered);
});

module.exports = router;
