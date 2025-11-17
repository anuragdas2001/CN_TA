import { useEffect, useState } from 'react';
import { officerService } from '@/services/officerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import Loader from '@/components/shared/Loader';
import type { LoanOfficer } from '@/types';
import { User, Building2, Save, Edit2, X } from 'lucide-react';

const OfficerProfile = () => {
  const [profile, setProfile] = useState<LoanOfficer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    branch: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await officerService.getProfile();
      setProfile(data);
      setFormData({
        branch: data.branch || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        branch: profile.branch || ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      const updatedProfile = await officerService.updateProfile({
        branch: formData.branch
      });
      
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return <Loader text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">View and manage your officer profile</p>
      </div>

      {/* Profile Information */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600">Name</Label>
                <p className="text-lg font-semibold">{profile.userId?.name || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="text-lg font-semibold">{profile.userId?.email || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-600">Role</Label>
                <p className="text-lg font-semibold">{profile.userId?.role || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-600">Member Since</Label>
                <p className="text-lg font-semibold">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branch Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Branch Information</CardTitle>
                <CardDescription>Update your branch assignment</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                {/* Branch Display */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-gray-600 text-sm">Assigned Branch</Label>
                    <p className="text-2xl font-bold text-gray-900">
                      {profile.branch || 'Not Assigned'}
                    </p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Branch Information</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Your branch assignment determines your loan review scope</li>
                    <li>• Update this information if you are transferred to a new branch</li>
                    <li>• Contact admin for permanent branch changes</li>
                  </ul>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Branch Input */}
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch Location</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="branch"
                      name="branch"
                      type="text"
                      placeholder="Mumbai Central"
                      value={formData.branch}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter your branch name or location</p>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3">
                  <Button type="submit" disabled={isSaving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your account activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-gray-600 text-sm">Officer ID</Label>
                <p className="text-sm font-mono mt-1">{profile._id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-gray-600 text-sm">Last Updated</Label>
                <p className="text-sm font-semibold mt-1">
                  {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficerProfile;