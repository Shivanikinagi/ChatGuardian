import { create } from 'zustand';
import { apiClient } from '@services/api';

interface FamilyMember {
  id: string;
  name: string;
  phoneNumber: string;
  relationship: string;
  generation: number; // 0 = same, -1 = parent, +1 = child
  importance: number; // 1-10 scale
  messageCount: number;
  lastInteraction: Date;
  healthTracking: boolean;
  profilePicture?: string;
}

interface RelationshipEdge {
  from: string;
  to: string;
  type: 'parent' | 'child' | 'sibling' | 'spouse' | 'cousin' | 'uncle' | 'aunt';
  strength: number; // 0-1 based on interaction frequency
}

interface FamilyState {
  familyMembers: FamilyMember[];
  relationshipMap: RelationshipEdge[];
  loading: boolean;
  
  fetchFamilyData: () => Promise<void>;
  addFamilyMember: (member: Partial<FamilyMember>) => Promise<void>;
  updateRelationship: (memberId: string, relationship: string) => Promise<void>;
  enableHealthTracking: (memberId: string) => Promise<void>;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  familyMembers: [],
  relationshipMap: [],
  loading: false,

  fetchFamilyData: async () => {
    try {
      set({ loading: true });
      const response = await apiClient.get('/family');
      set({
        familyMembers: response.data.members,
        relationshipMap: response.data.relationships,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch family data:', error);
      set({ loading: false });
    }
  },

  addFamilyMember: async (member: Partial<FamilyMember>) => {
    try {
      const response = await apiClient.post('/family/members', member);
      set((state) => ({
        familyMembers: [...state.familyMembers, response.data],
      }));
    } catch (error) {
      console.error('Failed to add family member:', error);
    }
  },

  updateRelationship: async (memberId: string, relationship: string) => {
    try {
      await apiClient.patch(`/family/members/${memberId}`, { relationship });
      set((state) => ({
        familyMembers: state.familyMembers.map((m) =>
          m.id === memberId ? { ...m, relationship } : m
        ),
      }));
    } catch (error) {
      console.error('Failed to update relationship:', error);
    }
  },

  enableHealthTracking: async (memberId: string) => {
    try {
      await apiClient.post(`/family/members/${memberId}/health-tracking`);
      set((state) => ({
        familyMembers: state.familyMembers.map((m) =>
          m.id === memberId ? { ...m, healthTracking: true } : m
        ),
      }));
    } catch (error) {
      console.error('Failed to enable health tracking:', error);
    }
  },
}));
