var { createDID } = require("../iota/createDid")
var { addVerificationMethod } = require("../iota/verificationMethods")

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
        if (req.body && req.body.userId) {
            console.log("Adding VM")
            asyncAddVM(req.body.userId, req.body.userId, "key-1").then((isError) => {
                if (isError) {
                    res.status(400).json({
                        errorMessage: 'DID not exists!',
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

export { createDIDRoute, addVMRoute }
