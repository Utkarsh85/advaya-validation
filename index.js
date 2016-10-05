var Ajv = require('ajv');
var validationConfig= require(require('path').resolve('./config/validation'));

var addAdditionalSchema = function (v) {

	if(validationConfig && typeof(validationConfig) ==="object")
	{
		if(validationConfig.hasOwnProperty('keywords'))
		{
			for( var keyword in validationConfig.keywords)
			{
				v.addKeyword(keyword,validationConfig.keywords[keyword]);
			}
		}

		if(validationConfig.hasOwnProperty('formats'))
		{
			for( var format in validationConfig.formats)
			{
				v.addFormat(format,validationConfig.formats[format]);
			}
		}
	}
}


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
				addAdditionalSchema(v);

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
			addAdditionalSchema(v);
			
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
