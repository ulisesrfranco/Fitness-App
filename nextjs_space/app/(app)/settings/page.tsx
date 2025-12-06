'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  User,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight,
  Dumbbell,
  Briefcase,
  Target,
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession() || {};
  const [onboarding, setOnboarding] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setOnboarding(data?.onboarding);
        setSettings(data?.settings);
        setSubscription(data?.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const trialDaysLeft = subscription?.trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.trialEndsAt).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const sections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Name', value: session?.user?.name || 'Not set' },
        { label: 'Email', value: session?.user?.email || 'Not set' },
        { label: 'Age', value: onboarding?.age || 'Not set' },
        {
          label: 'Height',
          value: onboarding?.heightCm
            ? `${Math.round(onboarding.heightCm)} cm`
            : 'Not set',
        },
        {
          label: 'Weight',
          value: onboarding?.weightKg
            ? `${Math.round(onboarding.weightKg)} kg`
            : 'Not set',
        },
      ],
    },
    {
      title: 'Goals & Targets',
      icon: Target,
      items: [
        {
          label: 'Goal',
          value:
            onboarding?.goal === 'lose'
              ? 'Lose Weight'
              : onboarding?.goal === 'gain'
              ? 'Gain Muscle'
              : 'Maintain',
        },
        {
          label: 'Daily Calories',
          value: onboarding?.dailyCalorieTarget
            ? `${onboarding.dailyCalorieTarget} kcal`
            : 'Not set',
        },
        {
          label: 'Protein Target',
          value: onboarding?.dailyProteinTarget
            ? `${Math.round(onboarding.dailyProteinTarget)}g`
            : 'Not set',
        },
      ],
    },
    {
      title: 'Training',
      icon: Dumbbell,
      items: [
        {
          label: 'Works Out',
          value: onboarding?.worksOut ? 'Yes' : 'No',
        },
        {
          label: 'Gym Access',
          value: onboarding?.gymAccess ? 'Yes' : 'No',
        },
        {
          label: 'Confidence Level',
          value: onboarding?.confidenceLevel || 'Not set',
        },
      ],
    },
    {
      title: 'Work Schedule',
      icon: Briefcase,
      items: [
        {
          label: 'Work Type',
          value: onboarding?.workType || 'Not set',
        },
        {
          label: 'Work Hours',
          value:
            onboarding?.workStartTime && onboarding?.workEndTime
              ? `${onboarding.workStartTime} - ${onboarding.workEndTime}`
              : 'Not set',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Subscription */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-teal-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-gray-900">
                  {subscription?.status === 'free_trial'
                    ? 'Free Trial'
                    : subscription?.status === 'active'
                    ? 'Active'
                    : 'Inactive'}
                </span>
              </div>
              {subscription?.status === 'free_trial' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trial ends in</span>
                  <span className="font-medium text-orange-600">
                    {trialDaysLeft} days
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Stripe integration is a placeholder. Add your Stripe API key to enable payments.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Manage Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        {sections?.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {section?.items?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="px-6 py-4 flex justify-between items-center"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900 text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { id: 'waterReminders', label: 'Water reminders' },
              { id: 'sleepWarnings', label: 'Sleep warnings' },
              { id: 'recoveryAlerts', label: 'Recovery alerts' },
              { id: 'macroCheckIns', label: 'Macro check-ins' },
            ]?.map((notif) => (
              <div
                key={notif.id}
                className="px-6 py-4 flex justify-between items-center"
              >
                <span className="text-gray-900">{notif.label}</span>
                <Checkbox
                  checked={settings?.[notif.id as keyof typeof settings] || false}
                  onCheckedChange={() => {}}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Data */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Privacy & Data</h2>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <Button variant="outline" className="w-full justify-between" disabled>
              <span>Export Data</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-red-600 border-red-200 hover:bg-red-50" disabled>
              <span>Delete Account</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
