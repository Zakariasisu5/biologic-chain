
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { User, Edit, Save, Key, Shield, Download, Upload, Lock, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'John Doe',
    email: currentUser?.email || 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Health St, Medical City, CA 90210',
    emergencyContact: 'Jane Doe (+1 555-987-6543)',
    primaryCare: 'Dr. Sarah Johnson',
    bloodType: 'O Positive',
    allergies: 'Penicillin',
    medications: 'Lisinopril, Metformin',
    height: '5\'10"',
    weight: '175 lbs',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Manage your account and health information</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-1/3">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <Badge className="mt-2 bg-primary text-primary-foreground">
                {currentUser?.plan || 'Premium'} Plan
              </Badge>
              <div className="flex gap-2 mt-4 w-full">
                <Button className="flex-1" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <Button
                  className="flex-1"
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="md:w-2/3">
            <Tabs defaultValue="personal">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="medical">
                  <Shield className="h-4 w-4 mr-2" />
                  Medical
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal contact information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                        <Input 
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                        <Input 
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="emergencyContact" className="text-sm font-medium">Emergency Contact</label>
                        <Input 
                          id="emergencyContact"
                          name="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        {isEditing && (
                          <Button onClick={handleSave}>Save Changes</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="medical" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                    <CardDescription>Update your medical profile and health information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="primaryCare" className="text-sm font-medium">Primary Care Physician</label>
                        <Input 
                          id="primaryCare"
                          name="primaryCare"
                          value={profileData.primaryCare}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="bloodType" className="text-sm font-medium">Blood Type</label>
                          <Input 
                            id="bloodType"
                            name="bloodType"
                            value={profileData.bloodType}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="allergies" className="text-sm font-medium">Allergies</label>
                          <Input 
                            id="allergies"
                            name="allergies"
                            value={profileData.allergies}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <label htmlFor="medications" className="text-sm font-medium">Current Medications</label>
                        <Input 
                          id="medications"
                          name="medications"
                          value={profileData.medications}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="height" className="text-sm font-medium">Height</label>
                          <Input 
                            id="height"
                            name="height"
                            value={profileData.height}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="weight" className="text-sm font-medium">Weight</label>
                          <Input 
                            id="weight"
                            name="weight"
                            value={profileData.weight}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button variant="outline" className="flex gap-1">
                          <Download className="h-4 w-4" />
                          Export Medical History
                        </Button>
                        {isEditing && (
                          <Button onClick={handleSave}>Save Changes</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
