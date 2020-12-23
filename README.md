

# Daily Thoughts Capstone Server
Daily Thoughts is an app that allows users to record a sentence every day. This may help with writer's block, and or act as a documentation method for users to record their thoughts.



### 1. Working Prototype
You can access a working prototype of the React app here: https://daily-thoughts-capstone-client-2fkxew49b.vercel.app/ and Node app here: https://enigmatic-river-49566.herokuapp.com/



### 2. User Stories
This app is for two types of users: a visitor and a logged-in user

###### Landing Page (Importance - High)
* as a visitor
* I want to understand what I can do with this app (or sign up, or log in)
* so I can decide if I want to use it

###### Login Page (Importance - High)
* As a returning register user
* I want to enter my password and username to log into this app,
* So I can have access to my account.

###### Sign Up (Importance - High)
* As a new user
* I want to register to use this app
* So I can create a personal account.

###### Project List (Importance - High)
* As a logged-in user,
* I want to be able to view the contents of my project(s)
* So I can decide what project I want to navigate to.

###### Project Page (Importance - High)
* As a logged-in user,
* I want to be able to submit a new sentence into a project,
* so I can see my project added onto.

###### User Preferences (Importance - Medium)
* As a logged-in user,
* I want to be able to update my account cridentials,
* So I can be able to log in.

###### Dashboard (Importance - Medium)
* As a logged-in user,
* I want to be able to see my account statistics and previous posts,
* so I can decide what information I find important.

###### Project Sentence Thread (Importance - Medium)
* As a logged-in user,
* I want to be able to edit previously submitted content,
* So I can update the content of my project.

###### Project Sentence Thread (Importance - Medium)
* As a logged-in user,
* I want to be able to edit the sharing preferences on my project,
* So I can decide if I want my sentences to be visible to others.

###### Home Page (Importance - Medium)
* As a logged-in user,
* I want to be able to view recent public posts made by users,
* So I can get inspiration for my project(s).

###### Project Page (Importance - Low)
* As a logged-in user,
* I want to be able to 'pin' a project,
* So I can access it directly from my Home Page

###### User Preferences (Importance - Low)
* As a logged-in user,
* I want to be able to choose app color themes,
* So the app is more accessible.


### 3. Functionality
The app's functionality includes:
* Every User has the ability to create an account
* Registered Users have the ability to log in
* Registered Users have the ability to create projects
* Registered Users have the ability to view their created project(s)
* Registered Users have the ability to view the sentences within their project(s)
* Registered Users have the ability to add sentences to their project(s)



### 4. Technology (done)
* Front-End: HTML5, CSS3, JavaScript ES6, React
* Back-End: Node.js, Express.js, Mocha, Chai, RESTful API Endpoints, Postgres
* Development Environment: Heroku, DBeaver



### 5. Wireframes (to do now)
Landing Page
:-------------------------:
![Landing Page](./github-images/wireframes/landing-page-wireframe.png)

Register Page
:-------------------------:
![Register Page](./github-images/wireframes/register-page-wireframe.png)

Login Page
:-------------------------:
![Login Page](./github-images/wireframes/login-page-wireframe.png)

Project List Page
:-------------------------:
![Project List Page](./github-images/wireframes/project-list-wireframe.png)

Sentence Thread
:-------------------------:
![Sentence Thread](./github-images/wireframes/sentence-thread-wireframe.png)

### 6. Front-end Structure - React Components Map (to do later)
* __Index.js__ (stateless)
    * __App.js__ (stateful)
        * __LandingPage.js__ (stateless)
            * __Login.js__ (stateful) - connect to Users table (nickname, email, password)
            * __Register.js__ (stateful) - connect to Users table (nickname, email, password)
        * __Navbar.js__ (stateless) - renders navigation links
        * __ProjectListPage.js__ (stateless) - renders ProjectList ProjectListMenu and NavBar
            * __ProjectList.js__ (stateful) - connect to Projects table (id, project_name, created_date)
                * __ProjectCard.js__ (stateless) - renders a project card with project info
                * __ProjectListMenu.js__ (stateful) - connect to Projects table
        * __ProjectPage.js__ (stateful) - connect to Sentences table, renders Paragraph SentenceList SentenceForm
            * __Paragraph.js__ (stateless) - renders sentences in paragraph
            * __SentenceList.js__ (stateful) - renders SentenceCards 
                * __SentenceCard.js__ (stateless) - renders card with sentence content
            * __SentenceForm.js__ (stateful) - connects to Sentences table



