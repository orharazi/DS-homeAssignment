import React, { Component } from "react";
import { Alert, Container, Row, Col, Image } from "react-bootstrap";

import { DrugInteractionAlertProps, severityToVarient } from "../interfaces";

class DrugInteractionAlert extends Component<DrugInteractionAlertProps> {
  render() {
    return (
      <Container className="justify-content-center left-align">
        {/* Display interaction alert */}
        {this.props.interactionAlerts.length > 0 &&
          this.props.interactionAlerts.map((alert, idx) => {
            const varient = severityToVarient[alert.severity] || "info";
            return (
              <Alert key={idx} variant={varient}>
                <Row key={idx}>
                  <Col xs={1} sm={1} md={1} lg={1}>
                    <Image
                      src={
                        process.env.PUBLIC_URL + `/icons/${varient}-icon.png`
                      }
                      height={20}
                      width={20}
                    />
                  </Col>
                  <Col xs={11} sm={11} md={11} lg={11}>
                    {alert.description}
                  </Col>
                </Row>
              </Alert>
            );
          })}
      </Container>
    );
  }
}

export default DrugInteractionAlert;
