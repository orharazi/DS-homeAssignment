import React, { Component } from "react";
import { Table, Button, Image, Container, Col, Row } from "react-bootstrap";

import { PrescriptionTableProps } from "../interfaces";

class PrescriptionTable extends Component<PrescriptionTableProps> {
  render() {
    return (
      <div>
        <h2>Prescription Table</h2>
        {this.props.prescriptionList.length > 0 ? (
          <>
            <Container>
              {this.props.prescriptionList.map((drug, idx) => (
                <Row className="justify-content-center drug-row" key={idx}>
                  <Col sm={5} xs={5} md={3} lg={3}>
                    {drug.name}
                  </Col>
                  <Col sm={4} xs={4} md={3} lg={2}>
                    <input
                      type="date"
                      value={drug.prescriptionDate}
                      onChange={(event) =>
                        this.props.onDateChange(drug, event.target.value)
                      }
                    />
                  </Col>
                  <Col sm={3} xs={3} md={2} lg={1} className="right-align">
                    <Image
                      onClick={() => this.props.onRemoveDrug(drug)}
                      src={process.env.PUBLIC_URL + "/close-icon.png"}
                      className="remove-drug"
                      height={30}
                      width={30}
                    />
                  </Col>
                </Row>
              ))}
            </Container>
          </>
        ) : (
          <>
            <div>no medicent given!</div>
          </>
        )}
      </div>
    );
  }
}

export default PrescriptionTable;
