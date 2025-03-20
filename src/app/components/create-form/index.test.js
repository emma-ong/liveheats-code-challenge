import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreateForm } from ".";
import { useRouter } from "next/navigation";
import { BUTTON, INPUT } from "../../constants";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CreateForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("Should update the student's name and lane number when add/remove buttons are clicked and input fields are changed", () => {
    render(<CreateForm />);

    expect(screen.queryByLabelText(/Student Name/i)).toBeNull();
    expect(screen.queryByLabelText(/Lane Number/i)).toBeNull();

    fireEvent.click(screen.getByText(/Add another student/i));

    const studentNameInput1 = screen.getByLabelText(/Student Name/i);
    const laneNumberInput1 = screen.getByLabelText(/Lane Number/i);

    expect(studentNameInput1.id).toBe(`${INPUT.STUDENT.ID}-0`);
    expect(laneNumberInput1.id).toBe(`${INPUT.LANE.ID}-0`);

    fireEvent.change(studentNameInput1, { target: { value: "Competitor 1" } });
    fireEvent.change(laneNumberInput1, { target: { value: "1" } });

    expect(studentNameInput1.value).toBe("Competitor 1");
    expect(laneNumberInput1.value).toBe("1");

    fireEvent.click(screen.getByText(/Remove/i));

    expect(screen.queryByLabelText(/Student Name/i)).toBeNull();
    expect(screen.queryByLabelText(/Lane Number/i)).toBeNull();
  });

  test("Should add at least 5 students and submit the create form to local storage", () => {
    render(<CreateForm />);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText(/Add another student/i));

      const studentNameInput = screen.getByTestId(`${INPUT.STUDENT.ID}-${i}`);
      const laneNumberInput = screen.getByTestId(`${INPUT.LANE.ID}-${i}`);

      fireEvent.change(studentNameInput, {
        target: { value: `Competitor ${i + 1}` },
      });
      fireEvent.change(laneNumberInput, { target: { value: `${i + 1}` } });
    }

    fireEvent.click(screen.getByText(/Submit/i));

    const races = JSON.parse(localStorage.getItem("races"));
    expect(races).toHaveLength(1);
    expect(races[0]).toHaveLength(5);
  });

  test("Should add new students to existing races in localStorage", async () => {
    localStorage.setItem(
      "races",
      JSON.stringify([
        [
          { laneNumber: "1", studentName: "Competitor 1" },
          { laneNumber: "2", studentName: "Competitor 2" },
        ],
      ])
    );

    render(<CreateForm />);

    fireEvent.click(screen.getByText(/Add another student/i));
    fireEvent.click(screen.getByText(/Add another student/i));

    const studentNameInput1 = screen.getByTestId(`${INPUT.STUDENT.ID}-0`);
    const laneNumberInput1 = screen.getByTestId(`${INPUT.LANE.ID}-0`);
    const studentNameInput2 = screen.getByTestId(`${INPUT.STUDENT.ID}-1`);
    const laneNumberInput2 = screen.getByTestId(`${INPUT.LANE.ID}-1`);

    fireEvent.change(studentNameInput1, { target: { value: "Competitor x" } });
    fireEvent.change(laneNumberInput1, { target: { value: "3" } });
    fireEvent.change(studentNameInput2, { target: { value: "Competitor y" } });
    fireEvent.change(laneNumberInput2, { target: { value: "4" } });

    fireEvent.click(screen.getByText(/Submit/i));
    const races = JSON.parse(localStorage.getItem("races"));

    await waitFor(() => {
      const races = JSON.parse(localStorage.getItem("races"));
      expect(races).toHaveLength(2);
      expect(races[1]).toEqual([
        { studentName: "Competitor x", laneNumber: "3" },
        { studentName: "Competitor y", laneNumber: "4" },
      ]);
    });
  });

  test("Should show validation error if there is only one student submitted", () => {
    render(<CreateForm />);

    fireEvent.click(screen.getByText(/Add another student/i));

    const studentNameInput1 = screen.getByLabelText(/Student Name/i);
    const laneNumberInput1 = screen.getByLabelText(/Lane Number/i);

    expect(studentNameInput1.id).toBe(`${INPUT.STUDENT.ID}-0`);
    expect(laneNumberInput1.id).toBe(`${INPUT.LANE.ID}-0`);

    fireEvent.change(studentNameInput1, { target: { value: "Competitor 1" } });
    fireEvent.change(laneNumberInput1, { target: { value: "1" } });

    expect(studentNameInput1.value).toBe("Competitor 1");
    expect(laneNumberInput1.value).toBe("1");

    fireEvent.click(screen.getByText(/Submit/i));

    expect(
      screen.getByText(/A race can only be created with at least 2 students/i)
    ).toBeInTheDocument();
  });

  test("Should show validation error if the same student name is used on different lanes", () => {
    render(<CreateForm />);

    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByText(/Add another student/i));

      const studentNameInput = screen.getByTestId(`${INPUT.STUDENT.ID}-${i}`);
      const laneNumberInput = screen.getByTestId(`${INPUT.LANE.ID}-${i}`);

      fireEvent.change(studentNameInput, { target: { value: `Competitor 1` } });
      fireEvent.change(laneNumberInput, { target: { value: `${i + 1}` } });
    }

    fireEvent.click(screen.getByText(/Submit/i));

    const errorMessages = screen.getAllByText(
      /The same student cannot be assigned to more than one lane in the same race/i
    );
    expect(errorMessages[0]).toBeInTheDocument();
  });

  test("Should show validation error if the same lane is used by different students", () => {
    render(<CreateForm />);

    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByText(/Add another student/i));

      const studentNameInput = screen.getByTestId(`${INPUT.STUDENT.ID}-${i}`);
      const laneNumberInput = screen.getByTestId(`${INPUT.LANE.ID}-${i}`);

      fireEvent.change(studentNameInput, {
        target: { value: `Competitor ${i + 1}` },
      });
      fireEvent.change(laneNumberInput, { target: { value: `${1}` } });
    }

    fireEvent.click(screen.getByText(/Submit/i));

    const errorMessages = screen.getAllByText(
      /Different students cannot be assigned to the same lane/i
    );
    expect(errorMessages[0]).toBeInTheDocument();
  });

  test('Should navigate to "/edit" when the button is clicked', () => {
    const routerPushMock = jest.fn();

    useRouter.mockReturnValue({ push: routerPushMock });

    render(<CreateForm />);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText(/Add another student/i));

      const studentNameInput = screen.getByTestId(`${INPUT.STUDENT.ID}-${i}`);
      const laneNumberInput = screen.getByTestId(`${INPUT.LANE.ID}-${i}`);

      fireEvent.change(studentNameInput, {
        target: { value: `Competitor ${i + 1}` },
      });

      fireEvent.change(laneNumberInput, { target: { value: `${i + 1}` } });
    }

    const submitButton = screen.getByText(BUTTON.VALUES.SUBMIT, {
      exact: true,
    });

    fireEvent.click(submitButton);

    const seeEditButton = screen.getByText(/Click here to Edit Results/i);

    expect(seeEditButton).toBeInTheDocument();

    fireEvent.click(seeEditButton);

    expect(routerPushMock).toHaveBeenCalledWith("/edit");
  });
});
