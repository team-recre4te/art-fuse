# ArtFuse

*Explore. Exchange. Transform.*

Every day a new song remix is going viral on TikTok. Imagine if we had a space for these iterations to happen much earlier in the creative process and for a wider range of mediums, not just music. We are Recr4te. Our company philosophy is built on three core values: collaboration, openness, and community, and challenges one fundamental question, “how far can an idea go?” With the right room for expansion, ideas can go very very far. 

Many artists thrive in collaborative environments but struggle to find people to work with. We have designed a space that allows them to explore the myriad of outcomes for their work. Our product, ArtFuse, is an app that promises to change the way artists interact and test the limits of each other’s creativity. So many people have unfinished ideas that they want to take further, and we want to make these ideas visible by giving them a platform to share their work. 

It’s not easy to find community, especially in the creative world, but ArtFuse leverages its open and collaborative layout to make it easier for people to do so. Once one’s work is posted, people can contribute to it by making remixes. Remixes can also be remixed, which pushes the work in so many directions. These reactions to the art inform the art itself and can provide inspiration who don’t know what their next step should be. Users can also like and comment on every post, creating a valuable network of opinions and discussions. By catering to both creators and consumers, we can foster relationships between them. Our copyright policy requires artists to be comfortable posting their work but also ensures that they aren’t just taking other people’s ideas. 

Because remixing is the heart of ArtFuse, making space for new voices and acknowledging people’s contributions is our top priority. You can search for different creatives, view all the works they have done on their profile, receive notifications for specific categories, and explore different artists and pieces that we spotlight on our home page. By making all these features available, we are helping people grow their platforms. Ultimately, we want collaboration to go beyond ArtFuse and hope that artists can build lifelong connections through the framework we have provided. We are excited for you to join us on this journey as we encourage people to explore, exchange and transform what already exists.

# Conceptual Designs
## Post
* *Purpose:* Help users share their projects online for others to see and build on.
* *Operational Principle:* When creator x has a project that they want to see others remix, they can create an ArtFuse post which includes a project name, statement, related files, an associated category, and associated tags. If creator x is remixing another project, creator x’s post will have a reference to the post they remixed. After creator x posts the post, it will show up on the home pages of creators on the platform. When creator y goes onto ArtFuse looking for something new to work on, they may encounter creator x’s post. Creator y will also be able to use the remix button to create a post that remixes creator x’s post. Creator z, if a parent or ancestor of creator x’s post, can also choose to report the post. Creator z might want to do that if they feel creator x is disrespecting the previous creators. Reported posts will have warnings covering the post; users will need to choose to view the posts by clicking to remove the warning.
* *States:* author, name, description, files, images (displayed images on a post), categories, tags, parent post, and report status
* *Actions:*
    * add (author: User, name: String, description: String, files: File[], images: Image[], categories: Category[], tags: Tag[], parent: Post)
        * date = current date
        * use author, name, description, files, images, categories, tags, parent, and date to create a new post
    * get (category: Category)
        * return posts that have category as a category
    * get (tag: Tag)
        * return posts that have tag as a tag
    * delete (post: Post)
        * delete post
        * disconnect post from its user, categories, and tag(s)
    * add (reportStatus: ReportStatus, post: Post, reporter: User)
        * if reportStatus equals reported and reporter has a post that’s an ancestor to post
        * add reportStatus to post reportStatus
    * remix (parent: Post)
        * add name of parent to parent field of post

* *Data Modeling:*
    * author: Post -> one User
    * name: Post -> one String
    * description: Post -> one String
    * parent: Post -> one Post
    * categories: Post -> some Category
    * tags: Post -> set Tag
    * files: Post -> set File
    * images: Post -> set Image
    * date: Post -> one Date
    * reportStatus: Post -> one ReportStatus

## User

* *Purpose:* Allow one to have a presence on ArtFuse in the form of an account that connects their name and password with the projects they share and work on.

* *Operational Principle:* An artist learns about ArtFuse and decides to create an account; in this process, they add their name, a username, a password, a bio, and some tags that they are interested in; this information will be tied to the user’s account. Going forward, the artist can log in and log out whenever they choose. While logged in, the artist can view their bio, username, and name. Each user can decide to edit their bio at any point. When the artist goes on to create posts, likes, or comments, their creations will be associated with their user information. Anyone on the platform can go onto an artist’s profile to see information about the artist as well as posts they’ve liked, commented, or created.

* *States:* account status (existing account logged in or existing account logged out) and bio

* *Actions:*
    * add (name: String, username: String, password: String, bio: String)
        * use name, username, password, and bio to create new user
    * update (loginStatus: LoginStatus)
        * If loginStatus indicates that user has logged in, record that user has logged in
        * else record that user has logged out
    * update (bio: String)
        * change user’s current bio so that it matches bio
    * delete (user: User)
        * delete all posts created by user
        * delete all comments created by user
        * delete all likes created by user
        * delete user

* *Data Modeling:*
    * username: User -> one String
    * name: User -> one String
    * password: User -> one String
    * bio: User -> one String

