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
    type: String,
  },
  planterBox: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'plant',
    },
  ],
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
}, {
  usePushEach: true,
});

export default mongoose.model('profile', profileSchema);
