const router = require("express").Router()
const functions = require("../config/functions")

//homepage
router.get("/", (req, res) => {
	try{
		res.redirect("/profile/dashboard")
	} catch(err) {
		functions.error(res, 500, err)
	}
})

//certbot challange (remove for self hosted)
router.get("/.well-known/acme-challenge/6n5aqF9Y_otZRV_5xZXzIFL96EFsxqgqjKVV1KrhhAs", (req, res) => {
	try{
		res.send("6n5aqF9Y_otZRV_5xZXzIFL96EFsxqgqjKVV1KrhhAs.-AcrsV2YDI6oOMWRahbO1pcD_tYXvaiPWZRNEb5EKYA")
	} catch(err) {
		functions.error(res, 500, err)
	}
})
router.get("/.well-known/acme-challenge/YHzVnbaGlNOjAig1MXBCA6YnYyXOoBI4XZb87pD0qPE", (req, res) => {
	try{
		res.send("YHzVnbaGlNOjAig1MXBCA6YnYyXOoBI4XZb87pD0qPE.-AcrsV2YDI6oOMWRahbO1pcD_tYXvaiPWZRNEb5EKYA")
	} catch(err) {
		functions.error(res, 500, err)
	}
})
router.get("/.well-known/acme-challenge/SO4xvdi0-BNSKpeNCJ6NO9Fi3cYfAxZDkdmZoybe3jw", (req, res) => {
	try{
		res.send("SO4xvdi0-BNSKpeNCJ6NO9Fi3cYfAxZDkdmZoybe3jw.-AcrsV2YDI6oOMWRahbO1pcD_tYXvaiPWZRNEb5EKYA")
	} catch(err) {
		functions.error(res, 500, err)
	}
})

module.exports = router
