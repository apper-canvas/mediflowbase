class BedService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'bed_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI expected format
      return response.data.map(bed => ({
        Id: bed.Id,
        id: bed.id_c || `B${bed.Id.toString().padStart(3, '0')}`,
        ward: bed.ward_c,
        number: bed.number_c,
        type: bed.type_c,
        status: bed.status_c,
        patientId: bed.patient_id_c,
        lastCleaned: bed.last_cleaned_c
      }));
    } catch (error) {
      console.error("Error fetching beds:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }

      // Transform database field names to UI expected format
      const bed = response.data;
      return {
        Id: bed.Id,
        id: bed.id_c || `B${bed.Id.toString().padStart(3, '0')}`,
        ward: bed.ward_c,
        number: bed.number_c,
        type: bed.type_c,
        status: bed.status_c,
        patientId: bed.patient_id_c,
        lastCleaned: bed.last_cleaned_c
      };
    } catch (error) {
      console.error(`Error fetching bed ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(bedData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: bedData.number || `${bedData.ward}-${bedData.number}`,
          id_c: bedData.id || `B${Date.now().toString().slice(-3)}`,
          ward_c: bedData.ward,
          number_c: bedData.number,
          type_c: bedData.type,
          status_c: bedData.status || 'Available',
          patient_id_c: bedData.patientId || null,
          last_cleaned_c: bedData.lastCleaned || new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bed records:`, failed);
          throw new Error("Failed to create bed");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error creating bed:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, bedData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          // Only include Updateable fields
          Name: bedData.number || `${bedData.ward}-${bedData.number}`,
          id_c: bedData.id,
          ward_c: bedData.ward,
          number_c: bedData.number,
          type_c: bedData.type,
          status_c: bedData.status,
          patient_id_c: bedData.patientId,
          last_cleaned_c: bedData.lastCleaned
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bed records:`, failed);
          throw new Error("Failed to update bed");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error updating bed:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bed records:`, failed);
          return false;
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting bed:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByWard(ward) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ],
        where: [{"FieldName": "ward_c", "Operator": "EqualTo", "Values": [ward]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(bed => ({
        Id: bed.Id,
        id: bed.id_c || `B${bed.Id.toString().padStart(3, '0')}`,
        ward: bed.ward_c,
        number: bed.number_c,
        type: bed.type_c,
        status: bed.status_c,
        patientId: bed.patient_id_c,
        lastCleaned: bed.last_cleaned_c
      }));
    } catch (error) {
      console.error("Error fetching beds by ward:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getAvailableBeds() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": ["Available"]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(bed => ({
        Id: bed.Id,
        id: bed.id_c || `B${bed.Id.toString().padStart(3, '0')}`,
        ward: bed.ward_c,
        number: bed.number_c,
        type: bed.type_c,
        status: bed.status_c,
        patientId: bed.patient_id_c,
        lastCleaned: bed.last_cleaned_c
      }));
    } catch (error) {
      console.error("Error fetching available beds:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getOccupiedBeds() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": ["Occupied"]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(bed => ({
        Id: bed.Id,
        id: bed.id_c || `B${bed.Id.toString().padStart(3, '0')}`,
        ward: bed.ward_c,
        number: bed.number_c,
        type: bed.type_c,
        status: bed.status_c,
        patientId: bed.patient_id_c,
        lastCleaned: bed.last_cleaned_c
      }));
    } catch (error) {
      console.error("Error fetching occupied beds:", error?.response?.data?.message || error);
      return [];
    }
  }

  async assignPatient(bedId, patientId) {
    try {
      const params = {
        records: [{
          Id: parseInt(bedId),
          status_c: "Occupied",
          patient_id_c: patientId
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to assign patient to ${failed.length} bed records:`, failed);
          throw new Error("Failed to assign patient to bed");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error assigning patient to bed:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async releasePatient(bedId) {
    try {
      const params = {
        records: [{
          Id: parseInt(bedId),
          status_c: "Available",
          patient_id_c: null,
          last_cleaned_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to release patient from ${failed.length} bed records:`, failed);
          throw new Error("Failed to release patient from bed");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error releasing patient from bed:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new BedService();