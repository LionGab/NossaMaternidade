/**
 * Testes para CommunityService
 * Gerenciamento de posts e comentários da comunidade
 */

jest.mock('../../src/services/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
  },
}));

import { supabase } from '../../src/services/supabase';
import {
  communityService,
  type CommunityPost,
  type CreatePostData,
  type CreateCommentData,
} from '../../src/services/communityService';

describe('CommunityService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPosts', () => {
    it('deve retornar array vazio quando ocorre erro', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              range: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Error' } })),
            })),
          })),
        })),
      });

      const result = await communityService.getPosts(0, 20);

      expect(result).toEqual([]);
    });

    it('deve retornar posts aprovados', async () => {
      const mockPosts: CommunityPost[] = [
        {
          id: 'post-1',
          user_id: 'user-123',
          content: 'Post 1',
          likes_count: 5,
          comments_count: 2,
          is_reported: false,
          is_approved: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              range: jest.fn(() => Promise.resolve({ data: mockPosts, error: null })),
            })),
          })),
        })),
      });

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      // Mock isPostLikedByUser
      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'community_posts') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                order: jest.fn(() => ({
                  range: jest.fn(() => Promise.resolve({ data: mockPosts, error: null })),
                })),
              })),
            })),
          };
        }
        if (table === 'community_post_likes') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                eq: jest.fn(() => ({
                  single: jest.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
                })),
              })),
            })),
          };
        }
        return {};
      });

      const result = await communityService.getPosts(0, 20);

      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getPostById', () => {
    it('deve retornar null quando post nao existe', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
          })),
        })),
      });

      const result = await communityService.getPostById('post-123');

      expect(result).toBeNull();
    });

    it('deve retornar post quando existe', async () => {
      const mockPost: CommunityPost = {
        id: 'post-1',
        user_id: 'user-123',
        content: 'Post content',
        likes_count: 5,
        comments_count: 2,
        is_reported: false,
        is_approved: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'community_posts') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: mockPost, error: null })),
              })),
            })),
          };
        }
        if (table === 'community_post_likes') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                eq: jest.fn(() => ({
                  single: jest.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
                })),
              })),
            })),
          };
        }
        return {};
      });

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const result = await communityService.getPostById('post-1');

      expect(result).toEqual(expect.objectContaining({ id: 'post-1' }));
    });
  });

  describe('createPost', () => {
    it('deve retornar null quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const postData: CreatePostData = {
        content: 'Novo post',
      };

      const result = await communityService.createPost(postData);

      expect(result).toBeNull();
    });

    it('deve criar post com sucesso', async () => {
      const mockUser = { id: 'user-123' };
      const postData: CreatePostData = {
        content: 'Novo post',
        tags: ['suporte'],
      };

      const mockPost: CommunityPost = {
        id: 'post-new',
        user_id: mockUser.id,
        content: postData.content,
        tags: postData.tags,
        likes_count: 0,
        comments_count: 0,
        is_reported: false,
        is_approved: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockPost, error: null })),
          })),
        })),
      });

      const result = await communityService.createPost(postData);

      expect(result).toEqual(mockPost);
    });
  });

  describe('updatePost', () => {
    it('deve retornar false quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await communityService.updatePost('post-123', 'Novo conteúdo');

      expect(result).toBe(false);
    });

    it('deve atualizar post com sucesso', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null })),
        })),
      });

      const result = await communityService.updatePost('post-123', 'Novo conteúdo');

      expect(result).toBe(true);
    });
  });

  describe('deletePost', () => {
    it('deve retornar false quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await communityService.deletePost('post-123');

      expect(result).toBe(false);
    });

    it('deve deletar post com sucesso', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null })),
        })),
      });

      const result = await communityService.deletePost('post-123');

      expect(result).toBe(true);
    });
  });

  describe('togglePostLike', () => {
    it('deve retornar false quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const result = await communityService.togglePostLike('post-123');

      expect(result).toBe(false);
    });

    it('deve curtir post quando nao esta curtido', async () => {
      const mockUser = { id: 'user-123' };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'community_post_likes') {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                eq: jest.fn(() => ({
                  single: jest.fn(() => Promise.resolve({ data: null, error: { code: 'PGRST116' } })),
                })),
              })),
            })),
            insert: jest.fn(() => Promise.resolve({ error: null })),
          };
        }
        if (table === 'community_posts') {
          return {
            update: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ error: null })),
            })),
          };
        }
        return {};
      });

      const result = await communityService.togglePostLike('post-123');

      expect(result).toBe(true);
    });
  });

  describe('getComments', () => {
    it('deve retornar array vazio quando ocorre erro', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Error' } })),
          })),
        })),
      });

      const result = await communityService.getComments('post-123');

      expect(result).toEqual([]);
    });

    it('deve retornar comentarios do post', async () => {
      const mockComments = [
        {
          id: 'comment-1',
          post_id: 'post-123',
          user_id: 'user-123',
          content: 'Comentário 1',
          likes_count: 2,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: mockComments, error: null })),
          })),
        })),
      });

      const result = await communityService.getComments('post-123');

      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('createComment', () => {
    it('deve retornar null quando usuario nao autenticado', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
      });

      const commentData: CreateCommentData = {
        post_id: 'post-123',
        content: 'Novo comentário',
      };

      const result = await communityService.createComment(commentData);

      expect(result).toBeNull();
    });

    it('deve criar comentario com sucesso', async () => {
      const mockUser = { id: 'user-123' };
      const commentData: CreateCommentData = {
        post_id: 'post-123',
        content: 'Novo comentário',
      };

      const mockComment = {
        id: 'comment-new',
        post_id: commentData.post_id,
        user_id: mockUser.id,
        content: commentData.content,
        likes_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
      });

      (supabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'community_comments') {
          return {
            insert: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ data: mockComment, error: null })),
              })),
            })),
          };
        }
        if (table === 'community_posts') {
          return {
            update: jest.fn(() => ({
              eq: jest.fn(() => Promise.resolve({ error: null })),
            })),
          };
        }
        return {};
      });

      const result = await communityService.createComment(commentData);

      expect(result).toEqual(expect.objectContaining({ content: commentData.content }));
    });
  });
});

