import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';
import { withRouter } from './utils';
import handleSigninClick from "./client-signin";
import handleRegisterClick from "./client-register";
const axios = require('axios');
const bcrypt = require("bcryptjs");

var salt = bcrypt.genSaltSync(10);

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      loading: false,
      username: '',
      password: '',

      openVCModal: false,
      userVC: ''
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    this.setState({ username: username });
    if (!token) {
      // this.props.history.push('/login');
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getProduct();
      });
    }
  }

  getProduct = () => {
    
    this.setState({ loading: true });

    let data = '?';
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios.get(`http://localhost:2000/get-product${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
    }).catch((err) => {
      console.log(err)
      this.setState({ loading: false, products: [], pages: 0 },()=>{});
    });
  }

  deleteProduct = (id) => {
    axios.post('http://localhost:2000/delete-product', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    // this.props.history.push('/');
    this.props.navigate("/");
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }
  };

  addProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('discount', this.state.discount);
    file.append('price', this.state.price);

    axios.post('http://localhost:2000/add-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductClose();
      this.setState({ name: '', desc: '', discount: '', price: '', file: null, page: 1 }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductClose();
    });

  }

  updateProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('id', this.state.id);
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('discount', this.state.discount);
    file.append('price', this.state.price);

    axios.post('http://localhost:2000/update-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.handleProductEditClose();
      this.setState({ name: '', desc: '', discount: '', price: '', file: null }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.handleProductEditClose();
    });

  }

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      fileName: ''
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleProductEditOpen = (data) => {
    this.setState({
      openProductEditModal: true,
      id: data._id,
      name: data.name,
      desc: data.desc,
      price: data.price,
      discount: data.discount,
      fileName: data.image
    });
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  onTextChange = (e) => this.setState({ [e.target.name]: e.target.value });

  verifyFIDO = async () => {
    let isVerified = await handleSigninClick(this.state.username).then((user) => {
      console.log(user)
      // localStorage.setItem('token', user.tokenId);
      // localStorage.setItem('user_id', user.userId);
      // this.props.navigate("/dashboard");
      return true;
    })
    .catch((err) => {
      console.log(err)
      return false;
    })
    return isVerified;
  }

  handleCreateDID = async () => {
    let passed =  await this.verifyFIDO();
    console.log(passed)
    if (passed) {
      console.log("Create DID")
      axios.post('http://localhost:2000/create_did', {
        userId: localStorage.getItem("user_id"),
      }).then((res) => {
        swal({
          text: res.data.message,
          icon: "success",
          type: "success"
        });
      }).catch((err) => {
        if (err.response && err.response.data && err.response.data.errorMessage) {
          swal({
            text: err.response.data.errorMessage,
            icon: "error",
            type: "error"
          });
        }
      });
    }
  }

  handleAddingVM = async () => {
    let passed =  await this.verifyFIDO(this.state.username);

    if (passed) {
      axios.post('http://localhost:2000/find-user', {
        username: this.state.username,
      }).then((res) => {
        var user = res.data.user
        console.log(user)
    
      console.log("Adding VM")
      axios.post('http://localhost:2000/add_vm', {
        user: localStorage.getItem("user_id"),
      }).then((res) => {
        swal({
          text: res.data.message,
          icon: "success",
          type: "success"
        });
      }).catch((err) => {
        if (err.response && err.response.data && err.response.data.errorMessage) {
          swal({
            text: err.response.data.errorMessage,
            icon: "error",
            type: "error"
          });
        }
      });
      })
    }
  }

  handleAddingRevoke = async () => {
    let passed = await this.verifyFIDO(this.state.username);
    console.log(passed)
    if (passed) {
      console.log("Adding VM")
      axios.post('http://localhost:2000/add_revoke', {
        user: localStorage.getItem("user_id"),
      }).then((res) => {
        swal({
          text: res.data.message,
          icon: "success",
          type: "success"
        });
      }).catch((err) => {
        if (err.response && err.response.data && err.response.data.errorMessage) {
          swal({
            text: err.response.data.errorMessage,
            icon: "error",
            type: "error"
          });
        }
      });
    }
  }

  handleVCOpen = () => {
    this.setState({
      openVCModal: true,
      userVC: '',
    });
  };
  
  handleVCClose = () => {
    this.setState({ openVCModal: false });
  };

  handleAddingVC = async () => {
    let passed = await this.verifyFIDO(this.state.username);
    console.log(passed)
    
    if (passed) {
      // Step1. Finding UserVC
      axios.post('http://localhost:2000/find-user', {
        username: this.state.userVC,
      }).then((res) => {
        var userVC = res.data.user
        console.log(userVC)
        
        // Step2. Adding VC
        axios.post('http://localhost:2000/create_vc', {
          userVC: userVC._id,
          user: localStorage.getItem("user_id"),
          userVCID: Number(userVC.userId),
        }).then((res) => {
          swal({
            text: res.data.message,
            icon: "success",
            type: "success"
          });
          this.handleVCClose()
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errorMessage) {
            swal({
              text: err.response.data.errorMessage,
              icon: "error",
              type: "error"
            });
          }
        });

      }).catch((err) => {
        console.log(err)
      })
    }
  }

  handleAddingVP = async () => {
    let passed = await this.verifyFIDO(this.state.username);
    console.log(passed)
    
    if (passed) {
      // Step1. Adding VP
      axios.post('http://localhost:2000/create_vp', {
        user: localStorage.getItem("user_id"),
      }).then((res) => {
        swal({
          text: res.data.message,
          icon: "success",
          type: "success"
        });

        // Step2. Verify VP
        axios.post('http://localhost:2000/check_vp', {
          user: localStorage.getItem("user_id"),
        }).then((res) => {
          swal({
            text: res.data.message,
            icon: "success",
            type: "success"
          })
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errorMessage) {
            swal({
              text: err.response.data.errorMessage,
              icon: "error",
              type: "error"
            });
          }
        });

      })
      .catch((err) => {
        console.log(err)
      })

    }
  }

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard -- {this.state.username}</h2>
        </div>
        
        <div>
        <Button
          className="button_style"
          variant="contained"
          color="primary"
          size="small"
          onClick={this.handleAddingVM}
        >
          Add VM
        </Button>
        <Button
          className="button_style"
          variant="contained"
          color="primary"
          size="small"
          onClick={this.handleAddingRevoke}
        >
          Create Revoke
        </Button>
        <Button
          className="button_style"
          variant="contained"
          color="primary"
          size="small"
          onClick={this.handleVCOpen}
        >
          Create VC
        </Button>
        <Button
          className="button_style"
          variant="contained"
          color="secondary"
          size="small"
          onClick={this.handleAddingVP}
        >
          Rent Car
        </Button>
        </div>
        <br></br>
        <div>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Add Product
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Edit Product */}
        <Dialog
          open={this.state.openProductEditModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Product Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="discount"
              value={this.state.discount}
              onChange={this.onChange}
              placeholder="Discount"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                type="file"
                accept="image/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == ''}
              onClick={(e) => this.updateProduct()} color="primary" autoFocus>
              Edit Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Product */}
        <Dialog
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Product</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Product Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="discount"
              value={this.state.discount}
              onChange={this.onChange}
              placeholder="Discount"
              required
            /><br /><br />
            <Button
              variant="contained"
              component="label"
            > Upload
            <input
                type="file"
                accept="image/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="File"
                hidden
                required
              />
            </Button>&nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == '' || this.state.file == null}
              onClick={(e) => this.addProduct()} color="primary" autoFocus>
              Add Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add VC */}
        <Dialog
          open={this.state.openVCModal}
          onClose={this.handleVCClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Product</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="userVC"
              value={this.state.userVC}
              onChange={this.onChange}
              placeholder="User Name"
              required
            /><br />
            &nbsp;
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleVCClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.userVC == ''}
              onClick={this.handleAddingVC} color="primary" autoFocus>
              Add VC
            </Button>
          </DialogActions>
        </Dialog>

        {/* <br /> */}

        {/* <div>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onTextChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onTextChange}
            placeholder="Enter your password"
            required
          />
        </div> */}

        <br />

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by product name"
            required
          />
          
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="center" component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center"><img src={`http://localhost:2000/${row.image}`} width="70" height="70" /></TableCell>
                  <TableCell align="center">{row.desc}</TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.discount}</TableCell>
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleProductEditOpen(row)}
                    >
                      Edit
                  </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteProduct(row._id)}
                    >
                      Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />
        </TableContainer>

      </div>
    );
  }
}

export default withRouter(Dashboard);
