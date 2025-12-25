/**
 * Serviço de upload de imagens para Imgur
 * Usa a API do Imgur para fazer upload de imagens e retornar URLs públicas
 * Inclui retry + timeout para melhor reliability
 */

import { getImgurClientId } from "../config/env";
import { logger } from "../utils/logger";
import { fetchWithRetry, TIMEOUT_PRESETS } from "../utils/fetch-utils";
import {
  AppError,
  ErrorCode,
  wrapError,
  isAppError,
} from "../utils/error-handler";

const IMGUR_API_URL = "https://api.imgur.com/3/image";

export interface ImgurUploadResponse {
  success: boolean;
  data?: {
    id: string;
    link: string;
    deletehash?: string;
    width: number;
    height: number;
    size: number;
    type: string;
  };
  error?: string;
}

/**
 * Faz upload de uma imagem para o Imgur usando FormData
 * @param imageUri URI local da imagem (file:// ou asset://)
 * @returns URL pública da imagem no Imgur
 * @throws AppError se configuração inválida ou upload falhar
 */
export async function uploadImageToImgur(imageUri: string): Promise<string> {
  const imgurClientId = getImgurClientId();

  if (!imgurClientId) {
    throw new AppError(
      "IMGUR_CLIENT_ID not configured",
      ErrorCode.UPLOAD_FAILED,
      "Configuração do upload não encontrada. Contate o suporte.",
      undefined,
      { component: "ImgurService" }
    );
  }

  try {
    // Validar URI
    if (!imageUri || imageUri.length === 0) {
      throw new AppError(
        "Invalid image URI",
        ErrorCode.INVALID_INPUT,
        "URI de imagem inválida.",
        undefined,
        { component: "ImgurService", uri: imageUri }
      );
    }

    // Criar FormData com a imagem
    const formData = new FormData();

    // Extrair nome do arquivo da URI
    const filename = imageUri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("image", {
      uri: imageUri,
      type,
      name: filename,
    } as unknown as Blob);

    logger.debug("Iniciando upload para Imgur", "ImgurService", {
      filename,
      type,
    });

    // Fazer upload para Imgur COM RETRY + TIMEOUT
    const response = await fetchWithRetry(
      IMGUR_API_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${imgurClientId}`,
        },
        body: formData,
        // Upload pode demorar dependendo do tamanho
        timeoutMs: TIMEOUT_PRESETS.LONG,
        context: "ImgurService",
      },
      {
        maxAttempts: 3,
        initialDelay: 500,
        maxDelay: 3000,
      }
    );

    // Parse resposta
    const result: ImgurUploadResponse = await response.json();

    // Validar resposta
    if (!result.success) {
      throw new AppError(
        `Imgur upload failed: ${result.error || "unknown error"}`,
        ErrorCode.UPLOAD_FAILED,
        "Falha no upload. Tente novamente.",
        undefined,
        { component: "ImgurService", error: result.error }
      );
    }

    if (!result.data?.link) {
      throw new AppError(
        "Missing image link in Imgur response",
        ErrorCode.API_ERROR,
        "Resposta inválida do servidor.",
        undefined,
        { component: "ImgurService", data: Object.keys(result.data || {}) }
      );
    }

    logger.info("Upload concluído com sucesso", "ImgurService", {
      imageUrl: result.data.link,
      fileSize: result.data.size,
      dimensions: `${result.data.width}x${result.data.height}`,
    });

    return result.data.link;
  } catch (error) {
    // Se já é AppError, re-throw
    if (isAppError(error)) {
      throw error;
    }

    // Converter para AppError
    throw wrapError(
      error,
      ErrorCode.UPLOAD_FAILED,
      "Não consegui enviar a imagem. Tente novamente.",
      { component: "ImgurService", uri: imageUri.substring(0, 50) }
    );
  }
}

/**
 * Faz upload de múltiplas imagens para o Imgur
 * @param imageUris Array de URIs locais das imagens
 * @returns Array de URLs públicas das imagens que conseguiram fazer upload
 * @note Retorna as URLs que conseguiram, não falha se algumas falharem
 */
export async function uploadMultipleImagesToImgur(
  imageUris: string[]
): Promise<string[]> {
  if (!imageUris || imageUris.length === 0) {
    throw new AppError(
      "No images provided for upload",
      ErrorCode.INVALID_INPUT,
      "Nenhuma imagem fornecida.",
      undefined,
      { component: "ImgurService" }
    );
  }

  try {
    logger.debug("Iniciando upload de múltiplas imagens", "ImgurService", {
      count: imageUris.length,
    });

    // Usar allSettled para obter resultado granular
    const uploadPromises = imageUris.map((uri) => uploadImageToImgur(uri));
    const results = await Promise.allSettled(uploadPromises);

    // Separar sucessos e falhas
    const successful: string[] = [];
    const failed: { uri: string; error: string }[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successful.push(result.value);
      } else {
        const error =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        failed.push({
          uri: imageUris[index].substring(0, 50),
          error,
        });
      }
    });

    // Log dos resultados
    logger.info("Upload de múltiplas imagens concluído", "ImgurService", {
      totalRequested: imageUris.length,
      successful: successful.length,
      failed: failed.length,
    });

    if (failed.length > 0) {
      logger.warn("Algumas imagens falharam no upload", "ImgurService", {
        failures: failed,
      });
    }

    // Se nenhuma conseguiu, lançar erro
    if (successful.length === 0) {
      throw new AppError(
        "All image uploads failed",
        ErrorCode.UPLOAD_FAILED,
        "Nenhuma imagem conseguiu fazer upload. Tente novamente.",
        undefined,
        { component: "ImgurService", failures: failed }
      );
    }

    return successful;
  } catch (error) {
    // Se já é AppError, re-throw
    if (isAppError(error)) {
      throw error;
    }

    // Converter para AppError
    throw wrapError(
      error,
      ErrorCode.UPLOAD_FAILED,
      "Erro ao enviar imagens. Tente novamente.",
      { component: "ImgurService", uriCount: imageUris.length }
    );
  }
}

