const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      enum: ['free', 'paid'], 
      default: 'free',
      required: true,
    },

    totalTime: { 
      type: Number, 
      required: true, 
    }, // Total time in hours

    totalCoins: { 
      type: Number, 
      required: true, 
    },

    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      default: null, 
    },
  },
  { 
    timestamps: true,
  }
);

module.exports = mongoose.model('Membership', MembershipSchema);
