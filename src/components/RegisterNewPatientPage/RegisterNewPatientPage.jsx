import { City, Country, State } from "country-state-city";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import RegSelect from "./RegSelect";

import { Toast } from "primereact/toast";
import { useRef } from "react";
import useAxios from "../../../../Hooks/AuthHooks/useAxios";

const RegisterNewPatient = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const toast = useRef(null);

  let countryData = Country.getAllCountries();

  const [hospitalDoctors, setHospitalDoctors] = useState([]);

  const [formStep, setFormStep] = useState("Render form");
  const [selectedForm, setSelectedForm] = useState("Basic Information");
  const [patientDetails, setPatientDetails] = useState({
    nameTitle: "Mr.",
    patientFirstName: "",

    patientLastName: "",
    gender: "Male",
    dateOfBirth: "",

    AyushmanBharatNo: "",
    ABHAadress: "",
    UIDproof: {
      label: "AADHAR",
      value: "",
    },
    regDateTime: new Date(),

    regDepartment: "",

    maritalStatus: "Single",
    country: "India",
    state: "Maharashtra",
    PanelTPA: null,

    address: "",
    city: "Nashik",
    phone: "",
    doctor: "",

    email: "",
  });
  const [registeredPatient, setRegisteredPatient] = useState();
  const [formErrors, setFormErrors] = useState({
    patientFirstName: "",
    patientLastName: "",
    gender: "",
    dateOfBirth: "",
    PanelTPA: null,
    doctor: "",
    refferedBy: "",
    AyushmanBharatNo: "",
    ABHAadress: "",
    UIDproof: "",
    regDateTime: "",
    email: "",

    regDepartment: "",
    country: "",
    state: "",

    maritalStatus: "",

    address: "",
    city: "",
    phone: "",
  });

  const [registerPatientLoading, setregisterPatientLoading] = useState(false);
  const [formCompleted, setFormCompleted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [countries, setCountries] = useState(countryData);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  // const [tpaOptions, setTpaOptions] = useState();

  const [departmentDropdown, setDepartmentDropdown] = useState([]);
  const [tpaDropdown, setTpaDropdown] = useState([]);
  const [referredDoctorDropdown, setReferredDoctorDropdown] = useState([]);
  const [nameTitleDropdown, setNameTitleDropdown] = useState([]);
  const [nameTitleDropdowns, setNameTitleDropdowns] = useState([]);


  const handleLinkClick = (formName) => {
    setSelectedForm(formName);
  };

  const fetchStates = async () => {
    try {
      if (patientDetails.country === "") {
        return;
      }

      const countryCode = countryData.find(
        (c) => c.name === patientDetails.country,
      )?.isoCode;

      setStates(State.getStatesOfCountry(countryCode));
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error while fetching states");
    }
  };

  const fetchCities = async () => {
    try {
      if (patientDetails.state === "") {
        return;
      }

      const countryCode = countryData.find(
        (c) => c.name === patientDetails.country,
      )?.isoCode;
      const stateCode =
        states.find((c) => c.name === patientDetails.state)?.isoCode || "MH";

      setCities(City.getCitiesOfState(countryCode, stateCode));
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Error while fetching cities");
    }
  };

  useEffect(() => {
    fetchStates();
  }, [patientDetails.country]);
  useEffect(() => {
    fetchCities();
  }, [patientDetails.state]);

  useEffect(() => {
    checkRequiredFields();
  }, [patientDetails]);

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get("/hms/patient-registration/dropdowns");
      // const responseName = await axios.get("admin/nameTitle/getNameTitleDropdown");
      const responseNames = await axios.get("/admin/nameTitle/getActiveNameTitle");
      // setNameTitleDropdown(responseNames.data)
      setNameTitleDropdowns(responseNames.data)
      console.log(responseNames.data);
      // console.log(responseNames.data);
      
      if (response.status === 200) {
        // console.log(responseName.data.NameTitles);

        // setting department dropdown data
        const departments = response.data?.departments;
        setDepartmentDropdown(
          departments?.map((department) => ({
            label: department?.name,
            value: department?.name,
          })),
        );

        // setting tpa dropdown data
        const tpas = response.data?.tpa;
        setTpaDropdown(
          tpas?.map((tpa) => ({
            label: tpa?.tpaName,
            value: tpa?._id,
          })),
        );

        // setting referred doctor dropdown data
        const referredDoctors = response.data?.refferedDoctors;
        setReferredDoctorDropdown(
          referredDoctors?.map((doctor) => ({
            label: doctor?.doctorName,
            value: doctor?.doctorName,
          })),
        );
      }
    } catch (err) {
      console. log(err);
    }
  };

  useEffect(() => {
    fetchDropdownData();
    getDocotorDropdownData();
  }, []);

  const handleDateChange = (date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(12, 0, 0, 0);

    const adjustedDateUTC = new Date(
      adjustedDate.getTime() + adjustedDate.getTimezoneOffset() * 60000,
    );

    setSelectedDate(adjustedDateUTC);
  };

  const validateInput = (name, value) => {
    // Define your validation rules here

    let errorMessage = "";
    switch (name) {
      case "patientFirstName":
      case "patientLastName":
      case "address":
      case "regDepartment":
      case "doctor":
      case "country":
      case "state":
      case "city":
        errorMessage = value.trim() === "" ? "This field is required" : "";
        break;
      case "gender":
        errorMessage = value === "" ? "Please select a gender" : "";
        break;
      case "UIDproof.value":
        if (patientDetails.UIDproof.label === "AADHAR") {
          errorMessage =
            /^[2-9]{1}[0-9]{11}$/.test(value) || value.trim() == ""
              ? ""
              : "Invalid Aadhaar number";
          break;
        } else if (patientDetails.UIDproof.label === "PAN") {
          const isValidPAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
          errorMessage =
            isValidPAN || value.trim() == "" ? "" : "Invalid PAN number";
          break;
        } else if (patientDetails.UIDproof.label === "Driving License") {
          const isValidDrivingLicense = /^[A-Z]{2}[0-9]{13}$/.test(value);
          errorMessage =
            isValidDrivingLicense || value.trim() == ""
              ? ""
              : "Invalid Driving License number";
          break;
        }
        break;
      case "AyushmanBharatNo":
        errorMessage = /^[A-Za-z0-9]{12}$/.test(value)
          ? ""
          : "Invalid Ayushman Bharat number";
        break;

      case "dateOfBirth":
        errorMessage = value === "" ? "Date of birth or Age is required" : "";
        break;
      case "phone":
        errorMessage = /^\d{10}$/.test(value) ? "" : "Invalid phone number";
        break;
      case "email":
        errorMessage = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
          value,
        )
          ? ""
          : "Invalid email address";
        break;
      default:
        break;
    }

    // Update the formErrors state
    if (name === "UIDproof.value") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        UIDproof: errorMessage,
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    }

    // Check if all fields are valid to enable the "Next" button
    const isValidForm = Object.values(formErrors).every(
      (error) => error === "",
    );
    // setFormCompleted(isValidForm);

    setFormCompleted(isValidForm);
  };

  const checkRequiredFields = (name, value) => {
    const selectiveRequiredFields = [
      "patientFirstName",
      "patientLastName",
      "gender",
      "country",
      "state",
      "city",
      "address",
      "regDepartment",
      "doctor",
      "phone",
      "dateOfBirth",
    ];

    // Check if all selective required fields have values
    const areSelectiveFieldsValid = selectiveRequiredFields.every(
      (field) => patientDetails[field].trim() !== "",
    );

    // Update the formCompleted state based on selective field validation
    setFormCompleted(areSelectiveFieldsValid);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "UIDproof.label") {
      setPatientDetails({
        ...patientDetails,
        UIDproof: { ...patientDetails.UIDproof, label: value },
      });
    } else if (name === "UIDproof.value") {
      setPatientDetails({
        ...patientDetails,
        UIDproof: { ...patientDetails.UIDproof, value: value },
      });
    } else {
      setPatientDetails({ ...patientDetails, [name]: value });
    }

    validateInput(name, value);
  };

  const handleSubmit = async () => {
    try {
      setregisterPatientLoading(true);
      let data = {
        ...patientDetails,
        departmentIPDorOPD: "OPD",
      };

      const response = await axios.post(
        "/hms/patient-registration/opdPatientRegistration",
        data,
      );

      if (response.status === 201) {
        setRegisteredPatient(response.data.registeredPatient);
        toast.current.show({
          severity: "success",
          summary: "Registered",
          detail: "Patient Registered Successfully",
        });
        setFormStep("Registered Patient");
      } else if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Registered",
          detail: "Patient is already registered",
        });

        setRegisteredPatient(response.data.registeredPatient);
        setFormStep("Already Registered Patient");
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response.status === 409) {
        toast.current.show({
          severity: "success",
          summary: "Registered",
          detail: "Patient is already exist",
        });
        setRegisteredPatient(error.data.registeredPatient);
        setFormStep("Registered Patient");
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error while registering new patient",
        });
      }
    } finally {
      setregisterPatientLoading(false);
      setPatientDetails({
        nameTitle: "Mr.",
        patientFirstName: "",

        patientLastName: "",
        gender: "Male",
        dateOfBirth: "",

        AyushmanBharatNo: "",
        ABHAadress: "",
        UIDproof: {
          label: "AADHAR",
          value: "",
        },
        regDateTime: new Date(),

        regDepartment: "",

        maritalStatus: "",
        country: "India",
        state: "Maharashtra",
        PanelTPA: null,

        address: "",
        city: "Nashik",
        phone: "",
        doctor: "",

        email: "",
      });
    }
  };

  // const hospitalDepartments = [
  //   { label: "Medicine", value: "Medicine" },
  //   { label: "Pediatrics", value: "Pediatrics" },
  //   { label: "Surgery", value: "Surgery" },
  //   { label: "Gynecology", value: "Gynecology" },
  //   { label: "Ayurvedic", value: "Ayurvedic" },
  // ];

  // const hospitalDoctors = [
  //   { label: "VICKY PATIL", value: "VICKY PATIL" },
  //   { label: "SNEHAL PATIL", value: "SNEHAL PATIL" },
  //   { label: "VICKEY PATIL", value: "VICKEY PATIL" },
  //   { label: "ASHOK PATIL", value: "ASHOK PATIL" },
  // ];

  const getDocotorDropdownData = async () => {
    try {
      const response = await axios.get("/doctors/getActiveDoctors");
      if (response.status === 200 || response.status === 201) {
        console.log(response.data?.data);

        const doctors = response.data?.data;
        setHospitalDoctors(
          doctors?.map((doctor) => ({
            label: doctor?.name,
            value:doctor?._id,
          })),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const reffredByList = [
  //   { label: "DR ASHFAQUE", value: "DR ASHFAQUE" },
  //   { label: "DR BHAGWAT", value: "DR BHAGWAT" },
  //   { label: "DR CHOPDA", value: "DR CHOPDA" },
  //   { label: "DR HITESH CHORDIYA", value: "DR HITESH CHORDIYA" },
  //   { label: "DR NAGAOKAR", value: "DR NAGAOKAR" },
  //   { label: "DR OSWAL", value: "DR OSWAL" },
  //   { label: "DR SANTOSH PANDIT", value: "DR SANTOSH PANDIT" },
  //   { label: "DR VIVEK PAWAR", value: "DR VIVEK PAWAR" },
  // ];

  // const panelList = [{ label: "ASSEMA SCHOOL", value: "ASSEMA SCHOOL" }];

  return (
    <div className="mx-auto flex flex-col ">
      <Toast ref={toast} />
      {formStep === "Render form" && (
        <div className="mx-auto flex w-full flex-col space-y-2  rounded-lg  bg-white p-3 shadow-md ">
          {/* Render the selected form */}
          <h3 className="font-DmSans text-xl font-bold text-slate-800 md:text-3xl">
            Register new patient
          </h3>
          <form className="grid gap-4  sm:grid-cols-2 md:grid-cols-4    ">
            <div className="col-span-full flex flex-col">
              <label
                htmlFor="regDateTime"
                className="w-full font-semibold text-[#181C32]"
              >
                Registeration Date :
              </label>
              <DatePicker
                className="font-bold"
                selected={patientDetails.regDateTime}
                onChange={handleInputChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                withPortal
                disabled
              />

              <span className="text-red-500">{formErrors.regDateTime}</span>
            </div>

            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="AyushmanBharatNo" className="text-[#181C32]">
                Ayushman Bharat(ABHA) No.
              </label>
              <input
                type="text"
                id="AyushmanBharatNo"
                name="AyushmanBharatNo"
                className="h-[41.02px] w-full rounded border p-2"
                placeholder={
                  patientDetails.AyushmanBharatNo
                    ? patientDetails.AyushmanBharatNo
                    : "Enter Ayushman Barat Number"
                }
                onChange={handleInputChange}
              />
              <span className="text-red-500">
                {formErrors.AyushmanBharatNo}
              </span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="ABHAadress" className="text-[#181C32]">
                ABHA address
              </label>
              <input
                type="text"
                id="ABHAadress"
                name="ABHAadress"
                className="h-[41.02px] w-full rounded border p-2"
                placeholder={
                  patientDetails.ABHAadress
                    ? patientDetails.ABHAadress
                    : "Enter ABHA address"
                }
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.ABHAadress}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="UIDproof.label" className="text-[#181C32]">
                <select
                  name="UIDproof.label"
                  id=""
                  className="border"
                  onChange={handleInputChange}
                >
                  <option value="AADHAR">AADHAR</option>
                  <option value="PAN">PAN</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </label>
              <input
                type="text"
                id="UIDproof.value"
                name="UIDproof.value"
                className="h-[41.02px] w-full rounded border p-2"
                placeholder={
                  patientDetails.UIDproof.value
                    ? patientDetails.UIDproof.value
                    : "ID Number"
                }
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.UIDproof} </span>
            </div>

            <hr className="col-span-full" />

            <div className="flex flex-col sm:col-span-2 ">
              <label htmlFor="patientFirstName" className="text-[#181C32]">
                Patient Name <span className="font-bold  text-red-500">*</span>
              </label>
              <div className="flex gap-1">
                <select
                  id="nameTitle"
                  name="nameTitle"
                  className={`rounded border p-2  ${
                    formErrors.nameTitle &&
                    "border-red-500 focus:outline-red-500"
                  }`}
                  onChange={handleInputChange}
                >

{
  nameTitleDropdowns.map((name, index) => (
    // <option value="Mrs.">Mrs.</option>
    <option key={index} value={name.nameTitle}>{name.nameTitle}</option>
  ))
}
                
                    
                </select>
                <input
                  type="text"
                  id="patientFirstName"
                  name="patientFirstName"
                  className={`h-[41.02px] w-full rounded border p-2 ${
                    formErrors.patientFirstName &&
                    "border-red-500 focus:outline-red-500"
                  }`}
                  placeholder={
                    patientDetails.patientFirstName
                      ? patientDetails.patientFirstName
                      : "Enter first name"
                  }
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="patientLastName"
                  name="patientLastName"
                  className={`h-[41.02px] w-full rounded border p-2 ${
                    formErrors.patientLastName &&
                    "border-red-500 focus:outline-red-500"
                  }`}
                  placeholder={
                    patientDetails.patientLastName
                      ? patientDetails.patientLastName
                      : "Enter last name"
                  }
                  onChange={handleInputChange}
                />
              </div>
              <span className="text-red-500">
                {formErrors.patientFirstName || formErrors.patientLastName}
              </span>
            </div>

            {/* Gender and date of birth*/}

            <div className="flex flex-col">
              <label htmlFor="gender" className="text-[#181C32] ">
                Gender <span className="font-bold  text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                className={`rounded border p-2  ${
                  formErrors.gender && "border-red-500 focus:outline-red-500"
                }`}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </select>
              <span className="text-red-500">{formErrors.gender}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="maritalStatus" className="text-[#181C32] ">
                Marital Status{" "}
                <span className="font-bold  text-red-500">*</span>
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                className={`rounded border p-2  ${
                  formErrors.maritalStatus &&
                  "border-red-500 focus:outline-red-500"
                }`}
                onChange={handleInputChange}
              >
                <option value="">--Select--</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
              <span className="text-red-500">{formErrors.maritalStatus}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="dateOfBirth" className="w-full text-[#181C32]">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.dateOfBirth &&
                  "border-red-500 focus:outline-red-500"
                }`}
                onChange={handleInputChange}
                value={patientDetails.dateOfBirth}
              />
              <span className="text-red-500">{formErrors.dateOfBirth}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="age" className="w-full text-[#181C32]">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.dateOfBirth &&
                  "border-red-500 focus:outline-red-500"
                }`}
                onChange={(e) => {
                  const age = e.target.value;
                  const currentYear = new Date().getFullYear() - age;

                  setPatientDetails({
                    ...patientDetails,
                    dateOfBirth: `${currentYear}-01-01`,
                  });
                }}
                value={
                  new Date().getFullYear() -
                    parseInt(patientDetails.dateOfBirth.substring(0, 4)) || ""
                }
                max={200}
              />
              <span className="text-red-500">{formErrors.dateOfBirth}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-[#181C32]">
                Email
              </label>
              <input
                type="tel"
                id="email"
                name="email"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.email && "border-red-500 focus:outline-red-500"
                }`}
                placeholder={
                  patientDetails.email
                    ? patientDetails.email
                    : "Enter email adress"
                }
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.email}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-[#181C32]">
                Phone Number <span className="font-bold  text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                maxLength={10}
                name="phone"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.phone && "border-red-500 focus:outline-red-500"
                }`}
                placeholder={
                  patientDetails.phone
                    ? patientDetails.phone
                    : "Enter phone no."
                }
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.phone}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="regDepartment" className="text-[#181C32] ">
                Department <span className="font-bold  text-red-500">*</span>
              </label>
              <RegSelect
                options={departmentDropdown}
                name={"regDepartment"}
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.regDepartment}</span>
            </div>

            {/* Full Address and city name*/}

            <div className="col-span-full flex flex-col md:col-span-2">
              <label htmlFor="address" className="text-[#181C32]">
                Full Address <span className="font-bold  text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.address && "border-red-500 focus:outline-red-500"
                } `}
                placeholder={
                  patientDetails.address
                    ? patientDetails.address
                    : "Enter full address"
                }
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.address}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="country" className="text-[#181C32]">
                Country
                <span className="font-bold  text-red-500">*</span> :
              </label>

              <select
                name="country"
                onChange={handleInputChange}
                className="h-[41.02px] w-full rounded border p-2"
              >
                <option value="India">India IN</option>
                {countries?.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name} {country.isoCode}
                  </option>
                ))}
              </select>

              <span className="text-red-500">{formErrors.country}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="state" className="text-[#181C32]">
                State
                <span className="font-bold  text-red-500">*</span> :
              </label>
              {patientDetails.country != "" ? (
                <select
                  name="state"
                  onChange={handleInputChange}
                  className="h-[41.02px] w-full rounded border p-2"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  {states?.map((state, index) => (
                    <option key={index} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  name="state"
                  id="state"
                  disabled
                  className="h-[41.02px] w-full rounded border p-2"
                >
                  <option value="">--Select City--</option>
                </select>
              )}
              <span className="text-red-500">{formErrors.state}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="text-[#181C32]">
                City
                <span className="font-bold  text-red-500">*</span> :
              </label>
              {patientDetails.state != "" ? (
                <select
                  name="city"
                  onChange={handleInputChange}
                  className="h-[41.02px] w-full rounded border p-2"
                >
                  <option value="Nashik">Nashik</option>
                  {cities?.map((city, index) => (
                    <option key={index} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  name="city"
                  id="city"
                  disabled
                  className="h-[41.02px] w-full rounded border p-2"
                >
                  <option value="">--Select City--</option>
                </select>
              )}

              <span className="text-red-500">{formErrors.city}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="doctor" className="text-[#181C32] ">
                Doctor <span className="font-bold  text-red-500">*</span>
              </label>
              <RegSelect
                options={hospitalDoctors}
                name={"doctor"}
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.doctor}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="refferedBy" className="text-[#181C32] ">
                Reffered By
              </label>
              <RegSelect
                options={referredDoctorDropdown}
                name={"refferedBy"}
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.refferedBy}</span>
            </div>

            <div className="flex flex-col">
              <label htmlFor="PanelTPA" className="text-[#181C32] ">
                Panel / TPA
              </label>
              <RegSelect
                options={tpaDropdown}
                name={"PanelTPA"}
                onChange={handleInputChange}
                className="h-[41.02px] w-full rounded border p-2"
              >
                {/* <option value="">--Select--</option>
                {tpaOptions?.map((item) => (
                  <option
                    key={item._id}
                    className={`${item.colorCode} font-bold`}
                    value={item._id}
                  >
                    {item.tpaName}
                  </option>
                ))} */}
              </RegSelect>
              <span className="text-red-500">{formErrors.PanelTPA}</span>
            </div>

            <hr className="col-span-full" />

            {/* Phone Number */}

            <div className="col-span-full flex justify-end">
              <button
                type="button"
                className={` flex h-[43px] items-center gap-2 rounded bg-slate-700  p-2 text-white
               disabled:cursor-not-allowed disabled:bg-[#bbbec4]
              `}
                disabled={!formCompleted || registerPatientLoading}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {registerPatientLoading && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
                Register Patient
              </button>
            </div>
          </form>
        </div>
      )}

{formStep === "Registered Patient" && (
  <div className="flex h-[auto] w-[430px]">
    <div className="rounded p-2 shadow-lg transition-transform transform ">
      <div className="flex flex-col items-center space-y-3  w-[100%] bg-white p-4 rounded-lg animate-fadeIn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-green-700 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
              </svg>
              <div className="card">

              
        <h1 className="bg-gradient-to-r from-[#0D1B2A] to-[#1B263B] bg-clip-text p-1 m-0 text-center text-3xl font-bold text-transparent">
          Patient Registered Successfully
        </h1>
        <p className="text-center p-2 ">
          UHID: <strong>{registeredPatient.uhid}</strong>
        </p>
        <p className="text-center  p-2 border rounded-[20px]  bg-blue-200">
          <strong className="text-black p-1.5"> OPDID:{registeredPatient.opdID}</strong>
                </p>
                <div className="patient-text-para flex flex-wrap justify-center m-3">
                <p className="text-center mr-3">
          Patient: <strong>{registeredPatient.patientFirstName} {registeredPatient.patientLastName}</strong>
        </p>
        <p className="text-center">
          Phone: <strong>{registeredPatient.phone}</strong>
        </p>
                </div>
        
        <p className="font-semibold mb-5">
          Take a screenshot or note down the UHID and OPD ID for further use!
                </p>
                <div className="card-btn flex flex-wrap flex-row items-center justify-center ">
        <Link
          to="/hms/appointment"
          className="inline-flex mr-2 items-center rounded-[5px] bg-[#1B263B] px-3 p-3 text-white hover:bg-[#0D1B2A] focus:outline-none focus:ring transition-colors "
        >
          <svg
            xmlns="http://w3.org/2000/svg"
            className="mr-1 h-4 w-5"
            fill="none"
            viewBox="0 -2 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
                  </svg>
                  
          <span className="text-sm font-medium">Book Appointment</span>
        </Link>
        <button
          className="inline-flex items-center rounded-[5px] bg-[#1B263B] px-3 p-3 text-white hover:bg-[#0D1B2A] focus:outline-none focus:ring transition-colors"
          onClick={() => {
            setFormStep("Render form");
            setRegisteredPatient({});
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 2 24 24"
            fill="none"
          >
            <path
              d="M6 15.1255H18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22.4318L12 7.81909"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm text-center font-medium">Register New Patient</span>
                </button>
                </div>
                </div>
      </div>
    </div>
  </div>
)}

      {formStep === "Already Registered Patient" && (
        <>
          <div className="flex h-full items-center justify-center ">
            <div className="rounded p-1 shadow-lg ">
              <div className="flex flex-col items-center space-y-2 bg-white p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-28 w-28 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h1 className="bg-gradient-to-r from-[#1F263E] to-[#1F263E] bg-clip-text text-center text-4xl font-bold text-transparent">
                  Patient Already Exist
                </h1>
                <p className="text-center">
                  UHID : <strong>{registeredPatient.uhid}</strong>
                </p>
                <p className="text-center">
                  OPDID : <strong>{registeredPatient.opdID}</strong>
                </p>
                <p className="text-center">
                  Patient :{" "}
                  <strong>
                    {registeredPatient.patientFirstName}{" "}
                    {registeredPatient.patientLastName}
                  </strong>
                </p>
                <p className="text-center">
                  phone : <strong>{registeredPatient.phone}</strong>{" "}
                </p>

                <p>
                  take screenshot or not down the UHID and OPD ID for further
                  use{" "}
                </p>
                <Link
                  to="/hms/appointment"
                  className="inline-flex items-center rounded-full bg-[#1F263E] px-4 py-2  text-white hover:bg-[#1F263Ee8] focus:outline-none focus:ring"
                >
                  <svg
                    xmlns="http://w3.org/2000/svg"
                    className="mr-2 h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <span className="text-sm font-medium">Book Appointment</span>
                </Link>
                <button
                  className="inline-flex items-center rounded-full bg-[#1F263E] px-4 py-2  text-white hover:bg-[#1F263Ee8] focus:outline-none focus:ring"
                  onClick={() => {
                    setFormStep("Render form");
                    setRegisteredPatient({});
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="30"
                    viewBox="0 0 24 30"
                    fill="none"
                  >
                    <path
                      d="M6 15.1255H18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22.4318L12 7.81909"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>{" "}
                  <span className="text-sm font-medium">
                    Register New Patient
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RegisterNewPatient;
