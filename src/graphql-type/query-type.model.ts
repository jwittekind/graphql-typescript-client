
/**
 * Abstract Class QueryType
 *
 * This class can be use to extend a QueryClass.
 *
 * A Query Class has to implement a property called 'args',
 * which should be defined as an instance of a @ArgsType class.
 *
 * A Query Class has to implement a property called 'fields'.
 * which should be defined as a string with the type name of
 * an @ObjectType() decorated class.
 *
 * Ideally it could contain the instance of a class,
 * but circular dependencies were arising when the class imports
 * the Query class too.
 *
 * Type variable R = fieldTypeClass
 * Type variable V = argTypeClass
 *
 * My intended use of a QueryClass could look like this:

 // UsersQuery extends QueryType<UserPaginationType, UsersQueryVariables> {...}

 UsersQuery.byId(5).with('Posts', (postsQuery) =>
    postsQuery.pagination({ limit: 10, offset: 0 })
 ).query('UsersWithPostsQuery').subscribe((res) => ...)

 *
 */
export abstract class QueryType<R, V = any> {
    abstract args?: any = null;
    abstract fields: string;

    // a place to store apollo query options
    queryConfig = {} as any; // as QueryOptions<V> | WatchQueryOptions<R, V> | MutationOptions<R>

    /**
     *
     * @param queryName {string}
     */
    query(queryName?: string) { // returns Observable<ApolloQueryResult<R>>
        console.log('[QueryType] query()', this.args);
    }

    /**
     *
     * @param queryName {string}
     */
    watchQuery(queryName?: string) { // returns QueryRef<R, V>
        console.log('[QueryType] watchQuery()', this.args);
    }

    /**
     *
     * @param mutationName
     */
    mutate(mutationName?: string) { // returns MutationOptions<V>
        console.log('[QueryType] mutate()', this.args);
    }

}
