// @@filename: src/services/api-key-service.ts
import { v4 as uuidv4 } from "uuid";
import { getSupabase } from "../utils/supabase-client";
import { logger } from "../config/logger";
import {
  ApiKey,
  CreateApiKeyDto,
  UpdateApiKeyDto,
} from "../models/api-key-model";
import { redis } from "../utils/redis-client";

export class ApiKeyService {
  private readonly tableName = "api_keys";

  async createApiKey(dto: CreateApiKeyDto): Promise<ApiKey> {
    const newApiKey: Omit<
      ApiKey,
      "id" | "key" | "createdAt" | "lastUsed" | "isActive"
    > = {
      userId: dto.userId,
      credits: dto.credits,
    };

    const { data, error } = await getSupabase()
      .from(this.tableName)
      .insert({
        ...newApiKey,
        id: uuidv4(),
        key: this.generateApiKey(),
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating API key:", error);
      throw new Error("Failed to create API key");
    }

    await this.cacheApiKey(data);
    return data;
  }

  async getAllApiKeys(): Promise<ApiKey[]> {
    const { data, error } = await getSupabase()
      .from(this.tableName)
      .select("*");

    if (error) {
      logger.error("Error fetching API keys:", error);
      throw new Error("Failed to fetch API keys");
    }

    return data || [];
  }

  async getApiKey(key: string): Promise<ApiKey | null> {
    // Try to get from cache first
    const cachedApiKey = await redis.get(`apikey:${key}`);
    if (cachedApiKey) {
      return JSON.parse(cachedApiKey);
    }

    const { data, error } = await getSupabase()
      .from(this.tableName)
      .select("*")
      .eq("key", key)
      .single();

    if (error) {
      logger.error("Error fetching API key:", error);
      throw new Error("Failed to fetch API key");
    }

    if (data) {
      await this.cacheApiKey(data);
    }

    return data;
  }

  async deductCredits(key: string, amount: number): Promise<ApiKey> {
    const { data, error } = await getSupabase()
      .rpc("deduct_credits", { api_key_param: key, deduct_amount: amount })
      .single();

    if (error) {
      logger.error("Error deducting credits:", error);
      if (error.message === "Insufficient credits") {
        throw new Error("Insufficient credits");
      }
      throw new Error("Failed to deduct credits");
    }

    const apiKeyData = data as ApiKey;
    await this.cacheApiKey(apiKeyData);
    return apiKeyData;
  }

  async addCredits(key: string, amount: number): Promise<ApiKey> {
    const { data, error } = await getSupabase()
      .rpc("add_credits", { api_key_param: key, add_amount: amount })
      .single();

    if (error) {
      logger.error("Error adding credits:", error);
      throw new Error("Failed to add credits");
    }

    const apiKeyData = data as ApiKey;
    await this.cacheApiKey(apiKeyData);
    return apiKeyData;
  }

  async updateApiKey(key: string, dto: UpdateApiKeyDto): Promise<ApiKey> {
    const { data, error } = await getSupabase()
      .from(this.tableName)
      .update(dto)
      .eq("key", key)
      .select()
      .single();

    if (error) {
      logger.error("Error updating API key:", error);
      throw new Error("Failed to update API key");
    }

    await this.cacheApiKey(data);
    return data;
  }

  async deactivateApiKey(key: string): Promise<void> {
    const { error } = await getSupabase()
      .from(this.tableName)
      .update({ isActive: false })
      .eq("key", key);

    if (error) {
      logger.error("Error deactivating API key:", error);
      throw new Error("Failed to deactivate API key");
    }

    await redis.del(`apikey:${key}`);
  }

  private async cacheApiKey(apiKey: ApiKey): Promise<void> {
    await redis.set(`apikey:${apiKey.key}`, JSON.stringify(apiKey), "EX", 3600); // Cache for 1 hour
  }

  private generateApiKey(): string {
    return `ak_${uuidv4().replace(/-/g, "")}`;
  }
}
