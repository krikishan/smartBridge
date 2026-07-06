const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    banner: [
      {
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        image: { type: String, required: true },
        link: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
      },
    ],
    categories: [
      {
        name: { type: String, required: true },
        image: { type: String, default: '' },
        description: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);
