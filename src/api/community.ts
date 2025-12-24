/**
 * Community API Service
 *
 * Serviço para interagir com a tabela community_posts do Supabase
 * Mapeia campos do Supabase para o tipo Post usado no app
 *
 * NOTA: Usa type assertions porque community_posts não está no Database type ainda
 */

import type { Post } from "../types/navigation";
import { logger } from "../utils/logger";
import { supabase } from "./supabase";

/**
 * Type guard para verificar se Supabase está configurado
 */
function checkSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase não está configurado. Adicione EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente."
    );
  }
  return supabase;
}

/**
 * Mapeia moderation_status do Supabase para status do app
 */
function mapModerationStatus(
  moderationStatus: "safe" | "flagged" | "blocked" | null | undefined
): "pending" | "approved" | "rejected" {
  switch (moderationStatus) {
    case "safe":
      return "approved";
    case "flagged":
      return "pending";
    case "blocked":
      return "rejected";
    default:
      return "approved"; // Default seguro
  }
}

/**
 * Tipo para post do Supabase (community_posts)
 */
interface SupabasePost {
  id: string;
  author_id: string;
  group_id?: string | null;
  content: string;
  image_url?: string | null;
  type?: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  moderation_status?: "safe" | "flagged" | "blocked" | null;
  is_hidden?: boolean;
  profiles?: {
    name: string;
    avatar_url?: string | null;
  } | null;
}

/**
 * Mapeia Post do Supabase para Post do app
 */
function mapSupabasePostToAppPost(supabasePost: SupabasePost, isLiked?: boolean): Post {
  return {
    id: supabasePost.id,
    authorId: supabasePost.author_id,
    authorName: supabasePost.profiles?.name || "Usuário",
    authorAvatar: supabasePost.profiles?.avatar_url || undefined,
    content: supabasePost.content,
    imageUrl: supabasePost.image_url || undefined,
    likesCount: supabasePost.likes_count,
    commentsCount: supabasePost.comments_count,
    createdAt: supabasePost.created_at,
    groupId: supabasePost.group_id || undefined,
    type: supabasePost.type || undefined,
    status: mapModerationStatus(supabasePost.moderation_status),
    isLiked: isLiked ?? false,
  };
}

/**
 * Busca posts da comunidade
 */
