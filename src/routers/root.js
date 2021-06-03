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
router.get("/.well-known/acme-challenge/nzQENyRpkRAH6H3ebOoopMo5VED1KJUDpbcN_zWX7fY", (req, res) => {
	try{
		res.send("nzQENyRpkRAH6H3ebOoopMo5VED1KJUDpbcN_zWX7fY.-AcrsV2YDI6oOMWRahbO1pcD_tYXvaiPWZRNEb5EKYA")
	} catch(err) {
		functions.error(res, 500, err)
	}
})
router.get("/.well-known/acme-challenge/rUzFGnjRj6s2gx1fERIxoYFnKveVSodDJf49jhwsbdY", (req, res) => {
	try{
		res.send("rUzFGnjRj6s2gx1fERIxoYFnKveVSodDJf49jhwsbdY.-AcrsV2YDI6oOMWRahbO1pcD_tYXvaiPWZRNEb5EKYA)
	} catch(err) {
		functions.error(res, 500, err)
	}
})

module.exports = router
