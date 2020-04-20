import { QueryOptions } from 'apollo-client';
import { GraphqlJazzInjectorInstance } from '../graphql-jazz.module';
import { GraphqlOperationService } from '../services/graphql-operation.service';

/**
 *
 * @param typeName
 * @constructor
 */
export abstract class QueryType<R, V = any> {
    abstract args?: any = null;
    abstract fields: string;
    queryConfig = { query: null, variables: null } as QueryOptions<V>;

    query(queryName?: string) {
        return GraphqlJazzInjectorInstance.get(GraphqlOperationService)
            .query(this, null, queryName);
    }

    watchQuery(queryName?: string) {
        return GraphqlJazzInjectorInstance.get(GraphqlOperationService)
            .watchQuery<R, V>(this, null, queryName);
    }

    mutate(mutationName?: string) {
        console.log('[QueryType] mutate()', this.args);
    }

}
