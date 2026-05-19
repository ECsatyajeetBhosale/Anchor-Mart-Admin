/**
 * features/dashboard/components/DashboardCard.test.tsx
 *
 * Basic smoke tests for the DashboardCard component.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardCard } from "./DashboardCard";

describe("DashboardCard", () => {
  it("renders the title and value", () => {
    render(<DashboardCard title="Test Metric" value={42} />);

    expect(screen.getByText("Test Metric")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows a dash when loading", () => {
    render(<DashboardCard title="Test Metric" value={42} isLoading={true} />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders with string values", () => {
    render(<DashboardCard title="Alerts" value="5 critical" />);

    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("5 critical")).toBeInTheDocument();
  });
});
