import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '@store/messageStore';
import { formatDistanceToNow } from 'date-fns';

interface MessageCardProps {
  message: Message;
  onPress?: () => void;
}

export function MessageCard({ message, onPress }: MessageCardProps) {
  const priorityConfig = {
    emergency: {
      color: '#ef4444',
      bgColor: '#fee2e2',
      icon: 'alert-circle',
      label: 'EMERGENCY',
    },
    important: {
      color: '#f59e0b',
      bgColor: '#fef3c7',
      icon: 'star',
      label: 'Important',
    },
    informational: {
      color: '#3b82f6',
      bgColor: '#dbeafe',
      icon: 'information-circle',
      label: 'Info',
    },
    noise: {
      color: '#6b7280',
      bgColor: '#f3f4f6',
      icon: 'volume-mute',
      label: 'Filtered',
    },
    blocked: {
      color: '#1f2937',
      bgColor: '#e5e7eb',
      icon: 'ban',
      label: 'Blocked',
    },
  };

  const config = priorityConfig[message.priority];

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-lg p-4 mb-3 border-l-4`}
      style={{ borderLeftColor: config.color }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: config.bgColor }}
          >
            <Text className="text-lg font-semibold" style={{ color: config.color }}>
              {message.sender.name.charAt(0)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-semibold">
              {message.sender.name}
            </Text>
            <Text className="text-gray-500 text-xs">
              {message.groupName} • {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </Text>
          </View>
        </View>

        <View
          className="px-2 py-1 rounded-full flex-row items-center"
          style={{ backgroundColor: config.bgColor }}
        >
          <Ionicons name={config.icon as any} size={12} color={config.color} />
          <Text className="ml-1 text-xs font-semibold" style={{ color: config.color }}>
            {config.label}
          </Text>
        </View>
      </View>

      {/* Message Content */}
      <Text className="text-gray-700 mb-2" numberOfLines={3}>
        {message.content}
      </Text>

      {/* Media Indicator */}
      {message.mediaType && message.mediaType !== 'text' && (
        <View className="flex-row items-center mt-2">
          <Ionicons
            name={
              message.mediaType === 'image'
                ? 'image'
                : message.mediaType === 'video'
                ? 'videocam'
                : message.mediaType === 'audio'
                ? 'mic'
                : 'document'
            }
            size={16}
            color="#6b7280"
          />
          <Text className="text-gray-600 text-sm ml-1 capitalize">
            {message.mediaType}
          </Text>
        </View>
      )}

      {/* AI Classification Info */}
      {message.aiClassification.isFakeNews && (
        <View className="mt-2 flex-row items-center bg-red-50 p-2 rounded">
          <Ionicons name="warning" size={16} color="#ef4444" />
          <Text className="text-red-600 text-xs ml-2 font-semibold">
            Potential Fake News Detected
          </Text>
        </View>
      )}

      {/* Auto Response */}
      {message.autoResponse && (
        <View className="mt-2 bg-green-50 p-2 rounded">
          <Text className="text-green-700 text-xs">
            <Text className="font-semibold">Auto-responded: </Text>
            {message.autoResponse}
          </Text>
        </View>
      )}

      {/* Confidence */}
      <View className="mt-2 flex-row items-center">
        <Text className="text-gray-500 text-xs">
          AI Confidence: {Math.round(message.aiClassification.confidence * 100)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
}
