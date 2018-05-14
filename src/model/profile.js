'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    min: 10,
    max: 11,
  },
  planterBox: [],
  location: {
    type: String,
    required: true,
  },
  googleID: {
    type: String,
    unique: true,
  },
  account: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
});

export default mongoose.model('profile', profileSchema);
