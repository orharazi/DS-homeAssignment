import React, { Component } from "react";
import { Button, Alert, Container, Row, Col } from "react-bootstrap";

import { DrugInteractionAlertProps, severityToVarient } from "../interfaces";

class DrugInteractionAlert extends Component<DrugInteractionAlertProps> {
  render() {
    return (
      <Container>
        {/* Display interaction alert */}
        {this.props.interactionAlerts.length > 0 &&
          this.props.interactionAlerts.map((alert, idx) => (
            <Row className="justify-content-center" key={idx}>
              <Col xs={12} sm={8} md={6} lg={6}>
                <Alert key={idx} variant={severityToVarient[alert.severity]}>
                  {alert.description}
                </Alert>
              </Col>
            </Row>
          ))}
      </Container>
    );
  }
}

export default DrugInteractionAlert;
