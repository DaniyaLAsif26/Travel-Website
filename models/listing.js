const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema

const listingSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: String,
    image: {
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
        set: (v) => v === "" ? "https://tr.rbxcdn.com/30DAY-DynamicHeadCostume-AC8DEB0282CEBFC91B9869E3CD2C52CA-Png/420/420/DynamicHeadCostume/Webp/noFilter" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"

        }
    ]
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing





