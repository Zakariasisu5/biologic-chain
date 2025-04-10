
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, AlertCircle, CreditCard } from 'lucide-react';

interface SecurityTabProps {
  isEditing: boolean;
  currentUser: any;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ isEditing, currentUser }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Password</h3>
              <div className="grid gap-4 mt-2">
                <div className="grid gap-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
                  <Input id="currentPassword" type="password" disabled={!isEditing} />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                  <Input id="newPassword" type="password" disabled={!isEditing} />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                  <Input id="confirmPassword" type="password" disabled={!isEditing} />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mt-1">Enhance your account security with 2FA</p>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <h4 className="text-sm font-medium">Status: <span className="text-health-red">Disabled</span></h4>
                </div>
                <Button variant="outline" className="flex gap-1">
                  <Key className="h-4 w-4" />
                  Enable 2FA
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Connected Devices</h3>
              <ul className="space-y-2 mt-2">
                <li className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">iPhone 13 Pro</p>
                      <p className="text-xs text-muted-foreground">Last active: {new Date().toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">New York, USA (192.168.1.1)</p>
                    </div>
                    <Badge>Current Device</Badge>
                  </div>
                </li>
                <li className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">MacBook Pro</p>
                      <p className="text-xs text-muted-foreground">Last active: Yesterday, 3:24 PM</p>
                      <p className="text-xs text-muted-foreground">San Francisco, USA (192.168.0.2)</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">Revoke</Button>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <Button variant="destructive" className="flex gap-1">
                <AlertCircle className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>Manage your subscription and payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{currentUser?.plan || 'Premium'} Plan</h3>
                  <p className="text-sm text-muted-foreground">Billed annually</p>
                </div>
                <Button variant="outline">Upgrade</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Payment Information</h3>
              <div className="mt-2 flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/24</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Update</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
