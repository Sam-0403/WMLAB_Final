require('dotenv').config();

const apiurl = process.env.API_URL || "https://v4.passwordless.dev";
const API_SECRET = process.env.API_SECRET || "YOUR_API_SECRET"; // Replace with your API secret
const API_KEY = process.env.API_KEY || "YOUR_API_KEY"; // this will be injected to index.html

async function createToken(req, res) {

    const userId = getRandomInt(999999999);
    const alias = req.query.alias;
    const displayname = "Mr Guest";
    // grab the userid from session, cookie etc
    const payload = {
      userId,
      username: alias || displayname,
      displayname,
      aliases: alias ? [alias] : [] // We can also set aliases for the userid, so that signin can be initiated without knowing the userid
    };
  
    console.log("creating-token", apiurl);
    // Send the username to the passwordless api to get a token
    var response = await fetch(apiurl + "/register/token", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json'},
      // agent
    });
  
    var responseData = await response.json();
  
    console.log("passwordless api response", response.status, response.statusText, responseData);
      
    if(response.status == 200) {
      console.log("received token: ", responseData.token);
    } else {
      // Handle or log any API error
    }
  
    res.status(response.status);
    res.send(responseData);
  };
  

async function verifySignin(req, res) {
    const token = { token: req.query.token };
  
    console.log("Validating token", token);
    const response = await fetch(apiurl + "/signin/verify", {
      method: "POST",
      body: JSON.stringify(token),
      headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json' },
      // agent
    });
  
    var body = await response.json();
  
    if (body.success) {
      console.log("Succesfully verfied signin for user", body);
    } else {
      console.warn("Sign in failed", body);
    }
    res.statusCode = response.status;
    res.send(body);
  };
  
  function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

export {createToken, verifySignin}