import React, { Component, ChangeEvent } from "react";
import { Form, Button, ListGroup, Container, Col, Row } from "react-bootstrap";
import { DrugSearchFormProps, DrugSearchFormState, Drug } from "../interfaces";

class DrugSearchForm extends Component<
  DrugSearchFormProps,
  DrugSearchFormState
> {
  private searchTimer: NodeJS.Timeout | null = null;

  constructor(props: DrugSearchFormProps) {
    super(props);
    this.state = {
      searchTerm: "",
      drugList: [],
      showList: false,
    };
  }

  handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm }, () => {
      // Trigger search when the user stops typing for a brief moment
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      this.searchTimer = setTimeout(this.handleSearchSubmit, 500);
    });
  };

  handleSearchSubmit = async () => {
    if (this.state.searchTerm) {
      try {
        const response = await fetch(
          `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${this.state.searchTerm}&ef=RXCUIS`
        );
        /* 
          The API data provides us an array with data, here is the data we gone use:
          data[1] => drugName[]
          data[2] => { RXCUIS: drugCode[][] }
        */

        const data: any[] = await response.json();
        const drugsData: Drug[] = [];
        for (let i in data[1]) {
          drugsData.push({
            name: data[1][i],
            code: data[2].RXCUIS[i].join("+"),
          });
        }

        this.setState({ drugList: drugsData, showList: true });
      } catch (error) {
        console.error("Error fetching drug data:", error);
      }
    } else {
      this.setState({ drugList: [] });
    }
  };

  handleAddDrug = (drug: Drug) => {
    // Close drug list
    this.setState({ showList: false, searchTerm: "" });
    drug.prescriptionDate = new Date().toISOString().slice(0, 10);

    // Avoid adding the same prescription
    if (!this.props.prescriptionList.find((d: Drug) => d.code === drug.code)) {
      this.props.onAddDrug(drug);
    }
  };

  render(): React.ReactNode {
    return (
      <Container className="drug-search-container">
        <ListGroup>
          <ListGroup.Item key="search-bar">
            <Row className="justify-content-center">
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form>
                  <Form.Group controlId="searchTerm">
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Search for a drug..."
                      onChange={this.handleSearchChange}
                      value={this.state.searchTerm}
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </ListGroup.Item>

          {/* Display drug list with "Add Drug" button */}
          {this.state.drugList.length === 0 &&
          this.state.searchTerm &&
          this.state.showList ? (
            <ListGroup.Item>
              <h4>Cannot find drugs with: {this.state.searchTerm}</h4>
            </ListGroup.Item>
          ) : (
            this.state.showList &&
            this.state.drugList.map((drug) => (
              <ListGroup.Item
                key={drug.code}
                className="search-result-list-item"
              >
                <Row className="search-result-row">
                  <Col xs={7} sm={8} md={8} lg={8} className="left-align">
                    <span className="drug-name">{drug.name.split("(")[0]}</span>
                    <br />
                    <span className="drug-type">
                      {"(" + drug.name.split("(")[1]}
                    </span>
                  </Col>
                  <Col xs={5} sm={4} md={4} lg={4} className="right-align">
                    <Button
                      variant="success"
                      onClick={() => this.handleAddDrug(drug)}
                    >
                      Add Drug
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Container>
    );
  }
}

export default DrugSearchForm;
