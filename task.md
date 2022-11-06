## Fullstack task

Welcome to spotted.io test.

You can use any libraries, any utilities that you wish, but please do not change the DB. SQlite allows us to quickly spin it up without running dockers or setting up a local DB.

The task should take you around

- junior: 3 hours
- medior: 2 hours
- senior: 1 hour
- senior with a prior experience with prisma/chakra and react-query it should take you around 30 minutes

after install and repo setup.

This is a fullstack test, so make sure you:

- modify the prisma schema
- add needed migration
- add seed data(if needed)
- implement FE changes
- modify existing tests if they are broken

We have a simple blog which at the moment has these functionalities:

- display a list of posts
- display a single post detail
- add a new post

Your task is to implement:

- when adding new post, you can select tags for the post from a tag input. A list of tags should be coming from backend, not hardcoded on FE
- (optional) tag input should create a new tag when the user types in any text and confirms with hitting an enter key
- display post's tags on the list of posts for each post, ideally as a list of `<Tag />` elements
- display post's tags on the post detail, ideally as a list of `<Tag />` elements

When changing the schema, please make sure that we can rename tags in the future. Tag rename is not part of this task, but the schema you introduce should allow renaming a tag without updating any Post.

Ideally your code should have at least happy paths tested. When it comes to styling feel free to keep it very basic

Our primary focus in this task is clean code and UX. The candidate who delivers the task with a codebase without any grave mistakes and best UX gets hired.

When you think you are done with the feature, please send it as zip/tar archive to `jiri.s@spotted.io` and `nick.t@spotted.io` in a copy. Alternatively you can share your solution using a github repository.
