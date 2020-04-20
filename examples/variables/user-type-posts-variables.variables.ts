/**
 * UserTypePostsVariables
 */
import {ArgDefinition, ArgsType} from "../../src";

@ArgsType()
export class UserTypePostsVariables {

    // This is the id of the users post
    id?: ArgDefinition<number> = {
        type: 'Int',
        variableName: ''
    };

    // This is the slug of the users post
    slug?: ArgDefinition<string> = {
        type: 'String',
        variableName: ''
    };

    // This is the pagination of the users posts
    pagination: ArgDefinition<any> = { // PaginationInputType
        type: 'PaginationType!',
        variableName: ''
    };

}
