const mongoose = require("mongoose");
const Campground = require("../models/capmground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .catch((e) => console.log("Mongo db connected!"))
  .catch((err) => console.log("Error connection mongo db:", err));

const db = mongoose.connection;
db.on("error", (err) => {
  console.log("Error mongo db connection:", err);
});
db.once("open", function () {
  console.log("DB connected");
});

const sample = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non sunt sit eaque maxime qui, repellat quaerat laboriosam deserunt harum earum quae voluptatibus nihil illo ducimus eligendi totam quisquam commodi enim.",
      price: Math.floor(Math.random() * 20) + 10,
    });
    camp.save();
  }
  console.log("Databeses seeds executed");
};

seedDB();
