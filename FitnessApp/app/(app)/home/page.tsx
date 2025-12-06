'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Activity,
  Cloud,
  Moon,
  Footprints,
  Battery,
  Brain,
  Heart,
  Droplets,
  Weight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { data: session } = useSession() || {};
  const [todayData, setTodayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const response = await fetch('/api/health/today');
      if (response.ok) {
        const data = await response.json();
        setTodayData(data);
      }
    } catch (error) {
      console.error('Failed to fetch today data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const recoveryScore = todayData?.healthData?.recoveryScore || 3;
  const bodyBattery = todayData?.healthData?.bodyBatteryScore || 75;
  const sleepQuality = todayData?.healthData?.sleepQuality || 3;

  let trainingRecommendation = 'Normal training day';
  let trainingChipStyle = 'bg-blue-100 text-blue-700';

  if (recoveryScore >= 4 && bodyBattery >= 75) {
    trainingRecommendation = 'Push hard today';
    trainingChipStyle = 'bg-green-100 text-green-700';
  } else if (recoveryScore <= 2 || bodyBattery < 50) {
    trainingRecommendation = 'Go light & recover';
    trainingChipStyle = 'bg-orange-100 text-orange-700';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {session?.user?.name || 'there'}!
          </h1>
          <p className="text-sm text-gray-600">Today's Overview</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Today's Recommendation</p>
              <h2 className="text-2xl font-bold">Ready to Train</h2>
            </div>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                trainingChipStyle
              )}
            >
              {trainingRecommendation}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4" />
              <span>Body Battery: {bodyBattery}/100</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Recovery: {recoveryScore}/5</span>
            </div>
          </div>
          {todayData?.onboarding && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm opacity-90 mb-1">Daily Targets</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-white/20 px-2 py-1 rounded">
                  {todayData?.onboarding?.dailyCalorieTarget} kcal
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {todayData?.onboarding?.dailyProteinTarget}g protein
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {todayData?.onboarding?.dailyCarbsTarget}g carbs
                </span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {todayData?.onboarding?.dailyFatsTarget}g fat
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Activity & Calories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Activity & Calories
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Burned today</span>
                <span className="font-medium">
                  {todayData?.healthData?.caloriesBurned || 0} kcal
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((todayData?.healthData?.caloriesBurned || 0) / 2500) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">On track for today</p>
            </div>
          </div>

          {/* Card 2: Weather */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Cloud className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Weather & Training
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">72°F</span>
                <span className="text-sm text-gray-600">Partly cloudy</span>
              </div>
              <p className="text-sm text-gray-600">
                Great conditions for outdoor training
              </p>
            </div>
          </div>

          {/* Card 3: Sleep */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Moon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    sleepQuality >= 4
                      ? 'bg-green-100 text-green-700'
                      : sleepQuality === 3
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  )}
                >
                  {sleepQuality}/5
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sleep
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last night</span>
                <span className="font-medium">
                  {Math.floor(
                    (todayData?.healthData?.sleepDurationMinutes || 0) / 60
                  )}
                  h{' '}
                  {(todayData?.healthData?.sleepDurationMinutes || 0) % 60}m
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Deep: {todayData?.healthData?.deepSleepMinutes || 0}m | REM:{' '}
                {todayData?.healthData?.remSleepMinutes || 0}m
              </p>
            </div>
          </div>

          {/* Card 4: Steps */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Footprints className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Steps</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {(todayData?.healthData?.steps || 0)?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">/ 10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((todayData?.healthData?.steps || 0) / 10000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 5: Body Battery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Battery className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Body Battery
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {bodyBattery}
                </span>
                <span className="text-sm text-gray-600">/ 100</span>
              </div>
              <p className="text-sm text-gray-600">
                {bodyBattery >= 75
                  ? 'Excellent capacity'
                  : bodyBattery >= 50
                  ? 'Good capacity'
                  : 'Low capacity - rest needed'}
              </p>
            </div>
          </div>

          {/* Card 6: Stress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Brain className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Stress
            </h3>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {todayData?.healthData?.stressScore || 3}
                </span>
                <span className="text-sm text-gray-600">/ 5</span>
              </div>
              <p className="text-sm text-gray-600">
                {(todayData?.healthData?.stressScore || 3) <= 2
                  ? 'Relaxed'
                  : (todayData?.healthData?.stressScore || 3) === 3
                  ? 'Normal'
                  : 'Elevated'}
              </p>
            </div>
          </div>

          {/* Card 7: Recovery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Recovery
            </h3>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {recoveryScore}
                </span>
                <span className="text-sm text-gray-600">/ 5</span>
              </div>
              <p className="text-sm text-gray-600">
                {recoveryScore >= 4
                  ? 'Push your limits'
                  : recoveryScore === 3
                  ? 'Train normal'
                  : 'Prioritize rest'}
              </p>
            </div>
          </div>

          {/* Card 8: Hydration */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Droplets className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hydration
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {todayData?.hydrationToday || 0}
                </span>
                <span className="text-sm text-gray-600">/ 80 oz</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-cyan-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((todayData?.hydrationToday || 0) / 80) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 9: Body Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Weight className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Body Metrics
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">HRV</p>
                <p className="font-medium">
                  {todayData?.healthData?.heartRateVariability || 0}ms
                </p>
              </div>
              <div>
                <p className="text-gray-600">RHR</p>
                <p className="font-medium">
                  {todayData?.healthData?.restingHeartRate || 0}bpm
                </p>
              </div>
              <div>
                <p className="text-gray-600">RespRate</p>
                <p className="font-medium">
                  {todayData?.healthData?.respirationRate?.toFixed(1) || 0}
                </p>
              </div>
              <div>
                <p className="text-gray-600">SpO2</p>
                <p className="font-medium">
                  {todayData?.healthData?.oxygenSaturation?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
