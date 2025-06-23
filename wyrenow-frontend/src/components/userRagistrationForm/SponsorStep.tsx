import React from 'react';
import { FormInput, Card, FormSelect } from '../ui';
import { FormData, FormErrors } from '../../types';
import { CheckCircle } from 'lucide-react';

interface SponsorStepProps {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  handleSponsorUsernameChange: (username: string) => void;
  handlePlacementUsernameChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const binaryLegs = [{
          id:"left leg",
          name: "Left Leg"
        }, {
          id:"right leg",
          name: "Right Leg"
        }, {
          id:"system decide",
          name: "System Decide"
        }]
        
const SponsorStep: React.FC<SponsorStepProps> = ({
  formData,
  errors,
  isLoading,
  handleSponsorUsernameChange,
  handlePlacementUsernameChange
}) => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <FormInput
          label="Sponsor Username"
          name="sponsorUsername"
          value={formData.sponsorUsername}
          onChange={(e) => handleSponsorUsernameChange(e.target.value)}
          placeholder="Enter sponsor username"
          required
          error={errors.sponsorUsername}
          icon={isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          ) : undefined}
        />
        {formData.sponsorName && (
          <div className="mt-2 flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Sponsor: {formData.sponsorName}</span>
          </div>
        )}
      </div>
      {formData.sponsorName&&  <div className="relative">
        <FormSelect
        label="Placement"
        name="placementUsername"
         value={formData.placementUsername}
        onChange={handlePlacementUsernameChange}
        options={binaryLegs.map(country => ({ 
          value: country.id, 
          label: country.name 
        }))}
        placeholder="Select Placement Leg"
        required
        error={errors.placementUsername}
      />
 
      </div>
      }

     

      <Card variant="info" className="p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Sponsor Information</h4>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          The sponsor must be a registered member in your upline. The placement user determines 
          where the new user will be positioned in the binary tree structure.
        </p>
      </Card>
    </div>
  );
};

export default SponsorStep;