# class-planner
An in-progress, collaborative, and expansive Node.js project that provides a convenient, complete suite of student organization tools through its integration with MongoDB and Google's oAuth -- with more to come.

### Important:
If you wish to utilize this project for yourself, you must create an env.js file.
Then, run the the `install` NPM script to download the project's dependencies.
Note that this doesn't include Node.js itself, which is required to run the command.

### Creating an env.js file
1. Make a new file titled env.js in the /src/ directory.
2. Add the following lines, replacing the `<enclosed text>` with its corresponding keys:
```
  module.exports = {
    mongooseString: `'<your MongoDB connection string>'`,

    oAuthID: '<your Google oAuth ID>',
    oAuthSecret: '<your Google oAuth secret>',

    cookieKey: '<a secure password used to encrypt login cookies>',

    email: '<your support email>',

    port: <the port you wish to open your server on; 3000 is recommended>
  }
```
### NPM Scripts
`install`: Installs the project's dependencies.
`dev`: Launches a live development server on the port specified in the `env.js` file.
