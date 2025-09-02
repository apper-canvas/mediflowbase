class StaffService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'staff_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI expected format
      return response.data.map(staff => ({
        Id: staff.Id,
        id: staff.id_c || `S${staff.Id.toString().padStart(3, '0')}`,
        name: staff.name_c || staff.Name,
        role: staff.role_c,
        department: staff.department_c,
        shift: staff.shift_c,
        contact: staff.contact_c,
        specialization: staff.specialization_c
      }));
    } catch (error) {
      console.error("Error fetching staff:", error?.response?.data?.message || error);
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
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }

      // Transform database field names to UI expected format
      const staff = response.data;
      return {
        Id: staff.Id,
        id: staff.id_c || `S${staff.Id.toString().padStart(3, '0')}`,
        name: staff.name_c || staff.Name,
        role: staff.role_c,
        department: staff.department_c,
        shift: staff.shift_c,
        contact: staff.contact_c,
        specialization: staff.specialization_c
      };
    } catch (error) {
      console.error(`Error fetching staff ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(staffData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: staffData.name,
          id_c: staffData.id || `S${Date.now().toString().slice(-3)}`,
          name_c: staffData.name,
          role_c: staffData.role,
          department_c: staffData.department,
          shift_c: staffData.shift,
          contact_c: staffData.contact,
          specialization_c: staffData.specialization
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
          console.error(`Failed to create ${failed.length} staff records:`, failed);
          throw new Error("Failed to create staff member");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error creating staff:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, staffData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          // Only include Updateable fields
          Name: staffData.name,
          id_c: staffData.id,
          name_c: staffData.name,
          role_c: staffData.role,
          department_c: staffData.department,
          shift_c: staffData.shift,
          contact_c: staffData.contact,
          specialization_c: staffData.specialization
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
          console.error(`Failed to update ${failed.length} staff records:`, failed);
          throw new Error("Failed to update staff member");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error updating staff:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} staff records:`, failed);
          return false;
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting staff:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(staff => ({
        Id: staff.Id,
        id: staff.id_c || `S${staff.Id.toString().padStart(3, '0')}`,
        name: staff.name_c || staff.Name,
        role: staff.role_c,
        department: staff.department_c,
        shift: staff.shift_c,
        contact: staff.contact_c,
        specialization: staff.specialization_c
      }));
    } catch (error) {
      console.error("Error fetching staff by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByRole(role) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
        ],
        where: [{"FieldName": "role_c", "Operator": "EqualTo", "Values": [role]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(staff => ({
        Id: staff.Id,
        id: staff.id_c || `S${staff.Id.toString().padStart(3, '0')}`,
        name: staff.name_c || staff.Name,
        role: staff.role_c,
        department: staff.department_c,
        shift: staff.shift_c,
        contact: staff.contact_c,
        specialization: staff.specialization_c
      }));
    } catch (error) {
      console.error("Error fetching staff by role:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByShift(shift) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
        ],
        where: [{"FieldName": "shift_c", "Operator": "EqualTo", "Values": [shift]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(staff => ({
        Id: staff.Id,
        id: staff.id_c || `S${staff.Id.toString().padStart(3, '0')}`,
        name: staff.name_c || staff.Name,
        role: staff.role_c,
        department: staff.department_c,
        shift: staff.shift_c,
        contact: staff.contact_c,
        specialization: staff.specialization_c
      }));
    } catch (error) {
      console.error("Error fetching staff by shift:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new StaffService();
