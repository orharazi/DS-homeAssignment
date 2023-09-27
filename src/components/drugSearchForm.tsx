import React, { Component, ChangeEvent, FormEvent } from "react";
import { Form, Button, Dropdown } from "react-bootstrap";
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
          data[2] => drugCode[][]
        */

        const data: any[] = await response.json();
        const drugsData: Drug[] = [];
        for (let i in data[1]) {
          drugsData.push({
            name: data[1][i],
            code: data[2].RXCUIS[i].join("+"),
          });
        }

        this.setState({ drugList: drugsData });
      } catch (error) {
        console.error("Error fetching drug data:", error);
      }
    } else {
      this.setState({ drugList: [] });
    }
  };

  handleAddDrug = (drug: Drug) => {
    // avoid adding the same prescription
    if (!this.props.prescriptionList.find((d: Drug) => d.code === drug.code)) {
      this.props.onAddDrug(drug);
    }
  };

  render(): React.ReactNode {
    return (
      <div>
        <Dropdown>
          <Dropdown.Toggle>
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
          </Dropdown.Toggle>

          {/* Display drug list with "Add Drug" button */}
          {this.state.drugList.length > 0 ? (
            <Dropdown.Menu>
              {this.state.drugList.map((drug) => (
                <Dropdown.Item key={drug.code} href="#/action-3">
                  <span>{drug.name}</span>
                  <Button
                    variant="success"
                    onClick={() => this.handleAddDrug(drug)}
                  >
                    Add Drug
                  </Button>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          ) : (
            <></>
          )}
        </Dropdown>
      </div>
    );
  }
}

export default DrugSearchForm;