## Comment

* *Purpose:* Give users a way to interact with other users’ art projects, give feedback, discuss topics, and encourage ideas.
* *Operational Principle:* When a user looks through posts on ArtFuse, they may see posts that they like, dislike, or generally find interesting. User u can share thoughts by commenting on the project post of various users. Users can also interact with and learn more about each other by viewing each other’s comments.
* *States:* comments by certain user, comments on certain post, content of comment, and date comment was created

* Actions:
    * add (content: String, post: Post, author: User)
        * date = current date
        * Create comment using date, content, and author
    * delete (comment: Comment)
        * remove comment from post comments
        * remove comment from user comments
        * delete comment
    * delete (post: Post)
        * for each comment on post, delete comment
        * delete post
    * get (author: Author)
        * return comments that author has created
    get (post: Post)
        * return comments that have to do with

*Data Modeling:*
    * commentedItem: Comment -> one Item
    * author: Comment -> one User
    * content: Comment -> one String
    * Date: Comment -> Date

## Like

*Purpose:* Help users show their interest or admiration for another user’s project post, and help users discover posts that users are currently most interested in.
*Operational Principle:* When a user sees a post they like, they can press the like button to show the creator and others that they like this post. After the post has been liked, the user will also have access to an unlike button that will be helpful to them if they change their mind about liking the post. When other users view their home pages, they will be able to see posts that currently have the most likes.
*States:* number of likes on post, likes created by certain user, author of like, and post being liked

* Actions:
    * add (author: User, likedItem: Post)
        * create like using likedItem and author
    * delete (post: Post)
        * for each like on post
        * remove like from post’s likes, remove like from the like author’s likes
    * get (author: User)
        *return likes that author has created
    * get (post: Post)
        * return likes on post
* Data Modeling:
    * author: Like -> one User
    * likedItem: Like -> one Item

## Notification
* *Purpose:* Help users find projects to work on by providing suggestions on the fields of art they excel.
* *Operational Principle:* The user navigates to the notifications page and selects the categories they want to receive suggestions for. The system automatically selects the most liked projects from the categories they have selected. The user can click on the projects to view the projects and decide if they want to remix it.
* *States:* set of categories the user wants to receive a notification for

* *Actions:*
    * getRecommendations(user: User)
        * return suggested projects for user
    * subscribe(user: User, category: Category)
        * If category is not already in user’s set subscribed
        * add category to user set of subscribed categories
    * unsubscribe(user: User, category: Category)
        * If category is in user’s set subscribed
        * remove category to user set of subscribed category
* *Data modeling:*
    * Subscribed: User-> Set Category (where Category is a String)
    * Notifications: User -> Set Notification
    * Suggested: Notification -> Set Post

## App Definition

* app ArtFuse
* concepts
    * Post
    * User
    * Comment [User.User, Post.Post]
    * Like [User.User, Post.Post]
    * Notification [User.User, Post.Post]

## Synchronizations

1. User U likes User T’s post:
    * User T’s post will show as a liked post on User U’s platform. User T’s post will increase in rank and potentially be easier to see amongst other posts by other users.
2. User U comments on User T’s post:
    * User T’s post will now show un User U’s profile as a post User U has commented on. User U’s comment will be attached to User T’s post whenever the post is viewed.
3. User U creates a post that has User T’s post as the parent:
    * User U’s post will be linked to User T’s post visually, and whenever viewers look to see ancestry of the post, User T’s post will be included.
4. User U deletes their post:
    * All posts that have User U as their parent will now show that their parent has been removed rather than showing the parent post.
5. User U reports User T’s post:
    * User T’s post will be covered by a warning message about the post being reported
    * Individual users will be able to decide to click and view the post if they wish
6. User U remixes a reported post:
    * User U’s parent will be the reported post, User U’s post will show that it was remixed by “a reported project”

