# My React Drug Prescription App

This is a React-based web application for managing drug prescriptions, checking drug interactions, and searching for drugs. It consists of three distinct components:

1. **Drug Search**: Allows the doctor to search for a drug in free text and get all relevant drug names. When the relevant drug is found, clicking on “Add Drug” will add it to the prescriptions table.

2. **Prescription Table**: Allows the doctor to manage the prescription; it allows setting a prescription date for each drug or removing the drug from the table.

3. **Drug Interaction Alert**: This section helps the doctor discover potentially harmful drug interactions.

## Installation

Follow these steps to set up the application locally:

1. Clone the repository to your local machine: `git clone https://github.com/orharazi/DS-homeAssignment.git`

2. Navigate to the project directory: `cd DS-homeAssignment`

3. Install the required dependencies: `npm install`

## Usage

To start the development server and run the application, use the following command: `npm start`

This will launch the application in your default web browser at `http://localhost:3000`.

## Notes

- I decided to use React Class-Components instead of Functional Components in order to write this app in an object-oriented programming (OOP) style.
- This assignment took me a total of 5 hours to complete.
- You can reload the page, and the data will remain.
- I decided not to store the Alerts data in local storage and make an API call on load to get them because if some of the alerts changed, the user will see the newest alerts.
- The alerts are sorted by severity. (high to low)
- The API provider didn't provide options for severity, so I tried to understand it myself and also prevent wasting time. I saw three options: `N/A`, `low`, and `high`. These are the severities this app supports.

**I'm here for any questions; feel free to reach me through WhatsApp or phone call :)**
