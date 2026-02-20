import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },

        description : {
            type : String,
            default : ''
        },

        videos : {
            type : [mongoose.Schema.Types.ObjectId],
            ref : 'Video',
            default : []
        },

        subscribers : {
            type : [mongoose.Schema.Types.ObjectId],
            ref : 'User',
            default : []
        },

        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        
    }, {timestamps : true}
);

export const Channel = mongoose.model('Channel', channelSchema);
