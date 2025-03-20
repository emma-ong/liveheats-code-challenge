"use client";

import React, { useState } from "react";
import styles from "./index.module.css";
import { BUTTON, LABELS } from "@/app/constants";
import { Button } from "../button";

export const CreateForm = () => {
  const [students, setStudents] = useState([]);

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

  return (
    <>
      <form>
        {students.map((student, index) => (
          <div className={styles.createForm} key={index}>
            <label htmlFor={`${LABELS.STUDENT.ID}-${index}`}>
              {LABELS.STUDENT.STUDENT_LABEL} {index + 1}
            </label>
            <input
              data-testid={`${LABELS.STUDENT.ID}-${index}`}
              type="text"
              id={`${LABELS.STUDENT.ID}-${index}`}
              name={LABELS.STUDENT.ID}
              value={student.studentName}
              onChange={(e) => handleInputChange(index, e)}
              required
            />
            <label htmlFor={`${LABELS.STUDENT.LANE_ID}-${index}`}>
              {LABELS.STUDENT.LANE_LABEL}
            </label>
            <input
              data-testid={`${LABELS.STUDENT.LANE_ID}-${index}`}
              type="number"
              id={`${LABELS.STUDENT.LANE_ID}-${index}`}
              name={LABELS.STUDENT.LANE_ID}
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
      </form>
    </>
  );
};
