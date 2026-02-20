import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        
        channel : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Channel',
            required : true
        },

        followers : {
            type : [mongoose.Schema.Types.ObjectId],
            ref : 'User',
            default : [],
        },

        following : {
            type : [mongoose.Schema.Types.ObjectId],
            ref : 'User',
            default : [],

        },
        
    }, {timestamps : true}
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
