const { default: mongoose, Schema } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
