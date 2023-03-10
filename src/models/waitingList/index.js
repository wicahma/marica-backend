const mongoose = require("mongoose");

const createSchemaType = (enumValues) => {
  console.log(enumValues);
  return new mongoose.SchemaType({
    name: "essentials",
  });
};

const waitingSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Please add Your full name"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    tipe: {
      type: String,
      enum: ["admin", "orangtua", "anak"],
      required: [true, "Please add your type"],
    },
    essentials: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

waitingSchema.path("tipe").set((v) => {
  const enumValues = waitingSchema.paths.tipe.enumValues;
  console.log(enumValues);
  const customType = createSchemaType(enumValues);
  this.schema.path("essentials", customType);
  return v;
});

module.exports = mongoose.model("waitingList", waitingSchema);
