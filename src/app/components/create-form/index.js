"use client";

import React, { useState, useEffect } from "react";
import { BUTTON, ERROR_MESSAGES, INPUT, LABELS } from "../../constants";
import { Button } from "../button";
import { useRouter } from "next/navigation";

export const CreateForm = () => {
  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitFlag, setSubmitFlag] = useState(false);

  const router = useRouter();

  const errorMessages = [
    {
      condition: errors.minStudentsRequired,
      message: errors.minStudentsRequired,
    },
    { condition: errors.uniqueLaneNumbers, message: errors.uniqueLaneNumbers },
    {
      condition: errors.uniqueStudentNames,
      message: errors.uniqueStudentNames,
    },
  ];

  const addStudent = () => {
    setStudents([...students, { studentName: "", laneNumber: "" }]);
  };

  const removeStudent = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedStudents = [...students];
    updatedStudents[index][name] = value;
    setStudents(updatedStudents);
  };

  const handleValidation = (event) => {
    const originalLaneNumbersArray = event.map((student) => student.laneNumber);
    const uniqueLaneNumbersArray = [...new Set(originalLaneNumbersArray)];

    const originalStudentNamesArray = event.map(
      (student) => student.studentName
    );
    const uniqueStudentNamesArray = [...new Set(originalStudentNamesArray)];

    let newErrors = {};

    if (event.length < 2) {
      newErrors.minStudentsRequired = ERROR_MESSAGES.minStudentsRequired;
    }

    if (originalLaneNumbersArray.length > uniqueLaneNumbersArray.length) {
      newErrors.uniqueLaneNumbers = ERROR_MESSAGES.uniqueLaneNumbers;
    }

    if (originalStudentNamesArray.length > uniqueStudentNamesArray.length) {
      newErrors.uniqueStudentNames = ERROR_MESSAGES.uniqueStudentNames;
    }

    setErrors(newErrors);
    setCanSubmit(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    handleValidation(students);

    if (students.length > 1) {
      setSubmitFlag(true);
    }
  };

  const renderSubmitButton = () => {
    if (canSubmit && submitFlag) {
      return (
        <div style={submitButtonStyle}>
          <h3>{BUTTON.VALUES.SUBMIT}</h3>
          <Button
            value={BUTTON.VALUES.EDIT}
            onClick={() => router.push(BUTTON.PATHS.EDIT)}
            type={BUTTON.TYPE.RACE_SUBMITTED}
          />
        </div>
      );
    }

    return <Button type={BUTTON.TYPE.SUBMIT} value={BUTTON.VALUES.SUBMIT} />;
  };

  useEffect(() => {
    if (canSubmit && submitFlag) {
      const getLocalStorageItems = JSON.parse(localStorage.getItem("races"));

      if (!getLocalStorageItems) {
        localStorage.setItem("races", JSON.stringify([students]));
      } else {
        localStorage.setItem(
          "races",
          JSON.stringify([...getLocalStorageItems, students])
        );
      }

      setStudents([]);
    }
  }, [canSubmit, submitFlag]);

  const createFormStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  };

  const errorMessagesStyle = {
    color: "red",
    padding: "5px",
    marginTop: "10px",
    borderRadius: "3px",
  };

  const submitButtonStyle = {
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      {!canSubmit && !submitFlag && (
        <Button
          value={BUTTON.VALUES.ADD}
          onClick={() => addStudent()}
          type={BUTTON.VALUES.BUTTON}
        />
      )}
      <form onSubmit={handleSubmit}>
        {students.map((student, index) => (
          <div style={createFormStyle} key={index}>
            <label htmlFor={`${INPUT.STUDENT.ID}-${index}`}>
              {INPUT.STUDENT.LABEL} {index + 1}
            </label>
            <input
              data-testid={`${INPUT.STUDENT.ID}-${index}`}
              type="text"
              id={`${INPUT.STUDENT.ID}-${index}`}
              name={INPUT.STUDENT.ID}
              value={student.studentName}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <label htmlFor={`${INPUT.LANE.ID}-${index}`}>
              {INPUT.LANE.LABEL}
            </label>
            <input
              data-testid={`${INPUT.LANE.ID}-${index}`}
              type="number"
              id={`${INPUT.LANE.ID}-${index}`}
              name={INPUT.LANE.ID}
              value={student.laneNumber}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <Button
              value={BUTTON.VALUES.REMOVE}
              onClick={() => removeStudent(index)}
              type={BUTTON.VALUES.REMOVE}
            />
          </div>
        ))}

        {errorMessages?.map(
          (error, index) =>
            error.condition && (
              <p key={index} style={errorMessagesStyle}>
                {error.message}
              </p>
            )
        )}
        {renderSubmitButton()}
      </form>
    </>
  );
};
