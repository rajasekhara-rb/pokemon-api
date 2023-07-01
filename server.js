// importing the required packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// importing the mongoose pokemon and users schema form the schemas.js 
import { User, Pokemon } from "./schemas.js";

// creating an instance of the express 
const app = express();
app.use(express.json());

app.use(cors());

// configuring the dotenv for environment variables
dotenv.config();
const PORT = process.env.PORT || 4500;
const MONGODB_URL = process.env.MONGODB_URL;

// connet to the mongodb dtabase using mongoose
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false
        });
        console.log("Connetion to the pokemonDB is Successfull !");
    } catch (error) {
        console.log("Connection to the pokemonDB is failed ", error);
    }
}
connectToMongoDB()

// creating the default route for the server
app.get("/", (req, res) => {
    res.send("<h1>Server is Running</h1>")
})

// creating a post route for creating a pokemon 
app.post("/createPokemon", async (req, res) => {
     const {name, weakness, strength, moves } = req.body
    const pokemonData = {name: name, weakness: weakness, strength: strength, moves: moves }
    try {
        const poke = await new Pokemon(pokemonData)
        poke.save()
            .then((e) => {
                console.log("Pokemon Data Saved Successfully");
            });
        res.status(200).send({ message: "Pokemon Created" })
    } catch (error) {
        console.log(error)
        res.send({ message: "Some error occured in creating a pokemon" })
    }
});

// creating a get route to get all pokemons

app.get("/getPokemons", async (req, res) => {
    // const poke = await new Pokemon;
    try {
        const result = await Pokemon.aggregate([{ $project: { _id: 1, __v: 0 } }])
        res.send(result);
    } catch (error) {
        res.send({ message: "Some error occured", error: error.message })
    }
});

// creating a get route to get one pokemon based on id 
app.get("/getPokemons/:_id", async (req, res) => {
    const id = req.params._id;
    try {
        const result = await Pokemon.findOne({ _id: id });
        res.send(result)
    } catch (error) {
        res.send({ message: "Pokemon doesn't exists with the id you provided", error: error.message })
    }

})

app.listen(PORT, () => {
    console.log("Server Started @ port " + PORT);
});