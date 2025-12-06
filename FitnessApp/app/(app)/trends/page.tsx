'use client';

import { useEffect, useState } from 'react';
import { Activity, Moon, Heart, TrendingUp } from 'lucide-react';

export default function TrendsPage() {
  const [selectedTab, setSelectedTab] = useState('activity');

  const tabs = [
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'sleep', name: 'Sleep & Recovery', icon: Moon },
    { id: 'body', name: 'Body Metrics', icon: Heart },
    { id: 'nutrition', name: 'Nutrition', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Trends</h1>
          <p className="text-sm text-gray-600">Track your progress over time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 -mb-px">
            {tabs?.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
              <TrendingUp className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Trends & Analytics
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your historical data and trends will be displayed here. Keep tracking your progress to see meaningful insights!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
