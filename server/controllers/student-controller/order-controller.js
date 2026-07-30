const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findOne({
            _id: courseId,
            isPublished: true,
        });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Published course not found",
            });
        }

        const coursePricing = Number(course.pricing);
        if (!Number.isFinite(coursePricing) || coursePricing < 0) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid course price" });
        }

        const existingPurchase = await StudentCourses.exists({
            userId: req.user._id,
            "courses.courseId": courseId,
        });
        if (existingPurchase) {
            return res
                .status(409)
                .json({ success: false, message: "Course already purchased" });
        }

        const paymentRequest = {
            intent: "sale",
            payer: { payment_method: "paypal" },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/payment-return`,
                cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: course.title,
                                sku: courseId,
                                price: coursePricing.toFixed(2),
                                currency: "USD",
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: "USD",
                        total: coursePricing.toFixed(2),
                    },
                    description: course.title,
                },
            ],
        };

        paypal.payment.create(paymentRequest, async (error, paymentInfo) => {
            if (error) {
                console.log(error);
                return res.status(502).json({
                    success: false,
                    message: "Unable to start PayPal payment",
                });
            }

            try {
                const order = await Order.create({
                    userId: req.user._id,
                    userName: req.user.userName,
                    userEmail: req.user.userEmail,
                    orderStatus: "pending",
                    paymentMethod: "paypal",
                    paymentStatus: "initiated",
                    instructorId: course.instructorId,
                    instructorName: course.instructorName,
                    courseImage: course.image,
                    courseTitle: course.title,
                    courseId,
                    coursePricing: coursePricing.toFixed(2),
                });
                const approveUrl = paymentInfo.links.find(
                    (link) => link.rel === "approval_url"
                )?.href;
                if (!approveUrl) throw new Error("PayPal approval URL missing");
                return res.status(201).json({
                    success: true,
                    data: { approveUrl, orderId: order._id },
                });
            } catch (saveError) {
                console.log(saveError);
                return res.status(500).json({
                    success: false,
                    message: "Unable to create order",
                });
            }
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, message: "An error occurred" });
    }
};

const executePaypalPayment = (paymentId, payerId) =>
    new Promise((resolve, reject) => {
        paypal.payment.execute(
            paymentId,
            { payer_id: payerId },
            (error, payment) => {
                if (error) return reject(error);
                resolve(payment);
            }
        );
    });

const capturePaymentAndFinalizeOrder = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;
        const order = await Order.findOne({
            _id: orderId,
            userId: req.user._id,
        });
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order cannot be found" });
        if (order.paymentStatus === "paid") {
            return res.status(200).json({
                success: true,
                message: "Order already confirmed",
                data: order,
            });
        }
        if (!paymentId || !payerId) {
            return res.status(400).json({
                success: false,
                message: "PayPal payment details are required",
            });
        }

        const payment = await executePaypalPayment(paymentId, payerId);
        const transaction = payment.transactions?.[0];
        if (
            payment.state !== "approved" ||
            transaction?.amount?.currency !== "USD" ||
            Number(transaction?.amount?.total) !== Number(order.coursePricing)
        ) {
            return res.status(402).json({
                success: false,
                message: "PayPal payment was not approved",
            });
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = paymentId;
        order.payerId = payerId;
        await order.save();

        const courseEntry = {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
        };
        (await StudentCourses.findOneAndUpdate(
            {
                userId: order.userId,
                "courses.courseId": { $ne: order.courseId },
            },
            { $push: { courses: courseEntry } },
            { new: true }
        )) ||
            (await StudentCourses.findOneAndUpdate(
                { userId: order.userId },
                {
                    $setOnInsert: {
                        userId: order.userId,
                        courses: [courseEntry],
                    },
                },
                { upsert: true, new: true }
            ));

        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                },
            },
        });

        return res
            .status(200)
            .json({ success: true, message: "Order confirmed", data: order });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Unable to verify PayPal payment",
        });
    }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
