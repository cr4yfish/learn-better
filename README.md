# Nouv - learn better
The learning app that helps you learn anything you want.

<div style="display: flex; flex-direction: column ">

<a href="https://www.reddit.com/r/nouv_app/" target="_blank">r/nouv_app on Reddit</a>

<a href="https://lemmy.world/c/nouv@lemmy.world" target="_blank">nouv (at) lemmy.world on Lemmy</a>

</div>



<div style="width: 100%; display: flex; justify-content: center; gap: 1rem;">
    <img src="https://i.imgur.com/ZI5MVWV.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/jlW9KwP.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/ELax4dC.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/9BdqEjB.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/MR2U4bb.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/qSPt5SL.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/jWbhecS.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/1NQBKuV.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/1kLMd45.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/7fMMwSs.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/Ws0Fy1c.png" style="height: 500px; width: auto;" > 
</div>

## TL;DR
Duolingo but for any subject and community-driven.

## Description
This is a project to help people learn better. Its main feature is the ability to create and share courses.
The point being that you can learn anything you want, and you can help others learn what you know.

The main reason for this project is that I would love to have an App like Duolingo but for university subjects, and since I'd have to create a nice way of adding content to it anyway, I thought why not make it a platform for everyone to use - so here we are.

## Hero Features
- Create & Share Courses, Levels & Questions
- AI Helper for answering questions
- AI Course Sections & Levels creation from source documents (PDF)
- Leaderboard with Rank System
- Streak and XP System
- Level Scroller with Progression System and Sections

## Stack
* Next.js
* Supabase
* TailwindCSS
* NextUI
* Shadcn
* Vercel AI SDK
* Gemini
* Mistral/NVIDIA Nemo

## Roadmap

Missing some Question Types for your perfect Course? Add them here:
[Suggest a Question Type](https://github.com/cr4yfish/nouv/issues/11)

I tried ordering stuff in a logical order, but I might still jump around a bit.

Features marked with a question mark are not yet decided on, and might be dropped.

### MVP Features
- [x] Basic Level interaction
- [x] Level Scroller
- [x] Auth System
- [x] Course subscription system
- [x] Basic Level creation
- [x] Basic Level editing
- [x] Basic Course creation
- [x] Basic Course Editing
    - [x] General info
    - [x] Change order of Levels 
- [x] Data aquisition on questions & levels
    - [x] Add accuracy system for questions & topics
    - [x] Add XP system
    - [x] Track & Show streaks
    - [x] Basic UI for level complete, using that data
- [x] Basic Creation for user accounts & profiles (I manually create them in the database right now)
- [x] Very basic welcome/login page 
- [x] Basic UI for Profiles
    - [x] Basic Edit Profile
    - [x] Basic Settings (cloud saved)
- [x] Leaderboard (global for now)
- [x] Implement Rank system
    - [x] Leaderboard per rank
    - [x] Rank up system (individual)
- [x] New-user Flow
    - [x] Onboarding      
- [x] Implement Course Sections
    - [x] Viewing course sections
    - [x] Creating course sections
    - [x] Editing course sections
    - [x] Adjust other systems to use course sections
        - [x] Level Scroller
        - [x] Level Creation
- [x] Community Features 1
    - [x] Viewing other user profiles
    - [x] Rating System
        - [x] Courses
        - [x] Levels 
- [x] Recurring questions in levels when questions are answered wrong
- [ ] Data Features 1
    - [x] Training mode on low confidence questions
    - [x] Stats about users & learning
    - [x] Weekly/Monthly streak/xp goals
    - [ ] Achievements - WIP
- [x] PWA features 
    - [x] App installation popup support (depends on Browser)
    - [x] Notification System
    - [x] Better caching
    - [x] Offline Mode
- [x] Community Features 2
    - [x] Following other users
    - [x] Friend Battles    

### Beta Features
- [ ] Redesign UI & Refactor Code
    - [ ] Improve UI/UX - WIP
    - [ ] Add animations - WIP
    - [x] Move as much as possible to Server Rendering
- [x] Buy a domain

### Future Features
- [ ] Anon views
    - [ ] Anon view of courses
    - [ ] Demo mode for onboarding
- [ ] Full offline Mode
    - [ ] Downloadable Course Content -- WIP
    - [ ] Full download of frontend
    - [ ] Fallback for online features
    - [ ] Syncing of offline progress
- [ ] Course Collaboration  
- [ ] Friend Quests
- [ ] Importing Levels & Questions from other sources
    - [ ] Anki decks -- WIP
    - [x] Website Scraper (only works on server-rendered websites)
- [ ] Security features
    - [ ] Cloudflare
    - [ ] Captcha for user sign ups
    - [ ] Add Email Verification
- [ ] Privacy Settings
    - [x] Private Courses
    - [ ] Private User Profiles
- [ ] Localization? - Only if there are enough users to justify it
    - [ ] Multi-language support
    - [ ] Multi-language Courses
- [ ] Institutional Accounts?    

### AI features
- [x] Creating Levels & Questions from Document uploads using AI
    - [x] PDF
    - [x] Website URL (only works on server-rendered websites)
- [x] AI explanation for questions
- [ ] Personalized Teacher AI per course
    - [x] Basic AI for answering questions
    - [x] Give AI access to course data
    - [ ] Give AI some useful features

### Question Types
- [x] Multiple Choice & Single Choice
- [x] True/False
- [x] Match the Cards
- [x] Fill in the Blanks
- [ ] Listening?
- [ ] Speaking?

## Data Privacy
I'm a EU-based Developer, so I'm building it with GDRP in mind. 
Altough, as you can take from the roadmap above, I didn't get to the part of implementing Privacy-focused features yet.

I'm using the free tier of Mistral, so every time you use the "Explain Answer" feature, all Data related to the Question and your answer gets send to Mistral and is used by them to train the Model. 
The only user-generated Data here is which answer option you chose, not even your username or anything like that.

Edit:
For the Teacher AI, your username and the course you're currently in gets send to the AI, so it can give you more personalized answers. Again, Mistral Free Tier, so this data is used by Mistral to train their Models.

All other Data, exept for your password is visible in clear-text format for me in the Database. 
Sounds scary but pretty normal for any application really. (also I still didn't get around to hash user-provided Gemini API keys yet, so enter that on your own volition right now - I promise i won't do aynthing with it tho lol). 

* If you delete your account, all data you generated gets permanently removed automatically.

## Open Source & Contributions
This project is 100% open source. 
Please don't judge my code too harshly, I'm on a tight schedule and I'm doing my best.

If you want to contribute, please do. I'm happy to accept any help I can get.
Easiest way is to test the app and report bugs, but if you want to help with code, that's great too.