### 7. Back-end Structure - Business Objects
* Users (database table)
    * id (auto-generated)
    * nickname (minimum 5 characters, no special chars, no initial/trailing space validation)
    * email (must be unique, email validation)
    * password (at least 8 chars, at least one alpha and a special character validation)
    * date_created (now())

* Projects (database table)
    * id (auto-generated)
    * user_id (foreign key connected with user table)
    * project_name (minimum 1 character, no spaces validation) [if I'm going to have clean conversion to url]
    * date_created (now())
    * last_updated (now(), updates on edit)
    * is_archived (default false)

* Sentences (database table)
    * id (auto-generated)
    * project_id (foreign key connected with project table)
    * date_created (now())
    * content (TEXT NOT NULL, no trailing or leading space validation)
    * last_updated (now(), updates on edit)
    * is_archived (default false)


### 8. API Documentation (to do later)
API Documentation details:
```text
/
.
├── /auth
│   └── POST /login
├── /users
│   └── GET
│       ├── /
│       └── /:id
│   └── POST /
│   └── PATCH /:id
│   └── DELETE /:id
├── /project
│   └── GET
│       ├── /
│       └── /:id
│   └── POST /
│   └── PATCH /:id
│   └── DELETE /:id
├── /sentence
│   └── GET
│       ├── /
│       └── /:id
│   └── POST /
│   └── PATCH /:id
│   └── DELETE /:id
```
#### POST `/auth/login`
```js
// req.body
{
  nickname: String,
  password: String
}
// res.body
{
  authToken: String
}
```
#### GET `/users`
```js
//res.body
{
  [
    {
      id: Number,
      nickname: String,
      email: String,
      password: String(encrypted),
      date_created: String
    }
  ]
}
```
#### POST `/users`
```js
//req.body
{
  nickname: String,
  email: String,
  password: String
}
//res.body
{
  id: Number,
  nickname: String,
  email: String,
  password: String(encrypted),
  date_created: String
}
```
#### GET `/project`
```js
//res.body
{
  [
    {
      id: Number,
      user_id: Number,
      project_name: String,
      date_created: String,
      last_updated: String,
      is_archived: Boolean
    }
  ]
}
```
#### POST `/project`
```js
//req.body
{
  user_id: Number,
  project_name: String,
}
//res.body
{
  id: Number,
  user_id: Number,
  project_name: String,
  date_created: String,
  last_updated: String,
  is_archived: Boolean
}
```
#### POST `/sentence`
```js
//req.body
{
  project_id: Number,
  content: String
}
//res.body
{
  id: Number,
  project_id: Number,
  content: String,
  date_created: String,
  last_updated: String,
  is_archived: Boolean
}
```
#### PATCH `/sentence/:id`
```js
//req.body
{
  content: String
}
//res.body
{
  id: Number,
  project_id: Number,
  content: String,
  date_created: String,
  last_updated: String,
  is_archived: Boolean
}
```



### 9. Screenshots
Landing Page
:-------------------------:
![Landing Page](./github-images/screenshots/landing-page-screenshot.png)

Register Page
:-------------------------:
![Register Page](./github-images/screenshots/register-page-screenshot.png)

Login Page
:-------------------------:
![Login Page](./github-images/screenshots/login-page-screenshot.png)

Project List
:-------------------------:
![Project List](./github-images/screenshots/project-list-screenshot.png)

Project Page
:-------------------------:
![Project Page](./github-images/screenshots/project-page-screenshot.png)



### 10. Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* add more functionality
* completely revamp style and design



### 11. How to run it
Use command line to navigate into the project folder and run the following in terminal

##### Local React scripts
* To install the react project ===> npm install
* To run react (on port 3000) ===> npm start
* To run tests ===> npm run test

##### Local Node scripts
* To install the node project ===> npm install
* To migrate the database ===> npm run migrate -- 1
* To run Node server (on port 8000) ===> npm run dev
* To run tests ===> npm run test