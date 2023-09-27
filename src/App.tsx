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
    prescriptionList: [] as Drug[],
    interactionAlerts: [] as InteractionAlert[],
  };

  addDrugToPrescription = (drug: Drug) => {
    this.setState((prevState: any) => ({
      prescriptionList: [...prevState.prescriptionList, drug],
    }));
  };

  handleDateChange = (drug: Drug, date: string) => {
    const updatedPrescriptionList = this.state.prescriptionList.map((d) => {
      if (d.code === drug.code) {
        d.prescriptionDate = date;
      }
      return d;
    });

    this.setState({ prescriptionList: updatedPrescriptionList });
  };

  handleRemoveDrug = (drug: Drug) => {
    const updatedPrescriptionList = this.state.prescriptionList.filter(
      (d) => d.code !== drug.code
    );
    this.setState({ prescriptionList: updatedPrescriptionList });
  };

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

  componentDidUpdate(prevProps: any, prevState: any) {
    // Check if prescriptionList has changed
    if (this.state.prescriptionList !== prevState.prescriptionList) {
      // Run detectInteractions when prescriptionList changes
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
          <h1>Doctor's Prescription</h1>
          <Col lg="4">
            <DrugSearchForm
              prescriptionList={this.state.prescriptionList}
              onAddDrug={this.addDrugToPrescription}
            />
          </Col>
        </Row>
        <Row className="justify-content-center mb-3">
          <PrescriptionTable
            prescriptionList={this.state.prescriptionList}
            onDateChange={this.handleDateChange}
            onRemoveDrug={this.handleRemoveDrug}
          />
        </Row>
        <Row className="justify-content-center mb-3">
          <DrugInteractionAlert
            selectedDrugs={this.state.prescriptionList}
            interactionAlerts={this.state.interactionAlerts}
          />
        </Row>
      </Container>
    );
  }
}

export default App;
