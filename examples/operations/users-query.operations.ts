import {QueryType} from "../../src/graphql-type";
import {UsersQueryVariables} from "../variables/users-query-variables.variables";

/**
 * UsersQuery
 */
export class UsersQuery<R = any> extends QueryType<R, UsersQueryVariables> {

    readonly queryName = 'users';
    readonly fields = 'UserPaginationType';
    readonly args = new UsersQueryVariables();

    // The id of the user
    id?(userPaginationTypeId: number) {
        this.args.id.value = userPaginationTypeId;
        return this;
    }
    // The slug of the user
    slug?(userPaginationTypeSlug: string) {
        this.args.slug.value = userPaginationTypeSlug;
        return this;
    }
    // The pagination of the users
    pagination?(userPaginationTypePagination: any) { // PaginationInputType
        this.args.pagination.value = userPaginationTypePagination;
        return this;
    }

    search?(userPaginationTypeSearch: string) {
        this.args.search.value = userPaginationTypeSearch;
        return this;
    }

}
