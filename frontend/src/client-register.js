require('dotenv').config();
// var Passwordless = require("passwordless");
var Passwordless = require('@passwordlessdev/passwordless-client');
const fetch = require("node-fetch");

const apiurl = process.env.API_URL || "https://v4.passwordless.dev";
const API_SECRET = process.env.API_SECRET || "testnode:secret:d6546f738f6d4357baf384388e0bc641"; // Replace with your API secret
const API_KEY = process.env.API_KEY || "testnode:public:73e14b3dfdb44af0a06419237dae6dd1"; // this will be injected to index.html
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:2000"; // this will be injected to index.html

async function handleRegisterClick(alias) {
  // Initiate the Passwordless client with your public api key
  console.log(alias)
  const p = new Passwordless.Client({
    apiKey: API_KEY
  });

  // Create token - Call your node backend to retrieve a token that we can use client-side to register a passkey to an alias
  const backendRequest = await fetch(
    BACKEND_URL + "/create-token?alias=" + alias
  );
  const backendResponse = await backendRequest.json();
  if(!backendRequest.ok) {
    console.log("Our backend failed while creating a token!")
    console.log(backendResponse);
    return;
  }

  // Register a key - The Passwordless API and browser creates and stores a passkey, based on the token.
  try {
    const {token, err} = await p.register(backendResponse.token);
    if(token) {
      console.log("Successfully registered WebAuthn!")
    } else {
      console.log(err)
    }

    // Done - the user can now sign in using the passkey

  } catch (e) {
    console.error("Things went bad", e);
  }
}

export default handleRegisterClick;
