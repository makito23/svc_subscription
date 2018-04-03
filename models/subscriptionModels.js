const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

  
var recipientSchema = new mongoose.Schema({
    platform: {
        type: String,
        lowercase: true,
        trim: true,
    },
    address: {
        type: String,
        lowercase: true,
        trim: true,
        required: 'Recipients must have an address'
    },
    hash_sha256: {
        type: String,
    }
    })

recipientSchema.plugin(timestamps);
//recipientSchema.plugin(mongooseStringQuery);

var subscriptionSchema = new mongoose.Schema({
    subscriptionType: {
      type: String,
    },
    specification: {
      type: String,
    },
    specificationKey: {
      type: String,
    },
    recipient: {
      type: [recipientSchema],
      required : 'Subscriptions must have a recipient'
    }
  })

subscriptionSchema.plugin(timestamps);
//subscriptionSchema.plugin(mongooseStringQuery);
  
var subscriberSchema = new mongoose.Schema({
    tenantId: {
        type: Number,
        required: 'Subscribers must belong to a tenant'
    },
    subscription: {
        type: [subscriptionSchema],
    }
    })

subscriberSchema.plugin(timestamps);
//subscriberSchema.plugin(mongooseStringQuery);

var subscriptionBundle = new mongoose.Schema({
    name: {
        type: String,
    },
    subscriptions: {
        type: String,
        required : 'Bundles must contain subscriptions'
    },
    platforms: {
        type: String,
        default: 'all'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    Updated_date: {
        type: Date,
        default: Date.now
    }
    })
 
const Subscription = mongoose.model('Subscriber', subscriberSchema);
module.exports = Subscription;      