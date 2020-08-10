import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../Context";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardSubtitle,
  CardImg,
  Button,
} from "reactstrap";
import "firebase/firestore";
import "bootstrap/dist/css/bootstrap.css";

const Dashboard = () => {
  const context = useContext(UserContext);
  function handleLogout() {
    return context.setUser(null), (<Redirect to="/SignIn" />);
  }
  if (context.user) {
    return (
      <>
        <br />
        <Row>
          <Col lg-4 />
          <Col lg-4>
            <Card>
              <CardImg
                top
                width="100%"
                height="300px"
                style={{ borderRadius: "50%" }}
                src={context.user.image}
                alt="Card image cap"
              />
              <CardBody>
                <CardTitle>{context.user.name}</CardTitle>
                <CardSubtitle>{context.user.email}</CardSubtitle>
                <CardText>
                  {context.user.phone} <br />
                  {context.user.birthday}
                </CardText>
              </CardBody>
            </Card>
          </Col>
          <Col lg-4 />
        </Row>
        <br />
        <Row>
          <Col className="text-center">
            <a onClick={handleLogout} className="btn border-danger">
              Logout
            </a>
          </Col>
        </Row>
      </>
    );
  } else {
    return <Redirect to="/SignIn" />;
  }
};

export default Dashboard;
