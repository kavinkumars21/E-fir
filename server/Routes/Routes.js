import express from "express";

// import { Postuser } from "../Controllers/PostUser.js";
import { Getuser } from "../Controllers/GetUser.js";
import { Postefir } from "../Controllers/PostFir.js";

const Route = express.Router();

// Route.post("/postuser", Postuser);
Route.get("/getuser", Getuser);
Route.post("/postfir", Postefir);

export default Route;
