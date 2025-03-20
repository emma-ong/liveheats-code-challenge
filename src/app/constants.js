export const INPUT = {
  STUDENT: {
    ID: "studentName",
    LABEL: "Student Name",
  },
  LANE: {
    ID: "laneNumber",
    LABEL: "Lane Number",
  },
  PLACEMENT: {
    ID: "placement",
    LABEL: "Place",
  },
};

export const BUTTON = {
  VALUES: {
    SUBMITTED: "Submitted",
    SUBMIT: "Submit",
    REMOVE: "Remove",
    ADD: "Add another student",
    RACE_SUBMITTED: "Race submitted!",
    EDIT: "Click here to Edit Results",
    SEE: "Click here to See Results",
    CREATE: "Create another race",
  },
  TYPE: {
    SUBMIT: "submit",
    GENERIC: "button",
  },
  PATHS: {
    EDIT: "/edit",
    VIEW: "/view",
    CREATE: "/create",
  },
};

export const FEEDBACK_MESSAGES = {
  PLACEMENT_SUBMITTED: "Placements submitted!",
  RACE: "Race",
};

export const ERROR_MESSAGES = {
  minStudentsRequired: "A race can only be created with at least 2 students",
  uniqueLaneNumbers: "Different students cannot be assigned to the same lane",
  uniqueStudentNames:
    "The same student cannot be assigned to more than one lane in the same race",
  missingPlacement: "Placements are missing",
  minPlacement: "Placements must be sequential starting from 1",
};
