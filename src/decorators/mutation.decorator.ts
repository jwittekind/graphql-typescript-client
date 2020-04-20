/**
 *
 * @param operationName
 * @param mutationArguments
 * @constructor
 */
import { GraphqlJazzInjectorInstance } from '../graphql-jazz.module';
import { TypeGQLOperation } from '../operation-builder';
import { GraphqlOperationService } from '../services/graphql-operation.service';

export function Mutation(mutationOperation: TypeGQLOperation, mutationName?: string, QueryName?: string) {
    return function(target: any, key: string | symbol, descriptor?: PropertyDescriptor) {
        target[key] = function(queryName?: string) {
            return GraphqlJazzInjectorInstance.get(GraphqlOperationService)
                .mutate(mutationOperation, null, queryName || QueryName);
        };
    };
}
