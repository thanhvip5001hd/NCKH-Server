const { Types } = require("mongoose");
const Question = require("../models/questionModel");
const User = require("../models/userModel");

const stripe = require("stripe")(process.env.STRIPE_PUBLIC_API_KEY);

const DOMAIN = "http://localhost:8888";
const SUCCESS_DOMAIN = "http://localhost:8888/payment-success";

exports.TransactionService = {
  createTransaction: async function (data) {
    const unit_amount = data.unit_amount;
    const name = data.name;
    const user = data.user;

    const question = await Question.find({ answer: "C" });
    console.log(question.length);
    await Question.updateMany({ answer: "C" }, [
      {
        $set: {
          answer: {
            $first: "$options",
          },
        },
      },
    ]);

    const session = await stripe.checkout.sessions.create({
      // line_items: [
      //   {
      //     // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
      //     price: "{{PRICE_ID}}",
      //     quantity: 1,
      //   },
      // ],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name,
              images: [
                "https://img.freepik.com/free-vector/stylish-business-pricing-table-template_1017-32006.jpg?w=2000",
              ],
            },
            // 500, 1000, 1500
            unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${SUCCESS_DOMAIN}`,
      cancel_url: `${DOMAIN}`,
      metadata: {
        user,
      },
    });
    return session.url;
  },

  handlePostTransaction: async function (event) {
    // const paymentIntent = event.data.object.payment_intent;
    // console.log("paymentIntent: ", paymentIntent);

    // Get payment intent id
    // paymentIntentId: string | Stripe.PaymentIntent (can be this type with expand parameter)
    let paymentIntentId = event.data.object.id;
    // Make this variable string to avoid Typescript Overload error
    const metadata = event.data.object.metadata;
    console.log("metadata: ", metadata);

    paymentIntentId = String(paymentIntentId);

    const productOrderedDetails = await stripe.checkout.sessions.listLineItems(
      paymentIntentId
    );

    console.log(
      "productOrderedDetails: ",
      JSON.stringify(productOrderedDetails)
    );

    await User.findByIdAndUpdate(metadata.user, {
      paidAmount: Number(productOrderedDetails.data[0].amount_total),
    });

    return productOrderedDetails;
  },
};
