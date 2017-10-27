# Scrum Board

Scrum Board takes in a [Trello Board](https://trello.com/) and converts it into a Scrum Board to track stories
and tasks throughout the scrum process.

Features:
  * Create tasks from stories
  * Move tasks from one lane to another while still seeing the story the task belongs too.
  * Assign team members to a task.
  * View story points

To add story points to a card, add `(x)` in front of the card name, where `x` is the story point value.

## Trello Board Setup

You must have at least two lists created `Sprint Backlog` and `Done`. You can create any number
of lists between `Sprint Backlog` and `Done` as you like to have them displayed in the Scrum Board.

Each card created in the `Sprint Backlog` will be treated as a story. All other cards created in other
lists will be treated as tasks. Us the Scrum Board to create tasks from stories and keep track of their
progress within the Scrum Board.

## Development

First, you will need to get a [Trello API Key](https://developers.trello.com). Next, copy the `src/trello-key.example.ts` to `src/trello-key.ts` and put your API key in that file.

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).
