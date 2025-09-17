import { supabase } from './supabaseClient';
import { errorService } from './errorService';
import { ResidentFellow } from '../types/dmp';

export class HealthcareProviderService {
  /**
   * Get all healthcare providers with filtering and pagination
   */
  static async getProviders(filters: {
    search?: string;
    specialty?: string;
    state?: string;
    status?: string;
    managedBy?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('healthcare_providers')
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(first_name, last_name),
          modified_by_user:users!healthcare_providers_last_modified_by_fkey(first_name, last_name)
        `);

      // Apply filters
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,npi.ilike.%${filters.search}%`);
      }
      if (filters.specialty) {
        query = query.eq('primary_specialty', filters.specialty);
      }
      if (filters.state) {
        query = query.eq('practice_state', filters.state);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.managedBy) {
        query = query.eq('entered_by', filters.managedBy);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch providers: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'Provider fetch', filters });
      throw error;
    }
  }

  /**
   * Get a single healthcare provider by ID
   */
  static async getProvider(id: string) {
    try {
      const { data, error } = await supabase
        .from('healthcare_providers')
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(first_name, last_name),
          modified_by_user:users!healthcare_providers_last_modified_by_fkey(first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch provider: ${error.message}`);
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'Single provider fetch', id });
      throw error;
    }
  }

  /**
   * Create a new healthcare provider
   */
  static async createProvider(providerData: Partial<ResidentFellow>, userId: string) {
    try {
      const { data, error } = await supabase
        .from('healthcare_providers')
        .insert({
          npi: providerData.npi,
          first_name: providerData.firstName,
          middle_name: providerData.middleName,
          last_name: providerData.lastName,
          credentials: providerData.credentials,
          gender: providerData.gender,
          date_of_birth: providerData.dateOfBirth,
          email: providerData.email,
          phone: providerData.phone,
          alternate_phone: providerData.alternatePhone,
          practice_address_1: providerData.practiceAddress1,
          practice_address_2: providerData.practiceAddress2,
          practice_city: providerData.practiceCity,
          practice_state: providerData.practiceState,
          practice_zip: providerData.practiceZip,
          mailing_address_1: providerData.mailingAddress1,
          mailing_address_2: providerData.mailingAddress2,
          mailing_city: providerData.mailingCity,
          mailing_state: providerData.mailingState,
          mailing_zip: providerData.mailingZip,
          primary_specialty: providerData.primarySpecialty,
          secondary_specialty: providerData.secondarySpecialty,
          taxonomy_code: providerData.taxonomyCode,
          license_state: providerData.licenseState,
          license_number: providerData.licenseNumber,
          license_issue_date: providerData.licenseIssueDate,
          license_expire_date: providerData.licenseExpireDate,
          board_name: providerData.boardName,
          certificate_name: providerData.certificateName,
          certification_start_date: providerData.certificationStartDate,
          program_name: providerData.programName,
          institution: providerData.institution,
          program_type: providerData.programType,
          training_start_date: providerData.trainingStartDate,
          training_end_date: providerData.trainingEndDate,
          pgy_year: providerData.pgyYear,
          dea_number: providerData.deaNumber,
          medicare_number: providerData.medicareNumber,
          medicaid_number: providerData.medicaidNumber,
          sole_proprietor: providerData.soleProprietor,
          source_type: providerData.sourceType,
          source_artifact: providerData.sourceArtifact,
          source_url: providerData.sourceUrl,
          source_fetch_date: providerData.sourceFetchDate,
          source_hash: providerData.sourceHash,
          status: providerData.status || 'pending',
          entered_by: userId,
          entered_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create provider: ${error.message}`);
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'Provider creation', providerData, userId });
      throw error;
    }
  }

  /**
   * Update an existing healthcare provider
   */
  static async updateProvider(id: string, providerData: Partial<ResidentFellow>, userId: string) {
    try {
      const { data, error } = await supabase
        .from('healthcare_providers')
        .update({
          ...providerData,
          last_modified_by: userId,
          last_modified_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update provider: ${error.message}`);
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'Provider update', id, providerData, userId });
      throw error;
    }
  }

  /**
   * Delete a healthcare provider
   */
  static async deleteProvider(id: string) {
    try {
      const { error } = await supabase
        .from('healthcare_providers')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete provider: ${error.message}`);
      }
    } catch (error) {
      errorService.logError(error as Error, { context: 'Provider deletion', id });
      throw error;
    }
  }

  /**
   * Bulk import providers
   */
  static async bulkImportProviders(providers: Partial<ResidentFellow>[], userId: string) {
    try {
      const recordsToInsert = providers.map(provider => ({
        npi: provider.npi,
        first_name: provider.firstName,
        middle_name: provider.middleName,
        last_name: provider.lastName,
        credentials: provider.credentials,
        gender: provider.gender,
        date_of_birth: provider.dateOfBirth,
        email: provider.email,
        phone: provider.phone,
        alternate_phone: provider.alternatePhone,
        practice_address_1: provider.practiceAddress1,
        practice_address_2: provider.practiceAddress2,
        practice_city: provider.practiceCity,
        practice_state: provider.practiceState,
        practice_zip: provider.practiceZip,
        mailing_address_1: provider.mailingAddress1,
        mailing_address_2: provider.mailingAddress2,
        mailing_city: provider.mailingCity,
        mailing_state: provider.mailingState,
        mailing_zip: provider.mailingZip,
        primary_specialty: provider.primarySpecialty,
        secondary_specialty: provider.secondarySpecialty,
        taxonomy_code: provider.taxonomyCode,
        license_state: provider.licenseState,
        license_number: provider.licenseNumber,
        license_issue_date: provider.licenseIssueDate,
        license_expire_date: provider.licenseExpireDate,
        board_name: provider.boardName,
        certificate_name: provider.certificateName,
        certification_start_date: provider.certificationStartDate,
        program_name: provider.programName,
        institution: provider.institution,
        program_type: provider.programType,
        training_start_date: provider.trainingStartDate,
        training_end_date: provider.trainingEndDate,
        pgy_year: provider.pgyYear,
        dea_number: provider.deaNumber,
        medicare_number: provider.medicareNumber,
        medicaid_number: provider.medicaidNumber,
        sole_proprietor: provider.soleProprietor,
        source_type: provider.sourceType,
        source_artifact: provider.sourceArtifact,
        source_url: provider.sourceUrl,
        source_fetch_date: provider.sourceFetchDate,
        source_hash: provider.sourceHash,
        status: provider.status || 'pending',
        entered_by: userId,
        entered_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('healthcare_providers')
        .insert(recordsToInsert)
        .select();

      if (error) {
        throw new Error(`Failed to bulk import providers: ${error.message}`);
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'Bulk provider import', count: providers.length, userId });
      throw error;
    }
  }
}