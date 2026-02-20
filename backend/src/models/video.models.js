import mongoose from 'mongoose';

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new mongoose.Schema(
    {
        uploadVideo : {
            type : String,
            required : true,
        },

        title : {
            type : String,
            required : true
        },

        description : {
            type : String,
            required : true
        },

        tags : {
            type : [String],
            default : []
        },

        videoUrl : {
            type : String,
            required : true
        },

        thumbnailUrl : {
            type : String,
            required : true
        },

        views : {
            type : Number,
            default : 0
        },

        likes : {
            type : Number,
            default : 0
        },

        dislikes : {
            type : Number,
            default : 0
        },

        comments : {
            type : Number,
            default : 0
        },

        duration : {
            type : Number,
            required : true
        },
        
        channel : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Channel',
            required : true
        }

    }, {timestamps : true}
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);