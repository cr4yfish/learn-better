# Nouv - learn better
The learning app that helps you learn anything you want.

<div style="width: 100%; display: flex; justify-content: center; gap: 1rem;">
  <img src="https://i.imgur.com/H8Zy6pn.png" style="height: 500px; width: auto;" >
  <img src="https://i.imgur.com/i6k9Rdp.pngg" style="height: 500px; width: auto;" >
  <img src="https://i.imgur.com/Q1dJgYl.png" style="height: 500px; width: auto;" >
  <img src="https://i.imgur.com/aRvuZpp.png" style="height: 500px; width: auto;" >

</div>

## Description
This is a project to help people learn better. Its main feature is the ability to create and share courses.
The point being that you can learn anything you want, and you can help others learn what you know.

The main reason for this project is that I would love to have an App like Duolingo but for university subjects, and since I'd have to create a nice way of adding content to it anyway, I thought why not make it a platform for everyone to use, I thought why not make it a platform for everyone to use - so here we are.

## 

## Roadmap
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
- [ ] Implement Course Sections
    - [x] Viewing course sections
    - [x] Creating course sections
    - [x] Editing course sections
    - [ ] Adjust other systems to use course sections
        - [ ] Level Scroller
        - [ ] Level Creation
- [ ] Community Features 1
    - [ ] Image upload support
    - [ ] Adding more optional info fields
    - [ ] Viewing other user profiles
    - [ ] Rating Courses, Levels & Questions

### Beta Features
- [ ] Redesign UI & Refactor Code
    - [ ] Move as much as possible to Server Rendering
    - [ ] Add animations
    - [ ] Improve UI/UX
- [ ] Data Features 1
    - [ ] Training mode on low confidence questions
    - [ ] Stats about users & learning
    - [ ] Weekly/Monthly streak/xp goals
    - [ ] Weekly rank ups
    - [ ] Achievements
- [ ] Offline features
    - [ ] Making better use of PWA features
    - [ ] Better caching
    - [ ] Offline UI
    - [ ] Manual download of Courses?
- [ ] Community Features 2
    - [ ] Following other users / Friends
    - [ ] Rating Courses, Levels & Questions
    - [ ] Course Collaboration
- [ ] Buy a domain

### Future Features
- [ ] Importing Levels & Questions from other sources
    - [ ] Anki decks   
- [ ] Security features
    - [ ] Cloudflare
    - [ ] Captcha for user sign ups
- [ ] Privacy Settings
    - [ ] Private Courses
    - [ ] Private User Profiles
- [ ] Localization? - Only if there are enough users to justify it
    - [ ] Multi-language support
    - [ ] Multi-language Courses
- [ ] Institutional Accounts?    

### Paywall features (these cost significant money to run)
These features will be locked either behind a payment plan or by letting users provide their API keys (e.g. for OpenAI).
Since it's open source the 2nd option will be available anyway for tech-users.
Right now I prefer the first option since it might also help pay for server cost.

- [ ] Creating Levels & Questions from Document uploads using AI (PDF, Word, etc)?
- [ ] Creating Levels & Questions from Pictures of Documents?
- [ ] AI Helper for creating questions & levels (mostly for writing help)
- [ ] AI Helper for answering questions

## Open Source & Contributions
This project is 100% open source. 
Please don't judge my code too harshly, I'm on a tight schedule and I'm doing my best.

If you want to contribute, please do. I'm happy to accept any help I can get.
Easiest way is to test the app and report bugs, but if you want to help with code, that's great too.
