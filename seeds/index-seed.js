const mongoose = require("mongoose");
const Campground = require("../models/campground");
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
      image: [
        {
          filename: "yelp-camp/dkadt4a6nijpe2jvy03j",
          path: `https://res.cloudinary.com/dswgihnab/image/upload/v1700410079/yelp-camp/dkadt4a6nijpe2jvy03j.jpg`,
        },
        {
          filename: "yelp-camp/lbqcotgbirwuzn4u2swo",
          path: `https://res.cloudinary.com/dswgihnab/image/upload/v1700408708/yelp-camp/lbqcotgbirwuzn4u2swo.jpg`,
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non sunt sit eaque maxime qui, repellat quaerat laboriosam deserunt harum earum quae voluptatibus nihil illo ducimus eligendi totam quisquam commodi enim.",
      price: Math.floor(Math.random() * 20) + 10,
      author: "654b054f687fb0e58f9d8659",
    });
    camp.save();
  }
  console.log("Databeses seeds executed");
};

seedDB();
