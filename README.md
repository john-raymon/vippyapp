# VippyBeta 
Vippy BETA - Monolithic Fullstack MERN App

Look into `.env.example` for required environment variables
```
NODE_ENV=
SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_TEST_CLIENT_ID=
TWILIO_ACCOUNT_SECURITY_API_KEY=
CLOUDINARY_CLOUD_NAME=vippy
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_GEOCODING_API_KEY=

```

##### Table of Contents  
- [Models](#models)
- [React Frontend](#react-frontend)
## Models
  - `Users`
  - `Host` (These are venues)
  - `Events`
  - `Listings`

## React Frontend

  All request returning a promise made in the thunks/actions should be caught in the component dependent of it immeditaly.
```
export const login = (userCredentials, userAgent) => dispatch => {
  const body = {
    emailOrPhoneNumber: {
      email: userCredentials.email,
      phoneNumber: userCredentials.phoneNumber
    },
    password: userCredentials.password
  }
  return dispatch({
    type: "USER_LOGIN",
    payload: userAgent.login(body)
  })
}
```

This will return a promise. We aren't concerned with catching it in our thunk, instead we leave the catching as the responsibility of the caller, which I imagine may be coming from a method in a component.
```
    ...
    payload: userAgent.login(body) 
    // Promise 
    // .then(res => res)  
    // .catch(err => err)
    ...
```
