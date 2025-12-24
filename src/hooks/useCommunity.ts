/**
 * useCommunity Hook
 *
 * Hook customizado para gerenciar estado e lógica da Community
 * Conecta com Supabase para dados reais, com fallback para mock
 */

import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Share } from "react-native";
import { createPost, fetchPosts, togglePostLike } from "../api/community";
import { supabase } from "../api/supabase";
import { MOCK_POSTS } from "../config/community";
import { useAppStore, useCommunityStore } from "../state/store";
import type { MainTabScreenProps, Post } from "../types/navigation";
import { logger } from "../utils/logger";

type NavigationProp = MainTabScreenProps<"Community">["navigation"];

export interface UseCommunityReturn {
  // State
  posts: Post[];
  filteredPosts: Post[];
  isSearchVisible: boolean;
  searchQuery: string;
  isNewPostModalVisible: boolean;
  isLoading: boolean;
  error: Error | null;

  // Handlers
  handleNewPost: (content: string, mediaUri?: string) => Promise<void>;
  handleCommentPress: (postId: string) => Promise<void>;
  handleSharePress: (post: Post) => Promise<void>;
  handlePostPress: (postId: string) => void;
  handleSearchToggle: () => Promise<void>;
  handleLike: (postId: string) => Promise<void>;
  openNewPostModal: () => void;
  closeNewPostModal: () => void;
  setSearchQuery: (query: string) => void;
  refreshPosts: () => Promise<void>;
}

export function useCommunity(navigation: NavigationProp): UseCommunityReturn {
  // Store selectors (individual para evitar re-renders)
  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const setPosts = useCommunityStore((s) => s.setPosts);
  const addPost = useCommunityStore((s) => s.addPost);
  const userName = useAppStore((s) => s.user?.name);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isNewPostModalVisible, setIsNewPostModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Carregar posts do Supabase (com fallback para mock)
  const loadPosts = useCallback(async () => {
    // Se Supabase não estiver configurado, usar mock
    if (!supabase) {
      logger.warn("Supabase não configurado. Usando dados mock.", "useCommunity");
      if (posts.length === 0) {
        setPosts(MOCK_POSTS);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await fetchPosts(20, 0);

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setPosts(data);
      } else {
        // Fallback para mock se não houver posts
        logger.info("Nenhum post encontrado. Usando dados mock.", "useCommunity");
        setPosts(MOCK_POSTS);
      }
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      logger.error("Erro ao carregar posts", "useCommunity", errorObj);
      setError(errorObj);
      // Fallback para mock em caso de erro
      if (posts.length === 0) {
        setPosts(MOCK_POSTS);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setPosts, posts.length]);

  // Carregar posts na montagem
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Posts filtrados pela busca
  const filteredPosts = useMemo(() => {
    const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;

    if (!searchQuery.trim()) {
      return displayPosts;
    }

    const query = searchQuery.toLowerCase();
    return displayPosts.filter(
      (post) =>
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.type?.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleNewPost = useCallback(
    async (content: string, mediaUri?: string) => {
      // Se Supabase não estiver configurado, usar mock
      if (!supabase) {
        const newPost: Post = {
          id: Date.now().toString(),
          authorId: "currentUser",
          authorName: userName || "Você",
          content,
          imageUrl: mediaUri,
          likesCount: 0,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          isLiked: false,
          type: "geral",
          status: "pending",
        };
        addPost(newPost);
        setIsNewPostModalVisible(false);
        return;
      }

      try {
        const { data, error: createError } = await createPost(content, mediaUri);

        if (createError) {
          throw createError;
        }

        if (data) {
          addPost(data);
          setIsNewPostModalVisible(false);
        }
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        logger.error("Erro ao criar post", "useCommunity", errorObj);
        setError(errorObj);
        // Fallback: criar post local mesmo em caso de erro
        const newPost: Post = {
          id: Date.now().toString(),
          authorId: "currentUser",
          authorName: userName || "Você",
          content,
          imageUrl: mediaUri,
          likesCount: 0,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          isLiked: false,
          type: "geral",
          status: "pending",
        };
        addPost(newPost);
        setIsNewPostModalVisible(false);
      }
    },
    [addPost, userName]
  );

  const handleCommentPress = useCallback(
    async (postId: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  const handleSharePress = useCallback(async (post: Post) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${post.content.substring(0, 100)}... - via Nossa Maternidade`,
      });
    } catch {
      // Silent error
    }
  }, []);

  const handlePostPress = useCallback(
    (postId: string) => {
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  const handleSearchToggle = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSearchVisible((prev) => {
      if (prev) {
        setSearchQuery("");
      }
      return !prev;
    });
  }, []);

  const handleLike = useCallback(
    async (postId: string) => {
      // Atualizar UI imediatamente (otimistic update)
      toggleLike(postId);

      // Se Supabase não estiver configurado, apenas atualizar localmente
      if (!supabase) {
        return;
      }

      try {
        const { error: toggleError } = await togglePostLike(postId);

        if (toggleError) {
          // Reverter otimistic update em caso de erro
          toggleLike(postId);
          throw toggleError;
        }
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        logger.error("Erro ao alternar like", "useCommunity", errorObj);
        // Reverter otimistic update
        toggleLike(postId);
      }
    },
    [toggleLike]
  );

  const refreshPosts = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  const closeNewPostModal = useCallback(() => {
    setIsNewPostModalVisible(false);
  }, []);

  const openNewPostModal = useCallback(() => {
    setIsNewPostModalVisible(true);
  }, []);

  return {
    // State
    posts,
    filteredPosts,
    isSearchVisible,
    searchQuery,
    isNewPostModalVisible,
    isLoading,
    error,

    // Handlers
    handleNewPost,
    handleCommentPress,
    handleSharePress,
    handlePostPress,
    handleSearchToggle,
    handleLike,
    openNewPostModal,
    closeNewPostModal,
    setSearchQuery,
    refreshPosts,
  };
}
