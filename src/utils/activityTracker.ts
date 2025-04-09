
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
  | 'export_medical_history'; // Added file-related activity types

interface ActivityDetails {
  [key: string]: any;
}

export const logUserActivity = async (
  userId: string,
  activityType: ActivityType,
  page?: string,
  details?: ActivityDetails
) => {
  try {
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
    if (currentUser?.id) {
      logUserActivity(currentUser.id, activityType, page, details);
    }
  };
  
  return { trackActivity };
};
