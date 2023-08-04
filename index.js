import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import dalleRoutes from "./routes/dalle.routes.js";
import stripe from "stripe";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/dalle", dalleRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

// Initialize Stripe with the secret key from your environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeSecretKey);

// Route to create a PaymentIntent
app.post("/api/create-payment-intent", async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount,
            currency,
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create PaymentIntent" });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
