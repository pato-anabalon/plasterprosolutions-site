import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export function setupUser(options?: Parameters<typeof userEvent.setup>[0]) {
  return userEvent.setup(options);
}

export function createTestFile(
  name = "photo.jpg",
  type = "image/jpeg",
  content = "file-content",
) {
  return new File([content], name, { type });
}

export { render, screen, waitFor, within };
