import mongoose from "mongoose";

// created a mongoose schema for the pokemon 

const pokemonSchema = new mongoose.Schema({
    // _id: Number,
    name: String,
    // avatar: URL,
    weakness: Array,
    strength: Array,
    moves: Object
})

// creating a mongoose schemam for the users 

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})


// creating the model for the pokemon 
export const Pokemon = new mongoose.model("pokemon", pokemonSchema);

// creating the model for the users 
export const User = new mongoose.model("user", userSchema);


// exporting the created modules
// export default { users, pokemon }