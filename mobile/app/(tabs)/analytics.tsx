import { View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useAnalyticsStore } from '@store/analyticsStore';

export default function AnalyticsScreen() {
  const { weeklyStats, messageDistribution, topSenders } = useAnalyticsStore();
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#0ea5e9',
    },
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Analytics Dashboard
        </Text>

        {/* Weekly Message Trend */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Weekly Message Trend
          </Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: weeklyStats.map(d => d.count),
              }],
            }}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Message Distribution */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Message Distribution
          </Text>
          <PieChart
            data={[
              {
                name: 'Emergency',
                population: 5,
                color: '#ef4444',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
              },
              {
                name: 'Important',
                population: 45,
                color: '#f59e0b',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
              },
              {
                name: 'Info',
                population: 120,
                color: '#3b82f6',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
              },
              {
                name: 'Noise',
                population: 450,
                color: '#6b7280',
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
              },
            ]}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Top Senders */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Most Active Senders
          </Text>
          <BarChart
            data={{
              labels: ['Mom', 'Dad', 'Uncle', 'Aunt', 'Cousin'],
              datasets: [{
                data: [85, 72, 58, 45, 32],
              }],
            }}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            showValuesOnTopOfBars
          />
        </View>

        {/* Time Saved */}
        <View className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg p-6 mb-4">
          <Text className="text-white text-lg font-semibold mb-2">
            Time Saved This Week
          </Text>
          <Text className="text-white text-4xl font-bold">4.5 hours</Text>
          <Text className="text-white/80 mt-2">
            By filtering 1,247 noise messages
          </Text>
        </View>

        {/* Accuracy Stats */}
        <View className="bg-white rounded-lg p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            AI Accuracy
          </Text>
          <View className="space-y-3">
            <AccuracyStat label="Emergency Detection" percentage={98} />
            <AccuracyStat label="Important Messages" percentage={94} />
            <AccuracyStat label="Fake News Detection" percentage={91} />
            <AccuracyStat label="Auto-Response Quality" percentage={87} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function AccuracyStat({ label, percentage }: { label: string; percentage: number }) {
  return (
    <View className="mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-700">{label}</Text>
        <Text className="text-gray-900 font-semibold">{percentage}%</Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary-500"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}
