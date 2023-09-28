import React, { Component } from "react";
import "./App.css";
import DrugSearchForm from "./components/drugSearchForm";
import PrescriptionTable from "./components/prescriptionTable";
import DrugInteractionAlert from "./components/drugInteractionAlert";
import { Drug, InteractionAlert } from "./interfaces";
import { Col, Container, Row } from "react-bootstrap";

class App extends Component {
  private detectInteractionsTimer: NodeJS.Timeout | null = null;

  state = {
    prescriptionList: (localStorage.getItem("prescriptionList")
      ? JSON.parse(localStorage.getItem("prescriptionList") as string)
      : []) as Drug[],
    interactionAlerts: [] as InteractionAlert[],
    dropdownOpen: false,
  };

  // Add new drug to prescription array
  addDrugToPrescription = (drug: Drug) => {
    this.setState((prevState: any) => ({
      prescriptionList: [...prevState.prescriptionList, drug],
    }));
  };

  // Change date of prescription
  handleDateChange = (drug: Drug, date: string) => {
    const updatedPrescriptionList = this.state.prescriptionList.map((d) => {
      if (d.code === drug.code) {
        d.prescriptionDate = date;
      }
      return d;
    });

    this.setState({ prescriptionList: updatedPrescriptionList });
  };

  // Remode drug from prescription
  handleRemoveDrug = (drug: Drug) => {
    const updatedPrescriptionList = this.state.prescriptionList.filter(
      (d) => d.code !== drug.code
    );
    this.setState({ prescriptionList: updatedPrescriptionList });
  };

  // Detect if there are some interaction and update interactionAlerts
  detectInteractions = async () => {
    try {
      if (this.state.prescriptionList.length > 0) {
        const selectedDrugCodes = this.state.prescriptionList
          .map((drug) => drug.code)
          .join("+");
        const response = await fetch(
          `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${selectedDrugCodes}`
        );
        const data = await response.json();

        // Process the data and set the interactionAlerts state accordingly
        if (data.fullInteractionTypeGroup) {
          const interactions =
            data.fullInteractionTypeGroup[0].fullInteractionType;

          // Get the alerts relevant data from interactions
          const interactionAlerts = interactions.map((interaction: any) => {
            return {
              severity: interaction.interactionPair[0].severity,
              description: interaction.interactionPair[0].description,
            };
          });

          // Some of the alerts are repeating themselves, here we make it unique array.
          const uniqueInteractionAlerts: InteractionAlert[] = [];
          interactionAlerts.forEach((alert: InteractionAlert) => {
            if (
              !uniqueInteractionAlerts.find(
                (a) => a.description === alert.description
              )
            ) {
              uniqueInteractionAlerts.push(alert);
            }
          });

          // Sorting the alerts by severity
          const order = { high: 1, low: 2, "N/A": 3 };

          uniqueInteractionAlerts.sort(
            (a, b) => order[a.severity] - order[b.severity]
          );

          // Setting the unique alerts
          this.setState({ interactionAlerts: uniqueInteractionAlerts });
        } else {
          // In case there are no warnings
          this.setState({ interactionAlerts: [] });
        }
      } else {
        // In case there are no drugs on prescriptionList
        this.setState({ interactionAlerts: [] });
      }
    } catch (error) {
      console.error("Error detecting drug interactions:", error);
    }
  };

  // If the user had prescriptionList saved, it will load the interactions on load.
  componentDidMount() {
    if (this.state.prescriptionList.length > 0) this.detectInteractions();
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // Check if prescriptionList has changed
    if (this.state.prescriptionList !== prevState.prescriptionList) {
      // Save old prescriptionList in localStorge
      localStorage.setItem(
        "prescriptionList",
        JSON.stringify(this.state.prescriptionList)
      );
      // Trigger detectInteractions when the user stops removing/adding for a brief moment
      if (this.detectInteractionsTimer) {
        clearTimeout(this.detectInteractionsTimer);
      }
      this.detectInteractionsTimer = setTimeout(this.detectInteractions, 500);
    }
  }

  render() {
    return (
      <Container className="center-app">
        <Row className="justify-content-center mb-3">
          <h1 className="mb-3">Drug Prescription App</h1>
          <Col xs={12} sm={10} md={8} lg={6}>
            <DrugSearchForm
              prescriptionList={this.state.prescriptionList}
              onAddDrug={this.addDrugToPrescription}
            />
          </Col>
        </Row>

        <Row className="justify-content-center mb-3">
          <Col xs={12} sm={10} md={8} lg={6}>
            <PrescriptionTable
              prescriptionList={this.state.prescriptionList}
              onDateChange={this.handleDateChange}
              onRemoveDrug={this.handleRemoveDrug}
            />
          </Col>
        </Row>

        <Row className="justify-content-center mb-3">
          <Col xs={12} sm={10} md={8} lg={6}>
            <DrugInteractionAlert
              selectedDrugs={this.state.prescriptionList}
              interactionAlerts={this.state.interactionAlerts}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
