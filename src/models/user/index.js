const mongoose = require("mongoose");

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
    userType: {
      type: String,
      enum: ["admin", "orangtua", "anak"],
      required: [true, "Please add your type"],
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
      required: [true, "Please add your address"],
      maxlength: [100, "Address cannot be more than 100 characters"],
    },
    dataAnak: {
      type: [mongoose.Schema.Types.ObjectId],
      required: false,
    },
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

const anak = new mongoose.Schema(
  {
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

module.exports = mongoose.model("user", userSchema);
