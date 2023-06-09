const mongoose = require("mongoose");

const optionalWithLength = (minLength, maxLength) => {
  minLength = minLength || 0;
  maxLength = maxLength || Infinity;
  return {
    validator: function (value) {
      if (value === undefined) return true;
      return value.length >= minLength && value.length <= maxLength;
    },
    message: `Optional field is shorter than the minimum allowed length ${minLength} or larger than the maximum allowed length ${maxLength}`,
  };
};

//NOTE - Child User Schema
// ! This Schema is not a model, it is a subdocument of the main user model

const anak = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Please add Your full name"],
      validate: optionalWithLength(2, 100),
    },
    rentangUsia: {
      type: String,
      enum: ["0-4", "5-8"],
      required: true,
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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "video" }],
    character: {
      gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
        default: "male",
      },
      baju: [{ type: mongoose.Schema.Types.ObjectId, ref: "asset" }],
      celana: [{ type: mongoose.Schema.Types.ObjectId, ref: "asset" }],
      aksesorisTangan: [{ type: mongoose.Schema.Types.ObjectId, ref: "asset" }],
      aksesorisKepala: [{ type: mongoose.Schema.Types.ObjectId, ref: "asset" }],
      aksesorisMuka: [{ type: mongoose.Schema.Types.ObjectId, ref: "asset" }],
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

//NOTE - Main User Schema

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
      validate: (date) => {
        return {
          validator: date < new Date(),
          message: "Date of birth must be in the past!",
        };
      },
    },
    userType: {
      type: String,
      enum: ["admin", "orangtua"],
      required: [true, "Please add your type"],
      immutable: [true, "User type cannot be changed"],
    },
    email: {
      type: String,
      required: [true, "Please add your email!"],
      maxlength: [50, "Email cannot be more than 30 characters"],
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
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: [true, "Please add your provider"],
      immutable: [true, "Provider cannot be changed"],
    },
  },
  {
    timestamps: true,
  }
);

//NOTE - Admin Schema

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

//NOTE - Orangtua Schema

const orangtua = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add your username"],
      maxlength: [20, "Username cannot be more than 20 characters"],
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      maxlength: [14, "Phone number cannot be more than 14 characters"],
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
    dataAnak: [anak],
    dataBilling: [{ type: mongoose.Schema.Types.ObjectId, ref: "payment" }],
    kidsAnalytics: [{ type: mongoose.Schema.Types.ObjectId, ref: "analytics" }],
  },
  {
    _id: false,
  }
);

//NOTE - Usertype Setter

userSchema.path("userType").set((v) => {
  const enumValues = userSchema.paths.userType.enumValues;
  switch (v) {
    case enumValues[0]:
      userSchema.path("essentials", admin);
      break;
    case enumValues[1]:
      userSchema.path("essentials", orangtua);
      break;
    default:
      throw Error("Invalid userType");
  }
  return v;
});

const model = mongoose.model;

exports.user = model("user", userSchema);
