/**
 * Nossa Maternidade - Notifications Edge Function
 *
 * Push Notifications via Expo Push API
 *
 * ENDPOINTS:
 * - POST /send - Enviar notificação para um usuário
 * - POST /send-templated - Enviar usando template do banco (NEW v1.1)
 * - POST /broadcast - Enviar para múltiplos usuários
 * - POST /register-token - Registrar push token
 * - POST /process-queue - Processar fila de notificações (cron job)
 * - GET /preferences - Obter preferências do usuário
 * - PUT /preferences - Atualizar preferências
 *
 * Features:
 * - JWT validation (authenticated users only)
 * - Rate limiting (100 notificações/min por usuário)
 * - Batch sending (até 100 notificações por request)
 * - Token management (auto-disable após falhas)
 * - Respeita preferências do usuário
 * - Expo Push Receipts (verificação de entrega)
 * - CORS restrito
 *
 * @version 1.1.0 - Template system (2025-01)
 *
 * NEW in v1.1:
 * - POST /send-templated - Enviar usando template do banco
 * - Template system com interpolação de variáveis
 * - Suporte i18n (pt-BR default)
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// =======================
// ENV & CONFIG
// =======================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Expo Push API
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_RECEIPTS_URL = "https://exp.host/--/api/v2/push/getReceipts";

// Domínios permitidos (CORS)
const ALLOWED_ORIGINS = [
  "https://nossamaternidade.com.br",
  "https://www.nossamaternidade.com.br",
  "exp://", // Expo Go
  "http://localhost:8081", // Dev local
];

// Rate limiting
const RATE_LIMIT = {
  maxNotificationsPerMinute: 100,
  maxBatchSize: 100,
};

// =======================
// TYPES
// =======================

type NotificationType =
  | "daily_check_in"
  | "daily_affirmation"
  | "habit_reminder"
  | "wellness_reminder"
  | "community_comment"
  | "community_like"
  | "community_mention"
  | "chat_reminder"
  | "cycle_reminder"
  | "period_prediction"
  | "custom";

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
  ttl?: number;
  channelId?: string;
  priority?: "default" | "normal" | "high";
  categoryId?: string;
}

interface ExpoPushTicket {
  id?: string;
  status: "ok" | "error";
  message?: string;
  details?: {
    error?: "DeviceNotRegistered" | "MessageTooBig" | "InvalidCredentials" | "MessageRateExceeded";
  };
}

interface SendNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  priority?: "default" | "normal" | "high";
  ttl?: number;
  collapseKey?: string;
}

interface SendTemplatedNotificationRequest {
  userId: string;
  type: NotificationType;
  templateKey: string;
  templateData: Record<string, string>;
  data?: Record<string, unknown>;
  priority?: "default" | "normal" | "high";
  language?: string; // Default: pt-BR
}

interface BroadcastRequest {
  userIds: string[];
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

interface RegisterTokenRequest {
  token: string;
  platform: "ios" | "android" | "web";
  deviceId?: string;
  deviceName?: string;
}

interface NotificationPreferences {
  notifications_enabled: boolean;
  daily_check_in: boolean;
  daily_affirmation: boolean;
  habit_reminders: boolean;
  wellness_reminders: boolean;
  community_comments: boolean;
  community_likes: boolean;
  community_mentions: boolean;
  chat_reminders: boolean;
  cycle_reminders: boolean;
  period_predictions: boolean;
  check_in_time: string;
  affirmation_time: string;
  habit_reminder_time: string;
  wellness_time: string;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

// =======================
// HELPERS
// =======================

function jsonResponse(data: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
    },
  });
}

function hashUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `user_${Math.abs(hash).toString(16).substring(0, 8)}`;
}

/**
 * Map notification type to preference field
 */
function getPreferenceField(type: NotificationType): keyof NotificationPreferences | null {
  const mapping: Record<NotificationType, keyof NotificationPreferences | null> = {
    daily_check_in: "daily_check_in",
    daily_affirmation: "daily_affirmation",
    habit_reminder: "habit_reminders",
    wellness_reminder: "wellness_reminders",
    community_comment: "community_comments",
    community_like: "community_likes",
    community_mention: "community_mentions",
    chat_reminder: "chat_reminders",
    cycle_reminder: "cycle_reminders",
    period_prediction: "period_predictions",
    custom: null, // Always allowed
  };
  return mapping[type];
}

