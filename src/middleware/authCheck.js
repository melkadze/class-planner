//check if user is logged in
const authCheck = (req, res, next) => {
	if(!req.user) {
		//executes if user not logged in
		res.redirect("/auth/login")
	} else {
		next()
	}
}

module.exports = authCheck