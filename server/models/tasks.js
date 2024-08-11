import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      /* 유효성 검사 지움 - 할일에서 꼭 두단어 이상 입력안해도 되도록 */
      // validate: {
      //   validator: function (title) {
      //     return title.split(" ").length > 1;
      //   },
      //   message: "must contain at least 2 words",
      // },
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
