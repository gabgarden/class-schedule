import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema(
  {
    classroomNumber: {
      type: Number,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    capability: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'classrooms',
  }
);

export default mongoose.model('Classroom', classroomSchema);
