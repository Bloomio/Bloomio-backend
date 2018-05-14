'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  // collection: [plantSchema],
  // quote: {
  //   type: String,
  // },
  avatar: {
    type: String,
  },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

export default mongoose.model('profile', profileSchema);
