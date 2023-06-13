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

// ça marche pas
router.get('/tarace', async (req, res, next) => {
  const artistId = '648824f677ad3c5eec0ae37c';
  const artist = await Artist.findOne({ "_id": artistId })
  const album = artist.albums[0]
  res.send(album)

})

// alors que ça, ça marche
router.get('/:id/albums/:n', async (req, res, next) => {
  const artist = await Artist.findOne({ "_id": req.params.id })
  const album = artist.albums[req.params.n]
  res.send(album)
})

router.get('/:name/albums', async function (req, res, next) {
  const artists = await Artist.find({ "name": req.params.name })
  res.send(artists);
});

// ça, ça marche aussi
router.get('/albums/:n', async function (req, res, next) {
  const y = parseInt(req.params.n)
  const artists = await Artist.find({ "albums.year": { "$gte": y } })
  res.send(artists);
});

// et ça, pas du tout
router.get('/filter', async function (req, res, next) {
  const years = parseInt(req.query.albumAfter)
  const artists = await Artist.find({ "albums.year": { "$gte": years } })
  res.send(artists);
});
// mais peut être une réponse ici : https://stackoverflow.com/questions/18524125/req-query-and-req-param-in-expressjs

router.get('/:nation', async function (req, res, next) {
  const artists = await Artist.find({ "country": req.params.nation })
  res.send(artists);
});


router.get('/artists/:id/songs?orderBy=popularity', async function (req, res, next) {
  const artists = await Artist.findOne({ "_id": req.params.id })
  const filtered = artists.sort(function (a, b) { a - b })
  res.send(filtered);
});


// TEST AVEC GPT
router.get('/:id/songs', async (req, res) => {
  const artistId = req.params.id;
  const orderBy = req.query.orderBy;

  try {
    // Récupérer l'artiste correspondant à l'ID
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({ message: 'Artiste non trouvé' });
    }

    // Récupérer les chansons de l'artiste
    const songs = artist.albums.flatMap(album => album.tracks);

    // Trier les chansons par popularité (orderBy=popularity)
    if (orderBy === 'popularity') {
      songs.sort((a, b) => b.nbHits - a.nbHits);
    }

    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