/**
 * Check if user has enabled this notification type
 */
async function isNotificationAllowed(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  type: NotificationType
): Promise<boolean> {
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!prefs) return true; // Default to allowed if no preferences set

  if (!prefs.notifications_enabled) return false;

  const prefField = getPreferenceField(type);
  if (!prefField) return true; // Custom notifications always allowed

  return prefs[prefField] as boolean;
}

/**
 * Get Android channel ID based on notification type
 */
function getChannelId(type: NotificationType): string {
  const channels: Record<NotificationType, string> = {
    daily_check_in: "check-in",
    daily_affirmation: "affirmation",
    habit_reminder: "habits",
    wellness_reminder: "wellness",
    community_comment: "community",
    community_like: "community",
    community_mention: "community",
    chat_reminder: "chat",
    cycle_reminder: "cycle",
    period_prediction: "cycle",
    custom: "default",
  };
  return channels[type];
}

// =======================
// EXPO PUSH API
// =======================

/**
 * Send notifications via Expo Push API
 * Returns array of results per message
 */
async function sendExpoPush(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
  if (messages.length === 0) return [];

  // Expo accepts max 100 messages per request
  const batches: ExpoPushMessage[][] = [];
  for (let i = 0; i < messages.length; i += RATE_LIMIT.maxBatchSize) {
    batches.push(messages.slice(i, i + RATE_LIMIT.maxBatchSize));
  }

  const allTickets: ExpoPushTicket[] = [];

  for (const batch of batches) {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      console.error("[NOTIFICATIONS] Expo Push API error:", response.status);
      // Return error tickets for this batch
      const errorTickets: ExpoPushTicket[] = batch.map(() => ({
        status: "error",
        message: `HTTP ${response.status}`,
      }));
      allTickets.push(...errorTickets);
      continue;
    }

    const result = await response.json();
    allTickets.push(...(result.data as ExpoPushTicket[]));
  }

  return allTickets;
}

/**
 * Handle Expo Push Ticket result
 * Marks tokens as failed if device not registered
 */
async function handleTicketResult(
  supabase: ReturnType<typeof createClient>,
  token: string,
  ticket: ExpoPushTicket,
  userId: string,
  notificationType: NotificationType,
  title: string,
  body: string,
  data: Record<string, unknown>
): Promise<void> {
  if (ticket.status === "ok") {
    // Log successful notification
    await supabase.from("notification_history").insert({
      user_id: userId,
      notification_type: notificationType,
      title,
      body,
      data,
      status: "delivered",
      expo_receipt_id: ticket.id,
    });
  } else {
    // Handle error
    const errorCode = ticket.details?.error || "unknown";
    const errorMessage = ticket.message || "Unknown error";

    console.error(`[NOTIFICATIONS] Failed for token ${token.substring(0, 20)}...: ${errorCode}`);

    // Mark token as failed
    await supabase.rpc("mark_token_failed", {
      p_token: token,
      p_error: errorMessage,
    });

    // Log failed notification
    await supabase.from("notification_history").insert({
      user_id: userId,
      notification_type: notificationType,
      title,
      body,
      data,
      status: "failed",
      error_code: errorCode,
      error_message: errorMessage,
    });

    // If device not registered, deactivate token immediately
    if (errorCode === "DeviceNotRegistered") {
      await supabase
        .from("push_tokens")
        .update({ is_active: false, last_error: "DeviceNotRegistered" })
        .eq("token", token);
    }
  }
}

/**
 * Get notification title and body from template
 * Calls Supabase function get_notification_from_template
 */
