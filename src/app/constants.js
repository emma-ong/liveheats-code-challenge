export const LABELS = {
  STUDENT: {
    STUDENT_LABEL: "Student Name",
    LANE_LABEL: "Lane Number",
    ID: "studentName",
    LANE_ID: "laneNumber",
  },
};

export const BUTTON = {
  VALUES: {
    REMOVE: "Remove",
    ADD: "Add another student",
    SUBMIT: "Race submitted!",
    EDIT: "Click here to Edit Results",
  },
  TYPE: {
    SUBMIT: "submit",
    GENERIC: "button",
  },
  PATHS: {
    EDIT: "/edit",
  },
};

export const ERROR_MESSAGES = {
  minStudentsRequired: "A race can only be created with at least 2 students",
  uniqueLaneNumbers: "Different students cannot be assigned to the same lane",
  uniqueStudentNames:
    "The same student cannot be assigned to more than one lane in the same race",
};
