/**
 * Tests for formatters utility
 *
 * Covers: formatTimeAgo, formatCompactNumber, truncateText
 */

import { formatTimeAgo, formatCompactNumber, truncateText } from "./formatters";

describe("formatters", () => {
  describe("formatTimeAgo", () => {
    // Helper to create date strings relative to now
    const createDateAgo = (
      amount: number,
      unit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months"
    ): string => {
      const now = Date.now();
      const multipliers = {
        seconds: 1000,
        minutes: 60 * 1000,
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
        weeks: 7 * 24 * 60 * 60 * 1000,
        months: 30 * 24 * 60 * 60 * 1000,
      };
      return new Date(now - amount * multipliers[unit]).toISOString();
    };

    describe("seconds range", () => {
      it("should return 'agora' for 0 seconds ago", () => {
        const date = createDateAgo(0, "seconds");
        expect(formatTimeAgo(date)).toBe("agora");
      });

      it("should return 'agora' for 30 seconds ago", () => {
        const date = createDateAgo(30, "seconds");
        expect(formatTimeAgo(date)).toBe("agora");
      });

      it("should return 'agora' for 59 seconds ago", () => {
        const date = createDateAgo(59, "seconds");
        expect(formatTimeAgo(date)).toBe("agora");
      });
    });

    describe("minutes range", () => {
      it("should return 'há 1 min' for 1 minute ago", () => {
        const date = createDateAgo(1, "minutes");
        expect(formatTimeAgo(date)).toBe("há 1 min");
      });

      it("should return 'há 2 min' for 2 minutes ago", () => {
        const date = createDateAgo(2, "minutes");
        expect(formatTimeAgo(date)).toBe("há 2 min");
      });

      it("should return 'há 30 min' for 30 minutes ago", () => {
        const date = createDateAgo(30, "minutes");
        expect(formatTimeAgo(date)).toBe("há 30 min");
      });

      it("should return 'há 59 min' for 59 minutes ago", () => {
        const date = createDateAgo(59, "minutes");
        expect(formatTimeAgo(date)).toBe("há 59 min");
      });
    });

    describe("hours range", () => {
      it("should return 'há 1h' for 1 hour ago", () => {
        const date = createDateAgo(1, "hours");
        expect(formatTimeAgo(date)).toBe("há 1h");
      });

      it("should return 'há 2h' for 2 hours ago", () => {
        const date = createDateAgo(2, "hours");
        expect(formatTimeAgo(date)).toBe("há 2h");
      });

      it("should return 'há 12h' for 12 hours ago", () => {
        const date = createDateAgo(12, "hours");
        expect(formatTimeAgo(date)).toBe("há 12h");
      });

      it("should return 'há 23h' for 23 hours ago", () => {
        const date = createDateAgo(23, "hours");
        expect(formatTimeAgo(date)).toBe("há 23h");
      });
    });

    describe("days range", () => {
      it("should return 'há 1 dia' for 1 day ago", () => {
        const date = createDateAgo(1, "days");
        expect(formatTimeAgo(date)).toBe("há 1 dia");
      });

      it("should return 'há 2 dias' for 2 days ago", () => {
        const date = createDateAgo(2, "days");
        expect(formatTimeAgo(date)).toBe("há 2 dias");
      });

      it("should return 'há 6 dias' for 6 days ago", () => {
        const date = createDateAgo(6, "days");
        expect(formatTimeAgo(date)).toBe("há 6 dias");
      });
    });

    describe("weeks range", () => {
      it("should return 'há 1 semana' for 1 week ago", () => {
        const date = createDateAgo(1, "weeks");
        expect(formatTimeAgo(date)).toBe("há 1 semana");
      });

      it("should return 'há 2 semanas' for 2 weeks ago", () => {
        const date = createDateAgo(2, "weeks");
        expect(formatTimeAgo(date)).toBe("há 2 semanas");
      });

      it("should return 'há 3 semanas' for 3 weeks ago", () => {
        const date = createDateAgo(3, "weeks");
        expect(formatTimeAgo(date)).toBe("há 3 semanas");
      });
    });

    describe("months range", () => {
      it("should return 'há 1 mês' for 1 month ago", () => {
        const date = createDateAgo(1, "months");
        expect(formatTimeAgo(date)).toBe("há 1 mês");
      });

      it("should return 'há 2 meses' for 2 months ago", () => {
        const date = createDateAgo(2, "months");
        expect(formatTimeAgo(date)).toBe("há 2 meses");
      });

      it("should return 'há 6 meses' for 6 months ago", () => {
        const date = createDateAgo(6, "months");
        expect(formatTimeAgo(date)).toBe("há 6 meses");
      });

      it("should return 'há 12 meses' for 12 months ago", () => {
        const date = createDateAgo(12, "months");
        expect(formatTimeAgo(date)).toBe("há 12 meses");
      });
    });

    describe("edge cases", () => {
      it("should handle ISO date strings", () => {
        const date = createDateAgo(5, "minutes");
        expect(formatTimeAgo(date)).toBe("há 5 min");
      });

      it("should handle dates at exact boundaries", () => {
        // 60 seconds = 1 minute exactly
        const date = createDateAgo(60, "seconds");
        expect(formatTimeAgo(date)).toBe("há 1 min");
      });
    });
  });

  describe("formatCompactNumber", () => {
    describe("numbers below 1000", () => {
      it("should return '0' for 0", () => {
        expect(formatCompactNumber(0)).toBe("0");
      });

      it("should return '1' for 1", () => {
        expect(formatCompactNumber(1)).toBe("1");
      });

      it("should return '999' for 999", () => {
        expect(formatCompactNumber(999)).toBe("999");
      });

      it("should return '500' for 500", () => {
        expect(formatCompactNumber(500)).toBe("500");
      });
    });

    describe("thousands (k)", () => {
      it("should return '1k' for 1000", () => {
        expect(formatCompactNumber(1000)).toBe("1k");
      });

      it("should return '1.5k' for 1500", () => {
        expect(formatCompactNumber(1500)).toBe("1.5k");
      });

      it("should return '10k' for 10000", () => {
        expect(formatCompactNumber(10000)).toBe("10k");
      });

      it("should return '10.5k' for 10500", () => {
        expect(formatCompactNumber(10500)).toBe("10.5k");
      });

      it("should return '100k' for 100000", () => {
        expect(formatCompactNumber(100000)).toBe("100k");
      });

      it("should return '999k' for 999000", () => {
        expect(formatCompactNumber(999000)).toBe("999k");
      });

      it("should remove trailing .0 for 2000 (2k not 2.0k)", () => {
        expect(formatCompactNumber(2000)).toBe("2k");
      });

      it("should show decimal for 1234 (1.2k)", () => {
        expect(formatCompactNumber(1234)).toBe("1.2k");
      });
    });

    describe("millions (M)", () => {
      it("should return '1M' for 1000000", () => {
        expect(formatCompactNumber(1000000)).toBe("1M");
      });

      it("should return '1.5M' for 1500000", () => {
        expect(formatCompactNumber(1500000)).toBe("1.5M");
      });

      it("should return '10M' for 10000000", () => {
        expect(formatCompactNumber(10000000)).toBe("10M");
      });

      it("should return '100M' for 100000000", () => {
        expect(formatCompactNumber(100000000)).toBe("100M");
      });

      it("should remove trailing .0 for 5000000 (5M not 5.0M)", () => {
        expect(formatCompactNumber(5000000)).toBe("5M");
      });

      it("should show decimal for 1234567 (1.2M)", () => {
        expect(formatCompactNumber(1234567)).toBe("1.2M");
      });
    });

    describe("edge cases", () => {
      it("should handle boundary between numbers and k (999 vs 1000)", () => {
        expect(formatCompactNumber(999)).toBe("999");
        expect(formatCompactNumber(1000)).toBe("1k");
      });

      it("should handle boundary between k and M (999999 vs 1000000)", () => {
        expect(formatCompactNumber(999999)).toBe("1000k");
        expect(formatCompactNumber(1000000)).toBe("1M");
      });

      it("should handle very large numbers", () => {
        expect(formatCompactNumber(999000000)).toBe("999M");
      });
    });
  });

  describe("truncateText", () => {
    describe("text shorter than maxLength", () => {
      it("should return text as-is when shorter than maxLength", () => {
        expect(truncateText("Hello", 10)).toBe("Hello");
      });

      it("should return text as-is when exactly maxLength", () => {
        expect(truncateText("Hello", 5)).toBe("Hello");
      });

      it("should return empty string when text is empty", () => {
        expect(truncateText("", 10)).toBe("");
      });
    });

    describe("text longer than maxLength", () => {
      it("should truncate and add ellipsis", () => {
        expect(truncateText("Hello World", 5)).toBe("Hello...");
      });

      it("should truncate longer text correctly", () => {
        expect(truncateText("This is a very long text that needs truncation", 20)).toBe(
          "This is a very long..."
        );
      });

      it("should handle maxLength of 1", () => {
        expect(truncateText("Hello", 1)).toBe("H...");
      });

      it("should trim trailing whitespace before adding ellipsis", () => {
        expect(truncateText("Hello World", 6)).toBe("Hello...");
      });
    });

    describe("edge cases", () => {
      it("should handle maxLength of 0", () => {
        expect(truncateText("Hello", 0)).toBe("...");
      });

      it("should handle single character text", () => {
        expect(truncateText("H", 1)).toBe("H");
      });

      it("should handle text with only spaces", () => {
        expect(truncateText("     ", 3)).toBe("...");
      });

      it("should handle unicode characters", () => {
        expect(truncateText("Olá Mundo", 4)).toBe("Olá...");
      });

      it("should handle text containing emojis", () => {
        // Note: JavaScript's slice() splits surrogate pairs (emojis are 2 chars)
        // This test documents current behavior - emojis may be split
        const text = "Hello 👋 World";
        const result = truncateText(text, 8);
        // 8 chars includes full emoji (6 + 2 for surrogate pair)
        expect(result).toBe("Hello 👋...");
      });

      it("should preserve text with special characters", () => {
        expect(truncateText("Test@#$%", 4)).toBe("Test...");
      });

      it("should handle newlines in text", () => {
        expect(truncateText("Hello\nWorld", 5)).toBe("Hello...");
      });

      it("should handle tabs in text", () => {
        expect(truncateText("Hello\tWorld", 5)).toBe("Hello...");
      });
    });

    describe("realistic scenarios", () => {
      it("should truncate post preview correctly", () => {
        const postContent =
          "Hoje foi um dia incrível! Consegui fazer todas as atividades que planejei para a minha rotina de autocuidado.";
        expect(truncateText(postContent, 50)).toBe(
          "Hoje foi um dia incrível! Consegui fazer todas as..."
        );
      });

      it("should truncate username correctly", () => {
        const longUsername = "maria_helena_santos_oliveira";
        expect(truncateText(longUsername, 15)).toBe("maria_helena_sa...");
      });

      it("should handle Portuguese text with accents", () => {
        const text = "Amamentação é um momento especial de conexão";
        expect(truncateText(text, 15)).toBe("Amamentação é u...");
      });
    });
  });
});
