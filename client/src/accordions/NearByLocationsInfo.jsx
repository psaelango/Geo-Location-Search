import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function NearByLocationsInfo() {
  return (
    <Accordion.Item eventKey="3">
      <Accordion.Header>Near By Locations</Accordion.Header>
      <Accordion.Body>
        <Container>
          <Row>
            <h3>
              You can browse all the locations and view the nearby location by
              clicking on it
            </h3>
          </Row>
          <Row>
            <Link to="/nearby-locations">
              Go to page - Browse Nearby Locations
            </Link>
          </Row>
        </Container>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default NearByLocationsInfo;
