const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const watchlistSchema = new Schema(
  {
    title: {
      type: String
    },
    content: {
      type: String
    },
    rating: {
        type: Number
    },
    author: {type: Schema.Types.ObjectId, ref: 'User' },
    movieId: String,
    tvId: String,
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Watchlist = model("Watchlist", watchlistSchema);

module.exports = Watchlist;