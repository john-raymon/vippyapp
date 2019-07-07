import React, { Component } from "react";

export default class DetailedReservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thankYou: false,
      error: null,
      reservation: null
    };
  }
  componentDidMount() {
    const {
      location: { parsedSearch },
      userAgent
    } = this.props;
    this.setState({
      thankYou: !!parsedSearch.thankYou
    });
    // fetch reservation from server
    this.props.userAgent
      ._get(`api/reservation/${this.props.match.params.reservationId}`)
      .then(resp => {
        this.setState({
          reservation: resp.reservation,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          error: "Sorry, we can't load your reservation right now."
        });
      });
  }
  render() {
    const { reservation } = this.state;
    console.log("the reservation is", reservation);
    return <div>Reservation will go here</div>;
  }
}
