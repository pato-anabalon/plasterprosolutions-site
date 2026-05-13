# Unit Testing Rules With Jest + React Testing Library

## 1. Test Priority

- Test observable behavior, not internal implementation.
- Prefer validating what users can see or do.
- Avoid testing internal state, class names, fragile DOM structures, or library details.
- Tests should validate the module contract.

## 2. Structure

- Use `describe` per component or module.
- Use `setup()` when rendering is repeated.
- Use clear test names:
  - `should render...`
  - `should call...`
  - `should not show...`
- Group scenarios with nested `describe` blocks when variants matter.
- Keep tests small and focused on one behavior.
- Prefer `it.each` when it reduces duplication.

## 3. React Testing Library Queries

Query priority:

1. `getByRole`
2. `getByLabelText`
3. `getByText`
4. `getByTestId`, only when there is no stable alternative.

Rules:

- Use `queryBy...` to validate absence.
- Use `findBy...` only for asynchronous content.
- Avoid ambiguous or overly generic queries.

## 4. Events

- Prefer `userEvent` over `fireEvent`.
- Always `await` `userEvent` interactions.
- Use `fireEvent` only for simple cases or specific edge cases.

## 5. Mocks

- Mock external dependencies:
  - hooks
  - analytics
  - navigation
  - services
  - APIs
  - translations
- Do not mock the component under test.
- Keep mocks simple and explicit.
- Clear mocks with:

```ts
beforeEach(() => {
  jest.clearAllMocks();
});
```

## 6. Props And Helpers

Create `defaultProps`:

```tsx
const defaultProps = {
  open: true,
  onClose: jest.fn(),
};
```

Use a reusable `setup`:

```tsx
const setup = (props = {}) =>
  render(<Component {...defaultProps} {...props} />);
```

- Avoid duplicating large prop objects.

## 7. Hooks

- Use `renderHook` for pure hooks.
- Avoid creating inline objects inside `renderHook` when they are `useEffect` dependencies.

Incorrect:

```tsx
renderHook(() => useHook({ value: true }));
```

Correct:

```tsx
const props = { value: true };

renderHook(() => useHook(props));
```

- Use `act()` for manual updates.

## 8. Branch Coverage

Create tests for:

- `true` / `false`
- `null` / `undefined`
- empty arrays
- optional callbacks
- early returns
- `try/catch` errors

Do not artificially break the `jsdom` environment to cover branches.

## 9. Async

- Use `waitFor` for asynchronous effects.
- Do not use real `setTimeout`.
- Use fake timers when the module uses timers.

```tsx
jest.useFakeTimers();

act(() => {
  jest.runAllTimers();
});
```

## 10. Storage And Browser APIs

Mock browser APIs when needed:

- `localStorage`
- `sessionStorage`
- `matchMedia`
- `window.location`

Restore modified globals after each test.

## 11. Assertions

Prefer focused assertions.

```tsx
expect(fn).toHaveBeenCalledWith(
  expect.objectContaining({
    id: 1,
  }),
);
```

Avoid validating huge objects when it is not necessary.

## 12. Snapshots

- Avoid large snapshots.
- Use snapshots only for:
  - small objects
  - stable structures
  - pure utilities

## 13. Cleanup

- Do not leave:
  - `console.log`
  - `.only`
  - `.skip`
- Do not modify `result.current` directly.
- Do not depend on test execution order.

## Jest-Specific Rules

### Naming

Test file names should follow:

- `Component.test.tsx`
- `hook.test.tsx`
- `helper.test.tsx`

### Recommended Mocking

Prefer explicit mocks:

```tsx
jest.mock("./service", () => ({
  fetchData: jest.fn(),
}));
```

### Recommended Reset

```tsx
afterEach(() => {
  jest.clearAllMocks();
});
```

## React Testing Library-Specific Rules

### Philosophy

- Test like a user.
- Avoid accessing:
  - state
  - instances
  - internal methods

### Accessibility

Prioritize accessible queries:

```tsx
screen.getByRole("button", {
  name: /submit/i,
});
```

### Element Absence

```tsx
expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
```

### Async Rendering

```tsx
expect(await screen.findByText(/success/i)).toBeInTheDocument();
```

## Anti-Patterns To Avoid

### Do Not Test Internal Implementation

```tsx
expect(wrapper.state("open")).toBe(true);
```

### Do Not Overuse Test IDs

Avoid:

```tsx
screen.getByTestId("button");
```

when this works:

```tsx
screen.getByRole("button");
```

### Do Not Use Giant Snapshots

Avoid snapshots of complete component trees.

### Avoid Weak Assertions

Incorrect:

```tsx
expect(button).toBeDefined();
```

Correct:

```tsx
expect(button).toBeInTheDocument();
```

## Recommended Test Order

1. Arrange
2. Act
3. Assert

Example:

```tsx
it("should call onClose when close button is clicked", async () => {
  // Arrange
  const onClose = jest.fn();
  const user = userEvent.setup();

  render(<Modal onClose={onClose} />);

  // Act
  await user.click(screen.getByRole("button", { name: /close/i }));

  // Assert
  expect(onClose).toHaveBeenCalledTimes(1);
});
```

## Final Goal

Tests should be:

- clear
- maintainable
- deterministic
- fast
- resistant to internal refactors
- focused on observable behavior
