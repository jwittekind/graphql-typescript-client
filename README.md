# Type GraphQL Client

This is decent draft of a new way to use GraphQL with apollo.
With this module i'd like to take a first step, 
so that graphql can be used with typescript more easily.

The idea is, to let the user write human readable methods that can be chained.
In the end, it could look similar to the way we write code in laravel PHP or other famous frameworks: 

`````
...

this.posts$ = PostPaginationType
    .getPosts()
    .byId(5)
    .withPagination({ limit: 10, offset: 0 })
    .with('comments', (comments) => {
        return comments.withPagination({ limit: 0, offset: 0 });
    })
    .watchQuery('myPostsQuery').valueChanges;

this.posts$.subscribe(() => ...);    

...
`````

## So How do we achieve that?

This idea came to my mind the first moment when i got to know graphql.
Actually i've almost barely worked with manually written graphql queries/mutations.

With my first implementation of graphql into an application, 
i started to write a service that converts js objects into the graphql query language.

Though, over time my ideas have evolved and caused a lot of headache - i always sticked to that idea.
This repository is what i could make out of it.
