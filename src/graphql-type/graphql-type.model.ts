import { Apollo } from 'apollo-angular';
import { QueryOptions } from 'apollo-client';
import { GraphqlJazzInjectorInstance } from '../graphql-jazz.module';

export abstract class GraphqlType<V = any, R = any> {

    queryConfig = { query: null, variables: null } as QueryOptions<V>;

    query() {
        const constructorName = this.constructor.name;
        const apollo = GraphqlJazzInjectorInstance.get<Apollo>(Apollo);
        // console.log(apollo.getClient());
        return 'query() return';
    }

    watchQuery() {
        console.log('I\'m About to watch query something!!!!');
        return 'watchQuery() return';
    }

    mutate() {
        console.log('I\'m About to mutate something!!!!');
        return 'mutate() return';
    }

}

// // apollo
// import { QueryRef } from 'apollo-angular';
// import {
//     EpCommunityImage,
//     EpCommunityImages,
//     EpCommunityPhotoAlbum,
//     EpCommunityPhotoAlbums,
// } from '@ep-shared/community-photos/models';
// import { EpPosts } from '@ep-shared/community/models';
// import { EpUser, EpUsers } from '@ep-shared/user/models';
// import { EpGroup, EpGroups } from '@ep-shared/group/models';
// import { EpArtist, EpArtists } from '@ep-shared/artist/models';
// import { EpArticle, EpArticles } from '@ep-shared/blog/models';
// import { EpLocation, EpLocations } from '@ep-shared/location/models';
// import { EpMusicAlbum, EpMusicAlbums } from '@ep-shared/music/models';
// import { EpEvent, EpEvents, EpTour, EpTours } from '@ep-shared/event/models';
// import { EpPublicImage, EpPublicImages } from '@ep-shared/public-photos/models';
// // EP
// import { QueryConfig } from '@ep-shared/core';
// import { QueryOptions } from 'apollo-client';
//
// export class EpQuery<M, R, V> {
//
//     ModelTarget?: any;
//     queryConfig?: QueryConfig<M, R, V> = { variables: {}, options: { subParams: null } };
//     private queryArguments?: any;
//
//     constructor(queryArguments?: { [key: string]: any }) {
//         this.ModelTarget = new.target;
//         if (queryArguments && queryArguments !== this.queryArguments) {
//             if (new.target === EpQuery) {
//                 throw new TypeError('Cannot construct Abstract instance EpQuery directly');
//             }
//             this.queryArguments = queryArguments;
//         }
//     }
//
//     /**
//      *
//      * @param id
//      * @constructor
//      */
//     static byId?<M>(id: number): M {
//         return asModelType(new this()).byId(id);
//     }
//
//     /**
//      *
//      * @param slug
//      * @constructor
//      */
//     static bySlug?<M>(slug: string): M {
//         return asModelType(new this()).bySlug(slug);
//     }
//
//     /**
//      *
//      * @param owner
//      */
//     static ownedBy?<M>(owner: any): M {
//         return asModelType(new this()).ownedBy(owner);
//     }
//
//     /**
//      *
//      * @param searchQuery
//      */
//     static search?<M>(searchQuery: string): M {
//         return asModelType(new this()).search(searchQuery);
//     }
//
//     /**
//      *
//      * @param relatedChild
//      * @param relatedVars
//      * @param relatedParams
//      */
//     static with?<M>(relatedChild: string, relatedVars?: any, relatedParams?: any): M {
//         return asModelType(new this()).with(relatedChild, relatedVars, relatedParams);
//     }
//
//     /**
//      *
//      * @param limit
//      * @param offset
//      * @param sortBy
//      * @param sortByDesc
//      */
//     static pagination?<M>(limit?: number, offset?: number, sortBy?: string, sortByDesc?: boolean): M {
//         return asModelType(new this()).pagination(limit, offset, sortBy, sortByDesc);
//     }
//
//     /**
//      *
//      * @param config
//      */
//     static config?<M>(config: any): M {
//         return asModelType(new this()).config(config);
//     }
//
//     /**
//      *
//      */
//     static forceFetch?<M>(): M {
//         return asModelType(new this()).forceFetch();
//     }
//
//     /**
//      *
//      */
//     public get?(...args: any[]): QueryRef<M, V>;
//
//     /**
//      *
//      * @param id
//      * @constructor
//      */
//     public byId?(id: number): M {
//         const key = this.varNameOf('id');
//         if (key) {
//             this.queryConfig.variables[key] = id;
//             return asModelType(this);
//         }
//         this.throwKeyError('byId()');
//     }
//
//     /**
//      *
//      * @param slug
//      * @constructor
//      */
//     public bySlug?(slug: string): M {
//         const key = this.varNameOf('slug');
//         if (key) {
//             this.queryConfig.variables[key] = slug;
//             return asModelType(this);
//         }
//         this.throwKeyError('bySlug()');
//     }
//
//     /**
//      *
//      * @param owner
//      */
//     public ownedBy?(owner: any): M {
//         const key = this.varNameOf('Owner');
//         if (key && owner) {
//             this.queryConfig.variables[key] = { type: owner.type };
//             const obj = this.queryConfig.variables[key];
//             if (owner.id) {
//                 this.queryConfig.variables[key] = { ...obj, id: owner.id };
//                 return asModelType(this);
//             } else if (owner.slug) {
//                 this.queryConfig.variables[key] = { ...obj, slug: owner.slug };
//                 return asModelType(this);
//             }
//         }
//         this.throwKeyError('[EpQuery] Invalid Tyoe passed to ownedBy()');
//     }
//
//     /**
//      *
//      * @param searchQuery
//      */
//     public search?(searchQuery: string) {
//         const key = this.varNameOf('search');
//         if (key && searchQuery) {
//             this.queryConfig.variables[key] = searchQuery;
//             return asModelType(this);
//         }
//         this.throwKeyError('search()');
//     }
//
//     /**
//      *
//      * @param relatedChild
//      * @param relatedVars
//      * @param relatedParams
//      */
//     public with?(relatedChild: string, relatedVars?: any, relatedParams?: any): M {
//         if (relatedChild) {
//             const options = this.queryConfig.options;
//             options.subParams = options.subParams || {};
//             options.subParams.items = options.subParams.items || {};
//             const params = options.subParams.items;
//             if (relatedChild.indexOf('.') !== -1) {
//                 options.subParams.items = {
//                     ...params,
//                     items: {
//                         ...params.items,
//                         ...(relatedChild.split('.').reverse().reduce((newParams, param, index) => {
//                             return { [param]: index === 0 ? true : newParams };
//                         }, {})),
//                     },
//                 };
//             } else {
//                 params[relatedChild] = relatedParams || true;
//             }
//             this.queryConfig.variables = this.queryConfig.variables || {};
//             this.queryConfig.variables = { ...this.queryConfig.variables, ...relatedVars };
//         }
//         return asModelType(this);
//     }
//
//     /**
//      *
//      * @param config
//      */
//     public config?(config: any) {
//         if (config) {
//             this.queryConfig = {
//                 ...this.queryConfig,
//                 ...config,
//                 variables: { ...this.queryConfig.variables, ...(config.vars || {}) },
//                 options: {
//                     ...this.queryConfig.options,
//                     ...(config.options || {}),
//                     subParams: {
//                         ...this.queryConfig.options.subParams,
//                         ...(config.options ? config.options.subparams : {}),
//                     },
//                 },
//             };
//         }
//         return asModelType(this);
//     }
//
//     /**
//      *
//      * @param limit
//      * @param offset
//      * @param sortBy
//      * @param sortByDesc
//      */
//     public pagination?(limit?: number, offset?: number, sortBy?: string, sortByDesc?: boolean): M {
//         const key = this.varNameOf('pagination');
//         if (key) {
//             limit = limit || 10;
//             offset = offset || 0;
//             const pagination: any = { limit, offset };
//             pagination.sortBy = sortBy ? sortBy : pagination.sortBy;
//             pagination.sortByDesc = typeof sortByDesc === 'boolean' ? sortByDesc : pagination.sortByDesc;
//             this.queryConfig.variables[key] = pagination;
//             // @ts-ignore
//             return asModelType(this);
//         }
//         this.throwKeyError('pagination()');
//     }
//
//     /**
//      *
//      */
//     public forceFetch?() {
//         this.queryConfig.forceFetch = true;
//         return asModelType(this);
//     }
//
//     /**
//      *
//      * @param key
//      */
//     private varNameOf?(key: string) {
//         if (key && this.queryArguments && this.queryArguments[key]) {
//             if (typeof this.queryArguments[key] === 'object') {
//                 return this.queryArguments[key].variableName;
//             }
//         }
//         return null;
//     }
//
//     /**
//      *
//      * @param method
//      */
//     private throwKeyError?(method: string) {
//         const model = this.ModelTarget.name;
//         throw new Error('[EpQuery] ' + method + ' can not be set for query of "' + model + '"');
//     }
// }
//
// function asModelType(model) {
//     if (isUser(model)) {
//         return model;
//     } else if (isTour(model)) {
//         return model;
//     } else if (isTours(model)) {
//         return model;
//     } else if (isUsers(model)) {
//         return model;
//     } else if (isPost(model)) {
//         return model;
//     } else if (isPosts(model)) {
//         return model;
//     } else if (isGroup(model)) {
//         return model;
//     } else if (isGroups(model)) {
//         return model;
//     } else if (isEvent(model)) {
//         return model;
//     } else if (isEvents(model)) {
//         return model;
//     } else if (isArtist(model)) {
//         return model;
//     } else if (isArtists(model)) {
//         return model;
//     } else if (isArticle(model)) {
//         return model;
//     } else if (isArticles(model)) {
//         return model;
//     } else if (isLocation(model)) {
//         return model;
//     } else if (isLocations(model)) {
//         return model;
//     } else if (isMusicAlbum(model)) {
//         return model;
//     } else if (isMusicAlbums(model)) {
//         return model;
//     } else if (isPublicImage(model)) {
//         return model;
//     } else if (isPublicImages(model)) {
//         return model;
//     } else if (isCommunityImage(model)) {
//         return model;
//     } else if (isCommunityImages(model)) {
//         return model;
//     } else if (isCommunityPhotoAlbum(model)) {
//         return model;
//     } else if (isCommunityPhotoAlbums(model)) {
//         return model;
//     }
//     return model;
// }
//
// function isUser(self): self is EpUser {
//     return self?.__typename === 'UserType';
// }
//
// function isUsers(self): self is EpUsers {
//     return self?.__typename === 'UserPaginationType';
// }
//
// function isTour(self): self is EpTour {
//     return self?.__typename === 'TourType';
// }
//
// function isTours(self): self is EpTours {
//     return self?.__typename === 'TourPaginationType';
// }
//
// function isGroup(self): self is EpGroup {
//     return self?.__typename === 'GroupType';
// }
//
// function isGroups(self): self is EpGroups {
//     return self?.__typename === 'GroupPaginationType';
// }
//
// function isPost(self): self is EpPosts {
//     return self?.__typename === 'PostType';
// }
//
// function isPosts(self): self is EpPosts {
//     return self?.__typename === 'PostPaginationType';
// }
//
// function isArtist(self): self is EpArtist {
//     return self?.__typename === 'ArtistType';
// }
//
// function isEvent(self): self is EpEvent {
//     return self?.__typename === 'EventType';
// }
//
// function isEvents(self): self is EpEvents {
//     return self?.__typename === 'EventPaginationType';
// }
//
// function isArtists(self): self is EpArtists {
//     return self?.__typename === 'ArtistPaginationType';
// }
//
// function isArticle(self): self is EpArticle {
//     return self?.__typename === 'ArticleType';
// }
//
// function isArticles(self): self is EpArticles {
//     return self?.__typename === 'ArticlePaginationType';
// }
//
// function isLocation(self): self is EpLocation {
//     return self?.__typename === 'LocationType';
// }
//
// function isLocations(self): self is EpLocations {
//     return self?.__typename === 'LocationPaginationType';
// }
//
// function isMusicAlbum(self): self is EpMusicAlbum {
//     return self?.__typename === 'MusicAlbumType';
// }
//
// function isMusicAlbums(self): self is EpMusicAlbums {
//     return self?.__typename === 'MusicAlbumPaginationType';
// }
//
// function isPublicImage(self): self is EpPublicImage {
//     return self?.__typename === 'PublicImageType';
// }
//
// function isPublicImages(self): self is EpPublicImages {
//     return self?.__typename === 'PublicImagePaginationType';
// }
//
// function isCommunityImage(self): self is EpCommunityImage {
//     return self?.__typename === 'CommunityImageType';
// }
//
// function isCommunityImages(self): self is EpCommunityImages {
//     return self?.__typename === 'CommunityImagePaginationType';
// }
//
// function isCommunityPhotoAlbum(self): self is EpCommunityPhotoAlbum {
//     return self?.__typename === 'CommunityPhotoAlbumType';
// }
//
// function isCommunityPhotoAlbums(self): self is EpCommunityPhotoAlbums {
//     return self?.__typename === 'CommunityPhotoAlbumPaginationType';
// }
