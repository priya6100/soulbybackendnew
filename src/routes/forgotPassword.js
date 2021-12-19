/** @format */

const express = require("express");
const { checkEmail, changePassword } = require("../controllers/forgotPassword");

const router = require("express").Router();

router.post("/forgot-password/check-email", checkEmail);
router.post("/forgot-password/change-password", changePassword);

module.exports = router;
