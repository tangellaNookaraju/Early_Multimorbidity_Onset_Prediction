import React, { useState, useEffect } from 'react';
import { Upload as UploadIcon, FileText, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Upload() {
    const [uploads, setUploads] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUploads();
    }, []);

    const fetchUploads = async () => {
        try {
            const response = await axios.get('http://localhost:8000/uploads', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUploads(response.data);
        } catch (err) {
            console.error("Error fetching uploads:", err);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchUploads();
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Upload Patient Data</h1>
                <p className="text-gray-500">Upload longitudinal EHR data for bulk analysis.</p>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <label className="block">
                <input type="file" className="hidden" accept=".csv,.xlsx,.json" onChange={handleFileChange} disabled={uploading} />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors">
                        {uploading ? (
                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <UploadIcon className="text-indigo-600" size={32} />
                        )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{uploading ? "Uploading..." : "Click to upload or drag and drop"}</h3>
                    <p className="text-gray-500 mt-2">CSV, Excel or JSON files (MAX. 500MB)</p>
                    <div className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Select Files
                    </div>
                </motion.div>
            </label>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Recent Uploads</h3>
                <div className="space-y-4">
                    {uploads.length === 0 ? (
                         <p className="text-sm text-gray-400">No recent uploads here.</p>
                    ) : uploads.map((upload) => (
                        <div key={upload._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{upload.filename}</p>
                                    <p className="text-xs text-gray-500">{(upload.file_size_bytes / 1024 / 1024).toFixed(2)} MB • {new Date(upload.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                <Check size={16} />
                                <span>{upload.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
