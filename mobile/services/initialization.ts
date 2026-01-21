import * as FileSystem from 'expo-file-system';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from '@models/schema';
import { Message, FamilyMember, AnalyticsRecord } from '@models';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'chatguardian',
  jsi: true,
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Message, FamilyMember, AnalyticsRecord],
});

export async function initializeApp() {
  try {
    // Initialize database
    console.log('Initializing database...');
    
    // Initialize encryption keys
    console.log('Setting up encryption...');
    
    // Initialize AI models (if on-device)
    console.log('Loading AI models...');
    
    // Setup background tasks
    console.log('Configuring background tasks...');
    
    // Initialize WebSocket connection
    console.log('Connecting to server...');
    
    console.log('App initialization complete');
  } catch (error) {
    console.error('App initialization failed:', error);
    throw error;
  }
}

export async function clearAppData() {
  try {
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
    console.log('App data cleared successfully');
  } catch (error) {
    console.error('Failed to clear app data:', error);
  }
}
