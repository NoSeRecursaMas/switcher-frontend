import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CreateUserModal from "./createUserModal";
import { getPlaceholder } from "../services/api/user";

describe("CreateUserModal", () => {
  it("should render", () => {
    render(<CreateUserModal />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });
});