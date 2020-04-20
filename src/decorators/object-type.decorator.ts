import { GraphqlSchemaService } from '../services/graphql-schema.service';

/**
 *
 * @param typeName
 * @constructor
 */
export function ObjectType(typeName: string) {
    return function(target) {
        let constructorName;
        if (typeof target === 'function' && target.name) {
            constructorName = target?.name;
        } else if (typeof target === 'object' && target?.constructor?.name) {
            constructorName = target?.constructor?.name;
        }
        const typeFields = GraphqlSchemaService.getTypeFields(constructorName) || {};
        target.prototype.__typename = typeFields.__typename = typeName;
        GraphqlSchemaService.setType(constructorName, typeFields);
        GraphqlSchemaService.setTypeModel(typeName, target);
        return target;
    };
}
