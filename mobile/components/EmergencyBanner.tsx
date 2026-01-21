import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Message } from '@store/messageStore';

interface EmergencyBannerProps {
  messages: Message[];
}

export function EmergencyBanner({ messages }: EmergencyBannerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{ transform: [{ scale: pulseAnim }] }}
      className="bg-red-500 rounded-lg p-4 mt-4"
    >
      <View className="flex-row items-center mb-2">
        <Ionicons name="alert-circle" size={24} color="#ffffff" />
        <Text className="text-white text-lg font-bold ml-2">
          🚨 EMERGENCY ALERT
        </Text>
      </View>
      
      <Text className="text-white mb-3">
        {messages[0].content.substring(0, 100)}
        {messages[0].content.length > 100 ? '...' : ''}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text className="text-white/90 text-sm">
          From: {messages[0].sender.name}
        </Text>
        <TouchableOpacity className="bg-white px-4 py-2 rounded-lg">
          <Text className="text-red-500 font-semibold">View Now</Text>
        </TouchableOpacity>
      </View>

      {messages.length > 1 && (
        <Text className="text-white/80 text-xs mt-2">
          +{messages.length - 1} more emergency messages
        </Text>
      )}
    </Animated.View>
  );
}
