import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFamilyStore } from '@store/familyStore';
import { FamilyMemberCard } from '@components/FamilyMemberCard';

export default function FamilyScreen() {
  const { familyMembers, relationshipMap } = useFamilyStore();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          Family Network
        </Text>
        <Text className="text-gray-600 mb-6">
          {familyMembers.length} members • AI-mapped relationships
        </Text>

        {/* Family Tree Visualization */}
        <TouchableOpacity className="bg-white rounded-lg p-6 mb-4 items-center">
          <Ionicons name="git-network" size={48} color="#0ea5e9" />
          <Text className="text-gray-800 font-semibold mt-2">
            View Family Tree
          </Text>
          <Text className="text-gray-500 text-sm">
            Interactive relationship map
          </Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View className="flex-row space-x-2 mb-6">
          <View className="flex-1 bg-white rounded-lg p-4">
            <Text className="text-gray-600 text-sm">Most Active</Text>
            <Text className="text-xl font-bold text-gray-800 mt-1">Mom</Text>
            <Text className="text-gray-500 text-xs mt-1">143 msgs/week</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-4">
            <Text className="text-gray-600 text-sm">Closest</Text>
            <Text className="text-xl font-bold text-gray-800 mt-1">Sister</Text>
            <Text className="text-gray-500 text-xs mt-1">85% response</Text>
          </View>
        </View>

        {/* Family Members List */}
        <Text className="text-lg font-semibold text-gray-800 mb-3">
          All Members
        </Text>

        {familyMembers.map((member) => (
          <FamilyMemberCard key={member.id} member={member} />
        ))}

        {/* Health Monitoring Section */}
        <View className="bg-white rounded-lg p-4 mt-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="fitness" size={24} color="#ef4444" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Health Monitoring
            </Text>
          </View>
          <Text className="text-gray-600 mb-3">
            Tracking health mentions for 5 family members
          </Text>
          <TouchableOpacity className="bg-primary-500 rounded-lg py-3">
            <Text className="text-white text-center font-semibold">
              View Health Dashboard
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cultural Calendar */}
        <View className="bg-white rounded-lg p-4 mt-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar" size={24} color="#f59e0b" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">
              Upcoming Events
            </Text>
          </View>
          <EventItem
            title="Diwali"
            date="Nov 12, 2026"
            icon="sparkles"
            color="#f59e0b"
          />
          <EventItem
            title="Uncle's Birthday"
            date="Nov 25, 2026"
            icon="cake"
            color="#ec4899"
          />
          <EventItem
            title="Family Reunion"
            date="Dec 15, 2026"
            icon="people"
            color="#0ea5e9"
          />
        </View>
      </View>
    </ScrollView>
  );
}

function EventItem({ title, date, icon, color }: any) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100">
      <Ionicons name={icon} size={20} color={color} />
      <View className="flex-1 ml-3">
        <Text className="text-gray-800 font-semibold">{title}</Text>
        <Text className="text-gray-500 text-sm">{date}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </View>
  );
}
