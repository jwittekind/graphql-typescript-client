import { TypeGQLOperation } from '../operation-builder';
/**
 *
 * @param queryOperation
 * @param QueryName
 * @param someArg
 * @constructor
 */
export function Query(queryOperation: string | TypeGQLOperation, QueryName?: string | any, someArg?: any) {
    return (target: any, key: string | symbol, descriptor?: PropertyDescriptor) => {
        // define the property of @Query decorated
        target[key] = (queryName?: string) => {
            // execute mutation operation and return Observable<ApolloQueryResult<T>>
        };
    };
}
