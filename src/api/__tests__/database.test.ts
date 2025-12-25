/**
 * Database API Service Tests
 *
 * Comprehensive tests for database CRUD operations:
 * - User profile operations
 * - Post operations
 * - Comment operations
 * - Like operations
 * - Habit operations
 *
 * @module api/__tests__/database.test
 */

import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  createPost,
  getPosts,
  getPost,
  deletePost,
  createComment,
  getPostComments,
  likePost,
  unlikePost,
  checkIfUserLikedPost,
  createHabit,
  getUserHabits,
  updateHabit,
  deleteHabit,
  completeHabit,
  uncompleteHabit,
  getHabitCompletions,
} from "../database";

// Mock RPC function
const mockRpc = jest.fn();

jest.mock("../supabase", () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
  Database: {},
  UserInsert: {},
  UserUpdate: {},
  PostInsert: {},
  CommentInsert: {},
  HabitInsert: {},
  HabitUpdate: {},
}));

jest.mock("../../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// Get the mocked supabase
const { supabase } = jest.requireMock("../supabase") as {
  supabase: { from: jest.Mock; rpc: jest.Mock };
};

describe("Database API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    supabase.rpc = mockRpc;
  });

  // ============================================
  // USER OPERATIONS
  // ============================================

  describe("User Operations", () => {
    describe("createUserProfile", () => {
      it("should create a user profile successfully", async () => {
        const mockUser = {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          stage: "pregnant",
          age: 28,
          location: "São Paulo",
          communication_preference: "email",
        };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await createUserProfile({
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          stage: "pregnant",
          age: 28,
          location: "São Paulo",
          communication_preference: "email",
        });

        expect(result.data).toEqual(mockUser);
        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith("users");
      });

      it("should return error on duplicate user", async () => {
        const mockError = { code: "23505", message: "Duplicate key" };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await createUserProfile({
          id: "user-123",
          email: "existing@example.com",
          name: "Test User",
          stage: "pregnant",
          age: 28,
          location: "São Paulo",
          communication_preference: "email",
        });

        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
      });
    });

    describe("getUserProfile", () => {
      it("should get a user profile by id", async () => {
        const mockUser = {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
        };

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getUserProfile("user-123");

        expect(result.data).toEqual(mockUser);
        expect(result.error).toBeNull();
        expect(mockBuilder.eq).toHaveBeenCalledWith("id", "user-123");
      });

      it("should return null for non-existent user", async () => {
        const mockError = { code: "PGRST116", message: "No rows found" };

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getUserProfile("unknown-user");

        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
      });
    });

    describe("updateUserProfile", () => {
      it("should update a user profile", async () => {
        const mockUpdatedUser = {
          id: "user-123",
          email: "test@example.com",
          name: "Updated Name",
        };

        const mockBuilder = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockUpdatedUser, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await updateUserProfile("user-123", { name: "Updated Name" });

        expect(result.data).toEqual(mockUpdatedUser);
        expect(result.error).toBeNull();
        expect(mockBuilder.update).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Updated Name",
            updated_at: expect.any(String),
          })
        );
      });

      it("should return error on update failure", async () => {
        const mockError = { code: "42501", message: "Permission denied" };

        const mockBuilder = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await updateUserProfile("user-123", { name: "New Name" });

        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
      });
    });
  });

  // ============================================
  // POST OPERATIONS
  // ============================================

  describe("Post Operations", () => {
    describe("createPost", () => {
      it("should create a post successfully", async () => {
        const mockPost = {
          id: "post-123",
          user_id: "user-123",
          author_name: "Test User",
          content: "Test post content",
          category: "general",
        };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockPost, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await createPost({
          user_id: "user-123",
          author_name: "Test User",
          content: "Test post content",
          category: "general",
        });

        expect(result.data).toEqual(mockPost);
        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith("posts");
      });

      it("should return error on post creation failure", async () => {
        const mockError = { code: "23503", message: "Foreign key violation" };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await createPost({
          user_id: "invalid-user",
          author_name: "Test User",
          content: "Test",
          category: "general",
        });

        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
      });
    });

    describe("getPosts", () => {
      it("should get all posts ordered by date", async () => {
        const mockPosts = [
          { id: "post-1", content: "First post", created_at: "2024-01-02" },
          { id: "post-2", content: "Second post", created_at: "2024-01-01" },
        ];

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
        };
        // Make order return the final result when no category filter
        mockBuilder.order = jest.fn().mockResolvedValue({ data: mockPosts, error: null });
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getPosts();

        expect(result.data).toEqual(mockPosts);
        expect(result.error).toBeNull();
        expect(mockBuilder.order).toHaveBeenCalledWith("created_at", { ascending: false });
      });

      it("should filter posts by category", async () => {
        const mockPosts = [
          { id: "post-1", content: "Health post", category: "health" },
        ];

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getPosts("health");

        expect(result.data).toEqual(mockPosts);
        expect(mockBuilder.eq).toHaveBeenCalledWith("category", "health");
      });

      it("should get all posts when category is 'all'", async () => {
        const mockPosts = [
          { id: "post-1", content: "Post 1" },
          { id: "post-2", content: "Post 2" },
        ];

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
          eq: jest.fn().mockResolvedValue({ data: mockPosts, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getPosts("all");

        expect(result.data).toEqual(mockPosts);
        expect(mockBuilder.eq).not.toHaveBeenCalled();
      });
    });

    describe("getPost", () => {
      it("should get a single post by id", async () => {
        const mockPost = { id: "post-123", content: "Test post" };

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockPost, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getPost("post-123");

        expect(result.data).toEqual(mockPost);
        expect(result.error).toBeNull();
        expect(mockBuilder.eq).toHaveBeenCalledWith("id", "post-123");
      });
    });

    describe("deletePost", () => {
      it("should delete a post successfully", async () => {
        const mockBuilder = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await deletePost("post-123");

        expect(result.error).toBeNull();
        expect(mockBuilder.eq).toHaveBeenCalledWith("id", "post-123");
      });

      it("should return error on delete failure", async () => {
        const mockError = { code: "42501", message: "Permission denied" };

        const mockBuilder = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: mockError }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await deletePost("post-123");

        expect(result.error).toEqual(mockError);
      });
    });
  });

  // ============================================
  // COMMENT OPERATIONS
  // ============================================

  describe("Comment Operations", () => {
    describe("createComment", () => {
      it("should create a comment and increment count", async () => {
        const mockComment = {
          id: "comment-123",
          post_id: "post-123",
          user_id: "user-123",
          author_name: "Test User",
          content: "Great post!",
        };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockComment, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);
        mockRpc.mockResolvedValue({ error: null });

        const result = await createComment({
          post_id: "post-123",
          user_id: "user-123",
          author_name: "Test User",
          content: "Great post!",
        });

        expect(result.data).toEqual(mockComment);
        expect(result.error).toBeNull();
        expect(mockRpc).toHaveBeenCalledWith("increment_comments_count", {
          post_id: "post-123",
        });
      });
    });

    describe("getPostComments", () => {
      it("should get all comments for a post", async () => {
        const mockComments = [
          { id: "c1", content: "First", created_at: "2024-01-01" },
          { id: "c2", content: "Second", created_at: "2024-01-02" },
        ];

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: mockComments, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getPostComments("post-123");

        expect(result.data).toEqual(mockComments);
        expect(result.error).toBeNull();
        expect(mockBuilder.order).toHaveBeenCalledWith("created_at", { ascending: true });
      });
    });
  });

  // ============================================
  // LIKE OPERATIONS
  // ============================================

  describe("Like Operations", () => {
    describe("likePost", () => {
      it("should like a post and increment count", async () => {
        const mockLike = {
          id: "like-123",
          user_id: "user-123",
          post_id: "post-123",
        };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLike, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);
        mockRpc.mockResolvedValue({ error: null });

        const result = await likePost("user-123", "post-123");

        expect(result.data).toEqual(mockLike);
        expect(result.error).toBeNull();
        expect(mockRpc).toHaveBeenCalledWith("increment_likes_count", {
          post_id: "post-123",
        });
      });

      it("should return error on duplicate like", async () => {
        const mockError = { code: "23505", message: "Duplicate key" };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await likePost("user-123", "post-123");

        expect(result.data).toBeNull();
        expect(result.error).toEqual(mockError);
      });
    });

    describe("unlikePost", () => {
      it("should unlike a post and decrement count", async () => {
        const mockBuilder = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
        };
        // Chain eq twice
        mockBuilder.eq.mockReturnValueOnce(mockBuilder).mockResolvedValueOnce({ error: null });
        supabase.from.mockReturnValue(mockBuilder);
        mockRpc.mockResolvedValue({ error: null });

        const result = await unlikePost("user-123", "post-123");

        expect(result.error).toBeNull();
        expect(mockRpc).toHaveBeenCalledWith("decrement_likes_count", {
          post_id: "post-123",
        });
      });
    });

    describe("checkIfUserLikedPost", () => {
      it("should return true when user has liked the post", async () => {
        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: { id: "like-123" }, error: null }),
        };
        mockBuilder.eq.mockReturnValue(mockBuilder);
        supabase.from.mockReturnValue(mockBuilder);

        const result = await checkIfUserLikedPost("user-123", "post-123");

        expect(result.liked).toBe(true);
        expect(result.error).toBeNull();
      });

      it("should return false when user has not liked the post", async () => {
        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { code: "PGRST116", message: "No rows found" },
          }),
        };
        mockBuilder.eq.mockReturnValue(mockBuilder);
        supabase.from.mockReturnValue(mockBuilder);

        const result = await checkIfUserLikedPost("user-123", "post-123");

        expect(result.liked).toBe(false);
        expect(result.error).toBeNull();
      });

      it("should return error on other failures", async () => {
        const mockError = { code: "42501", message: "Permission denied" };

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
        };
        mockBuilder.eq.mockReturnValue(mockBuilder);
        supabase.from.mockReturnValue(mockBuilder);

        const result = await checkIfUserLikedPost("user-123", "post-123");

        expect(result.liked).toBe(false);
        expect(result.error).toEqual(mockError);
      });
    });
  });

  // ============================================
  // HABIT OPERATIONS
  // ============================================

  describe("Habit Operations", () => {
    describe("createHabit", () => {
      it("should create a habit successfully", async () => {
        const mockHabit = {
          id: "habit-123",
          user_id: "user-123",
          title: "Drink water",
          emoji: "💧",
        };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockHabit, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await createHabit({
          user_id: "user-123",
          title: "Drink water",
          emoji: "💧",
        });

        expect(result.data).toEqual(mockHabit);
        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith("habits");
      });
    });

    describe("getUserHabits", () => {
      it("should get all habits for a user", async () => {
        const mockHabits = [
          { id: "h1", title: "Exercise" },
          { id: "h2", title: "Read" },
        ];

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: mockHabits, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getUserHabits("user-123");

        expect(result.data).toEqual(mockHabits);
        expect(result.error).toBeNull();
        expect(mockBuilder.eq).toHaveBeenCalledWith("user_id", "user-123");
      });
    });

    describe("updateHabit", () => {
      it("should update a habit", async () => {
        const mockUpdatedHabit = {
          id: "habit-123",
          title: "Updated title",
        };

        const mockBuilder = {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockUpdatedHabit, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await updateHabit("habit-123", { title: "Updated title" });

        expect(result.data).toEqual(mockUpdatedHabit);
        expect(result.error).toBeNull();
        expect(mockBuilder.update).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Updated title",
            updated_at: expect.any(String),
          })
        );
      });
    });

    describe("deleteHabit", () => {
      it("should delete a habit", async () => {
        const mockBuilder = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await deleteHabit("habit-123");

        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith("habits");
      });
    });

    describe("completeHabit", () => {
      it("should record a habit completion", async () => {
        const mockCompletion = {
          id: "completion-123",
          habit_id: "habit-123",
          user_id: "user-123",
          completed_date: "2024-01-15",
        };

        const mockBuilder = {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockCompletion, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await completeHabit("habit-123", "user-123", "2024-01-15");

        expect(result.data).toEqual(mockCompletion);
        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith("habit_completions");
      });
    });

    describe("uncompleteHabit", () => {
      it("should remove a habit completion", async () => {
        const mockBuilder = {
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
        };
        mockBuilder.eq.mockReturnValueOnce(mockBuilder).mockResolvedValueOnce({ error: null });
        supabase.from.mockReturnValue(mockBuilder);

        const result = await uncompleteHabit("habit-123", "2024-01-15");

        expect(result.error).toBeNull();
        expect(supabase.from).toHaveBeenCalledWith("habit_completions");
      });
    });

    describe("getHabitCompletions", () => {
      it("should get all completions for a habit", async () => {
        const mockCompletions = [
          { id: "c1", completed_date: "2024-01-15" },
          { id: "c2", completed_date: "2024-01-14" },
        ];

        const mockBuilder = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: mockCompletions, error: null }),
        };
        supabase.from.mockReturnValue(mockBuilder);

        const result = await getHabitCompletions("habit-123");

        expect(result.data).toEqual(mockCompletions);
        expect(result.error).toBeNull();
        expect(mockBuilder.order).toHaveBeenCalledWith("completed_date", {
          ascending: false,
        });
      });
    });
  });

  // ============================================
  // ERROR HANDLING
  // ============================================

  describe("Error Handling", () => {
    it("should handle network errors gracefully", async () => {
      const mockBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(new Error("Network error")),
      };
      supabase.from.mockReturnValue(mockBuilder);

      const result = await getUserProfile("user-123");

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
    });

    it("should handle RPC call failures by catching the error", async () => {
      const mockComment = { id: "comment-123", post_id: "post-123" };

      const mockBuilder = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockComment, error: null }),
      };
      supabase.from.mockReturnValue(mockBuilder);
      mockRpc.mockRejectedValue(new Error("RPC failed"));

      // When RPC call fails, the entire function catches the error
      // and returns an error response (since await rpc throws)
      const result = await createComment({
        post_id: "post-123",
        user_id: "user-123",
        author_name: "Test User",
        content: "Test",
      });

      // The error from RPC is caught in the catch block
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
    });
  });
});
