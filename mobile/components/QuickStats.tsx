import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function QuickStats() {
  return (
    <View className="flex-row space-x-2">
      <StatCard
        icon="alert-circle"
        color="#ef4444"
        label="Emergency"
        count={0}
        bgColor="#fee2e2"
      />
      <StatCard
        icon="star"
        color="#f59e0b"
        label="Important"
        count={12}
        bgColor="#fef3c7"
      />
      <StatCard
        icon="information-circle"
        color="#3b82f6"
        label="Info"
        count={45}
        bgColor="#dbeafe"
      />
      <StatCard
        icon="volume-mute"
        color="#6b7280"
        label="Filtered"
        count={167}
        bgColor="#f3f4f6"
      />
    </View>
  );
}

function StatCard({ icon, color, label, count, bgColor }: any) {
  return (
    <View className="flex-1 bg-white rounded-lg p-3">
      <View className="flex-row items-center mb-1">
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Ionicons name={icon} size={16} color={color} />
        </View>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{count}</Text>
      <Text className="text-gray-600 text-xs mt-1">{label}</Text>
    </View>
  );
}
