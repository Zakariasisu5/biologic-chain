
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityType } from '@/utils/activityTracker';

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  page: string;
  details: any;
  device_info: any;
  created_at: string;
}

const UserActivities = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');

  // Query to fetch user activities
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['userActivities', currentUser?.id, filter],
    queryFn: async () => {
      let query = supabase
        .from('user_activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filter if not 'all'
      if (filter !== 'all') {
        query = query.eq('activity_type', filter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as UserActivity[];
    },
    enabled: !!currentUser?.id,
  });

  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error Fetching Activities',
        description: 'Failed to load your activities. Please try again later.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Activity type badge color mapping
  const activityBadgeColor = (type: ActivityType) => {
    const colors: Record<string, string> = {
      login: 'bg-green-500',
      logout: 'bg-orange-500',
      view_page: 'bg-blue-500',
      update_profile: 'bg-purple-500',
      view_metrics: 'bg-teal-500',
      view_vitals: 'bg-indigo-500',
      view_alerts: 'bg-red-500',
      view_blockchain: 'bg-amber-500',
      update_settings: 'bg-fuchsia-500'
    };
    
    return colors[type] || 'bg-gray-500';
  };
  
  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Activity History</h1>
          <div className="w-full sm:w-64">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="view_page">Page Views</SelectItem>
                <SelectItem value="update_profile">Profile Updates</SelectItem>
                <SelectItem value="view_metrics">Health Metrics</SelectItem>
                <SelectItem value="view_vitals">Vitals</SelectItem>
                <SelectItem value="view_alerts">Alerts</SelectItem>
                <SelectItem value="view_blockchain">Blockchain</SelectItem>
                <SelectItem value="update_settings">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead className="hidden sm:table-cell">Details</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <Badge className={activityBadgeColor(activity.activity_type)} variant="secondary">
                            {activity.activity_type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{activity.page}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {activity.details?.pageName || 
                           JSON.stringify(activity.details) !== '{}' 
                             ? JSON.stringify(activity.details).substring(0, 50) 
                             : '-'}
                        </TableCell>
                        <TableCell>{formatTimestamp(activity.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No activities found. Your activity will appear here as you use the application.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserActivities;
