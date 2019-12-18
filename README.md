# VippyBeta 

// TODO: README NEEDS TO BE UPDATED

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
  - `User`
  - `Host` (These are venues)
  - `Event`
  - `Listing`
  - `Reservation` (These are purchased Listings—transactions)
  - `Promoter` (belong to a Host, have auth. capabilities, has different toggleable permissions controlled by Host—venue)

## React Frontend

  All request returning a promise made in the thunks/actions should be caught in the component dependent of it immeditaly.
  The userAgent should always be injected as a dependency of the thunk action creator.
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

We use thunk actions creators in combination with redux-promise-middleware in order to create a seamless flow from the dispatch to the thunk making the request, and then to the store, which will handle dispatching different actions reflecting the status of the promise, allowing us to update state accordingly while we do some asynchronous stuff. 
```
... // in thunk, creation action creator for dispatch being returned
  payload: something.makeRequestReturnAPromise.catch(res => { throw res.response.body.error.message }) // intercept, only return nested error message
...
```


