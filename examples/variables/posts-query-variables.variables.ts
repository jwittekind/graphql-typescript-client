import {ArgsType, ArgDefinition} from "../../src";

/**
 * PostsQueryVariables
 */
@ArgsType()
export class PostsQueryVariables {

    // The id of the Post
    id: ArgDefinition<number> = {
        type: 'Int',
        variableName: 'postPaginationTypeId'
    };

    // The slug of the Post
    slug: ArgDefinition<string> = {
        type: 'String',
        variableName: 'postPaginationTypeSlug'
    };

    // Post pagination
    pagination: ArgDefinition<any> = { // PaginationInputType
        type: 'PaginationType!',
        variableName: 'postPaginationTypePagination'
    };
}
