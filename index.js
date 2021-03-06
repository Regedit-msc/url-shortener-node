const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
// import the model here

const ShortURL = require("./models/url");

app.set("view engine", "ejs");

let port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const allData = await ShortURL.find();
  res.render("index", { shortUrls: allData });
});

app.post("/shortened_url", async (req, res) => {
  // Grab the fullUrl parameter from the req.body
  const fullUrl = req.body.fullUrl;
  console.log("URL requested: ", fullUrl);

  // insert and wait for the record to be inserted using the model
  const record = new ShortURL({
    full_url: fullUrl,
  });

  await record.save();

  res.redirect("/");
});

app.get("/:shortened_urlid", async (req, res) => {
  // grab the :shortid param
  const shortid = req.params.shortened_urlid;

  // perform the mongoose call to find the long URL
  const rec = await ShortURL.findOne({ shortened_url: shortid });

  // if null, set status to 404 (res.sendStatus(404))
  if (!rec) return res.sendStatus(404);

  // if not null, increment the click count in database
  rec.clicks++;
  await rec.save();

  // redirect the user to original link
  res.redirect(rec.full_url);
});

// Setup your mongodb connection here
mongoose
  .connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.connection.on("open", async () => {
  // Wait for mongodb connection before server starts

  app.listen(port, () => {
    console.log("Server started");
  });
});
