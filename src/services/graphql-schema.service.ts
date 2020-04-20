export const GraphqlSchemaService = {
    types: {},
    fields: {},
    arguments: {},
    typeModels: {},
    configArguments: {},
    operationHandlers: new Map(),
    // mutationConfigs: new Map(),

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
     * @param data
     */
    instantiateDataType(data: any) {
        if (Array.isArray(data) && data.length) {
            data = data.map((obj) => this.instantiateDataType(obj));
        } else if (data && typeof data === 'object') {
            let typeName: string;
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
                data = model ? Object.assign(new model(), data) : data;
            }
        }
        return data;
    },
};
