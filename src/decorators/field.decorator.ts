import { GraphqlSchemaService } from '../services/graphql-schema.service';

/**
 *
 * @param call
 * @param fieldType
 * @param fieldArgs
 * @constructor
 */
export function Field(call: boolean = true, fieldType?: any, fieldArgs?: any) {
    return function(target: any, key: string) {
        let constructorName;
        let paramName;
        if (typeof target === 'function' && target.name) {
            constructorName = target?.name;
        } else if (typeof target === 'object' && target?.constructor?.name) {
            constructorName = target?.constructor?.name;
        }
        if (typeof fieldType === 'function' && fieldType.name) {
            paramName = target?.name;
        } else if (typeof fieldType === 'object' && fieldType?.constructor?.name) {
            paramName = fieldType?.constructor?.name;
        } else if (typeof fieldType === 'string') {
            paramName = fieldType;
        }
        if (paramName) {
            GraphqlSchemaService.setTypeField(constructorName, key, {
                __call: !!call,
                __args: fieldArgs,
                __fields: paramName,
            });
        } else {
            GraphqlSchemaService.setTypeField(constructorName, key, !!call);
        }
    };
}
