/**
 * UserType
 * add a description here!
 */
import { UserType } from "./user.type";
import { Field, ObjectType } from "../../../src";

@ObjectType('UserPaginationType')
export class UserPaginationType {

    readonly __typename?: string = 'UserPaginationType';

    // An Array of users
    @Field(true, 'UserType') items?: UserType[];

    // The total amount of users to query
    @Field() itemTotal?: number;
}
