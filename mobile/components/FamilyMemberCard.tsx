import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FamilyMemberCardProps {
  member: any;
}

export function FamilyMemberCard({ member }: FamilyMemberCardProps) {
  return (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 flex-row items-center">
      <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mr-3">
        {member.profilePicture ? (
          <Image
            source={{ uri: member.profilePicture }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <Text className="text-primary-500 text-lg font-semibold">
            {member.name.charAt(0)}
          </Text>
        )}
      </View>

      <View className="flex-1">
        <Text className="text-gray-800 font-semibold text-base">
          {member.name}
        </Text>
        <Text className="text-gray-600 text-sm">{member.relationship}</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="chatbubble" size={12} color="#6b7280" />
          <Text className="text-gray-500 text-xs ml-1">
            {member.messageCount} messages
          </Text>
          {member.healthTracking && (
            <>
              <Ionicons name="fitness" size={12} color="#ef4444" className="ml-2" />
              <Text className="text-red-500 text-xs ml-1">Health Tracked</Text>
            </>
          )}
        </View>
      </View>

      <View className="items-end">
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{
            backgroundColor:
              member.importance >= 8
                ? '#fef3c7'
                : member.importance >= 5
                ? '#dbeafe'
                : '#f3f4f6',
          }}
        >
          <Ionicons
            name="star"
            size={16}
            color={
              member.importance >= 8
                ? '#f59e0b'
                : member.importance >= 5
                ? '#3b82f6'
                : '#6b7280'
            }
          />
        </View>
        <Text className="text-gray-500 text-xs mt-1">{member.importance}/10</Text>
      </View>
    </TouchableOpacity>
  );
}