export async function fetchPosts(
  limit: number = 20,
  offset: number = 0
): Promise<{ data: Post[]; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Buscar sessão atual para verificar se usuário está logado
    const {
      data: { session },
    } = await client.auth.getSession();

    // Query com join em profiles para pegar nome do autor
    // Usar type assertion porque community_posts não está no Database type ainda
    const communityPostsTable = (client as unknown as { from: (table: string) => unknown }).from(
      "community_posts"
    ) as {
      select: (columns: string) => {
        eq: (
          column: string,
          value: boolean
        ) => {
          eq: (
            column: string,
            value: boolean
          ) => {
            order: (
              column: string,
              options: { ascending: boolean }
            ) => {
              range: (
                start: number,
                end: number
              ) => Promise<{
                data: SupabasePost[] | null;
                error: { message: string } | null;
              }>;
            };
          };
        };
      };
    };

    const { data, error } = await communityPostsTable
      .select(
        `
        id,
        author_id,
        group_id,
        content,
        image_url,
        type,
        likes_count,
        comments_count,
        created_at,
        moderation_status,
        is_hidden,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .eq("is_deleted", false)
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Verificar quais posts o usuário curtiu
    let likedPostIds: Set<string> = new Set();
    if (session?.user?.id && data && data.length > 0) {
      const postIds = data.map((p) => p.id);
      const postLikesTable = (client as unknown as { from: (table: string) => unknown }).from(
        "post_likes"
      ) as {
        select: (columns: string) => {
          eq: (
            column: string,
            value: string
          ) => {
            in: (
              column: string,
              values: string[]
            ) => Promise<{
              data: { post_id: string }[] | null;
              error: { message: string } | null;
            }>;
          };
        };
      };

      const { data: likesData, error: likesError } = await postLikesTable
        .select("post_id")
        .eq("user_id", session.user.id)
        .in("post_id", postIds);

      if (!likesError && likesData) {
        likedPostIds = new Set(likesData.map((l) => l.post_id));
      }
    }

    // Mapear para formato do app
    const posts: Post[] =
      data?.map((post) => mapSupabasePostToAppPost(post, likedPostIds.has(post.id))) || [];

    return { data: posts, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao buscar posts da comunidade", "CommunityAPI", errorObj);
    return { data: [], error: errorObj };
  }
}

/**
 * Cria um novo post na comunidade
 */
export async function createPost(
  content: string,
  imageUrl?: string,
  groupId?: string
): Promise<{ data: Post | null; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const authorId = session.user.id;

    // Inserir post
    const communityPostsTable = (client as unknown as { from: (table: string) => unknown }).from(
      "community_posts"
    ) as {
      insert: (values: {
        author_id: string;
        content: string;
        image_url?: string | null;
        group_id?: string | null;
        type: string;
      }) => {
        select: (columns: string) => {
          single: () => Promise<{
            data: SupabasePost | null;
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data: postData, error } = await communityPostsTable
      .insert({
        author_id: authorId,
        content: content.trim(),
        image_url: imageUrl || null,
        group_id: groupId || null,
        type: imageUrl ? "image" : "text",
      })
      .select(
        `
        id,
        author_id,
        group_id,
        content,
        image_url,
        type,
        likes_count,
        comments_count,
        created_at,
        moderation_status,
        is_hidden,
        profiles:author_id (
          name,
          avatar_url
        )
      `
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!postData) {
      throw new Error("Post não foi criado");
    }

    // Mapear para formato do app
    const post = mapSupabasePostToAppPost(postData, false);

    return { data: post, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao criar post", "CommunityAPI", errorObj);
    return { data: null, error: errorObj };
  }
}

/**
 * Alterna like em um post
 */
export async function togglePostLike(
  postId: string
): Promise<{ data: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const userId = session.user.id;

    // Verificar se já curtiu
    const postLikesTable = (client as unknown as { from: (table: string) => unknown }).from(
      "post_likes"
    ) as {
      select: (columns: string) => {
        eq: (
          column: string,
          value: string
        ) => {
          eq: (
            column: string,
            value: string
          ) => {
            single: () => Promise<{
              data: { id: string } | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
      insert: (values: { post_id: string; user_id: string }) => Promise<{
        error: { message: string } | null;
      }>;
      delete: () => {
        eq: (
          column: string,
          value: string
        ) => {
          eq: (
            column: string,
            value: string
          ) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { data: existingLike } = await postLikesTable
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();

    if (existingLike) {
      // Remover like
      const { error } = await postLikesTable.delete().eq("post_id", postId).eq("user_id", userId);

      if (error) {
        throw new Error(error.message);
      }
      return { data: false, error: null }; // Like removido
    } else {
      // Adicionar like
      const { error } = await postLikesTable.insert({
        post_id: postId,
        user_id: userId,
      });

      if (error) {
        throw new Error(error.message);
      }
      return { data: true, error: null }; // Like adicionado
    }
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao alternar like", "CommunityAPI", errorObj);
    return { data: false, error: errorObj };
  }
}

/**
 * Deleta um post (soft delete)
 */
export async function deletePost(postId: string): Promise<{ data: boolean; error: Error | null }> {
  try {
    const client = checkSupabase();

    // Verificar sessão
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    // Soft delete
    const communityPostsTable = (client as unknown as { from: (table: string) => unknown }).from(
      "community_posts"
    ) as {
      update: (values: { is_deleted: boolean; deleted_at: string }) => {
        eq: (
          column: string,
          value: string
        ) => {
          eq: (
            column: string,
            value: string
          ) => Promise<{
            error: { message: string } | null;
          }>;
        };
      };
    };

    const { error } = await communityPostsTable
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("author_id", session.user.id); // Apenas o autor pode deletar

    if (error) {
      throw new Error(error.message);
    }

    return { data: true, error: null };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Erro ao deletar post", "CommunityAPI", errorObj);
    return { data: false, error: errorObj };
  }
}
