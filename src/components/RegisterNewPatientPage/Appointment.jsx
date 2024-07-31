import React, { useEffect, useState } from 'react';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { City, Country, State } from 'country-state-city';
import DatePicker from 'react-datepicker';
import RegSelect from './RegSelect';

import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const Appointment = () => {
  const toast = useRef(null);

  const [showConsultedDoctor, setShowConsultedDoctor] = useState(false);
  const [appointmentPatientLoading, setAppointmentPatientLoading] = useState(false);

  let countryData = Country.getAllCountries();

  const [patientDetails, setPatientDetails] = useState({
    nameTitle: 'Mr.',
    patientFirstName: '',
    patientLastName: '',
    gender: 'Male',
    dateOfBirth: '',
    regDateTime: new Date(),
    regDepartment: '',
    maritalStatus: 'Single',
    country: 'India',
    state: 'Maharashtra',
    address: '',
    city: 'Nashik',
    phone: '',
    doctor: '',
    complaint: '',
    appointmentDate: '',
    email: '',
    consultedDoctor: '',
    consultedBefore: 'No',
  });

  const [formErrors, setFormErrors] = useState({
    patientFirstName: '',
    patientLastName: '',
    gender: '',
    dateOfBirth: '',
    doctor: '',
    regDateTime: '',
    email: '',
    regDepartment: '',
    country: '',
    state: '',
    maritalStatus: '',
    address: '',
    city: '',
    phone: '',
    complaint: '',
    date: '',
  });

  const [formCompleted, setFormCompleted] = useState(false);
  const [countries, setCountries] = useState(countryData);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const [nameTitleDropdown, setNameTitleDropdown] = useState([]);

  const [departmentDropdown, setDepartmentDropdown] = useState([]);
  const handleSubmit = async () => {
    try {
      setAppointmentPatientLoading(true);

      console.log(patientDetails);

      setShowConsultedDoctor(false);

      // Your API request code goes here

      // Reset form after successful submission
      setFormErrors({
        patientFirstName: '',
        patientLastName: '',
        gender: '',
        dateOfBirth: '',
        doctor: '',
        regDateTime: '',
        email: '',
        regDepartment: '',
        country: '',
        state: '',
        maritalStatus: '',
        address: '',
        city: '',
        phone: '',
        complaint: '',
        appointmentDate: '',
        consultedDoctor: '',
      });
      setPatientDetails({
        nameTitle: 'Mr.',
        patientFirstName: '',
        patientLastName: '',
        gender: 'Male',
        dateOfBirth: '',
        regDateTime: new Date(),
        regDepartment: '',
        maritalStatus: 'Single',
        country: 'India',
        state: 'Maharashtra',
        address: '',
        city: 'Nashik',
        phone: '',
        doctor: '',
        complaint: '',
        appointmentDate: '',
        email: '',
        consultedDoctor: '',
        consultedBefore: 'No',
      });
      setFormCompleted(false);

      // Show success message
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Appointment booked successfully!',
      });
    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error booking appointment. Please try again later.',
      });
    } finally {
      setAppointmentPatientLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      if (patientDetails.country === '') {
        return;
      }

      const countryCode = countryData.find((c) => c.name === patientDetails.country)?.isoCode;

      setStates(State.getStatesOfCountry(countryCode));
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('Error while fetching states');
    }
  };

  const fetchCities = async () => {
    try {
      if (patientDetails.state === '') {
        return;
      }

      const countryCode = countryData.find((c) => c.name === patientDetails.country)?.isoCode;
      const stateCode = states.find((c) => c.name === patientDetails.state)?.isoCode || 'MH';

      setCities(City.getCitiesOfState(countryCode, stateCode));
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('Error while fetching cities');
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

  const validateInput = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'patientFirstName':
      case 'patientLastName':
      case 'address':
      case 'regDepartment':
      case 'doctor':
      case 'country':
      case 'state':
      case 'city':
        errorMessage = value.trim() === '' ? 'This field is required' : '';
        break;

      case 'consultedDoctor':
        errorMessage = showConsultedDoctor && value.trim() === '' ? 'This field is required' : '';
        break;
      case 'gender':
        errorMessage = value === '' ? 'Please select a gender' : '';
        break;

      case 'dateOfBirth':
        errorMessage = value === '' ? 'Date of birth or Age is required' : '';
        break;
      case 'phone':
        errorMessage = /^\d{10}$/.test(value) ? '' : 'Invalid phone number';
        break;
      case 'email':
        errorMessage = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) ? '' : 'Invalid email address';
        break;
      default:
        break;
    }

    // Check if all fields are valid to enable the "Next" button
    setFormErrors({ ...formErrors, [name]: errorMessage });

    // Check if all fields are valid to enable the "Book Appointment" button
    const isValidForm = Object.values(formErrors).every((error) => error === '');
    setFormCompleted(isValidForm);
  };

  const checkRequiredFields = (name, value) => {
    const selectiveRequiredFields = [
      'patientFirstName',
      'patientLastName',
      'gender',
      'country',
      'state',
      'city',
      'address',
      'regDepartment',
      'doctor',
      'phone',
      'dateOfBirth',
    ];

    // Check if all selective required fields have values
    const areSelectiveFieldsValid = selectiveRequiredFields.every((field) => patientDetails[field].trim() !== '');

    // Update the formCompleted state based on selective field validation
    setFormCompleted(areSelectiveFieldsValid);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
    validateInput(name, value);
  };

  // const hospitalDoctors = [
  //   { label: "VICKY PATIL", value: "VICKY PATIL" },
  //   { label: "SNEHAL PATIL", value: "SNEHAL PATIL" },
  //   { label: "VICKEY PATIL", value: "VICKEY PATIL" },
  //   { label: "ASHOK PATIL", value: "ASHOK PATIL" },
  // ];

  const getDocotorDropdownData = async () => {
    try {
      const response = await axios.get('/doctors/getActiveDoctors');
      if (response.status === 200 || response.status === 201) {
        console.log(response.data?.data);

        const doctors = response.data?.data;
        setHospitalDoctors(
          doctors?.map((doctor) => ({
            label: doctor?.name,
            value: doctor?._id,
          }))
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mx-auto flex flex-col p-8 ">
      <Toast ref={toast} />

      <div className="mx-auto flex w-full flex-col space-y-2  rounded-lg  bg-white p-3 shadow-md ">
        <h3 className="font-DmSans text-xl font-bold text-slate-800 md:text-3xl">Book new Appointment</h3>
        <form className="grid gap-4  sm:grid-cols-2 md:grid-cols-4    ">
          <div className="col-span-full flex flex-col">
            <label htmlFor="regDateTime" className="w-full font-semibold text-[#181C32]">
              Appointment Date :
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

          <hr className="col-span-full" />

          <h2 className="col-span-full font-DmSans text-xl font-bold text-slate-800 ">Patient Details:</h2>

          <div className="flex flex-col sm:col-span-2 ">
            <label htmlFor="patientFirstName" className="text-[#181C32]">
              Patient Name <span className="font-bold  text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              <select
                id="nameTitle"
                name="nameTitle"
                className={`rounded border p-2  ${formErrors.nameTitle && 'border-red-500 focus:outline-red-500'}`}
                onChange={handleInputChange}
                value={patientDetails.nameTitle}
              >
                {nameTitleDropdown.map((name, index) => (
                  // <option value="Baby">Baby</option>
                  <option key={index} value={name.nameTitle}>
                    {name.nameTitle}
                  </option>
                ))}
                {/* <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Master">Master</option>
                    <option value="Baby">Baby</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Fr.">Fr.</option>
                    <option value="Er.">Er.</option>
                    <option value="Boy">Boy</option>
                    <option value="Ar">Ar</option>
                    <option value="Lt.">Lt.</option>
                    <option value="Prof.">Prof.</option> */}
              </select>
              <input
                type="text"
                id="patientFirstName"
                name="patientFirstName"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.patientFirstName && 'border-red-500 focus:outline-red-500'
                }`}
                placeholder={patientDetails.patientFirstName ? patientDetails.patientFirstName : 'Enter first name'}
                onChange={handleInputChange}
                value={patientDetails.patientFirstName}
              />
              <input
                type="text"
                id="patientLastName"
                name="patientLastName"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.patientLastName && 'border-red-500 focus:outline-red-500'
                }`}
                placeholder={patientDetails.patientLastName ? patientDetails.patientLastName : 'Enter last name'}
                onChange={handleInputChange}
                value={patientDetails.patientLastName}
              />
            </div>
            <span className="text-red-500">{formErrors.patientFirstName || formErrors.patientLastName}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="gender" className="text-[#181C32] ">
              Gender <span className="font-bold  text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              className={`rounded border p-2  ${formErrors.gender && 'border-red-500 focus:outline-red-500'}`}
              onChange={handleInputChange}
              value={patientDetails.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="other">Other</option>
            </select>
            <span className="text-red-500">{formErrors.gender}</span>
          </div>
          <div className="flex flex-col">
            <label htmlFor="maritalStatus" className="text-[#181C32] ">
              Marital Status <span className="font-bold  text-red-500">*</span>
            </label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              className={`rounded border p-2  ${formErrors.maritalStatus && 'border-red-500 focus:outline-red-500'}`}
              onChange={handleInputChange}
              value={patientDetails.maritalStatus}
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
                formErrors.dateOfBirth && 'border-red-500 focus:outline-red-500'
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
                formErrors.dateOfBirth && 'border-red-500 focus:outline-red-500'
              }`}
              onChange={(e) => {
                const age = e.target.value;
                const currentYear = new Date().getFullYear() - age;

                setPatientDetails({
                  ...patientDetails,
                  dateOfBirth: `${currentYear}-01-01`,
                });
              }}
              value={new Date().getFullYear() - parseInt(patientDetails.dateOfBirth.substring(0, 4)) || ''}
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
                formErrors.email && 'border-red-500 focus:outline-red-500'
              }`}
              placeholder={patientDetails.email ? patientDetails.email : 'Enter email adress'}
              onChange={handleInputChange}
              value={patientDetails.email}
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
                formErrors.phone && 'border-red-500 focus:outline-red-500'
              }`}
              placeholder={patientDetails.phone ? patientDetails.phone : 'Enter phone no.'}
              onChange={handleInputChange}
              value={patientDetails.phone}
            />
            <span className="text-red-500">{formErrors.phone}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="regDepartment" className="text-[#181C32] ">
              Department <span className="font-bold  text-red-500">*</span>
            </label>

            <RegSelect
              options={departmentDropdown}
              name={'regDepartment'}
              onChange={handleInputChange}
              value={patientDetails.regDepartment}
            />
            <span className="text-red-500">{formErrors.regDepartment}</span>
          </div>

          <div className="col-span-full flex flex-col md:col-span-2">
            <label htmlFor="address" className="text-[#181C32]">
              Full Address <span className="font-bold  text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              className={`h-[41.02px] w-full rounded border p-2 ${
                formErrors.address && 'border-red-500 focus:outline-red-500'
              } `}
              placeholder={patientDetails.address ? patientDetails.address : 'Enter full address'}
              onChange={handleInputChange}
              value={patientDetails.address}
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
              value={patientDetails.country}
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
            {patientDetails.country != '' ? (
              <select
                name="state"
                onChange={handleInputChange}
                className="h-[41.02px] w-full rounded border p-2"
                value={patientDetails.state}
              >
                <option value="Maharashtra">Maharashtra</option>
                {states?.map((state, index) => (
                  <option key={index} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            ) : (
              <select name="state" id="state" disabled className="h-[41.02px] w-full rounded border p-2">
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
            {patientDetails.state != '' ? (
              <select
                name="city"
                onChange={handleInputChange}
                className="h-[41.02px] w-full rounded border p-2"
                value={patientDetails.city}
              >
                <option value="Nashik">Nashik</option>
                {cities?.map((city, index) => (
                  <option key={index} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            ) : (
              <select name="city" id="city" disabled className="h-[41.02px] w-full rounded border p-2">
                <option value="">--Select City--</option>
              </select>
            )}

            <span className="text-red-500">{formErrors.city}</span>
          </div>

          <hr className="col-span-full" />

          <h2 className="col-span-full font-DmSans text-xl font-bold text-slate-800 ">Appointment Details:</h2>

          <div className="flex flex-col">
            <label htmlFor="doctor" className="text-[#181C32] ">
              Doctor <span className="font-bold  text-red-500">*</span>
            </label>
            <RegSelect
              options={hospitalDoctors}
              name={'doctor'}
              onChange={handleInputChange}
              value={patientDetails.doctor}
            />
            <span className="text-red-500">{formErrors.doctor}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="appointmentDate" className="text-[#181C32]">
              Appointment Date :
            </label>

            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              onChange={(e) => handleInputChange(e)}
              min={new Date().toISOString().split('T')[0]}
              className="h-[41.02px] w-full cursor-pointer rounded border p-2"
              value={patientDetails.appointmentDate}
            />
          </div>

          <div>
            <div
              className="flex items-center justify-start
             gap-2"
            >
              <label htmlFor="consultedBefore" className="text-[#181C32]">
                Consulted to any Doctor Before:
              </label>
              <input
                type="checkbox"
                id="consultedBefore"
                name="consultedBefore"
                className="rounded border p-2"
                checked={patientDetails.consultedBefore === 'Yes'}
                onChange={(e) => {
                  const value = e.target.checked ? 'Yes' : 'No';
                  handleInputChange({
                    target: { name: 'consultedBefore', value },
                  });
                  setShowConsultedDoctor(e.target.checked);
                }}
                value={patientDetails.consultedBefore}
              />
            </div>
          </div>

          {showConsultedDoctor && (
            <div className="flex flex-col">
              <label htmlFor="consultedDoctor" className="text-[#181C32] ">
                Consulted Doctor <span className="font-bold  text-red-500">*</span>
              </label>

              <input
                type="text"
                name="consultedDoctor"
                className={`h-[41.02px] w-full rounded border p-2 ${
                  formErrors.phone && 'border-red-500 focus:outline-red-500'
                }`}
                onChange={handleInputChange}
                value={patientDetails.consultedDoctor}
              />
              <span className="text-red-500">{formErrors.consultedDoctor}</span>
            </div>
          )}

          <div className=" flex flex-col">
            <label htmlFor="complaint" className="text-[#181C32]">
              Complaint / Problem :
            </label>

            <textarea
              name="complaint"
              id="complaint"
              className=" rounded border p-2"
              rows="5"
              onChange={(e) => handleInputChange(e)}
              value={patientDetails.complaint}
              placeholder="Write your symptoms or diseases here..."
            ></textarea>
          </div>

          <div className="col-span-full flex justify-end">
            <button
              type="button"
              className={` flex h-[43px] items-center gap-2 rounded bg-slate-700  p-2 text-white
               disabled:cursor-not-allowed disabled:bg-[#bbbec4]
              `}
              disabled={!formCompleted || appointmentPatientLoading}
              onClick={() => {
                handleSubmit();
              }}
            >
              {appointmentPatientLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
