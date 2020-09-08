const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_BBpfF82J7gaYc9KtduOXARnf');

exports.payWithStripe = functions.https.onRequest((request, response) => {
    stripe.charges.create({
        amount: request.body.amount,
        currency: request.body.currency,
        source: request.body.token,
    }).then((charge) => {
        console.log('charge', charge)
            response.send(charge);
            return charge
        })
        .catch(err =>{
            console.log(err);
        });
});