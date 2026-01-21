import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '@store/messageStore';
import { MessageCard } from '@components/MessageCard';

type FilterType = 'all' | 'emergency' | 'important' | 'informational' | 'noise';

export default function MessagesScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { messages, loading } = useMessageStore();

  const filteredMessages = messages.filter(msg => {
    const matchesFilter = filter === 'all' || msg.priority === filter;
    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row space-x-2">
          <FilterTab
            label="All"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
            color="#6b7280"
          />
          <FilterTab
            label="Emergency"
            active={filter === 'emergency'}
            onPress={() => setFilter('emergency')}
            color="#ef4444"
          />
          <FilterTab
            label="Important"
            active={filter === 'important'}
            onPress={() => setFilter('important')}
            color="#f59e0b"
          />
          <FilterTab
            label="Info"
            active={filter === 'informational'}
            onPress={() => setFilter('informational')}
            color="#3b82f6"
          />
          <FilterTab
            label="Noise"
            active={filter === 'noise'}
            onPress={() => setFilter('noise')}
            color="#6b7280"
          />
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageCard message={item} />}
        contentContainerClassName="p-4"
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="mail-open-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 mt-4">No messages found</Text>
          </View>
        }
      />
    </View>
  );
}

function FilterTab({ label, active, onPress, color }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${
        active ? 'bg-primary-500' : 'bg-gray-100'
      }`}
    >
      <Text className={active ? 'text-white font-semibold' : 'text-gray-700'}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
