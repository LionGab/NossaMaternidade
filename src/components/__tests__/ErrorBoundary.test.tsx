/**
 * ErrorBoundary Component Tests
 *
 * Tests for the ErrorBoundary class component:
 * - Module exports
 * - Static methods
 * - Class structure
 *
 * Note: Full rendering tests require additional setup for nativewind/css-interop.
 *
 * @module components/__tests__/ErrorBoundary.test
 */

import { ErrorBoundary } from "../ErrorBoundary";

describe("ErrorBoundary", () => {
  describe("module exports", () => {
    it("exports ErrorBoundary class component", () => {
      expect(ErrorBoundary).toBeDefined();
      // Class components extend React.Component
      expect(ErrorBoundary.prototype).toBeInstanceOf(Object);
    });

    it("is a React component class", () => {
      // ErrorBoundary should be a class that has React Component methods
      expect(ErrorBoundary.prototype.render).toBeDefined();
      expect(typeof ErrorBoundary.prototype.render).toBe("function");
    });

    it("has componentDidCatch method", () => {
      expect(ErrorBoundary.prototype.componentDidCatch).toBeDefined();
      expect(typeof ErrorBoundary.prototype.componentDidCatch).toBe("function");
    });

    it("has getDerivedStateFromError static method", () => {
      expect(ErrorBoundary.getDerivedStateFromError).toBeDefined();
      expect(typeof ErrorBoundary.getDerivedStateFromError).toBe("function");
    });
  });

  describe("getDerivedStateFromError", () => {
    it("should return state with hasError true and the error", () => {
      const testError = new Error("Test error message");
      const state = ErrorBoundary.getDerivedStateFromError(testError);

      expect(state).toEqual({
        hasError: true,
        error: testError,
      });
    });

    it("should preserve error message", () => {
      const errorMessage = "Custom error message for testing";
      const testError = new Error(errorMessage);
      const state = ErrorBoundary.getDerivedStateFromError(testError);

      expect(state.error?.message).toBe(errorMessage);
    });

    it("should handle different error types", () => {
      const typeError = new TypeError("Type error");
      const state = ErrorBoundary.getDerivedStateFromError(typeError);

      expect(state.hasError).toBe(true);
      expect(state.error).toBeInstanceOf(TypeError);
    });
  });

  describe("instance methods", () => {
    it("should have handleReset method", () => {
      // Create instance to test method binding
      const instance = new ErrorBoundary({ children: null });
      expect(instance.handleReset).toBeDefined();
      expect(typeof instance.handleReset).toBe("function");
    });

    it("handleReset should reset error state", () => {
      const instance = new ErrorBoundary({ children: null });

      // Set error state
      instance.state = {
        hasError: true,
        error: new Error("Test"),
        errorInfo: null,
      };

      // Mock setState
      const setStateMock = jest.fn();
      instance.setState = setStateMock;

      // Call handleReset
      instance.handleReset();

      // Verify state was reset
      expect(setStateMock).toHaveBeenCalledWith({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const instance = new ErrorBoundary({ children: null });

      expect(instance.state).toEqual({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    });
  });

  describe("props handling", () => {
    it("should accept children prop", () => {
      const instance = new ErrorBoundary({ children: "test" });
      expect(instance.props.children).toBe("test");
    });

    it("should accept fallback prop", () => {
      const fallback = "Custom fallback";
      const instance = new ErrorBoundary({ children: null, fallback });
      expect(instance.props.fallback).toBe(fallback);
    });
  });
});
