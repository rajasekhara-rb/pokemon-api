import mongoose from "mongoose";

// created a mongoose schema for the pokemon 

const pokemonSchema = new mongoose.Schema({
    // id: Number,
    // name: String,
    // avatar: String,
    // weakness: Array,
    // strength: Array,
    // moves: Array,
    // image: URL,

    id: Number,
    name: String,
    avatar: String,
    description: String,
    category: String,
    height: String,
    weight: Number,
    abilities: Array,
    gender: String,
    type: Array,
    weaknesses: Array,
    stats: Array,
    evolutions: Array
})

// creating a mongoose schemam for the users 

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    forgotToken: {
        type: String,
        default: ""
    }
})


// creating the model for the pokemon 
export const Pokemon = new mongoose.model("pokemon", pokemonSchema);

// creating the model for the users 
export const User = new mongoose.model("user", userSchema);


// exporting the created modules
// export default { users, pokemon }