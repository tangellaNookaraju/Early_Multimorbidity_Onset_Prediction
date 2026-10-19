import React from 'react';

export default function Explainability() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Model Explainability (SHAP/LIME)</h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Feature importance and local explanations will appear here.</p>
            </div>
        </div>
    );
}
