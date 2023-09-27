import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";

import { PrescriptionTableProps } from "../interfaces";

class PrescriptionTable extends Component<PrescriptionTableProps> {
  render() {
    return (
      <div>
        <h2>Prescription Table</h2>
        {this.props.prescriptionList.length > 0 ? (
          <>
            <Table borderless>
              <tbody>
                {this.props.prescriptionList.map((drug) => (
                  <tr key={drug.code}>
                    <td>{drug.name}</td>
                    <td>
                      <input
                        type="date"
                        onChange={(event) =>
                          this.props.onDateChange(drug, event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => this.props.onRemoveDrug(drug)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
