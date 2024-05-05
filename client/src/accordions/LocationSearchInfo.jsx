import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function UploadMoodInfo() {
  return (
    <Accordion.Item eventKey="1">
      <Accordion.Header>Search Locations</Accordion.Header>
      <Accordion.Body>
        <Container>
          <Row>
            <h3>You can search for the location by available in the database and view similar locations with a score</h3>
          </Row>
          <Row>
            <Link to="/location-search">Go to page - Search Locations</Link>
          </Row>
        </Container>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default UploadMoodInfo;