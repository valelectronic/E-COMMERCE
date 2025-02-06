
import { stripe } from "../lib/stripe.js";
import coupon from "../models/coupon.model.js";
import product from "../models/product.module.js";
import order from "../models/order.model.js"

// creating the checkout list session

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        // Input validation
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        if (couponCode && typeof couponCode !== "string") {
            return res.status(400).json({ error: "Invalid coupon code" });
        }

        let totalAmount = 0;
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // Stripe expects amount in cents
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        let coupons = null;
        if (couponCode) {
            coupons = await coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (coupons) {
                // Log the discountPercentage for debugging
                console.log("Discount Percentage:", coupons.discountPercentage);

                // Apply discount to total amount
                totalAmount -= Math.round((totalAmount * coupons.discountPercentage) / 100);
            }
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupons
                ? [
                      {
                          coupon: await createStripeCoupon(coupons.discountPercentage), // Pass discountPercentage here
                      },
                  ]
                : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });

        // Create a new coupon if the total amount is above a threshold
        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};


// creating stripe coupon 
async function createStripeCoupon(discountPercentage) {
    // Validate discountPercentage
    if (typeof discountPercentage !== "number" || discountPercentage < 1 || discountPercentage > 100) {
        throw new Error("Invalid discount percentage. Must be a number between 1 and 100.");
    }

    // Create the Stripe coupon
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage, // Ensure this is a valid number
        duration: "once",
    });

    return coupon.id; // Return the coupon ID
}

// creating the coupon 
async function createNewCoupon(userId) {
	await coupon.findOneAndDelete({ userId });

	const newCoupon = new coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}


// creating a checkout success 
export const CheckoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;

        // Check if an order with this sessionId already exists
        const existingOrder = await order.findOne({ stripeSessionId: sessionId });
        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already exists.",
                orderId: existingOrder._id,
            });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await coupon.findOneAndUpdate(
                    {
                        code: session.metadata.couponCode,
                        userId: session.metadata.userId,
                    },
                    {
                        isActive: false,
                    }
                );
            }

            // Create new order
            const products = JSON.parse(session.metadata.products);
            const newOrder = new order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // Convert from cents to dollars
                stripeSessionId: sessionId,
            });

            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment successful, order created, and coupon deactivated if used.",
                orderId: newOrder._id,
            });
        } else {
            res.status(400).json({ success: false, message: "Payment not completed." });
        }
    } catch (error) {
        if (error.code === 11000) {
            console.error("Duplicate key error:", error);
            res.status(400).json({ message: "Duplicate order detected. Please try again." });
        } else {
            console.error("Error in checkoutSuccess controller:", error.message);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
};