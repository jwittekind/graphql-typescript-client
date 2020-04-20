import { GraphqlSchemaService } from '../services/graphql-schema.service';
import { GqlJazzMutationFields, GqlJazzQueryFields } from '../graphql-jazz.models';

export type TypeGQLOperation = any | {
    args?: string;
    fields: string;
    queryName?: string;
    mutationName?: string;
};

/**
 *
 * @param operation
 * @param options
 */
export function buildOperation(operation: TypeGQLOperation, options: any = {}): GqlJazzQueryFields | GqlJazzMutationFields {
    operation = typeof operation === 'function' ? new operation() : operation;
    const type = operation.queryName ? 'query' : (operation.mutationName && 'mutation') || null;
    if (operation.fields && type) {
        const operationName = operation[type + 'Name'],
            queryName = options.queryName || operationName;
        if (queryName) {
            const directive: string = options.queryDirective || '',
                { variables, args, fields } = parseOperationConfig(
                    operation.fields,
                    operation.args,
                    options,
                );
            // Add named query Name
            const gqlj: string = (type + ' ' + queryName.charAt(0).toUpperCase() + queryName.substring(1) +
                // Add query variable names and types
                (args.length > 0 ? '(' + args.join(', ') + ')' : '') +
                // Add parameters to query with optional directive and sub params
                ` { ${operationName} ${directive} ${fields.join(' ')} }`)
                .replace(/\s\(\s/g, '(')
                .replace(/\s\)\s/g, ') ');
            if (type === 'query') {
                return { [type]: gqlj, queryName, operationName, variables } as GqlJazzQueryFields;
            } else {
                return { [type]: gqlj, queryName, operationName, variables } as GqlJazzMutationFields;
            }
        }
    }
}

/**
 *
 * @param fieldType
 * @param fieldArgs
 * @param options
 * @param args
 * @param path
 */
export function parseOperationConfig(fieldType, fieldArgs?: any, options?: any, args?: any[], path?: string[]) {
    args = args || [];
    path = path || [];
    let operationFields: string[] = [],
        operationArgs: string[] = [];
    const variables = {};
    // check if param is a GqlJazzType definition
    fieldType = typeof fieldType === 'string' ? GraphqlSchemaService.getType(fieldType) : fieldType;
    if (fieldType?.__typename || (fieldType?.__call && fieldType.__fields)) {
        if (fieldType?.__call && fieldType.__fields) {
            fieldType.__fields = typeof fieldType.__fields === 'string' ?
                GraphqlSchemaService.getType(fieldType.__fields) :
                fieldType.__fields;
            fieldType = fieldType.__fields;
        }
        if (fieldArgs) {
            // paramArguments are optional addition, when params provided
            const parsedArgs = parseOperationArguments(fieldArgs, args, variables);
            operationFields = operationFields.concat(parsedArgs.queryParams);
            operationArgs = parsedArgs.queryArguments;
            fieldArgs = null;
        }
        // check if param is a GqlJazzField definition
        if (fieldType?.__typename) {
            const parsedParams = parseOperationFields(fieldType, fieldArgs, variables, options, args, path);
            operationFields = operationFields.concat(parsedParams.queryParams);
            operationArgs = operationArgs.concat(parsedParams.queryArguments);
        }
    }
    return { fields: operationFields, args: operationArgs, variables: variables !== {} && variables || null };
}

/**
 *
 * @param typeArguments
 * @param args
 * @param variables
 */
function parseOperationArguments(typeArguments, args, variables) {
    let queryParams: string[] = [],
        queryArguments: string[] = [],
        fieldArguments: string[] = [];
    typeArguments = typeof typeArguments === 'function' ? new typeArguments() : typeArguments;
    // Add arguments to operation if given
    if (typeof typeArguments === 'object' && Object.keys(typeArguments).length) {
        for (const argument in typeArguments) {
            if (typeArguments.hasOwnProperty(argument)) {
                const { variableName, type, value } = typeArguments[argument];
                // type & variableName are required argument properties
                if (type && variableName) {
                    // global variables have to be unique - duplicate variable type declarations will be ignored
                    if (args.indexOf(variableName) === -1) {
                        args.push(variableName);
                        // create global operation variable types: "$objectId: Int!"
                        queryArguments.push('$' + variableName?.trim() + ': ' + type.trim());
                    }
                    // create argument variable pairs: "id: $objectId"
                    fieldArguments.push(argument + ': $' + variableName.trim());

                    if (typeArguments[argument].hasOwnProperty('defaultValue')) {
                        // save optional default value if available
                        if (typeof value !== 'undefined') {
                            variables[variableName] = value;
                        }
                    }
                }
            }
        }
        fieldArguments = fieldArguments.length ? ['(', fieldArguments.join(', '), ')'] : fieldArguments;
        queryParams = queryArguments.length ? fieldArguments : queryParams;
        queryArguments = queryArguments.length ? queryArguments : queryArguments;
    }
    return { queryParams, queryArguments };
}

/**
 *
 * @param typeModel
 * @param paramArguments
 * @param defaultValues
 * @param options
 * @param args
 * @param path
 */
function parseOperationFields(typeModel: any, paramArguments: any, defaultValues: any, options: any, args: string[], path: string[]) {
    let queryParams: string[] = [],
        queryArguments: string[] = [];
    path.push(typeModel.__typename);
    for (const fieldName in typeModel) {
        if (typeModel.hasOwnProperty(fieldName)) {
            let typeField = typeModel[fieldName];
            const subParams = options.subParams,
                fieldToQuery = typeof typeField === 'object' && typeField.hasOwnProperty('__call') ? typeField.__call : !!typeField,
                toQuery = (typeof subParams?.[fieldName] === 'boolean' || typeof subParams?.[fieldName] === 'object') ?
                    subParams?.[fieldName] : fieldToQuery;
            const subParamOptions = typeof subParams?.[fieldName] === 'object' ? subParams?.[fieldName] : null;
            // const { toQuery, subParamOptions } = isParamToQuery(typeField, field, options, path, typeModel.__typename);
            if (toQuery && typeField) {
                // typeField = fieldName !== '__typename' && typeof typeField === 'string' ?
                //     GraphqlSchemaService.getType(typeField) : typeField;
                if (typeof typeField === 'object') {
                    // check if typeField is a GQLJazzType definition
                    if (typeField.__call) {
                        paramArguments = paramArguments || typeField.__args;
                        typeField = typeField.__fields;
                        typeField = typeof typeField === 'string' ? GraphqlSchemaService.getType(typeField) : typeField;
                        typeField = typeof typeField === 'function' ?
                            GraphqlSchemaService.getType(typeField.prototype?.__typename) : typeField;
                    }
                    // check if typeField is a GQLJazzField definition
                    if (typeField && (typeField.__typename || typeField.__call)) {
                        const subQueryParams = parseOperationConfig(typeField, paramArguments, subParamOptions || options, args, [...path]);
                        if (subQueryParams.fields.length) {
                            // only add arguments and fields if fields are provided
                            queryArguments = queryArguments.concat(subQueryParams.args);
                            for (const key in subQueryParams?.variables) {
                                if (subQueryParams.variables.hasOwnProperty(key) && !defaultValues[key]) {
                                    defaultValues[key] = subQueryParams.variables[key];
                                }
                            }
                            queryParams = queryParams.concat([fieldName, ...subQueryParams.fields]);
                        }
                    }
                } else {
                    // add field as it is truthy
                    queryParams.push(fieldName);
                }
            }
        }
    }
    queryParams = queryParams.length ? ['{', ...queryParams, '}'] : [];
    return { queryArguments, queryParams };
}

