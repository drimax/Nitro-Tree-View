# NitroTreeview
## Author
- [Harshika Ranaweera](https://github.com/drimax)
## _Background_
This sample web application was created by the Author as a part of 'Nitro Front End Proficiency Test'. Excercise Focuses on elabarating authors problem solving skills and ability of writing a quality code. 

## Features
- Displaying set of Posts in a Tree View
- Posts will be initially grouped by the posted week
- Posts can be grouped by 'Weekly' or by 'Author' or by 'Location'.and user can select which group preferred.
- Users can edit the location and the author details of each post

## Technology
- Angular - v15.0.0
- Node.js - v19.1.0
- npm - v9.1.2
- TypeScript - v4.8.2
- Bootstrap - v5.2.2
- HTML

## Running the Web App
This web application is only configured to run on the development mode. Please follow below steps to run the web application.
1. Makesure running environment Node.js version and npm versions are compatible to run the web appliation.
2. Clone the Project from Git Repo and navigate to 'nitro-treeview' folder.
3. run 'npm install'
4. Makesure port 3000 and 4200 are avaialble on the running environment.
5. Open a Terminal or Command line and  type `npx json-server --watch post.json` to setup the backend node server.
6. Open a another terminal or Command line and type `ng serve`.
7. Open Chrome browser and Navigate to `http://localhost:4200/` to open the web application.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `ng test --watch=false --code-coverage` to generate the code coverage and navigate to `\coverate\nitro-treeview\index.html` file to check the test coverage of the web appliation.
