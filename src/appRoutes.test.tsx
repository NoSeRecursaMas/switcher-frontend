import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./appRoutes";
import { ChakraProvider } from "@chakra-ui/react";

describe("App Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByLabelText("Toggle Color Mode")).toBeInTheDocument();
  });

  it("renders the icon light mode", () => {
    render(<App />);
    expect(screen.getByLabelText("Light Mode")).toBeInTheDocument();
  });

  it("toggles color mode when the button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    expect(screen.getByLabelText("Dark Mode")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Toggle Color Mode"));
    expect(screen.getByLabelText("Light Mode")).toBeInTheDocument();
  });
});
