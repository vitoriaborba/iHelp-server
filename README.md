# Project - iHelp
<br>

## Description

iHelp is a community made to help whoever is in need.


**Keywords:** Help, community, social network.
<br>



## Login Credentials

You can use this credential to enter the app without the need to sign up.

**Username:** test@test.com

**Password:** 12345678



# Client / Frontend
## React Router Routes (React App)


| Path           | Component       | Permissions                 | Behavior                                          |
|----------------|-----------------|-----------------------------|---------------------------------------------------|
| `/`            | Home            | public `<Route>`            | Homepage                                          |
| `/signup`      | SignupPage      | anon only  `<AnonRoute>`    | Signup form, navigates to login page after signup.|
| `/login`       | LoginPage       | anon only  `<AnonRoute>`    | Login form, navigates to feed page after login.   |
| `/feed`        | Feed            | anon only  `<AnonRoute>`    | Show requests from all users.                     |
| `/user`        | UserDetails     | anon only  `<AnonRoute>`    | Show the log in user profile page.                |
| `/requests`    | UserRequests    | anon only  `<AnonRoute>`    | Show the pending and completed user requests from the log in user. |

    
 
## Components
**Pages**

* LoginPage.                   
* SignupPage.                 
* Home                            
* ProfilePage                    
* Feed.                              
* EditProfile
* Community
* NewPost
* PostDetails
* UserDetails                   
* UserRequests                

**Components**

* IsAnon
* IsPrivate
* Logo
* NavBar
* Rating
* SearchBar

<br>

# Server / Backend


## Models:


**User model**

```javascript
{
  username: { type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
  },
  email: {
      type: String, 
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
  },
  image: {
      type: String,
      default: "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
  },
   password: {
    type: String,
    required: true,
    trim: true,
   },
   posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
   postsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
   wasHelped: [{ type: Schema.Types.ObjectId, ref: 'User' }],
   Helped: [{ type: Schema.Types.ObjectId, ref: 'User' }],
},
  {
    timestamps: true,
  }
  ```


**Post model**

```javascript
{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    image: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    isDone: {
        type: Boolean,
        default: false,
    },
      {
        timestamps: true,
    }
```

**Comment model**

```javascript
{
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    content: String
  },
  {
    timestamps: true
  }
```
<br>

## API Endpoints (backend routes)

| HTTP Method | URL                     | Request Body                  | Success status | Error Status | Description                                                 
| ----------- | ----------------------- | ----------------------------- | -------------- | ------------ | ----------------------------------------------
| POST        | /signup                 | { username, email, password } | 201            | 500          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | /login                  | {username, password}          | 201            | 500          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session|
| GET         | /verify                 | Saved token                   | 200            | 500          | Check if the user has the authorization token to access the app |
| GET         | /users                  |              -                | 200            | 500          | Get all users                                
| GET         | /user		                | {_id}	                        | 200            | 500          | Checks for the user id                       
| GET         | /user/:id	              | { id }	                      | 200            | 500          | Get the profile from the login user         
| PUT         | /user/:userid	          | { username, email, password } | 200            | 500          | Edit user details
| POST        | /comment/:postId        | { postId, content, _id }      | 200            | 500          | Create a post
| DELETE      | /post/:commentId	      | -                             | 204            | 500          | Delete post                                
| GET         | /feed/:postId           | {postId}                      | 200            | 500          | Get post details
| POST        | /upload 			          | -                             | 200            | 500          | Uploads an image

<br>

## Links:

### Figma:
https://www.figma.com/file/mD02aURiYGoJYKB5Z9NL7y/iHelp-App?node-id=0%3A1

### Notion:
https://www.notion.so/iHelp-App-1a6ea7b2238443fb8892d023a621f428

### Git:
[Client repository Link](https://github.com/vitoriaborba/project-management-client)

[Server repository Link](https://github.com/vitoriaborba/project-management-server)

[Deployed App Link](https://i-help.netlify.app/)			

 
### API used:
https://geoptapi.org/municipio


### Slides:
https://docs.google.com/presentation/d/150STf6jlLjr0h3axYOvMfgfMbeIDrRY88so0fl-gfIs/edit?usp=sharing

			
