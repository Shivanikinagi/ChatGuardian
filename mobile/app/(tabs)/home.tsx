import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '@store/messageStore';
import { MessageCard } from '@components/MessageCard';
import { QuickStats } from '@components/QuickStats';
import { EmergencyBanner } from '@components/EmergencyBanner';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { 
    emergencyMessages, 
    importantMessages, 
    unreadCount,
    fetchMessages 
  } = useMessageStore();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800">
            ChatGuardian
          </Text>
          <Text className="text-gray-600 mt-1">
            Your AI-powered family chat assistant
          </Text>
        </View>

        {/* Quick Stats */}
        <QuickStats />

        {/* Emergency Banner */}
        {emergencyMessages.length > 0 && (
          <EmergencyBanner messages={emergencyMessages} />
        )}

        {/* Important Messages Section */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-semibold text-gray-800">
              Important Messages
            </Text>
            <TouchableOpacity>
              <Text className="text-primary-500">View All</Text>
            </TouchableOpacity>
          </View>

          {importantMessages.length > 0 ? (
            importantMessages.slice(0, 5).map((message) => (
              <MessageCard key={message.id} message={message} />
            ))
          ) : (
            <View className="bg-white rounded-lg p-6 items-center">
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text className="text-gray-600 mt-2">All caught up!</Text>
            </View>
          )}
        </View>

        {/* Today's Summary */}
        <View className="mt-6 bg-white rounded-lg p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Today's Summary
          </Text>
          <View className="space-y-2">
            <SummaryRow
              icon="alert-circle"
              color="#ef4444"
              label="Emergency"
              count={0}
            />
            <SummaryRow
              icon="star"
              color="#f59e0b"
              label="Important"
              count={12}
            />
            <SummaryRow
              icon="information-circle"
              color="#3b82f6"
              label="Informational"
              count={45}
            />
            <SummaryRow
              icon="volume-mute"
              color="#6b7280"
              label="Filtered Noise"
              count={167}
            />
            <SummaryRow
              icon="shield-checkmark"
              color="#10b981"
              label="Blocked Spam"
              count={23}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function SummaryRow({ icon, color, label, count }: any) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color={color} />
        <Text className="ml-3 text-gray-700">{label}</Text>
      </View>
      <Text className="text-gray-900 font-semibold">{count}</Text>
    </View>
  );
}
