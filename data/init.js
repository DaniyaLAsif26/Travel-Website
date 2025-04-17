
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/musafir";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  let modifiedData = initData.map((obj) => ({ ...obj, owner:'67fe98a5c4935864f7cc7c0b'}));
  await Listing.insertMany(modifiedData);
  console.log("data was initialized");
};

initDB();
