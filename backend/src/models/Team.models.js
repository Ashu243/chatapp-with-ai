import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema({
    teamName:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
},{
    timestamps: true
})


const Team = mongoose.model("Team", TeamSchema)
export default Team