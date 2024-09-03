/* variables
    express
    app
    port
    mongoose
    film model
*/
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
//import
const Schema = mongoose.Schema;
//Buid schema pointing required parameters
const filmSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  trailer_url: {
    type: String,
    required: true,
  },
});
const Film = mongoose.model("Film", filmSchema);
app.use(express.json());

//post
app.post("/", async (req, res) => {
  try {
    const film = new Film({
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url,
      trailer_url: req.body.trailer_url,
    });
    await film.save();
    return res.send("successfully created");
  } catch (error) {
    return res.status(400).send("Creation failed");
  }
});
//get
app.get("/", async (req, res) => {
  const films = await Film.find();
  return res.send(films);
});
//put
app.put("/:id", async (req, res) => {
  try {
    const film = await Film.findByIdAndUpdate(
      req.params.id,
      {
        image_url: req.body.image_url,
        trailer_url: req.body.trailer_url,
      },
      {
        new: true,
      }
    );
    return res.send("successfully updated");
  } catch (error) {
    return res.status(404).send("id not found");
  }
});
//delete
app.delete("/:id", async (req, res) => {
  try {
    const film = await Film.findByIdAndDelete(req.params.id);
    return res.send("successfully deleted");
  } catch (erro) {
    return res.status(404).send("id not found");
  }
});

//Create endpoint getById
app.get("/:id", async (req, res) => {
  try {
    const film = await Film.findById(req.params.id);
    return res.send(film);
  } catch (erro) {
    return res.status(404).send("id not found");
  }
});

//Create endpoint getByName
app.get("/title/:title", async (req, res) => {
  try {
    const film = await Film.find({ title: req.params.title });
    if (film.length !== 0) {
      return res.status(200).send(film);
    } else {
      return res.status(404).send("title not found");
    }
  } catch (error) {
    return res.status(500).send("internal server error");
  }
});

//app

app.listen(port, async () => {
  console.log(`Listening to port ${port}`);
  try {
    await mongoose.connect("mongodb://localhost:27017");
    console.log("db connected");
  } catch (error) {
    console.error("db connection failed");
  }
  /*
  await mongoose
    .connect("mongodb://localhost:27017")
    .then(() => console.log("connected"))
    .catch(() => console.error("failed"));
    */
});
