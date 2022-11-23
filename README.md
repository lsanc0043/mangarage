
# ManGaRage

![ManGaRage Logo, a garage with a manga rage icon](https://i.ibb.co/djLYvqf/Site-Title.png)

<a href="https://mangarage.onrender.com">Deployed Project Page (Live)</a> 
[See mock users](#mock-users)

[![GitHub Pull Request](https://img.shields.io/github/issues-pr-closed/lsanc0043/mangarage)](https://github.com/lsanc0043/mangarage/pulls)
[![GitHub repo size](https://img.shields.io/github/repo-size/lsanc0043/mangarage)](https://github.com/lsanc0043/mangarage/)
[![GitHub contributors](https://img.shields.io/github/contributors/lsanc0043/mangarage)](https://github.com/lsanc0043/mangarage/)


## Contents

- [About](#about-mangarage)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Features](#features)
  - [User Authentication & User Management](#user-authentication--user-management)
  - [Manga Poster](#manga-poster)
  - [Manga Reading List](#manga-reading-list)
- [Drawing Board](#drawing-board)
- [Installation](#installation)
- [Mock Users](#mock-users)
- [Future Development](#future-development)
- [Acknowledgements](#acknowledgements)

## About ManGaRage 
[Back to Contents](#contents)

***ManGaRage*** is a manga bucket-list. Find your promised neverland!

**manga · rage** - *a term to describe the passion some might feel about about manga*

**manGArage** or **manga garage** - *a term for a safe space to indulge in reading manga*

###### User Landing Page
<img src="https://user-images.githubusercontent.com/106147236/203653256-e7621098-bdef-469f-bea3-8c8c7a99cc87.png" width="1000" alt="user landing page" />

## Tech Stack 
[Back to Contents](#contents)

<table align="center">
  <tr>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168923681-ece848fc-5700-430b-957f-e8de784e9847.png" width="48" height="48" alt="html" />
      <br>html
    </td>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168924521-589f95da-069a-496a-bcc1-ee6dd132ff12.png" width="48" height="48" alt="CSS" />
      <br>CSS
    </td>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168977094-6a5073a2-2f48-4f5a-ae0e-ed1421a678c6.png" width="48" height="48" alt="JavaScript" />
      <br>JavaScript
    </td>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168976819-15a1f4e0-29cf-4ac0-94a7-1f15eee374a1.png" width="48" height="48" alt="postgreSQL" />
      <br>postgreSQL
    </td>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168978951-5ac2af5e-c911-4e59-b493-683071cf1860.png" width="48" height="48" alt="Express" />
      <br>Express
    </td>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168979311-4a486cad-32c8-46f4-a5da-912fdc51b2d6.png" width="48" height="48" alt="React" />
      <br>React
    </td>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168979848-733f7090-0f78-401a-9ceb-4267231abef7.png" width="48" height="48" alt="Node" />
      <br>Node
    </td>
    <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/74997368/168980647-1690f9de-bf0e-4318-93cb-1b2ba3701ded.png" width="48" height="48" alt="Bootstrap" />
      <br>Bootstrap
    </td>
    <td align="center" width="96">
        <img src="https://pbs.twimg.com/profile_images/1337188620222906368/oNKK_fVe_400x400.jpg" width="48" height="48" alt="Render" />
      <br>Render
    </td>
  </tr>
</table>

## API Reference 
[Back to Contents](#contents)

<table align="center">
  <tr>
     <td align="center" width="96">
        <img src="https://styles.redditmedia.com/t5_fljgj/styles/communityIcon_dodprbccfsy71.png" width="48" height="48" alt="MangaDex" />
        <br>MangaDex
     </td>
     <td align="center" width="96">
        <img src="https://user-images.githubusercontent.com/106147236/203653869-620d03c6-c9b0-4d67-afd7-ecca6f8ea203.png" width="60" height="48" alt="AnimePlanet" />
        <br>AnimePlanet
     </td>
  </tr>
</table>

## Features 
[Back to Contents](#contents)

### User Authentication & User Management
- Auth0 Login and Registration + Custom SQL encrypted login/registration
- Admin can view a record of all users and delete them
- Admin can view all posters without having to complete them

<table align="center">
  <tr>
     <td align="center" width="350">
        <img src="https://user-images.githubusercontent.com/106147236/203654060-d314f9bc-44be-4404-9eb5-5d5f51b16bca.png" width="200" alt="Auth0 Login and Registration" />
        <br>Auth0 View
     </td>
     <td align="center" width="350">
        <img src="https://user-images.githubusercontent.com/106147236/203654040-e4f07743-9fa5-4cd6-9982-89ded757195a.png" width="500" alt="Login Modal" />
        <br>Login Modal
     </td>
     <td align="center" width="350">
        <img src="https://user-images.githubusercontent.com/106147236/203654048-e6636b16-8f1b-4465-a645-2e595fc15af0.png" width="500" alt="Registration Modal" />
        <br>Registration Modal
     </td>
  </tr>
</table>

### Manga Poster
- User can view a poster with 48 mangas
- User can mark a manga as read or unread
- User can take a three question quiz to test their knowledge in order to mark the manga as read
- User can 'scratch' off the poster with a custom-designed coin to signify completion
- User can give completed mangas a rating out of 10

##### User View of Poster and Quiz
<img src="https://user-images.githubusercontent.com/106147236/203654731-183f7df4-848c-42d6-86a5-748e3bd3c4b3.png" width="1000" alt="User View of Poster and Quiz" />

### Manga Reading List
- User can view a reading list with tables for:
    - ***Will Read***
    - ***Currently Reading***
    - ***Completed***
- User can use a search bar to look for a specific manga and display the details
- User can add and delete from the reading list!
- User can add a status of either **Just Started**, **Halfway**, or **Almost Done** to mangas in the ***Currently Reading*** list
- User can add a rating out of 10 to mangas on the ***Completed*** list
- User can drag and drop table items to move between the three lists

##### User View of Reading List
<img src="https://user-images.githubusercontent.com/106147236/203654849-97e07eab-5544-44be-8e68-5b0facd944c7.png" width="1000" alt="User View of Reading List" />

##### User View of Add Manga Form
<img src="https://user-images.githubusercontent.com/106147236/203654991-7191d813-eb79-4e65-9c2e-1f9547b8f9c7.png" width="1000" alt="User View of Add Manga Form" />

## Drawing Board 
[Back to Contents](#contents)

[Excalidraw](https://excalidraw.com/#json=Cniy0hOLFdLXvohX1dtsO,iJePRDH64pJDyz8ffqXKqA)

#### Stylesheet
<img src="https://user-images.githubusercontent.com/106147236/203656972-b3ec4fe5-3bc1-43dc-9ca6-d6e16ff94308.png" width="800" alt="Project Stylesheet" />

#### Wireframe
<img src="https://user-images.githubusercontent.com/106147236/203657321-aa1a1dfa-c003-4d48-8c13-b7725ace77af.png" width="800" alt="Project Wireframe" />

#### Database Tables
<img src="https://user-images.githubusercontent.com/106147236/203657114-ad04e88a-01b2-4d88-8910-eb765997af23.png" width="800" alt="Database Tables" />

#### User Flow
<img src="https://user-images.githubusercontent.com/106147236/203657178-19d5251f-8533-4286-87a1-52cc7320ddc8.png" width="800" alt="User Flow" />

## Installation
[Back to Contents](#contents)

**This project requires Auth0! Please visit [Auth0](https://auth0.com/) to make an account and retrieve a domain and clientid. See .env.example for set up!**

Step 1: Clone my project & switch into the project directory.

```bash
  git clone https://github.com/lsanc0043/mangarage
  cd mangarage
```

Step 2: Install all packages.
```bash
  cd client && npm install && cd ../server && npm install
```

Step 3: Setup Environment Variables
- Copy the instructions from both .env.example files in the client and server.

Step 4: Connect the database and the data.
```bash
  cd server
  psql postgres -f db.sql
```

Step 5: Start the program!

Method 1: Have two servers running at the same time.
```bash
  cd client && npm start
  // open a new terminal
  cd server && npm start
```

Method 2: Have just one server running.
```bash
  cd client && npm run build
  cd server && npm run start
```

**Note: 
Client server will be running on [http://localhost:3000](http://localhost:3000) and server will be running on [http://localhost:4020](http://localhost:4020).**

## Mock Users
1. User that has read no mangas
```bash
  username: test
  password: TestPass1
```
2. User that has a lot of manga read (checked off on poster)
```bash
  username: bookworm
  password: BookWorm1
```
3. User that has a lot of manga in their reading list
```bash
  username: avidreader
  password: AvidReader1
```

## Future Development 
[Back to Contents](#contents)

- Optimize media queries for mobile page
- Add a user favorites list
- Allow user to sort the reading list by rating or status!
- Add a calendar to track manga chapter release dates

## Acknowledgements 
[Back to Contents](#contents)

I would like to thank the Techtonica staff and my fellow cohort for being the light to guide me through. Thank you to my mentor, [Michael St. Clair](https://github.com/michaelst) for helping me when I was down. Finally, a special shoutout to [Alma](https://github.com/almabntz) and [Meia](https://github.com/m3ia) for keeping me grounded.
