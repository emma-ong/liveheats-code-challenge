import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { ViewResults } from ".";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ViewResults", () => {
  const mockRaces = [
    [
      { studentName: "Competitor 1", laneNumber: "1", placement: "1" },
      { studentName: "Competitor 2", laneNumber: "2", placement: "2" },
    ],
    [
      { studentName: "Competitor 3", laneNumber: "3", placement: "1" },
      { studentName: "Competitor 4", laneNumber: "4", placement: "2" },
    ],
  ];

  beforeEach(() => {
    localStorage.setItem("races", JSON.stringify(mockRaces));
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("Should display races and students from localStorage", () => {
    render(<ViewResults />);

    expect(screen.getByText("Race 1")).toBeInTheDocument();
    expect(screen.getByText("Race 2")).toBeInTheDocument();

    expect(screen.getByText("Competitor 1")).toBeInTheDocument();
    expect(screen.getByText("Competitor 2")).toBeInTheDocument();

    expect(screen.getByText("Competitor 3")).toBeInTheDocument();
    expect(screen.getByText("Competitor 4")).toBeInTheDocument();
  });

  test("Should navigate to the create page when the 'Create' button is clicked", () => {
    const routerPushMock = jest.fn();
    useRouter.mockReturnValue({ push: routerPushMock });

    render(<ViewResults />);

    const createButton = screen.getByText(/Create/i);
    fireEvent.click(createButton);

    expect(routerPushMock).toHaveBeenCalledWith("/create");
  });

  test("Should show no races message when no races are in localStorage", () => {
    localStorage.clear();

    render(<ViewResults />);

    expect(screen.queryByText(/Competitor/)).not.toBeInTheDocument();
  });
});
