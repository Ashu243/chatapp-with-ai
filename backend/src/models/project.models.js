import mongoose, { Schema } from "mongoose";


const ProjectSchema = new Schema({
    projectName:{
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: [true, "Project name must be unique"]
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Team"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true
})

const Project = mongoose.model('Project', ProjectSchema)
export default Project