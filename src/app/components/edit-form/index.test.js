import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { EditForm } from ".";
import { BUTTON, INPUT } from "../../constants";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("EditForm", () => {
  beforeEach(() => {
    const mockRaces = [
      [
        { studentName: "Competitor 1", laneNumber: "1", submitted: true },
        { studentName: "Competitor 2", laneNumber: "2", submitted: true },
        { studentName: "Competitor 3", laneNumber: "3", submitted: true },
        { studentName: "Competitor 4", laneNumber: "4", submitted: true },
        { studentName: "Competitor 5", laneNumber: "5", submitted: true },
      ],
      [
        { studentName: "Competitor 1", laneNumber: "1", submitted: false },
        { studentName: "Competitor 2", laneNumber: "2", submitted: false },
        { studentName: "Competitor 3", laneNumber: "3", submitted: false },
      ],
    ];

    localStorage.setItem("races", JSON.stringify(mockRaces));
  });

  test("Should load data from local storage and populate a form", () => {
    render(<EditForm />);

    const submitButtons = screen.getAllByText(BUTTON.VALUES.SUBMITTED);
    expect(submitButtons).toHaveLength(1);

    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`${INPUT.STUDENT.ID}-${i}`).value).toBe(
        `Competitor ${i + 1}`
      );
      expect(screen.getByTestId(`${INPUT.LANE.ID}-${i}`).value).toBe(
        `${i + 1}`
      );
    }
  });

  test("Should allow user to change the placement of a student", () => {
    render(<EditForm />);

    const placementInput1 = screen.getByTestId(`${INPUT.PLACEMENT.ID}-0`);
    fireEvent.change(placementInput1, { target: { value: "10" } });

    expect(placementInput1.value).toBe("10");
  });

  test("Should show validation error if the first placement is not 1", () => {
    render(<EditForm />);

    const placementInputs = screen.getAllByTestId(/placement-/);

    const placementInput1 = placementInputs[0];
    fireEvent.change(placementInput1, { target: { value: "2" } });

    placementInputs.forEach((input, index) => {
      if (index !== 0) {
        fireEvent.change(input, { target: { value: `${index + 1}` } });
      }
    });

    const submitButton = screen.getByText(BUTTON.VALUES.SUBMIT, {
      exact: true,
    });

    fireEvent.click(submitButton);

    expect(
      screen.getByText(/Placements must be sequential starting from 1/i)
    ).toBeInTheDocument();
  });

  test("Should show validation error if there are missing placements", () => {
    render(<EditForm />);

    const placementInputs = screen.getAllByTestId(/placement-/);

    const mockPlacementPatterns = {
      0: [1, 1, 2],
      1: [1, 1, 4],
      2: [1, 3, 4],
      3: [1, 2, 1],
      4: [1, 2, 5],
    };

    Object.keys(mockPlacementPatterns).forEach((key) => {
      const pattern = mockPlacementPatterns[key];

      pattern.forEach((value, index) => {
        const input = placementInputs[index];
        fireEvent.change(input, { target: { value: `${value}` } });
      });
    });

    const submitButton = screen.getByText(BUTTON.VALUES.SUBMIT, {
      exact: true,
    });

    fireEvent.click(submitButton);

    expect(screen.getByText(/Placements are missing/i)).toBeInTheDocument();
  });

  test("Should update local storage after successful submission", async () => {
    render(<EditForm />);

    const placementInputs = [
      screen.getByTestId("placement-0"),
      screen.getByTestId("placement-1"),
      screen.getByTestId("placement-2"),
    ];

    const values = [1, 2, 3];

    placementInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: `${values[index]}` } });
    });

    const submitButton = screen.getByText(BUTTON.VALUES.SUBMIT, {
      exact: true,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      const races = JSON.parse(localStorage.getItem("races"));
      expect(races).toHaveLength(2);
      expect(races[0]).toHaveLength(5);
      expect(races[1]).toHaveLength(3);
      expect(races[1][0].placement).toBe("1");
    });
  });

  test('Should navigate to "/view" when the button is clicked', () => {
    const routerPushMock = jest.fn();

    useRouter.mockReturnValue({ push: routerPushMock });

    render(<EditForm />);

    const placementInputs = [
      screen.getByTestId(`${INPUT.PLACEMENT.ID}-0`),
      screen.getByTestId(`${INPUT.PLACEMENT.ID}-1`),
      screen.getByTestId(`${INPUT.PLACEMENT.ID}-2`),
    ];

    const values = [1, 2, 3];

    placementInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: `${values[index]}` } });
    });

    const submitButton = screen.getByText(BUTTON.VALUES.SUBMIT, {
      exact: true,
    });

    fireEvent.click(submitButton);

    const seeResultsButton = screen.getByText(/Click here to See Results/i);

    expect(seeResultsButton).toBeInTheDocument();

    fireEvent.click(seeResultsButton);

    expect(routerPushMock).toHaveBeenCalledWith(BUTTON.PATHS.VIEW);
  });
});
