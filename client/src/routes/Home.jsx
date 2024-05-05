import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import AppInfo from "../accordions/AppInfo";
import LocationSearchInfo from "../accordions/LocationSearchInfo";
import NearByLocationsInfo from "../accordions/NearByLocationsInfo";

function Home() {
  return (
    <Container>
        <Row>
          <Accordion defaultActiveKey="0" style={{marginTop: '50px'}}>
            <AppInfo />
            <LocationSearchInfo />
            <NearByLocationsInfo />
          </Accordion>
        </Row>
    </Container>
  );
}

export default Home;
