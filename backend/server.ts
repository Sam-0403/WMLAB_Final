var express = require("express");
var app = express();

var cors = require('cors');
var bodyParser = require('body-parser');
var https = require("https");
var fetch = require("node-fetch");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/productDB");

// Utils
var { login, register, checkUserAndGenerateToken } = require("./utils/user");
var { addProduct, updateProduct, deleteProduct, getProduct } = require("./utils/product");
var { upload } = require("./utils/upload");
var { createToken, verifySignin } = require("./utils/fido");

// Iota
import { createDIDRoute, addVMRoute } from "./utils/iota";

require('dotenv').config();

const apiurl = process.env.API_URL || "https://v4.passwordless.dev";
const API_SECRET = process.env.API_SECRET || "YOUR_API_SECRET"; // Replace with your API secret
const API_KEY = process.env.API_KEY || "YOUR_API_KEY"; // this will be injected to index.html

// Functions
// import { createDID } from './iota/createDid'

// var dir = './uploads';
// var upload = multer({
//   storage: multer.diskStorage({

//     destination: function (req, file, callback) {
//       if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir);
//       }
//       callback(null, './uploads');
//     },
//     filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

//   }),

//   fileFilter: function (req, file, callback) {
//     var ext = path.extname(file.originalname)
//     if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//       return callback(/*res.end('Only images are allowed')*/ null, false)
//     }
//     callback(null, true)
//   }
// });

app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next();
});

// app.use("/", (req, res, next) => {
//   try {
//     if (req.path == "/login" || req.path == "/register" || req.path == "/" || req.path == "/create_did") {
//       next();
//     } else {
//       /* decode jwt token if authorized*/
//       jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
//         if (decoded && decoded.user) {
//           req.user = decoded;
//           next();
//         } else {
//           return res.status(401).json({
//             errorMessage: 'User unauthorized!',
//             status: false
//           });
//         }
//       })
//     }
//   } catch (e) {
//     res.status(400).json({
//       errorMessage: 'Something went wrong!',
//       status: false
//     });
//   }
// })

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'APIs'
  });
});

/*
  API for password authentication
*/
app.post("/login", (req, res) => {
  login(req, res);
});
app.post("/register", (req, res) => {
  register(req, res);
});

/*
  API for passwordless authentication
*/
const agent = new https.Agent({
  rejectUnauthorized: false
})
app.get("/create-token", async (req, res) => {
  await createToken(req, res);
});
app.get("/verify-signin", async (req, res) => {
  await verifySignin(req, res);
});

/*
  API for products
*/
app.post("/add-product", upload.any(), (req, res) => {
  addProduct(req, res);
});
app.post("/update-product", upload.any(), (req, res) => {
  updateProduct(req, res);
});
app.post("/delete-product", (req, res) => {
  deleteProduct(req, res);
});
app.get("/get-product", (req, res) => {
  getProduct(req, res);
});

/*
  API for iota
*/
app.post('/create_did', (req, res) => {
  createDIDRoute(req, res);
})
app.post('/add_vm', (req, res) => {
  addVMRoute(req, res);
})

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});
