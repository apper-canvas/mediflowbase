class PatientService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'patient_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI expected format
      return response.data.map(patient => ({
        Id: patient.Id,
        id: patient.id_c || `P${patient.Id.toString().padStart(3, '0')}`,
        name: patient.name_c || patient.Name,
        dateOfBirth: patient.date_of_birth_c,
        gender: patient.gender_c,
        contact: patient.contact_c,
        emergencyContact: patient.emergency_contact_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
        currentWard: patient.current_ward_c,
        bedNumber: patient.bed_number_c,
        status: patient.status_c,
        admissionDate: patient.admission_date_c
      }));
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }

      // Transform database field names to UI expected format
      const patient = response.data;
      return {
        Id: patient.Id,
        id: patient.id_c || `P${patient.Id.toString().padStart(3, '0')}`,
        name: patient.name_c || patient.Name,
        dateOfBirth: patient.date_of_birth_c,
        gender: patient.gender_c,
        contact: patient.contact_c,
        emergencyContact: patient.emergency_contact_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
        currentWard: patient.current_ward_c,
        bedNumber: patient.bed_number_c,
        status: patient.status_c,
        admissionDate: patient.admission_date_c
      };
    } catch (error) {
      console.error(`Error fetching patient ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(patientData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: patientData.name,
          id_c: patientData.id || `P${Date.now().toString().slice(-3)}`,
          name_c: patientData.name,
          date_of_birth_c: patientData.dateOfBirth,
          gender_c: patientData.gender,
          contact_c: patientData.contact,
          emergency_contact_c: patientData.emergencyContact,
          blood_type_c: patientData.bloodType,
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(', ') : patientData.allergies || '',
          current_ward_c: patientData.currentWard,
          bed_number_c: patientData.bedNumber,
          status_c: patientData.status || 'Stable',
          admission_date_c: patientData.admissionDate || new Date().toISOString().split('T')[0]
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
          console.error(`Failed to create ${failed.length} patient records:`, failed);
          throw new Error("Failed to create patient");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, patientData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          // Only include Updateable fields
          Name: patientData.name,
          id_c: patientData.id,
          name_c: patientData.name,
          date_of_birth_c: patientData.dateOfBirth,
          gender_c: patientData.gender,
          contact_c: patientData.contact,
          emergency_contact_c: patientData.emergencyContact,
          blood_type_c: patientData.bloodType,
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(', ') : patientData.allergies || '',
          current_ward_c: patientData.currentWard,
          bed_number_c: patientData.bedNumber,
          status_c: patientData.status,
          admission_date_c: patientData.admissionDate
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
          console.error(`Failed to update ${failed.length} patient records:`, failed);
          throw new Error("Failed to update patient");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} patient records:`, failed);
          return false;
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      return false;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "id_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "contact_c", "operator": "Contains", "values": [query]}], "operator": ""}
          ]
        }]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(patient => ({
        Id: patient.Id,
        id: patient.id_c || `P${patient.Id.toString().padStart(3, '0')}`,
        name: patient.name_c || patient.Name,
        dateOfBirth: patient.date_of_birth_c,
        gender: patient.gender_c,
        contact: patient.contact_c,
        emergencyContact: patient.emergency_contact_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
        currentWard: patient.current_ward_c,
        bedNumber: patient.bed_number_c,
        status: patient.status_c,
        admissionDate: patient.admission_date_c
      }));
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(patient => ({
        Id: patient.Id,
        id: patient.id_c || `P${patient.Id.toString().padStart(3, '0')}`,
        name: patient.name_c || patient.Name,
        dateOfBirth: patient.date_of_birth_c,
        gender: patient.gender_c,
        contact: patient.contact_c,
        emergencyContact: patient.emergency_contact_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
        currentWard: patient.current_ward_c,
        bedNumber: patient.bed_number_c,
        status: patient.status_c,
        admissionDate: patient.admission_date_c
      }));
    } catch (error) {
      console.error("Error fetching patients by status:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new PatientService();

export default new PatientService();