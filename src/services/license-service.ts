// @@filename: src/services/license-service.ts
import { getSupabase } from "../utils/supabase-client";
import { logger } from "../config/logger";
import {
  License,
  CreateLicenseDto,
  UpdateLicenseDto,
} from "../models/license-model";
import { redis } from "../utils/redis-client";

export class LicenseService {
  private readonly tableName = "licenses";

  async createLicense(dto: CreateLicenseDto): Promise<License> {
    const { data, error } = await getSupabase()
      .rpc("create_license", {
        api_key_id_param: dto.apiKeyId,
        product_id_param: dto.productId,
        expires_at_param: dto.expiresAt,
      })
      .single();

    if (error) {
      logger.error("Error creating license:", error);
      throw new Error("Failed to create license");
    }

    const licenseKeyData = data as License;
    await this.cacheLicense(licenseKeyData);
    return licenseKeyData;
  }

  async getLicense(id: string): Promise<License | null> {
    // Try to get from cache first
    const cachedLicense = await redis.get(`license:${id}`);
    if (cachedLicense) {
      return JSON.parse(cachedLicense);
    }

    const { data, error } = await getSupabase()
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      logger.error("Error fetching license:", error);
      throw new Error("Failed to fetch license");
    }

    if (data) {
      await this.cacheLicense(data);
    }

    return data;
  }

  async updateLicense(id: string, dto: UpdateLicenseDto): Promise<License> {
    const { data, error } = await getSupabase()
      .from(this.tableName)
      .update(dto)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      logger.error("Error updating license:", error);
      throw new Error("Failed to update license");
    }

    await this.cacheLicense(data);
    return data;
  }

  async revokeLicense(id: string): Promise<License> {
    const { data, error } = await getSupabase()
      .rpc("revoke_license", { license_id_param: id })
      .single();

    if (error) {
      logger.error("Error revoking license:", error);
      throw new Error("Failed to revoke license");
    }
    const licenseKeyData = data as License;
    await this.cacheLicense(licenseKeyData);
    return licenseKeyData;
  }

  async getLicensesByApiKey(apiKeyId: string): Promise<License[]> {
    const { data, error } = await getSupabase()
      .from(this.tableName)
      .select("*")
      .eq("api_key_id", apiKeyId);

    if (error) {
      logger.error("Error fetching licenses by API key:", error);
      throw new Error("Failed to fetch licenses");
    }

    return data;
  }

  private async cacheLicense(license: License): Promise<void> {
    await redis.set(
      `license:${license.id}`,
      JSON.stringify(license),
      "EX",
      3600
    ); // Cache for 1 hour
  }
}
