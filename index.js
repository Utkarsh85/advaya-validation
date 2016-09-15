var Ajv = require('ajv');

module.exports= function (schema,instance) {

	//make measure for the references
	if(schema.hasOwnProperty('reference'))
	{
		for(var ref in schema.reference)
		{
			schema.attributes.properties[ref]= {type:"string"};
		}
	}

	if(Array.isArray(instance))
	{
		return Promise.all(instance.map(function (singleInstance) {
			return new Promise(function (resolve,reject) {
				var v = new Ajv({ useDefaults: true });
				var isValid = v.validate(schema.attributes, singleInstance);

				if(isValid)
				{
					resolve(singleInstance);
				}
				else
				{
					reject(v.errors);
				}

			});
		}));
	}
	else
	{
		return new Promise(function (resolve,reject) {
			var v = new Ajv({ useDefaults: true });
			var isValid = v.validate(schema.attributes, instance);

			if(isValid)
			{
				resolve(instance);
			}
			else
			{
				reject(v.errors);
			}

		});
	}
}