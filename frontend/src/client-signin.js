// import { Passwordless } from 'passwordless/lib';

require('dotenv').config();
// var Passwordless = require("passwordless");
var Passwordless = require('@passwordlessdev/passwordless-client');
const fetch = require("node-fetch");

const apiurl = process.env.API_URL || "https://v4.passwordless.dev";
const API_SECRET = process.env.API_SECRET || "testnode:secret:d6546f738f6d4357baf384388e0bc641"; // Replace with your API secret
const API_KEY = process.env.API_KEY || "testnode:public:73e14b3dfdb44af0a06419237dae6dd1"; // this will be injected to index.html
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:2000"; // this will be injected to index.html

async function handleSigninClick(alias) {
  // Initiate the Passwordless client with your public api key
  console.log(alias)
  const p = new Passwordless.Client({
    apiKey: API_KEY,
  });

  try {
    const {token, error} = await p.signinWithAlias(alias);
    if(error) {
      console.log("Sign in failed!")
      return;
    }
    console.log("Received token", token);
    
    // Verify the sign in - Call your node backend to verify the token created from the sign in
    var user = await fetch(BACKEND_URL + "/verify-signin?token=" + token).then((r) => r.json());

    // Done - you can now check the user result for status, userid etc
    console.log("User", user);
    console.log(token)
    return {...user, "token": token}

  } catch (err) {
    console.log(err);
  }
}

export default handleSigninClick;
