'use strict';

import mongoose from 'mongoose';

const plantResourceSchema = mongoose.Schema({
  commonName: {
    type: String,
    required: true,
    unique: true,
  },
  scientificName: {
    type: String,
    required: true,
    unique: true,
  },
  groupType: {
    type: String,
    required: true,
  },
  waterDate: {
    type: Number,
    required: true,
  },
  fertilizerDate: {
    type: Number,
    required: true,
  },
  mistingDate: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('plantResource', plantResourceSchema);
