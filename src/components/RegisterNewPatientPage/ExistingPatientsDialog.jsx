import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ExistingPatientsTable from "./ExistingPatientsTable";

const ExistingPatientsDialog = ({
  existingPatients,
  setExistingPatients,
  handleRegisterNewPatient,
  handleBookAppointmentExistingPatient,
}) => {
  const headers = [
    { label: "UHID", value: "uhid" },
    { label: "Name", value: "fullName" },
    { label: "Phone", value: "phone" },
    { label: "Email", value: "email" },
    { label: "Address", value: "address" },
  ];

  //   setExistingPatients({
  //     existingPatients: response.data.existingPatients,
  //     newPatientDetails: response.data.newPatient,
  //     appointmentDetails: {
  //       appointmentDate: format(selectedDate, "yyyy-MM-dd"),
  //       appointmentTime: selectedTime,
  //       appointmentFee,
  //       showAppointmentDetails,
  //       doctor: patientDetails.doctor,
  //       complaint: patientDetails.complaint,
  //     },
  //   });
  return (
    <Dialog
      open={existingPatients !== null}
      onOpenChange={() => setExistingPatients(null)}
    >
      {existingPatients && (
        <DialogContent className="md:min-w-max">
          <DialogHeader>
            <DialogTitle>Patient Already Exists</DialogTitle>
            <DialogDescription>
              The patient already exists in the system. You can book an
              appointment for the existing patient or register a new patient.
            </DialogDescription>
          </DialogHeader>

          <ExistingPatientsTable
            existingPatients={existingPatients?.existingPatients || []}
            headers={headers}
            appointmentDetails={existingPatients?.appointmentDetails}
            handleBookAppointmentExistingPatient={handleBookAppointmentExistingPatient}
          />

          <Button
            onClick={(e) =>
              handleRegisterNewPatient({
                patientDetails: existingPatients?.newPatientDetails,
                appointmentDetails: existingPatients?.appointmentDetails,
              })
            }
            className="m-1"
          >
            Register New Patient
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ExistingPatientsDialog;
