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

// alors que ça, ça marche
// router.get('/:id/albums/:n', async (req, res, next) => {
//   const artist = await Artist.findOne({ "_id": req.params.id })
//   const album = artist.albums[req.params.n]
//   res.send(album)
// }) 

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

// edit : ça marche quand tu lances nodemon, connard
// attention aux conflits entre les routes !
router.get('/filter', async function (req, res, next) {
  const years = parseInt(req.query.albumAfter)
  const country = req.query.country
  let artists = ''

  if (years) {
    artists = await Artist.find({ "albums.year": { "$gte": years } })
  } else if (country) {
    artists = await Artist.find({ "country": country })
  }
  res.send(artists);
});
// un thread intéressant : https://stackoverflow.com/questions/18524125/req-query-and-req-param-in-expressjs


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
// Merci le chat pour son aide.

//REQUETE POST 1 : un artiste
router.post('/', async (req, res, next) => {
  // on récupère
  const name = req.body.name
  const country = req.body.country
  const albums = req.body.albums

  const newArtist = new Artist({
    name: name,
    country: country,
    albums: albums
  })

  const artist = await newArtist.save();
  res.json(artist);
})

//REQUETE POST 2 : un album à un artiste
router.post('/:id/albums', async (req, res, next) => {

  const id = req.params.id;
  const { name, year, tracks } = req.body;

  const artist = await Artist.updateOne({ _id: id }, { $push: { albums: { name: name, year: year, tracks: tracks } } });

  res.send(artist);

})

// Une requête qui insert un track by Barman : 
// router.post("/:id/albums/:albumName/tracks/add", async (req, res, next) => {
//   const id = req.params.id
//   const albumName = req.params.albumName
//   let updatedTracks = await Artist.updateOne({ _id: id, "albums.name": { $eq: albumName } }, {
//     $push: {
//       "albums.$.tracks": {
//         name: req.body.name,
//         duration: req.body.duration,
//         nbHits: req.body.nbHits
//       }
//     }
//   })

//   res.send(updatedTracks + "changed ?")
// })


// // Un autre exemple du Chat : Route pour ajouter un nouvel artiste
// router.post('/artists', async (req, res) => {
//   try {
//     // Récupérer les données de l'artiste à partir du corps de la requête
//     const { name, country, albums } = req.body;

//     // Créer une nouvelle instance de l'artiste avec les données fournies
//     const newArtist = new Artist({ name, country, albums });

//     // Enregistrer l'artiste dans la base de données
//     const savedArtist = await newArtist.save();

//     res.json(savedArtist);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

module.exports = router;
