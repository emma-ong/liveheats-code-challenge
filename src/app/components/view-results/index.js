"use client";

import { BUTTON, FEEDBACK_MESSAGES, INPUT } from "../../constants";
import { Button } from "../button/index";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const ViewResults = () => {
  const [races, setRaces] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const racesFromLocalStorage = JSON.parse(localStorage.getItem("races"));

    if (racesFromLocalStorage) {
      const updatedRaces = racesFromLocalStorage.map((race) =>
        race.map((student) => ({
          ...student,
          placement: student.placement,
        }))
      );
      setRaces(updatedRaces);
    }
  }, []);

  const tableStyles = { width: "100%" };
  const tableDataStyles = {
    textAlign: "left",
    fontWeight: "bold",
    backgroundColor: "green",
    color: "white",
  };

  return (
    <>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th>{INPUT.STUDENT.LABEL}</th>
            <th>{INPUT.LANE.LABEL}</th>
            <th>{INPUT.PLACEMENT.LABEL}</th>
          </tr>
        </thead>
        <tbody>
          {races?.map((race, idx) => {
            return (
              <Fragment key={idx}>
                <tr>
                  <td colSpan="3" style={tableDataStyles}>
                    {FEEDBACK_MESSAGES.RACE} {idx + 1}
                  </td>
                </tr>

                {race.map((student, studentIdx) => (
                  <tr key={studentIdx} style={tableStyles}>
                    <td>{student.studentName}</td>
                    <td>{student.laneNumber}</td>
                    <td>{student.placement}</td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <Button
        value={BUTTON.VALUES.CREATE}
        type={BUTTON.TYPE.GENERIC}
        onClick={() => router.push(BUTTON.PATHS.CREATE)}
      />
    </>
  );
};
