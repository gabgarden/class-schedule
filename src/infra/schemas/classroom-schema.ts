import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema(
  {
    classroomNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    capacity: {
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
