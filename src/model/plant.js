'use strict';

import moment from 'moment';
import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Profile from './profile';

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
    default: () => new Date(),
  },
  lastWaterDate: {
    type: Date,
    default: () => new Date(),
  },
  waterInterval: {
    type: Number,
    default: 3,
  },
  nextWaterDate: {
    type: Date,
  },
  lastFertilizerDate: {
    type: Date,
  },
  fertilizerInterval: {
    type: Number,
  },
  nextFertilizerDate: {
    type: Date,
  },
  lastMistingDate: {
    type: Date,
  },
  mistingInterval: {
    type: Number,
  },
  nextMistingDate: {
    type: Date,
  },
  plantJournal: {
    type: String,
  },
  image: {
    type: String,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'profile',
    required: true,
  },
});

plantSchema.methods.calculateNextWaterDate = function calculateNextWaterDate(newInterval) {
  let interval = this.waterInterval;
  if (newInterval) {
    interval = newInterval;
  }
  this.nextWaterDate = new Date(moment(this.lastWaterDate).add(interval, 'days'));
  return this;
};

plantSchema.methods.isTimeToWater = function isTimeToWater() {
  const currentTime = moment();
  if (currentTime >= this.nextWaterDate) {
    return true;
  } return false;
};

function plantPreHook(done) {
  return Profile.findById(this.profile)
    .then((profileFound) => {
      if (!profileFound) {
        throw new HttpError(404, 'Profile not found.');
      }
      this.calculateNextWaterDate();
      profileFound.planterBox.push(this._id);
      return profileFound.save();
    })
    .then(() => done());
}

const plantPostHook = (document, done) => {
  return Profile.findById(document.profile)
    .then((profileFound) => {
      if (!profileFound) {
        throw new HttpError(500, 'Profile not found in post hook.');
      }
      profileFound.planterBox = profileFound.planterBox.filter((plantId) => {
        return plantId.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

plantSchema.pre('save', plantPreHook);
plantSchema.post('remove', plantPostHook);

export default mongoose.model('plant', plantSchema);
