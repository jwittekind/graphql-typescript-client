/**
 * Graphql Schema Service
 *
 * The Graphql Schema Service stores all kinds of graphql types, fields & args,
 * that are initialized by the type-graphql-client decorators
 *
 */
export const GraphqlSchemaService = {
    types: {},
    fields: {},
    arguments: {},
    typeModels: {},
    configArguments: {},

    getTypeModel(className: string) {
        return this.typeModels[className];
    },

    setTypeModel(className: string, model) {
        this.typeModels[className] = model;
    },

    // Graphql Types
    getType(className: string) {
        return this.types[className];
    },

    setType(className: string, GraphQlType: any) {
        this.types[className] = GraphQlType;
    },

    // Graphql Type Fields
    getTypeFields(className: string) {
        return this.fields[className];
    },

    setTypeField(className: string, key: string, field: any) {
        this.fields[className] = this.fields[className] || {};
        this.fields[className][key] = field;
    },

    // Graphql Variable/Argument Types
    getArguments(className: string) {
        return this.arguments[className];
    },

    setArguments(className: string, argumentsType: any) {
        this.arguments[className] = argumentsType;
    },

    // Graphql @QueryConfig directive arguments
    getConfigArguments(className: string, methodName: string) {
        return this.configArguments[className]?.[methodName];
    },

    setConfigArguments(className: string, methodName: string, argumentAttrs) {
        this.configArguments[className] = this.configArguments[className] || {};
        this.configArguments[className][methodName] = argumentAttrs;
    },

    /**
     *
     * instantiateDataType !!!
     *
     * This is another important functionality
     *
     * this method takes a query/mutation response and instantiates all
     * graphql data with their appropriate class registered by @ObjectType('__typename')
     *
     * @param data
     */
    instantiateDataType(data: any) {
        if (Array.isArray(data) && data.length) {
            data = data.map((obj) => this.instantiateDataType(obj));
        } else if (data && typeof data === 'object') {
            let typeName: string = null;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (key === '__typename') {
                        typeName = key;
                    } else if (data[key] && typeof data[key] === 'object') {
                        data = {
                            ...data,
                            [key]: this.instantiateDataType(data[key]),
                        };
                    }
                }
            }
            if (typeName) {
                const model = this.getTypeModel(data.__typename);
                if (model) {
                    const dataModel = new model();
                    for(const key in data) {
                        if (data.hasOwnProperty(key)) {
                            dataModel[key] = data[key];
                        }
                    }
                    data = dataModel;
                }
            }
        }
        return data;
    },
};
