const express = require("express");
const router = express.Router();
const controller = require("../controllers/customer-controller");
const authService = require("../services/auth-service");

router.post("/authenticate", controller.authenticate);
router.get("/", authService.authorize, controller.get);
router.post("/", authService.authorize, controller.post);

module.exports = router;
