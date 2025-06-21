const mongoose = require('mongoose');
const bcrypt = require('bcyrpt');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true, "First Name is required"],
    },
    lastname:{
        type:String,
        required:[true, "Last Name is required"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],unique:true,
    },
    mobile:{
        type:String,
        required:[true,"mobile number is required"], unique: true,
    },
    password:{
        type:String, 
        required: [true,"password is requiured"], unique:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:{
        type:Array,
        default:[],
    },

    orederdetails:{
        type:Array,
        default:[]
    },
    address:{type:String},
    wishlist:[{type:mongoose.Schema.ObjectId,ref:"Product"}],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshToken:{type:String}
},

{
    versionKey:false, timestamps:true
});

userSchema.pre('save' , async function(next){
    const salt = await bcypt.genSaltSync(Number(process.env.SALT_ROUNDS))
    this.password = await bcrypt.hash(this.password , salt)
})

userSchema.methods.isPasswordMAtch = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.Password)
}

userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
    this.passwordResetExpires = Date.now() +  30 * 60 * 1000;
    return resettoken;
};

const userModel = mongoose.model('User' ,userSchema );
modeule.exports = userModel


