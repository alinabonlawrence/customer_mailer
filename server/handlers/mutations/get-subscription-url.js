import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function RECURRING_CREATE(url) {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "Standard Plan"
          returnUrl: "${url}"
          test: true
          lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 10, currencyCode: USD }
                  interval: EVERY_30_DAYS
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}
// Added (shop) in the parameter in order to add authentication
export const getSubscriptionUrl = async (ctx, shop) => {
  const { client } = ctx;

  const confirmationUrl = await client
    .mutate({
      mutation: RECURRING_CREATE(`${process.env.HOST}/auth?shop=${shop}`),
    })
    .then((response) => response.data.appSubscriptionCreate.confirmationUrl);

  return confirmationUrl;
};

// export const getSubscriptionUrl = async ctx => {
//   const { client } = ctx;
//   const confirmationUrl = await client
//     .mutate({
//       mutation: RECURRING_CREATE(process.env.HOST)
//     })
//     .then(response => response.data.appSubscriptionCreate.confirmationUrl);

//   return ctx.redirect(confirmationUrl);
// };
