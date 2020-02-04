import MessageFeed from 'structures/message-feed';

class PropertyResolver {
    constructor(scene){
        this.scene = scene;
    }

    resolve(schema, value){
        return Resolvers[schema.type] === undefined
                ? Resolvers["unknown"](this.scene, schema, value)
                : Resolvers[schema.type](this.scene, schema, value);
    }

    /**
     * Resolves all the properties in a given schema with a matching 
     * values object, returning an object w/ key/value pairs. 
     * 
     * @param {Object} schemas
     * @param {Object} values
     */
    resolveAll(schemas, values){
        let resolvedProps = {};
        for (let property in schemas){
            resolvedProps[property] = this.resolve(schemas[property], values[property]);
        }
        return resolvedProps;
    }

    serialize(schema, value){
        return Serializers[schema.type] === undefined
                ? Serializers["unknown"](this.scene, schema, value)
                : Serializers[schema.type](this.scene, schema, value);
    }

    toSerializableAll(schemas, values){
        let serializedProps = {};
        for (let property in schemas){
            serializedProps[property] = this.serialize(schemas[property], values[property]);
        }
        return serializedProps;
    }

}

const Serializers = {
    unknown: function(scene, schema, value){
        return value !== undefined ? value : schema.value; 
    },
    number: function(scene, schema, value){
        //TODO: Validate this property type
        return value !== undefined ? value : schema.value; 
    },
    string: function(scene, schema, value) {
         //TODO: Validate this property type
         return value !== undefined ? value : schema.value; 
    },
    boolean: function(scene, schema, value) {
         //TODO: Validate this property type
         return value !== undefined ? value : schema.value; 
    },
    select: function(scene, schema, value){
        return value !== undefined ? value : schema.value; 
    },
    //---------------- Complex ----------------------------

    MessageFeed: function(scene, schema, value){

    }

}

const Resolvers = {
    unknown: function(scene, schema, value){
        return value !== undefined ? value : schema.value; 
    },
    number: function(scene, schema, value){
        //TODO: Validate this property type
        return value !== undefined ? value : schema.value; 
    },
    string: function(scene, schema, value) {
         //TODO: Validate this property type
         return value !== undefined ? value : schema.value; 
    },
    boolean: function(scene, schema, value) {
         //TODO: Validate this property type
         return value !== undefined ? value : schema.value; 
    },
    select: function(scene, schema, value){
        return value !== undefined ? value : schema.value; 
    },
    list: function(scene, schema, value){
        
    },

    //---------------- Complex ----------------------------
    MessageFeed: function(scene, schema, value){
        return new MessageFeed();
    }
}

export default PropertyResolver;