require("dotenv").config()

function error(res, code, err) {
	console.log(`Error occurred --> ${err}`)
	res.status(code).send(`Sorry, but you've reached a 500 error.
        Please send on the following information to ${process.env.email}:
        ${err}`)
}

exports.error = error