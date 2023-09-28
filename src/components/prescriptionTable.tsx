import React, { Component } from "react";
import { Image, Container, Col, Row } from "react-bootstrap";

import { PrescriptionTableProps } from "../interfaces";

class PrescriptionTable extends Component<PrescriptionTableProps> {
  render() {
    return (
      <div>
        {this.props.prescriptionList.length > 0 && (
          <>
            <h3 className="second-title">Prescriptions</h3>
            <Container className="prescription-table">
              {this.props.prescriptionList.map((drug, idx) => (
                <Row className="drug-row" key={idx}>
                  <Col xs={5} sm={6} md={7} lg={7}>
                    <span className="drug-name">{drug.name.split("(")[0]}</span>
                    <br />
                    <span className="drug-type">
                      {"(" + drug.name.split("(")[1]}
                    </span>
                  </Col>
                  <Col xs={4} sm={4} md={4} lg={4}>
                    <input
                      type="date"
                      value={drug.prescriptionDate}
                      onChange={(event) =>
                        this.props.onDateChange(drug, event.target.value)
                      }
                    />
                  </Col>
                  <Col xs={3} sm={2} md={1} lg={1}>
                    <Image
                      onClick={() => this.props.onRemoveDrug(drug)}
                      src={process.env.PUBLIC_URL + "/icons/close-icon.png"}
                      className="remove-drug"
                      height={20}
                      width={20}
                    />
                  </Col>
                </Row>
              ))}
            </Container>
          </>
        )}
      </div>
    );
  }
}

export default PrescriptionTable;
