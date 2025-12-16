import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
    }
})

UserSchema.pre("save", async function(){
// ye hamne isliye kiya hai kyuki bina iske agar ham password hash karte to phir agar hmm kuch bhi update karte jaise username ya avatar change karte etc to password hash hota 
    if(!this.isModified("password")) return;


   this.password = await bcrypt.hash(this.password , 10)

})


UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
}




UserSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
}


const User = mongoose.model('User', UserSchema)
export default User