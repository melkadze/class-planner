# class-planner
An in-progress, collaborative, and expansive Node.js project that provides a convenient, complete suite of student organization tools through its integration with MongoDB and Google's oAuth -- with more to come.

### Important:
If you wish to utilize this project for yourself, you must create an env.js file

### Creating an env.js file
> Make a new file titled env.js in the /src/ directory
> Add the following lines, replacing the <enclosed text> with its corresponding keys
  
    module.exports = {
      mongooseString: '<your MongoDB connection string>',

      oAuthID: '<your Google oAuth ID>',
      oAuthSecret: '<your Google oAuth secret>',

      cookieKey: '<a secure password used to encrypt login cookies>',

      email: '<your support email>',

      port: <the port you wish to open your server on; 3000 is recommended>
    }
