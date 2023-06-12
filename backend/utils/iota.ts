var { createDID } = require("../iota/createDid")
var { addVerificationMethod } = require("../iota/verificationMethods")
var {addRevocationBitmap} = require("../iota/revocationBitmap")
var {createSignedVerifiableCredential} = require("../iota/verifiableCredentials")
var {createVerifiablePresentation} = require("../iota/verifiablePresentation")
var {checkVerifiablePresentation} = require("../iota/checkVerifiablePresentation")
var {loadDID} = require("../iota/loadDid")
const fs = require('fs')
import * as path from 'path'

async function asyncCreateDID(name, password) {
    // Create DID.
    return createDID(name, password)
}
function createDIDRoute(req, res) {
    try {
        if (req.body && req.body.userId) {
            console.log("Create DID")
            asyncCreateDID(req.body.userId, req.body.userId).then((isError) => {
                if (isError) {
                    res.status(400).json({
                        errorMessage: 'DID already exist!',
                        status: false
                    });
                }
                else {
                    res.json({
                        message: 'Create DID Successfully.',
                        status: true
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: 'Username or password is incorrect!',
                status: false
            });
        }
    } catch (e) {
        console.log("Create DID Error");
        console.log(e);
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};

async function asyncAddVM(name, password, fragment) {
    // Add VM.
    return addVerificationMethod(name, password, fragment)
}
function addVMRoute(req, res) {
    try {
        if (req.body && req.body.user) {
            console.log("Adding VM")
            asyncAddVM(req.body.user, req.body.user, "key-1").then((isError) => {
                console.log(isError)
                if (isError) {
                    res.status(400).json({
                        errorMessage: 'Add VM Failed!',
                        status: false
                    });
                }
                else {
                    res.json({
                        message: 'Add VM Successfully.',
                        status: true
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: 'Username or password is incorrect!',
                status: false
            });
        }
    } catch (e) {
        console.log("Adding VM Error");
        console.log(e);
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};

async function asyncAddRevoke(name, password, fragment) {
    // Create DID.
    return addRevocationBitmap(name, password, fragment)
}
function addRevokeRoute(req, res) {
    try {
        if (req.body && req.body.user) {
            console.log("Adding Revoke")
            asyncAddRevoke(req.body.user, req.body.user, "rev-1").then((isError) => {
                console.log(isError)
                if (isError) {
                    res.status(400).json({
                        errorMessage: 'Add Revoke Failed!',
                        status: false
                    });
                }
                else {
                    res.json({
                        message: 'Add Revoke Successfully.',
                        status: true
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: 'Username or password is incorrect!',
                status: false
            });
        }
    } catch (e) {
        console.log("Adding Revoke Error");
        console.log(e);
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};

// const issuerName = process.argv[3]
// const issuerPassword = process.argv[4]
// const subjectName = process.argv[5]
// const subjectDid = process.argv[6]
// const verificationMethodFragment = process.argv[7]
// const revocationBitmapFragment = process.argv[8]
// const revocationIndex = parseInt(process.argv[9])
// createSignedVerifiableCredential(
//     issuerName,
//     issuerPassword,
//     subjectName,
//     subjectDid,
//     verificationMethodFragment,
//     revocationBitmapFragment,
//     revocationIndex
// )
async function asyncCreateVC(issuerName, issuerPassword, subjectName, subjectDid, verificationMethodFragment, revocationBitmapFragment, revocationIndex) {
    // Add VM.
    return createSignedVerifiableCredential(
        issuerName,
        issuerPassword,
        subjectName,
        subjectDid,
        verificationMethodFragment,
        revocationBitmapFragment,
        revocationIndex
    )
}
function createVCRoute(req, res) {
    try {
        if (req.body && req.body.userVC && req.body.user && req.body.userVCID) {
            console.log("Create VC")
            loadDID(req.body.userVC, req.body.userVC, true).then((account) => {
                var issuer = req.body.user
                var subject = req.body.userVC
                var ID = req.body.userVCID
                console.log("Create VC DID")
                var subjectDid = account.did().toString()
                console.log(subjectDid)
                // asyncCreateVC(issuer, issuer, subject, subjectDid, "key-1", "rev-1", subject)
                asyncCreateVC(issuer, issuer, subject, subjectDid, "key-1", "rev-1", ID)
                .then(() => {
                    res.json({
                        message: 'Create VC Successfully.',
                        status: true
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({
                        errorMessage: 'Something went wrong!',
                        status: false
                    });
                })
            })
        }
    } catch (e) {
        console.log("Creating VC Error");
        console.log(e);
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
}

// const holderName = process.argv[3]
// const holderPassword = process.argv[4]
// const credentialFile = process.argv[5]
// const fragment = process.argv[6]
// const challenge = process.argv[7]
// createVerifiablePresentation(
//     holderName,
//     holderPassword,
//     credentialFile,
//     fragment,
//     challenge
// )
async function asyncCreateVP(holderName, holderPassword, credentialFile, fragment, challenge) {
    // Add VM.
    return createVerifiablePresentation(
        holderName,
        holderPassword,
        credentialFile,
        fragment,
        challenge
    )
}
function createVPRoute(req, res) {
    try {
        if (req.body && req.body.user) {
            console.log("Create VP")
            var holder = req.body.user
            var filename = path.join('credentials', holder+"-credential.json")
            console.log(filename)
            if(fs.existsSync(filename)){
                asyncCreateVP(holder, holder, holder+"-credential.json", "key-1", "xyz123")
                .then(() => {
                    res.json({
                        message: 'Create VP Successfully.',
                        status: true
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({
                        errorMessage: 'Something went wrong!',
                        status: false
                    });
                })
            }
            else{
                console.log("VC not found!")
                res.status(400).json({
                    errorMessage: "VC not found!",
                    status: false
                });
            }
        }
    } catch (e) {
        console.log("Creating VP Error");
        console.log(e);
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
}

// const presentationFile = process.argv[3]
// const challenge = process.argv[4]
// checkVerifiablePresentation(presentationFile, challenge)
async function asyncCheckVP(presentationFile, challenge) {
    // Add VM.
    return checkVerifiablePresentation(presentationFile, challenge)
}
function checkVPRoute(req, res) {
    try {
        if (req.body && req.body.user) {
            console.log("Check VP")
            var holder = req.body.user

            asyncCheckVP(holder+"-presentation.json", "xyz123")
            .then(() => {
                res.json({
                    message: 'Check VP Successfully.',
                    status: true
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({
                    errorMessage: 'Something went wrong!',
                    status: false
                });
            })
        }
    } catch (e) {
        console.log("Creating VP Error");
        console.log(e);
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
}

export { createDIDRoute, addVMRoute, addRevokeRoute, createVCRoute, createVPRoute, checkVPRoute }
