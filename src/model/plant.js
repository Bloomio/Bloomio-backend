'use strict';

import mongoose from 'mongoose';

const plantSchema = mongoose.Schema({
  plantNickname: {
    type: String,
  },
  commonName: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
  },
  groupType: {
    type: String,
  },
  placement: {
    type: String,
    required: true,
  },
  createdOn: { 
    type: Date,
    required: true,
    default: () => new Date(),
  },
  waterDate: {// .pre before saving water schedule calculate the date intervals
    type: Number,
    required: true,
  },
  fertilizerDate: {
    type: Number,
  },
  mistingDate: {
    type: Number,
  },
  plantJournal: {
    type: Number,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model('plant', plantSchema);
