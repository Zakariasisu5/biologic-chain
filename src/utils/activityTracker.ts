
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type ActivityType = 
  | 'login' 
  | 'logout'
  | 'view_page'
  | 'update_profile'
  | 'view_metrics'
  | 'view_vitals'
  | 'view_alerts'
  | 'update_settings'
  | 'view_blockchain'
  | 'registration'
  | 'upload_file'
  | 'download_file'
  | 'export_medical_history'
  | 'connect_wallet'
  | 'disconnect_wallet'; // Added wallet-related activity types

interface ActivityDetails {
  [key: string]: any;
}

// Helper function to check if a string is a valid UUID
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export const logUserActivity = async (
  userId: string,
  activityType: ActivityType,
  page?: string,
  details?: ActivityDetails
) => {
  try {
    // Validate userId format to avoid SQL errors
    if (!userId || !isValidUUID(userId)) {
      console.error('Invalid user ID format for activity logging');
      return; // Skip logging if invalid ID
    }

    // Get browser and device info
    const deviceInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height
    };

    // Insert activity record into Supabase
    // Using the generic typed version of the from method to avoid type errors
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        page: page || window.location.pathname,
        details: details || {},
        device_info: deviceInfo,
        ip_address: null // IP is captured server-side by Supabase
      } as any); // Using 'as any' to bypass TypeScript checking temporarily

    if (error) {
      console.error('Error logging user activity:', error);
    }
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// React hook to use the activity tracker
export const useActivityTracker = () => {
  const { currentUser } = useAuth();
  
  const trackActivity = (
    activityType: ActivityType,
    page?: string,
    details?: ActivityDetails
  ) => {
    if (currentUser?.id && isValidUUID(currentUser.id)) {
      logUserActivity(currentUser.id, activityType, page, details);
    } else {
      // Skip tracking if user ID is invalid
      console.log('Skipping activity tracking: Invalid user ID');
    }
  };
  
  return { trackActivity };
};
