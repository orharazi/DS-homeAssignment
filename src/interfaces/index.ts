export interface Drug {
  code: string;
  name: string;
  prescriptionDate?: string;
}

export interface InteractionAlert {
  severity: "high" | "low" | "N/A";
  description: string;
}

export enum severityToVarient {
  "high" = "danger",
  "low" = "warning",
  "N/A" = "info",
}

export interface DrugSearchFormState {
  searchTerm: string;
  drugList: Drug[];
  showList: boolean;
}

export interface DrugSearchFormProps {
  onAddDrug: (drug: Drug) => void;
  prescriptionList: Drug[];
}

export interface DrugInteractionAlertProps {
  selectedDrugs: Drug[];
  interactionAlerts: InteractionAlert[];
}

export interface PrescriptionTableProps {
  prescriptionList: Drug[];
  onDateChange: (drug: Drug, date: string) => void;
  onRemoveDrug: (drug: Drug) => void;
}
