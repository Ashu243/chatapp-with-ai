import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function() {return this.senderType === 'user'}// if the message is from the user then required is true else false because ai will not have sender id
    },
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    content:{
        type: String,
        required: true
    },
    senderType: {
        type: String,
        default: 'user',
        required: true,
        enum: ['user', 'ai']
    }
},{
    timestamps: true
})

messageSchema.index({projectId: 1, createdAt: 1})

export const Message = mongoose.model('Message', messageSchema)