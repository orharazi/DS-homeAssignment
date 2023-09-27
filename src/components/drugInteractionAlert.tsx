import React, { Component } from "react";
import { Button, Alert } from "react-bootstrap";

import { DrugInteractionAlertProps } from "../interfaces";

class DrugInteractionAlert extends Component<DrugInteractionAlertProps> {
  render() {
    return (
      <div>
        {/* Display interaction alert */}
        {this.props.interactionAlerts.length > 0 &&
          this.props.interactionAlerts.map((alert) => (
            <Alert variant="danger">{alert.description}</Alert>
          ))}
      </div>
    );
  }
}

export default DrugInteractionAlert;
