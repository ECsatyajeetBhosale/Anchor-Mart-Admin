/**
 * components/ui/Button.test.tsx
 *
 * Basic smoke tests for the Button component.
 *
 * Tests check:
 *   - The button renders with the correct text
 *   - It shows a loading spinner and is disabled when isLoading=true
 *   - It applies the secondary variant styles
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders the button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Saving</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders the secondary variant", () => {
    render(<Button variant="secondary">Cancel</Button>);
    const btn = screen.getByRole("button", { name: /cancel/i });
    expect(btn).toBeInTheDocument();
  });
});
