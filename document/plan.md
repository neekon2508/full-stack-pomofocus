# Plan React

## Requirement and Features

- Very simple application, where users can apply pomodoro technique to improve their focus.
- It can use without user accounts. But user can sign up/log in by email or google.
- Pomodo session: work, short break (after done working), long break (after each 3 done working).
- Counter component: count the number of sessions you have finished in day.
- Tasks component: include tasks for work. You can clear finished/all tasks.
- Reports component: for statistics.
- Setting component: define timer, sound, theme.
- Sign in component: navigate to sign in page.
- Login/Logout.
- Reminder each 5 minutes left.
- Keyboard shortcuts.

## Pages and Components

### Pages

- /login: Login
- /signup: Signup
- /\*: PageNotFound
- / : HomePage

### Components

- Header: include Logo, Report, Sign In and Menu.
- Logo: icon image, title and navigate to HomePage.
- Report: Summary + Detail.
- Menu: shortcut and login.
- Session: pomodoro, short break, long break. Time and Start button.
- Counter: number and title.
- Tasks: menu and Add Task button.
- Task: task input, number of pomodoro, add note link.

## Technology

- Routing: React Router.
- Styling: Material UI, Emotion.
- Remote state management: React Query, Axios.
- Form management: React-hook-form.
- UI state management: Context API.
- i18n.
