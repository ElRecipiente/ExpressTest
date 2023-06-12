// Require Mongoose
const mongoose = require('mongoose');

// Define a schema
const ArtistSchema = new mongoose.Schema({
    name: String,
    albums: Array
}, { collection: 'artists' })

// Export function to create 
module.exports = mongoose.model("Artist", ArtistSchema);