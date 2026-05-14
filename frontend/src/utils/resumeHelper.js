import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const handleResumeUpload = async (file, jobId, token) => {
  if (!file) throw new Error("No file selected");
  if (!jobId) throw new Error("Job ID is required");

  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job', jobId); // Matches Django ForeignKey field name

  try {
    const res = await axios.post(`${API_URL}/resume/upload/`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    // Extract the most helpful error message
    const errorMsg = err.response?.data?.error || 
                     err.response?.data?.detail || 
                     "Upload failed";
    throw new Error(errorMsg);
  }
};