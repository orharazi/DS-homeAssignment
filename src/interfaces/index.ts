export interface Drug {
  code: string;
  name: string;
  prescriptionDate?: string;
}

export interface InteractionAlert {
  severity: string;
  description: string;
}

export interface DrugSearchFormState {
  searchTerm: string;
  drugList: Drug[];
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