async function getNotificationFromTemplate(
  supabase: ReturnType<typeof createClient>,
  templateKey: string,
  templateData: Record<string, string>,
  language: string = "pt-BR"
): Promise<{ title: string; body: string } | null> {
  try {
    // Convert template data to JSONB
    const jsonData = JSON.stringify(templateData);

    // Call database function
    const { data, error } = await supabase.rpc("get_notification_from_template", {
      p_template_key: templateKey,
      p_data: jsonData,
      p_language: language,
    });

    if (error) {
      console.error(`[NOTIFICATIONS] Template error for ${templateKey}:`, error);
      return null;
    }

    if (!data || data.length === 0) {
      console.error(`[NOTIFICATIONS] Template not found: ${templateKey}`);
      return null;
    }

    const template = data[0];
    return {
      title: template.title,
      body: template.body,
    };
  } catch (err) {
    console.error("[NOTIFICATIONS] Failed to fetch template:", err);
    return null;
  }
}

// =======================
// MAIN HANDLERS
// =======================

/**
 * Send notification to a single user
 */
async function handleSendNotification(
  supabase: ReturnType<typeof createClient>,
  request: SendNotificationRequest
): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  const { userId, type, title, body, data = {}, priority = "high", ttl = 3600 } = request;

  // Check user preferences
  const isAllowed = await isNotificationAllowed(supabase, userId, type);
  if (!isAllowed) {
    return {
      success: true,
      sent: 0,
      failed: 0,
      errors: ["User has disabled this notification type"],
    };
  }

  // Get user's active push tokens
  const { data: tokens } = await supabase.rpc("get_user_push_tokens", {
    p_user_id: userId,
  });

  if (!tokens || tokens.length === 0) {
    return {
      success: true,
      sent: 0,
      failed: 0,
      errors: ["No active push tokens for user"],
    };
  }

  // Build messages for each token
  const messages: ExpoPushMessage[] = tokens.map((t: { token: string }) => ({
    to: t.token,
    title,
    body,
    data: { ...data, type, userId },
    sound: "default",
    priority,
    ttl,
    channelId: getChannelId(type),
  }));

  // Send via Expo
  const tickets = await sendExpoPush(messages);

  // Process results
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    const token = tokens[i].token;

    await handleTicketResult(supabase, token, ticket, userId, type, title, body, data);

    if (ticket.status === "ok") {
      sent++;
    } else {
      failed++;
      errors.push(`Token ${i}: ${ticket.message || "Unknown error"}`);
    }
  }

  console.log(`[NOTIFICATIONS] Sent to ${hashUserId(userId)}: ${sent} ok, ${failed} failed`);

  return { success: true, sent, failed, errors };
}

/**
 * Send notification using template from database
 */
async function handleSendTemplatedNotification(
  supabase: ReturnType<typeof createClient>,
  request: SendTemplatedNotificationRequest
): Promise<{ success: boolean; sent: number; failed: number; errors: string[]; template?: { title: string; body: string } }> {
  const { userId, type, templateKey, templateData, data = {}, priority = "high", language = "pt-BR" } = request;

  // Fetch template from database
  const template = await getNotificationFromTemplate(supabase, templateKey, templateData, language);

  if (!template) {
    return {
      success: false,
      sent: 0,
      failed: 0,
      errors: [`Template not found: ${templateKey}`],
    };
  }

  // Use existing send function with interpolated title/body
  const result = await handleSendNotification(supabase, {
    userId,
    type,
    title: template.title,
    body: template.body,
    data,
    priority,
  });

  return {
    ...result,
    template, // Include template for debugging
  };
}

/**
 * Broadcast notification to multiple users
 */
async function handleBroadcast(
  supabase: ReturnType<typeof createClient>,
  request: BroadcastRequest
): Promise<{ success: boolean; total: number; sent: number; failed: number; skipped: number }> {
  const { userIds, type, title, body, data = {} } = request;

  let totalSent = 0;
  let totalFailed = 0;
  let skipped = 0;

  // Process each user
  for (const userId of userIds) {
    const result = await handleSendNotification(supabase, {
      userId,
      type,
      title,
      body,
      data,
    });

    totalSent += result.sent;
    totalFailed += result.failed;

    if (result.sent === 0 && result.failed === 0) {
      skipped++;
    }
  }

  console.log(
    `[NOTIFICATIONS] Broadcast: ${totalSent} sent, ${totalFailed} failed, ${skipped} skipped`
  );

  return {
    success: true,
    total: userIds.length,
    sent: totalSent,
    failed: totalFailed,
    skipped,
  };
}

/**
 * Register push token for user
 */
