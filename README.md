This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash

yarn dev

```

To run tests and to see the test coverage:

```bash

yarn test

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result, this should redirect you to the **Create A Race** page [http://localhost:3000](http://localhost:3000) create.

# User Journey for Creating a Race Form

This document outlines the user journey for creating a race event using the form component. The journey details the steps a user takes to add students, validate input, and submit the form.

## User Flow - Create Form

### 1. **Add Students to the Form**
- The user begins by adding students to the form. Each student entry includes:
  - **Student Name**
  - **Lane Number**
- The user clicks on the "Add Student" button to add a new student entry.
- A new set of input fields for the student name and lane number will be displayed.
- The user can add as many students as needed, but at least **two students** are required to proceed.

### 2. **Input Validation**
As the user enters student names and lane numbers, the system continuously validates the data:
- **Minimum Student Requirement:** At least two students are required to create a valid race entry.
- **Unique Lane Numbers:** Each student must have a unique lane number.
- **Unique Student Names:** Each student must have a unique name.

### 3. **Remove Students (Optional)**
- The user can remove a student from the list by clicking the "Remove" button next to the student's input fields.
- When a student is removed, their name and lane number will be deleted from the list.

### 4. **Error Handling**
If any validation fails, error messages will be displayed to inform the user:
- "At least 2 students are required."
- "Lane numbers must be unique."
- "Student names must be unique."
- These error messages will be shown in **red** below the form fields.

### 5. **Submit the Form**
- When the form is correctly filled out, the "Submit" button will be enabled.
- The user can click on "Submit" to complete the race creation.
- If the submission is successful, the data is saved to **localStorage** to persist across page reloads.
- The form will reset, clearing all input fields for a fresh start.

### 6. **Post-Submission Action**
After submitting the form:
- The user is given an option to **edit** the race's placement data via a redirect button to another page.

## User Flow - Edit Form

### 1. **Edit Student Placements**
- The user begins by editing the placement of students for each race.
- Each student has the following fields:
  - **Student Name** (view-only, cannot be edited)
  - **Lane Number** (view-only, cannot be edited)
  - **Placement** (editable)
- The user can modify the **Placement** value for each student. Placements must be sequential, starting from 1 (i.e., no gaps in the numbering).

### 2. **Input Validation**
As the user edits the placements, the system performs continuous validation:
- **Missing Placement:** The system checks if any placement field is left empty.
- **Minimum Placement:** A valid race requires a minimum of one placement to be filled.
- **No Gaps in Placement Values:** Placements must form a continuous sequence, starting at 1 with no gaps.
- If there are multiple editable race forms on the page, **ALL** forms need to pass validation before they are submitted together

### 3. **Error Handling**
- If any validation fails, error messages will be displayed:
  - **Missing Placement:** "Placements are missing."
  - **Minimum Placement:** "At least one placement is required."
  - **No Gaps in Placement Values:** "Placements must be sequential starting from 1."

These error messages will be shown in **red** below the form fields.

### 4. **Submit the Form**
- When the form is correctly filled out and passes validation, the "Submit" button will be enabled.
- The user can click on "Submit" to confirm the placements and complete the race editing.
  - If successful, the race data is updated in **localStorage**, and the form is marked as submitted.
- If the placements are correctly filled, a **confirmation message** is displayed with an option to view the updated race/s.

### 5. **Post-Submission Action**
After submitting the form:
- The user is given an option to **view the updated race data** via a button that redirects them to another page.
- The user can **view or modify** the stored race placements at any point in the app.

## User Flow - View Results

### 1. **View Race Results**
- The user navigates to the results page where they can see the results of all races.
- A table displays the following information for each race:
  - **Student Name**: The name of each student.
  - **Lane Number**: The lane assigned to each student.
  - **Placement**: The placement assigned to each student based on their performance.

### 2. **Display of Results**
- The page loads the race data from **localStorage**.
  - If race data exists, the page displays each race in a table format.
  - Each race is labeled sequentially (e.g., **Race 1**, **Race 2**, etc.).
  - Under each race, student details (name, lane, and placement) are shown in rows.

### 3. **Navigating Back to the Create Page**
- After viewing the results, the user has the option to go back to the race creation page.
- A **"Create New Race"** button is provided, which redirects the user to the page where they can create a new race.

### 4. **Table Layout**
- The results are displayed in a **table format** with the following columns:
  - **Student Name**
  - **Lane Number**
  - **Placement**
- The table headers are clearly labeled to indicate what data is displayed in each column.

  