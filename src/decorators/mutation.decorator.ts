import { TypeGQLOperation } from '../operation-builder';

/**
 * Mutation Decorator Factory
 *
 * The @Mutation Decoration can be applied to properties inside a
 * class that was initialized with @ObjectType('typeName').
 *
 * There are multiple ways on how this Decorator could be designed:
 *
 * One way could be, to declare the function on the property a function that calls
 * the returns the result of apollo.mutate(...) with the appropriate options.
 *
 * Another Way could be to receive a MutationOperation class that can be instanciated by
 * this decorator, when the decorated function gets called. The Mutation class instance itself
 * could contain further methods to define variables and the options by using method chaining.
 * That way, the property decorated with @Mutation must not necessarily be an execution of the mutation itself.
 *
 * @param mutationOperation { function | object } A class that can be handled as a mutation Definition
 * @param mutationName {string} A custom name for the mutation
 * @constructor
 */
export function Mutation(mutationOperation: TypeGQLOperation, mutationName?: string) {
    return (target: any, key: string | symbol, descriptor?: PropertyDescriptor) => {
        target[key] = function(queryName?: string) {
            // execute mutation operation and return Observable<ApolloQueryResult<T>>
        };
    };
}
