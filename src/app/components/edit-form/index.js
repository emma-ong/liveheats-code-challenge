"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { BUTTON, ERROR_MESSAGES, FEEDBACK_MESSAGES } from "../../constants";
import { INPUT } from "../../constants";

export const EditForm = () => {
  const [races, setRaces] = useState([]);
  const router = useRouter();
  const [submitFlag, setSubmitFlag] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submittedForms, setSubmittedForms] = useState([]);

  const studentFormStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  };

  const [errors, setErrors] = useState({
    missingPlacement: [],
    minimumRequirement: [],
  });

  const errorMessageStyle = {
    color: "red",
  };

  const placementsSubmittedStyle = {
    display: "flex",
    flexDirection: "column",
  };

  useEffect(() => {
    const racesFromLocalStorage = JSON.parse(localStorage.getItem("races"));
    let submittedFormsIdxs = [];
    const updatedRaces = racesFromLocalStorage?.map((race, raceIdx) =>
      race.map((student) => {
        if (student.submitted && submittedFormsIdxs.indexOf(raceIdx) === -1) {
          submittedFormsIdxs.push(raceIdx);
        }
        setSubmittedForms(submittedFormsIdxs);
        return {
          ...student,
          placement: student.placement || "",
          submitted: student.submitted ? student.submitted : false,
        };
      })
    );
    setRaces(updatedRaces);
  }, []);

  const handleValidation = (races, racesIdx) => {
    const race = races[racesIdx];
    let counts = {};
    let noGaps = [];
    let newErrors = [];

    const placementValues = race
      .map((student) => Number(student.placement))
      .sort();

    if (placementValues[0] !== 1 && !newErrors.length) {
      newErrors.push(true);
    }

    placementValues.forEach((placement, idx) => {
      if (!counts[placement]) {
        counts[placement] = 1;
      } else {
        counts[placement]++;
      }
    });

    const countEntries = Object.entries(counts);
    countEntries.forEach((entry, idx) => {
      if (
        idx !== 0 &&
        Number(entry[0]) - countEntries[idx - 1][1] !==
          Number(countEntries[idx - 1][0])
      ) {
        noGaps.push(false);
      } else {
        noGaps.push(true);
      }
    });
    setErrors({
      missingPlacement: noGaps,
      minimumRequirement: newErrors,
    });
    setCanSubmit(Object.keys(newErrors).length === 0);
  };

  const handleSubmit = (e, racesIdx) => {
    e.preventDefault();
    handleValidation(races, racesIdx);
  };

  const handleInputChange = (racesIdx, studentIdx, e) => {
    const { value } = e.target;
    const newRaces = [...races];
    newRaces[racesIdx][studentIdx].placement = value;
    setRaces(newRaces);
  };

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (
      errors.missingPlacement.every((gap) => gap === true && races.length > 0)
    ) {
      const newRaces = [...races];
      const updatedRaces = newRaces.map((race) =>
        race.map((student) => ({
          ...student,
          submitted: student.placement ? true : false,
        }))
      );
      localStorage.setItem("races", JSON.stringify(updatedRaces));
      setSubmitFlag(true);
    }
  }, [errors, races]);

  const isRaceSubmitted = (racesIdx) => submittedForms.indexOf(racesIdx) !== -1;
  const isMissingPlacement = errors.missingPlacement.some(
    (gap) => gap === false
  );
  const isMinPlacementError = errors.minimumRequirement.length > 0;
  const isAllPlacementsFilled = errors.missingPlacement.every(
    (gap) => gap === true
  );
  const canSubmitPlacement =
    canSubmit && submitFlag && errors.minimumRequirement.length === 0;

  return (
    <ul>
      {races?.map((race, racesIdx) => {
        return (
          <div key={racesIdx}>
            <li>
              <h3>Race {racesIdx + 1}</h3>
            </li>
            <form onSubmit={(e) => handleSubmit(e, racesIdx)}>
              {race?.map((student, studentIdx) => {
                return (
                  !student.submitted && (
                    <div style={studentFormStyle} key={`${student.laneNumber}`}>
                      <label>
                        {INPUT.STUDENT.LABEL} {studentIdx + 1}
                      </label>
                      <input
                        data-testid={`${INPUT.STUDENT.ID}-${studentIdx}`}
                        type="text"
                        id={`${INPUT.STUDENT.ID}-${student.studentName}`}
                        name={INPUT.STUDENT.ID}
                        value={student.studentName}
                        disabled
                      />
                      <label>{INPUT.LANE.LABEL}</label>
                      <input
                        data-testid={`${INPUT.LANE.ID}-${studentIdx}`}
                        type="text"
                        id={`${INPUT.LANE.ID}-${student.laneNumber}`}
                        name={INPUT.LANE.ID}
                        value={student.laneNumber}
                        disabled
                      />
                      <label>{INPUT.PLACEMENT.LABEL}</label>
                      <input
                        data-testid={`${INPUT.PLACEMENT.ID}-${studentIdx}`}
                        type="number"
                        name={INPUT.PLACEMENT.ID}
                        required
                        value={student.placement}
                        onChange={(e) =>
                          handleInputChange(racesIdx, studentIdx, e)
                        }
                        disabled={student.submitted}
                      />
                    </div>
                  )
                );
              })}
              {!isRaceSubmitted(racesIdx) && isMissingPlacement && (
                <p style={errorMessageStyle}>
                  {ERROR_MESSAGES.missingPlacement}
                </p>
              )}

              {!isRaceSubmitted(racesIdx) && isMinPlacementError && (
                <p style={errorMessageStyle}>{ERROR_MESSAGES.minPlacement}</p>
              )}

              {!isRaceSubmitted(racesIdx) &&
              isAllPlacementsFilled &&
              canSubmitPlacement ? (
                <div style={placementsSubmittedStyle}>
                  <h3>{FEEDBACK_MESSAGES.PLACEMENT_SUBMITTED}</h3>
                  <Button
                    type={BUTTON.TYPE.BUTTON}
                    value={BUTTON.VALUES.SEE}
                    onClick={() => router.push(BUTTON.PATHS.VIEW)}
                  />
                </div>
              ) : (
                <Button
                  type={BUTTON.TYPE.SUBMIT}
                  value={
                    isRaceSubmitted(racesIdx)
                      ? BUTTON.VALUES.SUBMITTED
                      : BUTTON.VALUES.SUBMIT
                  }
                  disabled={isRaceSubmitted(racesIdx)}
                />
              )}
            </form>
          </div>
        );
      })}
    </ul>
  );
};
