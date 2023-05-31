// Library
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Functions
import { createDID } from './createDid'
import { createSignedVerifiableCredential } from './verifiableCredentials'
import { createVerifiablePresentation } from './verifiablePresentation'
import { checkVerifiablePresentation } from './checkVerifiablePresentation'
import { addVerificationMethod } from './verificationMethods'
import { revokeVC } from './revocation'
import { addRevocationBitmap } from './revocationBitmap'
import { loadDID } from './loadDid'

const app = express()
const port = 3000

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.send("Welcome to your server")
})

//Route that handles login logic
app.post('/login', (req, res) =>{
    console.log(req.body.username) 
    console.log(req.body.password) 
})

//Route that handles signup logic
app.post('/signup', (req, res) =>{
    console.log(req.body.fullname) 
    console.log(req.body.username)
    console.log(req.body.password) 
    res.send("Signup")
})

//Route that handles signup logic
async function createDIDAsync(name, password) {
    // Create DID.
    createDID(name, password)
    return
}
app.post('/create_did', (req, res) =>{
    createDIDAsync(req.body.name, req.body.password).then(() => {})
})

//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`)
})