const mongoose = require("mongoose");

// const createSchemaType = (enumValues) => {
//   return new mongoose.SchemaType({
//     name: "essentials",
//     validate: {
//       validator: (v) => {
//         console.log(v);
//         return enumValues.includes(v);
//       },
//       message: "Invalid value for enum!",
//     },
//   });
// };

const userSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Please add Your full name"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    lahir: {
      type: Date,
      required: [true, "Please add your date of birth"],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      maxlength: [30, "Email cannot be more than 30 characters"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["admin", "orangtua", "anak"],
      required: [true, "Please add your type"],
    },
    essentials: {
        type: Object,
        required: [true, "Please add your essentials"],
    }
    
  },
  {
    timestamps: true,
  }
);

// userSchema.path("type").set((v) => {
//   const enumValues = this.schema.paths.type.enumValues;
//   const customType = createSchemaType(enumValues);
//   console.group("types");
//   console.log({ customType });
//   console.log({ enumValues });
//   this.schema.path("color", customType);
//   return v;
// });

module.exports = mongoose.model("user", userSchema);
