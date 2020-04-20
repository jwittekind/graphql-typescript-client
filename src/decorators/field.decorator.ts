import {GraphqlSchemaService} from '../services/graphql-schema.service';

/**
 *
 * Field Decorator Factory
 *
 * The @Field decorator can be applied to a property inside
 * a class that was initialized with @ObjectType('typeName').
 * During initialization, it stores the property inside
 * the GraphqlSchemaService until the are ObjectType Decorator
 * takes over all defined types to be saved for its graphql type object.
 *
 * Each of the @Field decorated themselves may have another (Object)type,
 * that should be assigned.
 *
 * Circular Dependencies have been a huge struggle while working with that approach.
 * That's why a string value was used, to represent the @Field's type
 *
 * @param call {boolean} A Boolean defining whether or not to query the field by default
 * @param fieldType { string | function | object } Any type that can be handled as an graphql ObjectType
 * @param fieldArgs { string | function | object } Any type that can be handled as graphql Variables
 */
export function Field(call: boolean = true, fieldType?: any, fieldArgs?: any) {
    return (target: any, key: string) => {
        let paramName,
            constructorName;
        if (typeof target === 'function' && target.name) {
            // get class name by static class
            constructorName = target?.name;
        } else if (typeof target === 'object' && target?.constructor?.name) {
            // get class name by class instance
            constructorName = target?.constructor?.name;
        }

        if (typeof fieldType === 'function' && fieldType.name) {
            // save class name of field type if given
            paramName = target?.name;
        } else if (typeof fieldType === 'object' && fieldType?.constructor?.name) {
            // save class name of field type if given
            paramName = fieldType?.constructor?.name;
        } else if (typeof fieldType === 'string') {
            paramName = fieldType;
        }

        if (paramName) {
            // save either a field type configuration ...
            GraphqlSchemaService.setTypeField(constructorName, key, {
                __call: !!call,
                __args: fieldArgs,
                __fields: paramName,
            });
        } else {
            // ... or a default boolean on whether or not to query that field by default
            GraphqlSchemaService.setTypeField(constructorName, key, !!call);
        }
    };
}
