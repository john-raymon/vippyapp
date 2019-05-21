import superagentPromise from "superagent-promise";
import _superagent from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

class Agent {
  constructor(token = null, API_ROOT = "/") {
    this.token = token;
    this.API_ROOT = API_ROOT;
    this._tokenPlugin = this._tokenPlugin.bind(this);
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

  _del(url) {
    return superagent
      .del(`${this.API_ROOT}${url}`)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  _get(url) {
    return superagent
      .get(`${this.API_ROOT}${url}`)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  _patch(url, body) {
    return superagent
      .patch(`${this.API_ROOT}${url}`, body)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  _post(url, body) {
    return superagent
      .post(`${this.API_ROOT}${url}`, body)
      .use(this._tokenPlugin)
      .then(this._responseBody);
  }

  postImages(url, files, imagesProp) {
    return superagent
      .post(`${this.API_ROOT}${url}`)
      .use(this._tokenPlugin)
      .attach(imagesProp, files)
      .then(this._responseBody);
  }

  authLogin(email, password, loginEndpoint) {
    return this._post(loginEndpoint, { email, password });
  }
}

export default Agent;
