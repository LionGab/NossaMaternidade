/**
 * Hook para Deep Linking
 * Navegação direta para telas específicas via URLs
 */

import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { logger } from "../utils/logger";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SCHEME = "nossamaternidade";

export interface DeepLinkConfig {
  path: string;
  screen: keyof RootStackParamList;
  getParams?: (id?: string) => Record<string, unknown>;
  staticParams?: Record<string, unknown>;
}

const DEEP_LINK_ROUTES: Record<string, DeepLinkConfig> = {
  "/post/:id": {
    path: "/post/:id",
    screen: "PostDetail",
    getParams: (id?: string) => ({ postId: id || "" }),
  },
  "/community": {
    path: "/community",
    screen: "MainTabs",
    staticParams: { screen: "Community" },
  },
  "/assistant": {
    path: "/assistant",
    screen: "MainTabs",
    staticParams: { screen: "Assistant" },
  },
  "/home": {
    path: "/home",
    screen: "MainTabs",
    staticParams: { screen: "Home" },
  },
};

export function useDeepLinking() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Handle initial URL (app opened via deep link)
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    handleInitialURL();

    // Handle URL changes (app already open)
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  const handleDeepLink = (url: string) => {
    try {
      const parsed = Linking.parse(url);
      
      if (parsed.scheme !== SCHEME && !url.includes("nossamaternidade.com.br")) {
        return;
      }

      const path = parsed.path || "/";
      const route = findRoute(path);

      if (route) {
        const params = route.getParams 
          ? route.getParams(parsed.queryParams?.id as string)
          : route.staticParams || {};
        navigation.navigate(route.screen as never, params as never);
        logger.info(`Deep link navigated to ${route.screen}`, "DeepLinking");
      } else {
        logger.warn(`Unknown deep link path: ${path}`, "DeepLinking");
      }
    } catch (error) {
      logger.error("Error handling deep link", "DeepLinking", error instanceof Error ? error : new Error(String(error)));
    }
  };

  const findRoute = (path: string): DeepLinkConfig | null => {
    // Exact match
    if (DEEP_LINK_ROUTES[path]) {
      return DEEP_LINK_ROUTES[path];
    }

    // Pattern match (e.g., /post/123)
    for (const [pattern, config] of Object.entries(DEEP_LINK_ROUTES)) {
      if (pattern.includes(":id")) {
        const regex = new RegExp(pattern.replace(":id", "([^/]+)"));
        const match = path.match(regex);
        if (match) {
          return {
            ...config,
            getParams: config.getParams ? () => config.getParams!(match[1]) : undefined,
          };
        }
      }
    }

    return null;
  };

  return {
    handleDeepLink,
  };
}
