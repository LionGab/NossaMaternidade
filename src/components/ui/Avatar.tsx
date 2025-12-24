import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageSourcePropType, View, ViewStyle } from "react-native";
import { neutral } from "../../theme/tokens";
import { cn } from "../../utils/cn";

// Imagem real da Nath para avatares
const NATH_PROFILE_IMAGE = require("../../../assets/onboarding/images/nath-profile-small.jpg");

export interface AvatarProps {
  size?: number;
  source?: ImageSourcePropType | { uri: string } | null;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackColor?: string;
  fallbackBgColor?: string;
  isNathalia?: boolean; // Se true, usa o avatar padrão da Nathália
  isNathIA?: boolean; // Se true, usa o avatar da NathIA (assistente virtual)
  isCommunity?: boolean; // Se true, usa o avatar de Comunidade/Mundo da Nath
  className?: string;
  style?: ViewStyle;
}

const Avatar = React.memo(
  function Avatar({
    size = 40,
    source,
    fallbackIcon = "person",
    fallbackColor = neutral[600],
    fallbackBgColor = "rgba(255, 255, 255, 0.1)",
    isNathalia = false,
    isNathIA = false,
    isCommunity = false,
    className,
    style,
  }: AvatarProps) {
    // Prioridade: NathIA > Comunidade > Nathália > source customizado
    let imageSource: ImageSourcePropType | { uri: string } | null = null;

    if (isNathIA || isNathalia) {
      // Usa a foto real da Nath para NathIA e Nathalia
      imageSource = NATH_PROFILE_IMAGE;
    } else if (isCommunity) {
      // Comunidade também usa a foto da Nath como padrão
      imageSource = NATH_PROFILE_IMAGE;
    } else {
      imageSource = source || null;
    }

    return (
      <View
        className={cn("rounded-full items-center justify-center overflow-hidden", className)}
        style={[
          {
            width: size,
            height: size,
            backgroundColor: imageSource ? "transparent" : fallbackBgColor,
          },
          style,
        ]}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: size, height: size }}
            className="rounded-full"
            resizeMode="cover"
            accessibilityRole="image"
            accessibilityLabel={
              isNathIA
                ? "Avatar da NathIA, assistente virtual"
                : isCommunity
                  ? "Avatar da Comunidade Mundo da Nath"
                  : isNathalia
                    ? "Avatar de Nathália Valente"
                    : "Avatar do usuário"
            }
          />
        ) : (
          <Ionicons
            name={fallbackIcon}
            size={size * 0.6}
            color={fallbackColor}
            accessibilityLabel="Ícone de avatar padrão"
          />
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparator: só re-renderiza se props relevantes mudarem
    return (
      prevProps.size === nextProps.size &&
      prevProps.source === nextProps.source &&
      prevProps.isNathalia === nextProps.isNathalia &&
      prevProps.isNathIA === nextProps.isNathIA &&
      prevProps.isCommunity === nextProps.isCommunity &&
      prevProps.fallbackIcon === nextProps.fallbackIcon &&
      prevProps.className === nextProps.className
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
