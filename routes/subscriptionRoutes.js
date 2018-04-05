
const errors = require('restify-errors');
const subscriber = require('../models/subscriptionModels.js');

module.exports = function(server) {

    /** Add or Update */
    server.post('/:tenantId/subscriber', (req, res, next) => {
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json'"),
			);
		}
        let data = {
            tenantId: parseInt(req.params.tenantId), 
            subscription: {
                subscriptionType : req.body.subscriptionType,
                specification: req.body.specification,
                subscription: req.body.specificationKey,
                recipient: {
                    address: req.body.recipient.address,
                    platform: req.body.recipient.platform
                }
            }
            }  || {};
        
        /** Check for existing */
        existingSubscriber = subscriber.findOne(
            {'tenantId': parseInt(data.tenantId),'subscription.recipient.address':data.subscription.recipient.address}).lean().exec(function (err,doc){
                return res.end(JSON.stringify(doc));
            })
            
      /*  let newSubscriber = new subscriber(data);
        newSubscriber.save(function(err) {
            if (err) {
                console.error(err);
                return next(new errors.InternalError(err.message));
                next();
            }

            res.send(201);
            next();
        })*/
        if (existingSubscriber)
            {
                subscriber.findOneAndUpdate({
                    '_id': existingSubscriber._id,
                    'subscription.subscriptionType': existingSubscriber.subscription.subscriptionType,
                    'subscription.specification': existingSubscriber.subscription.specification,
                    'subscription.recipient.address': existingSubscriber.subscription.recipient.address
                }, {'subscription.$': data.subscription,},{ upsert:true,setDefaultsOnInsert:true}, 
                function(err) {
                    if (err) {
                        console.error(err);
                        return next(new errors.InternalError(err.message));
                        next();
                    }
                    res.send(201);
                    next();
                })      
            }
                
        else {
            let newSubscriber = new subscriber(data);
            newSubscriber.save(function(err) {
                if (err) {
                    console.error(err);
                    return next(new errors.InternalError(err.message));
                    next();
                }
    
                res.send(201);
                next();
            });
        }
	});

    //get all to be paginated
	server.get('/:tenantid/subscriber', (req, res, next) => {
		subscriber.apiQuery(req.params, function(err, docs) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			}
			res.send(docs);
			next();
		});
	});

	/**  get by address **/
	server.get('/:tenantId/subscriber/:address', (req, res, next) => {
		subscriber.findOne({ 'tenantId': parseInt(req.params.tenantId), 'subscription.recipient.address': req.params.address }, function(err, doc) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			}

			res.send(doc);
			next();
		});
	});

	/** DELETE **/
	server.del('/:tenantId/Subscriber/:subscriberId', (req, res, next) => {
		subscriber.remove({ _id: req.params.subscriberId }, function(err) {
			if (err) {
				console.error(err);
				return next(
					new errors.InvalidContentError(err.errors.name.message),
				);
			}

			res.send(204);
			next();
		});
	});
}; 