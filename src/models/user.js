const mongoose = require("mongoose");

const anak = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, "Please add Your full name"],
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  lahir: {
    type: Date,
    required: false,
  },
  imageID: {
    type: String,
    required: [true, "Please add your imageID"],
    default: "profile.png",
  },
  poin: {
    type: Number,
    required: true,
    default: 0,
  },
  character: {
    gender: {
      type: Boolean,
      required: true,
      default: false, // false cowo | true cewe
    },
    baju: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    celana: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    aksesorisTangan: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    aksesorisKepala: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    aksesorisMuka: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
  },
  listCourse: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
});

const userSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Please add Your full name"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    lahir: {
      type: Date,
      required: false,
    },
    userType: {
      type: String,
      enum: ["admin", "orangtua"],
      required: [true, "Please add your type"],
      immutable: [true, "User type cannot be changed"],
    },
    email: {
      type: String,
      required: [true, "Please add your email"],
      maxlength: [30, "Email cannot be more than 30 characters"],
      unique: true,
    },
    imageID: {
      type: String,
      required: [true, "Please add your imageID"],
      default: "profile.png",
    },
    essentials: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Please add your essentials"],
    },
    validated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const admin = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add your username"],
      maxlength: [20, "Username cannot be more than 20 characters"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
  },
  {
    _id: false,
  }
);

const orangtua = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add your username"],
      maxlength: [20, "Username cannot be more than 20 characters"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
    address: {
      type: String,
      required: false,
      maxlength: [100, "Address cannot be more than 100 characters"],
    },
    dataAnak: [{ type: mongoose.Schema.Types.ObjectId, ref: "anak" }],
    dataBilling: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
    kidsAnalytics: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
  },
  {
    _id: false,
  }
);

userSchema.path("userType").set((v) => {
  console.log({ v });
  const enumValues = userSchema.paths.userType.enumValues;
  switch (v) {
    case enumValues[0]:
      userSchema.path("essentials", admin);
      break;
    case enumValues[1]:
      userSchema.path("essentials", orangtua);
      break;
    case enumValues[2]:
      userSchema.path("essentials", anak);
      break;
    default:
      throw Error("Invalid userType");
  }
  return v;
});

const model = mongoose.model;

exports.user = model("user", userSchema);
exports.anak = model("anak", anak);
