const env = require('../env')

function error(res, code, err) {
    res.status(code).send(`Sorry, but you've reached a 500 error.
        Please send on the following information to ${env.email}:
        ${err}`)
}

exports.error = error