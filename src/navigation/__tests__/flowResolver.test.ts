/**
 * Tests for Navigation Flow Resolver
 *
 * Ensures deterministic navigation decisions based on flow state.
 *
 * @module navigation/__tests__/flowResolver.test
 */

import {
  resolveNavigationStage,
  resolveNavigationFlags,
  isFullyOnboarded,
  getNextOnboardingStep,
  getOnboardingProgress,
  describeFlowState,
  FlowState,
  NavigationStage,
} from "../flowResolver";

describe("flowResolver", () => {
  // Helper to create complete flow state
  const createFlowState = (overrides: Partial<FlowState> = {}): FlowState => ({
    isAuthenticated: false,
    notificationSetupDone: false,
    isNathJourneyOnboardingComplete: false,
    isOnboardingComplete: false,
    isNathIAOnboardingComplete: false,
    ...overrides,
  });

  describe("resolveNavigationStage", () => {
    describe("dev bypass", () => {
      it("should return MainApp when devBypass is true regardless of state", () => {
        const state = createFlowState(); // All false
        expect(resolveNavigationStage(state, true)).toBe("MainApp");
      });
    });

    describe("normal flow", () => {
      it("should return Login when not authenticated", () => {
        const state = createFlowState();
        expect(resolveNavigationStage(state)).toBe("Login");
      });

      it("should return NotificationPermission when authenticated but notifications not setup", () => {
        const state = createFlowState({
          isAuthenticated: true,
          notificationSetupDone: false,
        });
        expect(resolveNavigationStage(state)).toBe("NotificationPermission");
      });

      it("should return NathJourneyOnboarding after notifications setup", () => {
        const state = createFlowState({
          isAuthenticated: true,
          notificationSetupDone: true,
          isNathJourneyOnboardingComplete: false,
        });
        expect(resolveNavigationStage(state)).toBe("NathJourneyOnboarding");
      });

      it("should return Onboarding after Nath Journey", () => {
        const state = createFlowState({
          isAuthenticated: true,
          notificationSetupDone: true,
          isNathJourneyOnboardingComplete: true,
          isOnboardingComplete: false,
        });
        expect(resolveNavigationStage(state)).toBe("Onboarding");
      });

      it("should return NathIAOnboarding after legacy onboarding", () => {
        const state = createFlowState({
          isAuthenticated: true,
          notificationSetupDone: true,
          isNathJourneyOnboardingComplete: true,
          isOnboardingComplete: true,
          isNathIAOnboardingComplete: false,
        });
        expect(resolveNavigationStage(state)).toBe("NathIAOnboarding");
      });

      it("should return MainApp when fully onboarded", () => {
        const state = createFlowState({
          isAuthenticated: true,
          notificationSetupDone: true,
          isNathJourneyOnboardingComplete: true,
          isOnboardingComplete: true,
          isNathIAOnboardingComplete: true,
        });
        expect(resolveNavigationStage(state)).toBe("MainApp");
      });
    });

    describe("edge cases", () => {
      it("should prioritize earlier stages over later ones", () => {
        // If authenticated but notifications not done, should show NotificationPermission
        // even if other onboarding steps are somehow marked complete
        const state = createFlowState({
          isAuthenticated: true,
          notificationSetupDone: false,
          isNathJourneyOnboardingComplete: true, // Shouldn't matter
          isOnboardingComplete: true, // Shouldn't matter
          isNathIAOnboardingComplete: true, // Shouldn't matter
        });
        expect(resolveNavigationStage(state)).toBe("NotificationPermission");
      });
    });
  });

  describe("resolveNavigationFlags", () => {
    it("should return correct flags for Login stage", () => {
      const state = createFlowState();
      const flags = resolveNavigationFlags(state);

      expect(flags.shouldShowLogin).toBe(true);
      expect(flags.shouldShowNotificationPermission).toBe(false);
      expect(flags.shouldShowNathJourneyOnboarding).toBe(false);
      expect(flags.shouldShowOnboarding).toBe(false);
      expect(flags.shouldShowNathIAOnboarding).toBe(false);
      expect(flags.shouldShowMainApp).toBe(false);
    });

    it("should return correct flags for MainApp stage", () => {
      const state = createFlowState({
        isAuthenticated: true,
        notificationSetupDone: true,
        isNathJourneyOnboardingComplete: true,
        isOnboardingComplete: true,
        isNathIAOnboardingComplete: true,
      });
      const flags = resolveNavigationFlags(state);

      expect(flags.shouldShowLogin).toBe(false);
      expect(flags.shouldShowNotificationPermission).toBe(false);
      expect(flags.shouldShowNathJourneyOnboarding).toBe(false);
      expect(flags.shouldShowOnboarding).toBe(false);
      expect(flags.shouldShowNathIAOnboarding).toBe(false);
      expect(flags.shouldShowMainApp).toBe(true);
    });

    it("should respect devBypass", () => {
      const state = createFlowState(); // All false
      const flags = resolveNavigationFlags(state, true);

      expect(flags.shouldShowMainApp).toBe(true);
      expect(flags.shouldShowLogin).toBe(false);
    });
  });

  describe("isFullyOnboarded", () => {
    it("should return false when not authenticated", () => {
      const state = createFlowState({
        isAuthenticated: false,
        notificationSetupDone: true,
        isNathJourneyOnboardingComplete: true,
        isOnboardingComplete: true,
        isNathIAOnboardingComplete: true,
      });
      expect(isFullyOnboarded(state)).toBe(false);
    });

    it("should return false when any onboarding step is incomplete", () => {
      const state = createFlowState({
        isAuthenticated: true,
        notificationSetupDone: true,
        isNathJourneyOnboardingComplete: true,
        isOnboardingComplete: false, // Missing this one
        isNathIAOnboardingComplete: true,
      });
      expect(isFullyOnboarded(state)).toBe(false);
    });

    it("should return true when all steps are complete", () => {
      const state = createFlowState({
        isAuthenticated: true,
        notificationSetupDone: true,
        isNathJourneyOnboardingComplete: true,
        isOnboardingComplete: true,
        isNathIAOnboardingComplete: true,
      });
      expect(isFullyOnboarded(state)).toBe(true);
    });
  });

  describe("getNextOnboardingStep", () => {
    it("should return Login when not authenticated", () => {
      const state = createFlowState();
      expect(getNextOnboardingStep(state)).toBe("Login");
    });

    it("should return null when fully onboarded", () => {
      const state = createFlowState({
        isAuthenticated: true,
        notificationSetupDone: true,
        isNathJourneyOnboardingComplete: true,
        isOnboardingComplete: true,
        isNathIAOnboardingComplete: true,
      });
      expect(getNextOnboardingStep(state)).toBeNull();
    });

    it("should return correct next step in sequence", () => {
      expect(
        getNextOnboardingStep(
          createFlowState({
            isAuthenticated: true,
            notificationSetupDone: true,
            isNathJourneyOnboardingComplete: true,
          })
        )
      ).toBe("Onboarding");
    });
  });

  describe("getOnboardingProgress", () => {
    it("should return 0 when not authenticated", () => {
      const state = createFlowState();
      expect(getOnboardingProgress(state)).toBe(0);
    });

    it("should return 20 when only authenticated", () => {
      const state = createFlowState({
        isAuthenticated: true,
      });
      expect(getOnboardingProgress(state)).toBe(20);
    });

    it("should return 100 when fully onboarded", () => {
      const state = createFlowState({
        isAuthenticated: true,
        notificationSetupDone: true,
        isNathJourneyOnboardingComplete: true,
        isOnboardingComplete: true,
        isNathIAOnboardingComplete: true,
      });
      expect(getOnboardingProgress(state)).toBe(100);
    });

    it("should return intermediate values for partial progress", () => {
      const state = createFlowState({
        isAuthenticated: true,
        notificationSetupDone: true,
        isNathJourneyOnboardingComplete: true,
        isOnboardingComplete: false,
        isNathIAOnboardingComplete: false,
      });
      // 20 (auth) + (2/4 * 80) = 20 + 40 = 60
      expect(getOnboardingProgress(state)).toBe(60);
    });
  });

  describe("describeFlowState", () => {
    it("should return human-readable description", () => {
      const state = createFlowState({
        isAuthenticated: true,
        notificationSetupDone: false,
      });
      const description = describeFlowState(state);

      expect(description).toContain("auth:yes");
      expect(description).toContain("notif:pending");
    });
  });

  describe("all possible stage combinations", () => {
    // Comprehensive test covering all valid stage transitions
    const stages: {
      state: Partial<FlowState>;
      expected: NavigationStage;
    }[] = [
      { state: {}, expected: "Login" },
      { state: { isAuthenticated: true }, expected: "NotificationPermission" },
      {
        state: { isAuthenticated: true, notificationSetupDone: true },
        expected: "NathJourneyOnboarding",
      },
      {
        state: {
          isAuthenticated: true,
          notificationSetupDone: true,
          isNathJourneyOnboardingComplete: true,
        },
        expected: "Onboarding",
      },
      {
        state: {
          isAuthenticated: true,
          notificationSetupDone: true,
          isNathJourneyOnboardingComplete: true,
          isOnboardingComplete: true,
        },
        expected: "NathIAOnboarding",
      },
      {
        state: {
          isAuthenticated: true,
          notificationSetupDone: true,
          isNathJourneyOnboardingComplete: true,
          isOnboardingComplete: true,
          isNathIAOnboardingComplete: true,
        },
        expected: "MainApp",
      },
    ];

    stages.forEach(({ state, expected }) => {
      it(`should return ${expected} for state: ${JSON.stringify(state)}`, () => {
        expect(resolveNavigationStage(createFlowState(state))).toBe(expected);
      });
    });
  });
});
