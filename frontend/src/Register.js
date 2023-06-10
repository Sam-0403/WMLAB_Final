import React, { Component } from "react";
import swal from "sweetalert";
import { Button, TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";

import handleRegisterClick from "./client-register";
import handleSigninClick from "./client-signin";

const axios = require("axios");

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = () => {
    axios.post('http://localhost:2000/register', {
      username: this.state.username,
      password: this.state.password,
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      // this.props.history.push('/');
      this.props.navigate("/");
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  registerFIDO = async () => {
    // Step1. Register
    var username = this.state.username
    await handleRegisterClick(username)
      .then(async () => {
        // Step2. Sign
        await handleSigninClick(username)
          .then((user) => {
            console.log(user)
            localStorage.setItem('token', user.tokenId);
            localStorage.setItem('user_id', user.userId);
            this.props.navigate("/dashboard");
          })
          .catch((err) => {
            console.log(err)
          })
        // Step3. Create DID
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
      })
      .catch((err) => {
        console.log(err)
      })
  }

  render() {
    return (
      <div style={{ marginTop: '200px' }}>
        <div>
          <h2>Register</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={this.state.confirm_password}
            onChange={this.onChange}
            placeholder="Confirm Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.username == '' || this.state.password == ''}
            onClick={this.register}
          >
            Register
          </Button> 
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.username == ''}
            onClick={async () => {
              await this.registerFIDO()
            }}
          >
            Register (FIDO)
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link
            component="button"
            style={{ fontFamily: "inherit", fontSize: "inherit" }}
            onClick={() => {
              this.props.navigate("/");
            }}
          >
            Login
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
