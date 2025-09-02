class AppointmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'appointment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI expected format
      return response.data.map(appointment => ({
        Id: appointment.Id,
        id: appointment.id_c || `A${appointment.Id.toString().padStart(3, '0')}`,
        patientId: appointment.patient_id_c,
        doctorId: appointment.doctor_id_c,
        department: appointment.department_c,
        dateTime: appointment.date_time_c,
        duration: appointment.duration_c,
        type: appointment.type_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      }));
    } catch (error) {
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }

      // Transform database field names to UI expected format
      const appointment = response.data;
      return {
        Id: appointment.Id,
        id: appointment.id_c || `A${appointment.Id.toString().padStart(3, '0')}`,
        patientId: appointment.patient_id_c,
        doctorId: appointment.doctor_id_c,
        department: appointment.department_c,
        dateTime: appointment.date_time_c,
        duration: appointment.duration_c,
        type: appointment.type_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      };
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(appointmentData) {
    try {
      const params = {
        records: [{
          // Only include Updateable fields
          Name: appointmentData.type || 'Appointment',
          id_c: appointmentData.id || `A${Date.now().toString().slice(-3)}`,
          patient_id_c: appointmentData.patientId,
          doctor_id_c: appointmentData.doctorId,
          department_c: appointmentData.department,
          date_time_c: appointmentData.dateTime,
          duration_c: appointmentData.duration || 30,
          type_c: appointmentData.type,
          status_c: appointmentData.status || 'Scheduled',
          notes_c: appointmentData.notes || ''
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
          console.error(`Failed to create ${failed.length} appointment records:`, failed);
          throw new Error("Failed to create appointment");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error creating appointment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, appointmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          // Only include Updateable fields
          Name: appointmentData.type || 'Appointment',
          id_c: appointmentData.id,
          patient_id_c: appointmentData.patientId,
          doctor_id_c: appointmentData.doctorId,
          department_c: appointmentData.department,
          date_time_c: appointmentData.dateTime,
          duration_c: appointmentData.duration,
          type_c: appointmentData.type,
          status_c: appointmentData.status,
          notes_c: appointmentData.notes
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
          console.error(`Failed to update ${failed.length} appointment records:`, failed);
          throw new Error("Failed to update appointment");
        }
        return successful[0]?.data || null;
      }
    } catch (error) {
      console.error("Error updating appointment:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} appointment records:`, failed);
          return false;
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting appointment:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [
          {"FieldName": "date_time_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "date_time_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(appointment => ({
        Id: appointment.Id,
        id: appointment.id_c || `A${appointment.Id.toString().padStart(3, '0')}`,
        patientId: appointment.patient_id_c,
        doctorId: appointment.doctor_id_c,
        department: appointment.department_c,
        dateTime: appointment.date_time_c,
        duration: appointment.duration_c,
        type: appointment.type_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      }));
    } catch (error) {
      console.error("Error fetching appointments by date range:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(appointment => ({
        Id: appointment.Id,
        id: appointment.id_c || `A${appointment.Id.toString().padStart(3, '0')}`,
        patientId: appointment.patient_id_c,
        doctorId: appointment.doctor_id_c,
        department: appointment.department_c,
        dateTime: appointment.date_time_c,
        duration: appointment.duration_c,
        type: appointment.type_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      }));
    } catch (error) {
      console.error("Error fetching appointments by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getTodaysAppointments() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "date_time_c", "Operator": "StartsWith", "Values": [today]}]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(appointment => ({
        Id: appointment.Id,
        id: appointment.id_c || `A${appointment.Id.toString().padStart(3, '0')}`,
        patientId: appointment.patient_id_c,
        doctorId: appointment.doctor_id_c,
        department: appointment.department_c,
        dateTime: appointment.date_time_c,
        duration: appointment.duration_c,
        type: appointment.type_c,
        status: appointment.status_c,
        notes: appointment.notes_c
      }));
    } catch (error) {
      console.error("Error fetching today's appointments:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new AppointmentService();

export default new AppointmentService();