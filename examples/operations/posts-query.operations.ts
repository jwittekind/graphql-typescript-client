import {QueryType} from "../../src/graphql-type";
import {PostsQueryVariables} from "../variables/posts-query-variables.variables";

/**
 * PostsQuery
 */
export class PostsQuery<R = any> extends QueryType<R, PostsQueryVariables> {
    readonly fields = 'PostPaginationType';
    readonly queryName = 'posts';
    readonly args = new PostsQueryVariables();

    // The id of the Post
    id?(postPaginationTypeId: number) {
        this.args.id.value = postPaginationTypeId;
        return this;
    }

    // The slug of the Post
    slug?(postPaginationTypeSlug: string) {
        this.args.slug.value = postPaginationTypeSlug;
        return this;
    }

    // Post pagination
    pagination?(postPaginationTypePagination: any) { // PaginationInputType
        this.args.pagination.value = postPaginationTypePagination;
        return this;
    }
}
