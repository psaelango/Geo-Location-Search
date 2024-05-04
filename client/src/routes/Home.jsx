import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';

function Home() {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetch('http://localhost:4000/api/location/all')
      .then((response) => response.json())
      .then(({ locations }) => setLocations(locations))
  }, []);

  return (
    <Container>
        <Row>
          <Accordion defaultActiveKey="0" style={{marginTop: '50px'}}>
            <div>
              <pre>{JSON.stringify(locations, null, 2)}</pre>
            </div>
          </Accordion>
        </Row>
    </Container>
  );
}

export default Home;