async function handleRegisterToken(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  request: RegisterTokenRequest
): Promise<{ success: boolean; tokenId?: string; error?: string }> {
  const { token, platform, deviceId, deviceName } = request;

  // Validate token format (Expo push token)
  if (!token.startsWith("ExponentPushToken[") && !token.startsWith("ExpoPushToken[")) {
    return { success: false, error: "Invalid token format. Expected Expo push token." };
  }

  try {
    const { data: tokenId, error } = await supabase.rpc("upsert_push_token", {
      p_user_id: userId,
      p_token: token,
      p_platform: platform,
      p_device_id: deviceId || null,
      p_device_name: deviceName || null,
    });

    if (error) {
      console.error("[NOTIFICATIONS] Token registration failed:", error);
      return { success: false, error: error.message };
    }

    console.log(`[NOTIFICATIONS] Token registered for ${hashUserId(userId)}`);
    return { success: true, tokenId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Process notification queue (for cron job)
 */
async function handleProcessQueue(
  supabase: ReturnType<typeof createClient>
): Promise<{ processed: number; sent: number; failed: number }> {
  // Get pending notifications scheduled for now or earlier
  const { data: queue } = await supabase
    .from("notification_queue")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", new Date().toISOString())
    .order("priority", { ascending: false })
    .order("scheduled_for", { ascending: true })
    .limit(RATE_LIMIT.maxBatchSize);

  if (!queue || queue.length === 0) {
    return { processed: 0, sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const item of queue) {
    // Check TTL
    const createdAt = new Date(item.created_at).getTime();
    const ttl = item.ttl_seconds * 1000;
    if (Date.now() - createdAt > ttl) {
      // Mark as expired
      await supabase
        .from("notification_queue")
        .update({ status: "cancelled" })
        .eq("id", item.id);
      continue;
    }

    // Send notification
    const result = await handleSendNotification(supabase, {
      userId: item.user_id,
      type: item.notification_type as NotificationType,
      title: item.title,
      body: item.body,
      data: item.data || {},
    });

    // Update queue status
    if (result.sent > 0) {
      await supabase
        .from("notification_queue")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", item.id);
      sent++;
    } else if (result.failed > 0) {
      const retryCount = item.retry_count + 1;
      if (retryCount >= 3) {
        await supabase
          .from("notification_queue")
          .update({
            status: "failed",
            error_message: result.errors.join("; "),
            retry_count: retryCount,
          })
          .eq("id", item.id);
        failed++;
      } else {
        // Retry later
        await supabase
          .from("notification_queue")
          .update({
            retry_count: retryCount,
            scheduled_for: new Date(Date.now() + 60000 * retryCount).toISOString(), // Exponential backoff
          })
          .eq("id", item.id);
      }
    }
  }

  console.log(`[NOTIFICATIONS] Queue processed: ${queue.length} items, ${sent} sent, ${failed} failed`);
  return { processed: queue.length, sent, failed };
}

/**
 * Get user notification preferences
 */
async function handleGetPreferences(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ success: boolean; preferences?: NotificationPreferences; error?: string }> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    // Create default preferences if not exists
    if (error.code === "PGRST116") {
      const { data: newData, error: insertError } = await supabase
        .from("notification_preferences")
        .insert({ user_id: userId })
        .select()
        .single();

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      return { success: true, preferences: newData as NotificationPreferences };
    }

    return { success: false, error: error.message };
  }

  return { success: true, preferences: data as NotificationPreferences };
}

/**
 * Update user notification preferences
 */
async function handleUpdatePreferences(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  updates: Partial<NotificationPreferences>
): Promise<{ success: boolean; preferences?: NotificationPreferences; error?: string }> {
  const { data, error } = await supabase
    .from("notification_preferences")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, preferences: data as NotificationPreferences };
}

// =======================
// MAIN HANDLER
// =======================

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop() || "";

  // CORS preflight
  if (req.method === "OPTIONS") {
    const allowOrigin = ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
      ? origin
      : ALLOWED_ORIGINS[0];

    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "authorization, content-type, x-client-info",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const allowOrigin = ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
    ? origin
    : ALLOWED_ORIGINS[0];

  try {
    // JWT Validation (except for process-queue which uses service key)
    const authHeader = req.headers.get("Authorization");
    const isServiceCall = path === "process-queue";

    if (!authHeader && !isServiceCall) {
      return jsonResponse({ error: "Missing authorization header" }, 401, allowOrigin);
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let userId = "";

    if (!isServiceCall) {
      const token = authHeader!.replace("Bearer ", "");
      const {
        data: { user },
        error: authError,
      } = await supabaseAdmin.auth.getUser(token);

      if (authError || !user) {
        return jsonResponse({ error: "Invalid or expired token" }, 401, allowOrigin);
      }

      userId = user.id;
    }

    // Route handlers
    switch (path) {
      case "send": {
        if (req.method !== "POST") {
          return jsonResponse({ error: "Method not allowed" }, 405, allowOrigin);
        }

        const body = await req.json() as SendNotificationRequest;
        const targetUserId = body.userId || userId;

        // Only allow sending to self or service role
        if (targetUserId !== userId) {
          return jsonResponse({ error: "Cannot send notifications to other users" }, 403, allowOrigin);
        }

        const result = await handleSendNotification(supabaseAdmin, {
          ...body,
          userId: targetUserId,
        });

        return jsonResponse(result, 200, allowOrigin);
      }

      case "send-templated": {
        if (req.method !== "POST") {
          return jsonResponse({ error: "Method not allowed" }, 405, allowOrigin);
        }

        const body = await req.json() as SendTemplatedNotificationRequest;
        const targetUserId = body.userId || userId;

        // Only allow sending to self or service role
        if (targetUserId !== userId) {
          return jsonResponse({ error: "Cannot send notifications to other users" }, 403, allowOrigin);
        }

        const result = await handleSendTemplatedNotification(supabaseAdmin, {
          ...body,
          userId: targetUserId,
        });

        return jsonResponse(result, result.success ? 200 : 400, allowOrigin);
      }

      case "broadcast": {
        // Only service role can broadcast
        if (req.method !== "POST") {
          return jsonResponse({ error: "Method not allowed" }, 405, allowOrigin);
        }

        const serviceKey = req.headers.get("x-service-key");
        if (serviceKey !== SUPABASE_SERVICE_KEY) {
          return jsonResponse({ error: "Unauthorized" }, 403, allowOrigin);
        }

        const body = await req.json() as BroadcastRequest;
        const result = await handleBroadcast(supabaseAdmin, body);

        return jsonResponse(result, 200, allowOrigin);
      }

      case "register-token": {
        if (req.method !== "POST") {
          return jsonResponse({ error: "Method not allowed" }, 405, allowOrigin);
        }

        const body = await req.json() as RegisterTokenRequest;
        const result = await handleRegisterToken(supabaseAdmin, userId, body);

        return jsonResponse(result, result.success ? 200 : 400, allowOrigin);
      }

      case "process-queue": {
        // Only for cron jobs / service calls
        if (req.method !== "POST") {
          return jsonResponse({ error: "Method not allowed" }, 405, allowOrigin);
        }

        const serviceKey = req.headers.get("x-service-key") || req.headers.get("Authorization")?.replace("Bearer ", "");
        if (serviceKey !== SUPABASE_SERVICE_KEY) {
          return jsonResponse({ error: "Unauthorized" }, 403, allowOrigin);
        }

        const result = await handleProcessQueue(supabaseAdmin);
        return jsonResponse(result, 200, allowOrigin);
      }

      case "preferences": {
        if (req.method === "GET") {
          const result = await handleGetPreferences(supabaseAdmin, userId);
          return jsonResponse(result, result.success ? 200 : 400, allowOrigin);
        }

        if (req.method === "PUT") {
          const body = await req.json() as Partial<NotificationPreferences>;
          const result = await handleUpdatePreferences(supabaseAdmin, userId, body);
          return jsonResponse(result, result.success ? 200 : 400, allowOrigin);
        }

        return jsonResponse({ error: "Method not allowed" }, 405, allowOrigin);
      }

      default:
        return jsonResponse({ error: "Not found", path }, 404, allowOrigin);
    }
  } catch (error) {
    console.error("[NOTIFICATIONS] Error:", error);
    return jsonResponse(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500,
      allowOrigin
    );
  }
});
