import React, { useState, useContext } from "react";
import { Row, Col, Container, Form, Input } from "reactstrap";
import firebase from "firebase/app";
import Provider from "../provider";
import { UserContext } from "../Context";
import "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.css";
import { Redirect } from "react-router-dom";

const SignIn = () => {
  const context = useContext(UserContext);

  var db = firebase.firestore();

  function handleSignin() {
    var count = 0;
    db.collection("user")
      .where("email", "==", document.getElementById("email").value)
      .where("password", "==", document.getElementById("password").value)
      .get()
      .then(function (querysnapshot) {
        querysnapshot.forEach(function (docReffer) {
          return (
            count++,
            console.log("Correct"),
            toast("correct email or password", { type: "success" }),
            firebase
              .firestore()
              .collection("user")
              .doc(docReffer.id)
              .get()
              .then((docRef) => {
                context.setUser({
                  email: docRef.data().email,
                  name: docRef.data().name,
                  phone: docRef.data().phone,
                  birthday: docRef.data().birthday,
                  image: docRef.data().imageLink,
                });
              })
          );
        });

        if (count != 1) {
          return (
            console.log("Wrong email and password"),
            toast("Wrong email or password", { type: "error" })
          );
        }
      })
      .catch(function (error) {
        toast(error.message, { type: "error" });
      });
  }

  if (context.user?.email) {
    return <Redirect to="/Dashboard" />;
  } else {
    return (
      <Container>
        <ToastContainer position="top-right" />
        <Row className="mt-5">
          <Col lg="3" />
          <Col lg="6" className="text-center">
            <Form>
              <Input
                type="email"
                placeholder="Email"
                required
                id="email"
                className="form-control"
              />
              <br />
              <Input
                type="password"
                placeholder="Password"
                required
                id="password"
                className="form-control"
              />
              <br />
              <a className="btn border-primary" onClick={handleSignin}>
                Sign in
              </a>
            </Form>
          </Col>
          <Col lg="3" />
        </Row>
      </Container>
    );
  }
};

export default SignIn;
