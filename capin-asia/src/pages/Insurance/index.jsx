import { useState } from "react";
import { useSelector } from "react-redux";

import { addNewInsurancePolicy } from "../../api/insurance";
import { getSelectedClient } from "../../redux/globalSlice";
import InsuranceForm from "./InsuranceForm";
import {
  Card,
  CardContent,
  EmptyState,
  useToast,
} from "../../components/ui";

function Insurance() {
  const { toast } = useToast();
  const selectedClient = useSelector(getSelectedClient);
  const clientId = selectedClient?.id;
  const clientName = selectedClient?.name;

  const [currentFormType, setCurrentFormType] = useState("direct");
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const subtitle = clientName
    ? `Add insurance policies for ${clientName}.`
    : "Add insurance policies for the selected client.";

  const handleFormTypeChange = (value) => {
    setCurrentFormType(value);
    setFormData({});
  };

  const handleSave = async () => {
    if (!clientId) {
      return;
    }

    setIsSaving(true);

    try {
      const res = await addNewInsurancePolicy(clientId, {
        ...formData,
        type: currentFormType,
      });

      if (res.success) {
        toast({
          title: "Insurance policy added",
          description: "The policy was saved successfully.",
          variant: "success",
        });
        setFormData({});
      } else {
        toast({
          title: "Could not save policy",
          description: "A policy with this number already exists.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Save failed",
        description: "Failed to save insurance policy. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insurance</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col pt-6">
          {!clientId ? (
            <EmptyState
              title="No client selected"
              description="Choose a client from the main header to add insurance policies."
            />
          ) : (
            <InsuranceForm
              currentFormType={currentFormType}
              onFormTypeChange={handleFormTypeChange}
              formData={formData}
              onFormDataChange={setFormData}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Insurance;
