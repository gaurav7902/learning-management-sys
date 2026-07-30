const express = require("express");
const {
    createOrder,
    capturePaymentAndFinalizeOrder,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();
const authenticate = require("../../middleware/auth-middleware");

router.use(authenticate);
router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

module.exports = router;
