export const register = (type = "user") => {
  // returns the proper dispatch function according to the user type

  if (type === "venue") {
    return (venue, venueAgent) => dispatch => {
      const body = {
        fullname: venue.fullName,
        legalVenueName: venue.legalVenueName,
        venueName: venue.venueName,
        zipcode: venue.zipCode,
        phonenumber: venue.phoneNumber,
        email: venue.email,
        password: venue.password,
        accessCode: venue.accessCode
      };
      return dispatch({
        type: "VENUE_REGISTER",
        payload: venueAgent.create(body).catch(error => {
          // TODO: actually integrate Raven or something similar
          console.log(
            "RAVEN: error in authActions register venue thunk",
            error
          );
          throw error;
        })
      });
    };
  }
  if (type === "user") {
    return (user, userAgent) => dispatch => {
      const body = {
        // TODO: don't rely on spreading the properties over for the body, explicity assign them over, that way one can look at the
        // dispatch action and see all the properties the request body will have. Rather than looking for the parameters given on the invocation.
        ...user, // reason for spreading is because user is sent with property names such as
        // user.verifcationCode that that endpoint expects as verification_code
        verification_code: user.verificationCode,
        fullname: user.fullName,
        phonenumber: user.phoneNumber,
        zipcode: user.zipCode
      };
      return dispatch({
        type: "USER_REGISTER",
        payload: userAgent.create(body).catch(error => {
          // TODO: actually integrate Raven or something similar
          console.log("RAVEN: error in authActions register user thunk", error);
          throw error;
        })
      });
    };
  }
};

export const login = loginType => {
  if (loginType === "venue") {
    return (venueCredentials, venueAgent) => dispatch => {
      const body = {
        email: venueCredentials.email,
        password: venueCredentials.password
      };
      return dispatch({
        type: "VENUE_LOGIN",
        payload: venueAgent.login(body)
      });
    };
  }

  return (userCredentials, userAgent) => dispatch => {
    const body = {
      emailOrPhoneNumber: {
        email: userCredentials.email,
        phoneNumber: userCredentials.phoneNumber
      },
      password: userCredentials.password
    };
    return dispatch({
      type: "USER_LOGIN",
      payload: userAgent.login(body)
    }).then(user => {
      dispatch(initUser(userAgent));
      return user;
    });
  };
};

export const logout = () => dispatch => {
  return dispatch({
    type: "USER_LOGOUT"
  });
};

export const initUser = userAgent => dispatch => {
  return dispatch({
    type: "INIT_USER",
    payload: new Promise((resolve, reject) => {
      // fetch all user neccessary resources
      return Promise.all[dispatch(fetchReservationsForUser(userAgent))];
    })
  });
};

export const fetchReservationsForVenue = venueAgent => dispatch => {
  // do something
  return dispatch({
    type: "FETCH_VENUES_RESERVATIONS",
    payload: venueAgent.getAllReservations()
  });
};

export const fetchEventsForVenue = (venueAgent, venueId) => (
  dispatch,
  getState
) => {
  // reason we won't also fetch events for a regular user when they log in because they aren't creators of events
  // fetch reservations linked to a regular user is enough to link to events. we don't fetch listings for a
  // regular user either because a reservation links to that too.
  return dispatch({
    type: "FETCH_VENUES_EVENTS",
    payload: venueAgent.getAllEvents({ byVenue: venueId })
  });
};

export const fetchListingsForVenue = (venueAgent, venueId) => dispatch => {
  // do something
  return dispatch({
    type: "FETCH_VENUES_LISTINGS",
    payload: venueAgent.getAllListings({ byVenue: venueId })
  });
};

export const fetchReservationsForUser = userAgent => dispatch => {
  console.log("making dispatch now!");
  return dispatch({
    type: "FETCH_USERS_RESERVATIONS",
    payload: userAgent.getAllReservations()
  });
};
