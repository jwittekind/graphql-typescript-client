import { GraphqlSchemaService } from '../services/graphql-schema.service';

/**
 *
 * ObjectType Decorator Factory
 *
 * The @ObjectType decorator can be applied to classes,
 * that are excluded from any kind of DI environment.
 *
 * It receives a typename of the graphql type it represents and can contain
 * properties that use the @Field decorator.
 * Those define the fields of a graphql type.
 *
 * The idea is to manually instanciate the class through its constructor.
 * An object definition of the according type could be passed in to
 * set the values for all queried fields.
 *
 * Each of the @Field decorated Types themselves may have a type,
 * that should be assigned.
 *
 * Circular Dependencies have been a huge struggle while working with that approach.
 * That's why a string value was used, to represent the @Field's type
 *
 * @param typeName
 * @constructor
 */
export function ObjectType(typeName: string) {
    return (target) => {
        let constructorName;
        if (typeof target === 'function' && target.name) {
            // get class name by static class
            constructorName = target?.name;
        } else if (typeof target === 'object' && target?.constructor?.name) {
            // get class name by class instance
            constructorName = target?.constructor?.name;
        }
        const typeFields = GraphqlSchemaService.getTypeFields(constructorName) || {};
        // setting __typename of the class
        target.prototype.__typename = typeFields.__typename = typeName;
        // save @Field marked properties by class name
        GraphqlSchemaService.setType(constructorName, typeFields);
        // save graphql @ObjectType by type name
        GraphqlSchemaService.setTypeModel(typeName, target);

        return target;
    };
}