# Wireframes
[Link to Figma](https://www.figma.com/file/SU2ZbpT87QI0YLB8cvcrxU/ArtFuse?node-id=0%3A1&t=rCiASyAgVDZLUUxl-0)

# VSD Analysis

## Stakeholders Dimension

1. Direct Stakeholders - A direct stakeholder is someone who directly interacts with the product, and the different groups of direct stakeholders may have unique perspectives, skills, and concerns. Below is a list of direct stakeholders for ArtFuse along with concern(s) specific to them.
    * Established Artist - find new inspiration
    * Beginner Artist - get their work noticed, practice skills, and explore new types of art
    * Art Newbie - get new ideas and try new skills
    * ArtFuse Company / Employees - connect people to other artists, support artists sharing their work
    * Original Creator - share artistic ideas for others to build off of
    * People who Remix Other Ideas - find new inspiration
2. Non-Targeted Use - Technologies are not always used in ways that the designers intended, and ArtFuse could be used in ways we didn’t plan for or for a nefarious purpose.
    * For example, the application could be a source for people to go to steal other people’s art and could raise copyright issues. To address this, our team has decided to include a clear disclaimer that all things posted on the site are under a creative commons license. Another nefarious purpose the site could be exploited for is to post and share inappropriate art. To help combat this, we plan to include a report button to allow people to flag these posts and have a label over the post saying that it has been reported.

## Time
1. Reappropriation - If ArtFuse was to reach the point of widespread use, it may be reappropriated in novel ways by the community using it, and this reappropriation can affect both the community in which it originated and the new communities using it.
    * People could start using the platform as a way to advertise their own services or sites where they sell their art to try to make money. This could lead to posts from the original community, who were using the platform to share creative things they have made to be further built off of by other artists, to get buried under these ads and make them harder to find. And, people from the original community might find these advertisements annoying and report them to get them taken down. In addition, it could start to be used to spread memes. The original community might be annoyed to have their art being on the same platform as memes. While the new community might be annoyed that their posts might be getting reported and taken down.

## Pervasiveness
1. Widespread Use - If ArtFuse was to grow from handfuls to thousands and then millions of users, a person’s use of it could be impacted. As it grows, more people around the world will likely be using it, so the platform and work being posted on it will become more diverse.
* Synergistic Benefits
    * With more people on the platform, more work is being posted, so there are more ideas for other people to build off of.
    * Widespread use will create a larger and more diverse community of artists, so a wider array of different ideas being posted.
    * More people on the platform will lead to more people finding posts interesting to them to build off of and there will be more collaboration between artists.
* Potential Breakdowns
    * The site could become overflowed with posts making it hard to find things that interest you to work on.
    * If the number of posts on the site gets very large, it could get harder to get your work seen in this sea of posts. So, it will be important to have a good search feature and suggestions for users for posts to look at.
    * It could also become more difficult to prevent nefarious content on the platform, so we plan to give users power to flag/report content.

# Tradeoffs

## *1. The Perils of Copyright (choosing a license)*

A lot of feedback we got from our project diverge video was related to ArtFuse and potential copyright issues. We were prompted to consider if everyone would waive their claims to their work when they post it but felt that this would be too extreme. Our next option was to implement a requesting mechanism that requires remixers to request to make changes to the original creator’s work. In principle, this seemed like the perfect solution because it gives creators autonomy over the decision of who gets to add to their work, however, we felt like it prevented the openness and freedom we wanted for the platform and had to consider cases like creators taking too long to respond or having to go through too many requests. We decided that all posts on our platform will be covered by a license that’s not restrictive. Two options we considered are the MIT License which allows software to be freely used, modified, and shared and the CC-BY License which allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use.

## *2. What Would Users Want? (tags vs. categories)*

We want to include some search mechanism in our app that makes it easy for users to find creators. We considered allowing creators to make their own categories when they post their work, however, this could affect the search experience if the spelling or naming of categories that are more or less the same differs. Users will have to search under different categories to find what they want which can be time-consuming and undesirable for some users. Having a set of broader categories such as ‘digital art’, and ‘music’, for users to pick from felt like a better solution for now. This design choice allows us to make the scope of the platform a bit more focused. Every root post will need to have a category associated with it for consistency and all remixes that are developed from that post will fall under the same category. However, we augmented this solution by giving creators the option to add their own tags to their posts. Tags appeal to people who might be looking for specific types of work or art forms and will expose users to both original posts and remixes, widening their reach. With time and more feedback from users, these categories will eventually grow and become more representative of what creators want.

## *3. Who Has The Power? (reporting & deleting posts)*

One of our mentors expressed the importance of having a reporting feature that allows users to handle work they feel is offensive. We agreed with this being an option but struggled with two things: what counts as offensive and what is a suitable consequence for a post being reported? Our initial idea was that if a creator finds a remix of their work offensive they should be able to delete it. However, we didn’t know if only the parent of a post (i.e. the person who made the post the remix is based on) should have the power to delete the post or if every creator in the layers above the post should have this power. We asked a lot of questions during this process and examined different stakeholders and their proximity to the art. Do all the creators that influenced the remix have the right to disapprove of it and delete it or should this power only be left to the parent of the remix whose work is closely related to it? This also revealed another issue of what happens when posts are deleted. Do all the posts that are extensions of it also get deleted? We decided that it would be unfair for creators who are also associated with the post to face the consequences too. Their work should still be visible on the platform, however, when people try to view the work they based it on, they will be notified “This post has been deleted”. We also felt that any creator that influenced the remix i.e. ancestors of the remix in tree-terms, should be able to express their feelings about a post they feel is inappropriate. For now, when a post is reported it will become a flagged post and will be hidden under a warning that says “This post was reported. Click to view at your own discretion.”, so people know to view it at their own discretion and the consequences will be handled on a case-by-case basis by the admin of the app.

## *4. Do You Really Have to Be So Complicated, Comments? (comments)*

Users have the ability to comment on posts to express what they like or dislike about the pieces, give advice or even share similar posts. We weren’t sure if we wanted people to also be able to comment on comments. A benefit of this would be more focused threads of communication, however, we decided to keep things simple and encourage people to direct their comments to the posts by only allowing people to make comments on posts. This decision will also make the user interface for displaying comments a lot more straightforward.
