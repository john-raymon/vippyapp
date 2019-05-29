import superagentPromise from "superagent-promise";
import _superagent from "superagent";
import localforage from "localforage";

const superagent = superagentPromise(_superagent, global.Promise);

export class Agent {
  constructor(token = null, API_ROOT = "/") {
    this.token = token;
    this.API_ROOT = API_ROOT;
    this._tokenPlugin = this._tokenPlugin.bind(this);
  }

  async _initToken() {
    this.token = await localforage.getItem("jwt");
  }

  _tokenPlugin(req) {
    if (this.token) {
      req.set("authorization", `${this.token}`);
    }
    return req;
  }

  setToken(token) {
    this.token = token;
  }

  _responseBody(res) {
    return res.body;
  }

  async _del(url) {
    await this._initToken();
    return superagent
      .del(`${this.API_ROOT}${url}`)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  async _get(url) {
    await this._initToken();
    console.log("the token is!! -->", this.token);
    return superagent
      .get(`${this.API_ROOT}${url}`)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  async _patch(url, body) {
    await this._initToken();
    return superagent
      .patch(`${this.API_ROOT}${url}`, body)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  async _post(url, body) {
    await this._initToken();
    return superagent
      .post(`${this.API_ROOT}${url}`, body)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  async postImages(url, files, imagesProp) {
    await this._initToken();
    return superagent
      .post(`${this.API_ROOT}${url}`)
      .use(this._tokenPlugin)
      .attach(imagesProp, files)
      .then(this._responseBody);
  }
  authLogin(email, password, loginEndpoint) {
    return this._post(loginEndpoint, { email, password });
  } // move to UserEndpointAgent
}

export class UserEndpointAgent extends Agent {
  constructor(token = null, API_ROOT = "/") {
    super(token, API_ROOT);
  }

  sendOnBoardCode(phoneNumber, email) {
    return this._get(
      `api/phone/send-onboard-code?phonenumber=${phoneNumber}&email=${encodeURIComponent(
        email
      )}`
    ).catch(error => {
      throw error.response.body;
    });
  }

  login(body) {
    return this._post(`api/user/login`, body).catch(error => {
      throw error.response;
    });
  }

  create(body) {
    return this._post(`api/user`, body).catch(error => {
      throw error.response.body;
    });
  }
}
