import {ArgDefinition, ArgsType} from "../../src";

/**
 * UsersQueryVariables
 */
@ArgsType()
export class UsersQueryVariables {

    // The id of the user
    id: ArgDefinition<number> = {
        type: 'Int',
        variableName: 'userPaginationTypeId'
    };

    // The slug of the user
    slug: ArgDefinition<string> = {
        type: 'String',
        variableName: 'userPaginationTypeSlug'
    };

    // The pagination of the users
    pagination: ArgDefinition<any> = { // PaginationInputType
        type: 'PaginationType!',
        variableName: 'userPaginationTypePagination'
    };


    search: ArgDefinition<string> = {
        type: 'String',
        variableName: 'userPaginationTypeSearch'
    };

}
