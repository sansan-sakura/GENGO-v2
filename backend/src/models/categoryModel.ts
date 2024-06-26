import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    unique: false,
    maxlength: [20, 'A sategory must be less than 20 charactors 🫣'],
    minlength: [3, 'A category must be more than 3 charactors ⭐️'],
  },
  user: {
    type: String,
    required: [true, 'Category needs to know the user'],
  },
});

// categorySchema.pre("save", async function (next) {
//   this.user = await User.findById(this.user);
//   if (!this.user) return new AppError("User doesn't exist", 400);
//   next();
// });

export const Category = mongoose.model('Category', categorySchema);
