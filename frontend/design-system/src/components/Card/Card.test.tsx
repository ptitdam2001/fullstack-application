import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Card } from "./Card";

// ─── CardContainer ────────────────────────────────────────────────────────────

describe("Card.Container", () => {
  it("renders a <section> element", () => {
    const { container } = render(<Card.Container />);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("sets data-slot='card'", () => {
    const { container } = render(<Card.Container />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card");
  });

  it("forwards className", () => {
    const { container } = render(<Card.Container className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children", () => {
    const { getByText } = render(
      <Card.Container>
        <span>child</span>
      </Card.Container>,
    );
    expect(getByText("child")).toBeInTheDocument();
  });
});

// ─── CardHeader ───────────────────────────────────────────────────────────────

describe("Card.Header", () => {
  it("renders a <div> with data-slot='card-header'", () => {
    const { container } = render(<Card.Header />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card-header");
  });

  it("forwards className", () => {
    const { container } = render(<Card.Header className="custom-header" />);
    expect(container.firstChild).toHaveClass("custom-header");
  });
});

// ─── CardTitle ────────────────────────────────────────────────────────────────

describe("Card.Title", () => {
  it("renders a <div> with data-slot='card-title'", () => {
    const { container } = render(<Card.Title />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card-title");
  });

  it("renders text content", () => {
    const { getByText } = render(<Card.Title>My title</Card.Title>);
    expect(getByText("My title")).toBeInTheDocument();
  });
});

// ─── CardDescription ─────────────────────────────────────────────────────────

describe("Card.Description", () => {
  it("renders a <div> with data-slot='card-description'", () => {
    const { container } = render(<Card.Description />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "card-description",
    );
  });

  it("renders text content", () => {
    const { getByText } = render(
      <Card.Description>A description</Card.Description>,
    );
    expect(getByText("A description")).toBeInTheDocument();
  });
});

// ─── CardContent ─────────────────────────────────────────────────────────────

describe("Card.Content", () => {
  it("renders a <div> with data-slot='card-content'", () => {
    const { container } = render(<Card.Content />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card-content");
  });

  it("renders children", () => {
    const { getByText } = render(<Card.Content>Content</Card.Content>);
    expect(getByText("Content")).toBeInTheDocument();
  });
});

// ─── CardFooter ───────────────────────────────────────────────────────────────

describe("Card.Footer", () => {
  it("renders a <div> with data-slot='card-footer'", () => {
    const { container } = render(<Card.Footer />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card-footer");
  });

  it("renders children", () => {
    const { getByText } = render(<Card.Footer>Footer text</Card.Footer>);
    expect(getByText("Footer text")).toBeInTheDocument();
  });
});

// ─── CardAction ───────────────────────────────────────────────────────────────

describe("Card.Action", () => {
  it("renders a <div> with data-slot='card-action'", () => {
    const { container } = render(<Card.Action />);
    expect(container.firstChild).toHaveAttribute("data-slot", "card-action");
  });

  it("renders children", () => {
    const { getByText } = render(<Card.Action>Edit</Card.Action>);
    expect(getByText("Edit")).toBeInTheDocument();
  });
});

// ─── Composition ─────────────────────────────────────────────────────────────

describe("Card (composed)", () => {
  it("renders a full card with all sub-components", () => {
    const { getByText } = render(
      <Card.Container>
        <Card.Header>
          <Card.Title>Title</Card.Title>
          <Card.Description>Description</Card.Description>
          <Card.Action>Action</Card.Action>
        </Card.Header>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card.Container>,
    );

    expect(getByText("Title")).toBeInTheDocument();
    expect(getByText("Description")).toBeInTheDocument();
    expect(getByText("Action")).toBeInTheDocument();
    expect(getByText("Content")).toBeInTheDocument();
    expect(getByText("Footer")).toBeInTheDocument();
  });

  it("renders the correct nesting structure", () => {
    const { container } = render(
      <Card.Container>
        <Card.Header>
          <Card.Title>Title</Card.Title>
        </Card.Header>
        <Card.Content>Content</Card.Content>
      </Card.Container>,
    );

    const section = container.querySelector("[data-slot='card']");
    expect(section).toBeInTheDocument();
    expect(section?.querySelector("[data-slot='card-header']")).toBeInTheDocument();
    expect(section?.querySelector("[data-slot='card-title']")).toBeInTheDocument();
    expect(section?.querySelector("[data-slot='card-content']")).toBeInTheDocument();
  });
});
