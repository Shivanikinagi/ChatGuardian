import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);
  const [fakeNewsFilterEnabled, setFakeNewsFilterEnabled] = useState(true);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Profile Header */}
        <View className="bg-white rounded-lg p-6 items-center mb-4">
          <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-3">
            <Ionicons name="person" size={48} color="#ffffff" />
          </View>
          <Text className="text-xl font-bold text-gray-800">Shivani</Text>
          <Text className="text-gray-600">shivani@example.com</Text>
          <TouchableOpacity className="mt-4 px-6 py-2 bg-primary-500 rounded-lg">
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Settings */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Settings
          </Text>

          <SettingRow
            label="Push Notifications"
            icon="notifications"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingRow
            label="Auto-Response"
            icon="chatbox"
            value={autoResponseEnabled}
            onValueChange={setAutoResponseEnabled}
          />
          <SettingRow
            label="Fake News Filter"
            icon="shield-checkmark"
            value={fakeNewsFilterEnabled}
            onValueChange={setFakeNewsFilterEnabled}
          />
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-lg mb-4">
          <MenuItem
            icon="settings"
            label="Preferences"
            onPress={() => router.push('/settings')}
          />
          <MenuItem
            icon="people"
            label="Manage Family Members"
            onPress={() => {}}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notification Settings"
            onPress={() => {}}
          />
          <MenuItem
            icon="shield"
            label="Privacy & Security"
            onPress={() => {}}
          />
          <MenuItem
            icon="analytics"
            label="AI Training Data"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle"
            label="Help & Support"
            onPress={() => {}}
          />
        </View>

        {/* Subscription */}
        <View className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg p-6 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={24} color="#fbbf24" />
            <Text className="text-white text-lg font-semibold ml-2">
              Premium Plan
            </Text>
          </View>
          <Text className="text-white/90 mb-3">
            Unlimited AI processing, advanced analytics
          </Text>
          <TouchableOpacity className="bg-white rounded-lg py-3">
            <Text className="text-primary-500 text-center font-semibold">
              Upgrade to Premium
            </Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <MenuItem
            icon="information-circle"
            label="About ChatGuardian"
            onPress={() => {}}
          />
          <MenuItem
            icon="document-text"
            label="Terms of Service"
            onPress={() => {}}
          />
          <MenuItem
            icon="lock-closed"
            label="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity className="bg-white rounded-lg p-4 mb-8">
          <View className="flex-row items-center justify-center">
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text className="text-red-500 font-semibold ml-2">Logout</Text>
          </View>
        </TouchableOpacity>

        {/* Version */}
        <Text className="text-center text-gray-500 text-sm mb-4">
          Version 1.0.0 • Built with ❤️
        </Text>
      </View>
    </ScrollView>
  );
}

function SettingRow({ label, icon, value, onValueChange }: any) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color="#6b7280" />
        <Text className="text-gray-800 ml-3">{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
        thumbColor={value ? '#0ea5e9' : '#f3f4f6'}
      />
    </View>
  );
}

function MenuItem({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4 border-b border-gray-100"
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color="#6b7280" />
        <Text className="text-gray-800 ml-3">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
}
