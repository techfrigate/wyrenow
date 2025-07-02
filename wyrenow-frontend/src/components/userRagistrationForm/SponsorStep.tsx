import React from "react";
import { FormInput, Card, FormSelect } from "../ui";
import { FormData, FormErrors } from "../../types";
import { CheckCircle, Info, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { selectRegistration } from "../../redux/slices/ragistrationSlice";
import AvailablePositionsTable from "./AvailablePositionsTable";
import LoadingSpinner from "../Layout/LoadingSpinner";
import { useRegistrationForm } from "../../hooks";

interface SponsorStepProps {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  showAlert: boolean;
  handlePlacementUsernameChange: (leg: "left" | "right" | "system") => void;
  handleSponsorUsernameChange: (username: string, check: boolean) => void;
  placementLoading: boolean
}
const binaryLegs = [
  {
    id: "left",
    name: "Left Leg",
  },
  {
    id: "right",
    name: "Right Leg",
  },
  {
    id: "system",
    name: "System Decide",
  },
];
const SponsorStep: React.FC<SponsorStepProps> = ({
  formData,
  errors,
  isLoading,
  showAlert,
  handleSponsorUsernameChange,
  handlePlacementUsernameChange,
  placementLoading
}) => {
 
  const { availablePositions } = useSelector(selectRegistration);
 
  return (
    <div className="space-y-6">
      {/* Sponsor Username Input */}
      <div className="flex items-center justify-end">
        {formData.placementUsername && (
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            Selected:{" "}
            {availablePositions?.username || formData.placementUsername} (
            {availablePositions?.available_position || formData.placementLeg}{" "}
            leg)
          </div>
        )}
      </div>
      <div className="relative">
        <FormInput
          label="Sponsor Username"
          name="sponsorUsername"
          value={formData.sponsorUsername}
          onChange={(e) => handleSponsorUsernameChange(e.target.value, true)}
          placeholder="Enter sponsor username"
          required
          error={errors.sponsorUsername}
          iconPosition="right"
          icon={
            isLoading ? (
              <LoadingSpinner size="sm" variant="secondary" />
            ) : undefined
          }
        />
        {formData.sponsorName && (
          <div className="mt-2 flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Sponsor: {formData.sponsorName}</span>
          </div>
        )}
        {showAlert && (
          <div className="mt-2 flex items-center space-x-2 text-red-600 dark:text-red-400">
            <Info className="w-4 h-4" />
            <span className="text-sm">
              Since the sponsor has no empty legs, select a leg to assign to
              another user who has available space.
            </span>
          </div>
        )}
      </div>

      {formData.sponsorUsername && (
        <div className="relative">
          {placementLoading ? (
            <LoadingSpinner size="sm" variant="secondary" />
          ) : (
            <FormSelect
              label="Placement"
              name="placementUsername"
              value={formData.placementLeg}
              onChange={(e) => handlePlacementUsernameChange(e.target.value)}
              options={binaryLegs.map((leg) => ({
                value: leg.id,
                label: leg.name,
              }))}
              placeholder="Select Placement Leg"
              required
              error={errors.placementUsername}
            />
          )}
        </div>
      )}

      {/* Information Card */}
      <Card variant="info" className="p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
          Placement Information
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Select a sponsor from your upline and choose an available position in
          their downline. You can only place new members in positions that show
          as "available" in either the left or right leg.
        </p>
      </Card>
    </div>
  );
};

export default SponsorStep;
