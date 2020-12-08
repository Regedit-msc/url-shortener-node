const mongoose = require("mongoose");
const shortId = require("shortid");

const shortUrlSchema = new mongoose.Schema({
  full_url: {
    type: String,
    required: true,
  },
  shortened_url: {
    type: String,
    required: true,

    // Use shortid package to generate random short
    default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
