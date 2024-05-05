import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function AppInfo() {
  return (
  <Accordion.Item eventKey="0">
        <Accordion.Header>Application Information</Accordion.Header>
        <Accordion.Body>
          <Container>
            <Row>
              <h3>Geo-Location Browsing App</h3>
            </Row>
            <Row>
              <p>
                It is web app for browsing geolocation data and featuring geolocation-based search functionality
              </p>
            </Row>
          </Container>
        </Accordion.Body>
      </Accordion.Item>
  );
}

export default AppInfo;