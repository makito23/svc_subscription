
const errors = require('restify-errors');
const subscriber = require('../models/subscriptionModels');

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
        let newSubscriber = new subscriber(data);
        console.log(data)
        console.log(newSubscriber)


        subscriber.findOneAndUpdate(
            {
                'tenantId': parseInt(req.params.tenantId),
                'subscription.subscriptionType': req.body.subscriptionType, 
                'subscription.recipient.address': req.body.recipient.address 
            }, 
            data, {upsert:true, runValidators:true,new:true}, function(err) {
        //newSubscriber.save(function(err) {
			if (err) {
				console.error(err);
				return next(new errors.InternalError(err.message));
				next();
			}
			res.send(201);
			next();
		});
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
	server.del('/todos/:todo_id', (req, res, next) => {
		Todo.remove({ _id: req.params.todo_id }, function(err) {
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