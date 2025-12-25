/**
 * ScreenErrorBoundary Component Tests
 *
 * Tests for the ScreenErrorBoundary class component:
 * - Module exports
 * - Static methods
 * - Class structure
 * - Navigation integration
 *
 * Note: Full rendering tests require additional setup for nativewind/css-interop.
 *
 * @module components/__tests__/ScreenErrorBoundary.test
 */

import { ScreenErrorBoundary } from "../ScreenErrorBoundary";

describe("ScreenErrorBoundary", () => {
  describe("module exports", () => {
    it("exports ScreenErrorBoundary class component", () => {
      expect(ScreenErrorBoundary).toBeDefined();
      expect(ScreenErrorBoundary.prototype).toBeInstanceOf(Object);
    });

    it("is a React component class", () => {
      expect(ScreenErrorBoundary.prototype.render).toBeDefined();
      expect(typeof ScreenErrorBoundary.prototype.render).toBe("function");
    });

    it("has componentDidCatch method", () => {
      expect(ScreenErrorBoundary.prototype.componentDidCatch).toBeDefined();
      expect(typeof ScreenErrorBoundary.prototype.componentDidCatch).toBe("function");
    });

    it("has getDerivedStateFromError static method", () => {
      expect(ScreenErrorBoundary.getDerivedStateFromError).toBeDefined();
      expect(typeof ScreenErrorBoundary.getDerivedStateFromError).toBe("function");
    });
  });

  describe("getDerivedStateFromError", () => {
    it("should return state with hasError true and the error", () => {
      const testError = new Error("Screen test error");
      const state = ScreenErrorBoundary.getDerivedStateFromError(testError);

      expect(state).toEqual({
        hasError: true,
        error: testError,
      });
    });

    it("should preserve error message", () => {
      const errorMessage = "NathIA screen crashed";
      const testError = new Error(errorMessage);
      const state = ScreenErrorBoundary.getDerivedStateFromError(testError);

      expect(state.error?.message).toBe(errorMessage);
    });
  });

  describe("instance methods", () => {
    it("should have handleReset method", () => {
      const instance = new ScreenErrorBoundary({ children: null, screenName: "TestScreen" });
      expect(instance.handleReset).toBeDefined();
      expect(typeof instance.handleReset).toBe("function");
    });

    it("should have handleGoHome method", () => {
      const instance = new ScreenErrorBoundary({ children: null, screenName: "TestScreen" });
      expect(instance.handleGoHome).toBeDefined();
      expect(typeof instance.handleGoHome).toBe("function");
    });

    it("handleReset should reset error state", () => {
      const instance = new ScreenErrorBoundary({ children: null, screenName: "TestScreen" });

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

    it("handleGoHome should call navigation dispatch when navigation provided", () => {
      const mockNavigation = {
        dispatch: jest.fn(),
      };

      const instance = new ScreenErrorBoundary({
        children: null,
        screenName: "TestScreen",
        navigation: mockNavigation as never,
      });

      // Set error state
      instance.state = {
        hasError: true,
        error: new Error("Test"),
        errorInfo: null,
      };

      // Mock setState
      instance.setState = jest.fn();

      // Call handleGoHome
      instance.handleGoHome();

      // Verify navigation was called
      expect(mockNavigation.dispatch).toHaveBeenCalled();
    });

    it("handleGoHome should not crash when navigation not provided", () => {
      const instance = new ScreenErrorBoundary({
        children: null,
        screenName: "TestScreen",
      });

      // Should not throw
      expect(() => instance.handleGoHome()).not.toThrow();
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const instance = new ScreenErrorBoundary({ children: null, screenName: "Home" });

      expect(instance.state).toEqual({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    });
  });

  describe("props handling", () => {
    it("should accept children prop", () => {
      const instance = new ScreenErrorBoundary({
        children: "test",
        screenName: "TestScreen",
      });
      expect(instance.props.children).toBe("test");
    });

    it("should require screenName prop", () => {
      const screenName = "Comunidade";
      const instance = new ScreenErrorBoundary({
        children: null,
        screenName,
      });
      expect(instance.props.screenName).toBe(screenName);
    });

    it("should accept optional navigation prop", () => {
      const mockNavigation = { dispatch: jest.fn() };
      const instance = new ScreenErrorBoundary({
        children: null,
        screenName: "TestScreen",
        navigation: mockNavigation as never,
      });
      expect(instance.props.navigation).toBe(mockNavigation);
    });

    it("should work without navigation prop", () => {
      const instance = new ScreenErrorBoundary({
        children: null,
        screenName: "TestScreen",
      });
      expect(instance.props.navigation).toBeUndefined();
    });
  });

  describe("screen name variations", () => {
    const screenNames = [
      "Home",
      "NathIA",
      "Ciclo",
      "Comunidade",
      "Meus Cuidados",
      "Perfil",
      "PostDetail",
    ];

    screenNames.forEach((screenName) => {
      it(`should accept screenName: ${screenName}`, () => {
        const instance = new ScreenErrorBoundary({
          children: null,
          screenName,
        });
        expect(instance.props.screenName).toBe(screenName);
      });
    });
  });
});
