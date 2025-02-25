import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plaid: {
    access_token: { type: String },
    item_id: { type: String },
    request_id: { type: String },
  },
  preferences: {
    rewardType: {
      type: String,
      enum: ['cashback', 'points', 'miles'],
      default: 'cashback'
    },
    spendingCategories: {
      travel: { type: Boolean, default: false },
      shopping: { type: Boolean, default: false },
      dining: { type: Boolean, default: false },
      transportation: { type: Boolean, default: false }
    }
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
