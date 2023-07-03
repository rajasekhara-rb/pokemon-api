// importing the required packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "./auth.js";

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
const JWT_SCRECT_KEY = process.env.JWT_SCRECT_KEY;

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
    res.send(`<h1>Server is Running</h1>
    <div>
    <h2>AVILABLE API ENDPOINTS</h2>
    <ol>
    <li>/api/v0/signup   => for new user sign in</li>
    <li>/api/v0/signin   => for existing user login</li>
    <li>/api/v0/createPokemon    => for creating the pokemon after login</li>
    <li>/api/v0/getPokemons     => for getting all pokemons after login</li>
    <li>/api/v0/getPokemons/:_id    => for getting one pokemon based on id after login </li>
    </ol>
</div>
    `)
})

// creating a post route for creating a pokemon 
app.post("/api/v0/createPokemon", async (req, res) => {
    const { name, weakness, strength, moves } = req.body
    const pokemonData = { name: name, weakness: weakness, strength: strength, moves: moves }
    try {
        const authorized = auth(req, res);
        if (authorized.userId) {
            const poke = await new Pokemon(pokemonData)
            poke.save()
                .then((e) => {
                    console.log("Pokemon Data Saved Successfully");
                });
            res.status(200).send({ message: "Pokemon Created" })
        } else {
            res.send({ message: "Some error occured in creating a pokemon", error: authorized.message });
        }

    } catch (error) {
        console.log(error)
        res.send({ message: "Some error occured in creating a pokemon", error: error.message })
    }
});

// creating a get route to get all pokemons

app.get("/api/v0/getPokemons", async (req, res) => {
    try {
        const authorized = auth(req, res);
        if (authorized.userId) {
            const result = await Pokemon.aggregate([{ $project: { _id: 1, __v: 0 } }])
            res.send(result);
        }
        else {
            res.send({ message: "Unauthorized User" });
        }
    } catch (error) {
        res.send({ message: "Unauthorized User", error: error.message })
    }
});

// creating a get route to get one pokemon based on id 
app.get("/api/v0/getPokemons/:_id", async (req, res) => {
    try {
        const id = req.params._id;
        const authorized = auth(req, res);
        // console.log(authorized.userId)
        if (authorized.userId) {
            const result = await Pokemon.findOne({ _id: id });
            res.send(result);
        } else {
            res.send({ message: "Unauthorized User", error: error.message })
        }
    } catch (error) {
        res.send({ message: "Pokemon doesn't exists with the id you provided", error: error.message })
    }

});

app.post("/api/v0/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.send({ message: "User already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await User.create({
                username: username,
                email: email,
                password: hashedPassword
            });
            const token = jwt.sign({ emai: result.email, id: result._id }, JWT_SCRECT_KEY);
            res.send({ message: "Users signup successfull", user: result, token: token });
        }
    } catch (error) {
        console.log(error);
        res.send({ message: "Something went wrong" });
    }
});

app.post("/api/v0/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            res.send({ message: "User not found" });
        } else {
            const matchPassword = await bcrypt.compare(password, existingUser.password)
            if (!matchPassword) {
                res.send({ message: "Invalid credentials" });
            } else {
                const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, JWT_SCRECT_KEY);
                res.send({ message: "User verified successfully", user: existingUser, token: token });
            }
        }
    } catch (error) {
        console.log(error)
        res.send({ message: "Something went wrong" });
    }
})

app.listen(PORT, () => {
    console.log("Server Started @ port " + PORT);
});