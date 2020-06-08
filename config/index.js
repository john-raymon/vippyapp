const isProd = process.env.NODE_ENV === "production" ? true : false;

module.exports = {
  secret: isProd ? process.env.SECRET : "secret",
  stripe: {
    secret_key: process.env.STRIPE_SECRET_KEY,
    publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    client_id:
      process.env.NODE_ENV === "production"
        ? process.env.STRIPE_CLIENT_ID
        : process.env.STRIPE_TEST_CLIENT_ID,
    authorizeUri: "https://connect.stripe.com/express/oauth/authorize",
    tokenUri: "https://connect.stripe.com/oauth/token"
  },
  public_domain: "http://localhost:4000"
};
