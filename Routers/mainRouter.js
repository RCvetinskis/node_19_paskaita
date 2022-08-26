const express = require("express")
const router = express.Router()
const {login} = require("../Controllers/mainController")
const {validateRegister}= require("../modules/validator")


router.post("/login", login)



module.exports = router