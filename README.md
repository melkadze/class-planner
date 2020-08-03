# class-planner / loop
An in-progress, collaborative, and expansive Node.js project that provides a convenient, complete suite of student organization tools through its integration with MongoDB and Google's oAuth -- with more to come.

### Important:
If you wish to utilize this project for yourself, you must create an `.env` file.
Then, run the the `build` NPM script to download the project's dependencies and build the necessary .js and .scss files.
Note that this repo doesn't include Node.js itself, which is required to run the command.

### Creating an .env file
1. Make a new file titled `.env` in the root (where package.json lies) directory.
2. Add the following lines, replacing the `<enclosed text>` with its corresponding keys:
```
mongooseString=<your MongoDB connection string>

oAuthID=<your Google oAuth ID>
oAuthSecret=<your Google oAuth secret>

cookieKey=<a secure password used to encrypt login cookies>

email=<your support email>

PORT=<the port you wish to open your server on; 3000 is recommended>
```
### NPM Scripts
`build`: Installs the project's dependencies and builds the necessary js files.

`dev`: Launches a live backend development server on the port specified in the `.env` file, and builds the necessary js and scss files as they are updated.

`start`: Runs the application, intended for shipping use online.
