import React from "react";
import { Row, Col, Button } from "reactstrap";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { firebaseConfig } from "../config/FirebaseConfig";
import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from "../config/FirebaseConfig";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var handleEmailCount = 0;
var handlePasswordCount = 0;

function handleSignup() {
  db.collection("user")
    .add({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      birthday: document.getElementById("dob").value,
      password: document.getElementById("password").value,
      imageLink: getImageLink,
    })
    .then(function (docRef) {
      return (
        toast("Register you can login now", { type: "success" }),
        document.getElementById("myform").reset()
      );
    })
    .catch(function (error) {
      console.log(error);
      toast("Something went wrong", { type: "error" });
    });
}

function handleEmail() {
  var countEmail = 0;
  db.collection("user")
    .where("email", "==", document.getElementById("email").value)
    .get()
    .then(function (snapshot) {
      snapshot.forEach(function (doc) {
        countEmail++;
      });
      if (countEmail > 0) {
        toast("Email is already used, try another", { type: "error" });
        document.getElementById("RBtn").disabled = true;
        handleEmailCount = 0;
      } else {
        handleEmailCount = 1;
      }
    });
}

function handlePassword() {
  if (
    document.getElementById("password").value !=
    document.getElementById("Cpassword").value
  ) {
    return (
      (document.getElementById("hPassword").innerHTML =
        "* Password and Confirm Password must be same"),
      (document.getElementById("RBtn").disabled = true),
      (handlePasswordCount = 0)
    );
  } else {
    return (
      (document.getElementById("hPassword").innerHTML = ""),
      (handlePasswordCount = 1)
    );
  }
}

function validate() {
  var fields = ["name", "phone", "dob", "email", "password", "Cpassword"];

  var i,
    l = fields.length;
  var fieldname;
  for (i = 0; i < l; i++) {
    fieldname = fields[i];
    if (document.forms["myform"][fieldname].value === "") {
      document.getElementById("allField").innerHTML = "* All fields required";
      document.getElementById("RBtn").disabled = true;
      return false;
    } else {
      document.getElementById("allField").innerHTML = "";
      if (handleEmailCount == 1 && handlePasswordCount == 1) {
        document.getElementById("RBtn").disabled = false;
      } else {
        document.getElementById("RBtn").disabled = true;
      }
    }
  }
}

function todo() {
  return validate(), handleEmail();
}

function todo1() {
  return validate(), handlePassword();
}
var getImageLink;
const handleImage = async (event) => {
  try {
    const files = event.target.files[0];
    const metadata = {
      contentType: files.type,
    };
    let resizedImage = await readAndCompressImage(files, imageConfig);
    const storageRef = await firebase.storage().ref();
    var uploadTask = storageRef
      .child("images/" + files.name)
      .put(resizedImage, metadata);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast(progress);

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Running");
            break;
        }
        if (progress == 100) {
          toast("Upload complete", { type: "success" });
        }
      },
      (error) => {
        toast("something went wrong in state changed", { type: "error" });
      },
      () => {
        uploadTask.snapshot.ref
          .getDownloadURL()
          .then(function (imageLink) {
            getImageLink = imageLink;
          })
          .catch((err) =>
            toast("somthing error in showing image", { type: "error" })
          );
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const SignUp = () => {
  return (
    <Row className="mt-5">
      <ToastContainer position="top-right" />
      <Col lg="3" />
      <Col lg="6" className="text-center">
        <div className="text-danger" id="allField"></div>
        <form id="myform">
          <label htmlFor="imagepicker">
            <img src={getImageLink} alt="" className="profile" />
          </label>
          <input
            type="file"
            id="imagepicker"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImage(e)}
          />
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="form-control"
            onChange={validate}
            required
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="form-control"
            onChange={todo}
            required
          />
          <br />
          <input
            type="number"
            placeholder="Phone"
            id="phone"
            className="form-control"
            required
            onChange={validate}
          />
          <br />
          <input
            type="date"
            placeholder="Birthday"
            id="dob"
            className="form-control"
            required
            onChange={validate}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="form-control"
            required
            onChange={todo1}
          />
          <span className="text-danger" id="hPassword"></span>
          <br />

          <input
            type="password"
            placeholder="Confirm Password"
            id="Cpassword"
            className="form-control"
            onChange={todo1}
            required
          />
          <br />
          <Button
            type="submit"
            className="btn border-primary bg-white text-dark"
            onClick={handleSignup}
            id="RBtn"
          >
            Sign up
          </Button>
        </form>
      </Col>
      <Col lg="3" />
    </Row>
  );
};

export default SignUp;
