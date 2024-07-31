import { City, Country, State } from 'country-state-city';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import RegSelect from '../components/RegisterNewPatientPage/RegSelect';

const departmentDropdown = [
  { label: 'Medicine', value: 'Medicine' },
  { label: 'Pediatrics', value: 'Pediatrics' },
  { label: 'Surgery', value: 'Surgery' },
  { label: 'Gynecology', value: 'Gynecology' },
  { label: 'Ayurvedic', value: 'Ayurvedic' },
];
const hospitalDoctors = [
  { label: 'VICKY PATIL', value: 'VICKY PATIL' },
  { label: 'SNEHAL PATIL', value: 'SNEHAL PATIL' },
  { label: 'VICKEY PATIL', value: 'VICKEY PATIL' },
  { label: 'ASHOK PATIL', value: 'ASHOK PATIL' },
];
const referredDoctorDropdown = [
  { label: 'DR ASHFAQUE', value: 'DR ASHFAQUE' },
  { label: 'DR BHAGWAT', value: 'DR BHAGWAT' },
  { label: 'DR CHOPDA', value: 'DR CHOPDA' },
  { label: 'DR HITESH CHORDIYA', value: 'DR HITESH CHORDIYA' },
  { label: 'DR NAGAOKAR', value: 'DR NAGAOKAR' },
  { label: 'DR OSWAL', value: 'DR OSWAL' },
  { label: 'DR SANTOSH PANDIT', value: 'DR SANTOSH PANDIT' },
  { label: 'DR VIVEK PAWAR', value: 'DR VIVEK PAWAR' },
];
const tpaDropdown = [{ label: 'ASSEMA SCHOOL', value: 'ASSEMA SCHOOL' }];

const formInit = {
  nameTitle: 'Mr.',
  patientFirstName: '',
  patientLastName: '',
  gender: 'Male',
  dateOfBirth: '',
  AyushmanBharatNo: '',
  ABHAadress: '',
  UIDproof: {
    label: 'AADHAR',
    value: '',
  },
  regDateTime: new Date(),
  maritalStatus: 'Single',
  country: 'India',
  state: 'Maharashtra',
  PanelTPA: null,
  address: '',
  city: 'Nashik',
  phone: '',
  doctor: '',
  email: '',
  isHobbies: false,
  subscribe: false,
  hobbies: [
    {
      name: '',
    },
  ],

  referral: '',
};

const LabNewRegistrationPage = () => {
  let countryData = Country.getAllCountries();

  const [formStep, setFormStep] = useState('Render form');
  const [patientDetails, setPatientDetails] = useState(formInit);
  const [formErrors, setFormErrors] = useState({
    patientFirstName: '',
    patientLastName: '',
    gender: '',
    dateOfBirth: '',
    PanelTPA: null,
    doctor: '',
    refferedBy: '',
    AyushmanBharatNo: '',
    ABHAadress: '',
    UIDproof: '',
    regDateTime: '',
    email: '',

    regDepartment: '',
    country: '',
    state: '',

    maritalStatus: '',

    address: '',
    city: '',
    phone: '',
  });

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: formInit,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hobbies',
  });

  console.log(isSubmitting);

  const [registerPatientLoading, setregisterPatientLoading] = useState(false);

  const [countries, setCountries] = useState(countryData);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const fetchStates = async () => {
    try {
      if (patientDetails.country === '') {
        return;
      }

      const countryCode = countryData.find((c) => c.name === patientDetails.country)?.isoCode;

      setStates(State.getStatesOfCountry(countryCode));
    } catch (error) {
      console.error('Error:', error.message);
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
    }
  };

  useEffect(() => {
    fetchStates();
  }, [patientDetails.country]);
  useEffect(() => {
    fetchCities();
  }, [patientDetails.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'UIDproof.label') {
      setPatientDetails({
        ...patientDetails,
        UIDproof: { ...patientDetails.UIDproof, label: value },
      });
    } else if (name === 'UIDproof.value') {
      setPatientDetails({
        ...patientDetails,
        UIDproof: { ...patientDetails.UIDproof, value: value },
      });
    } else {
      setPatientDetails({ ...patientDetails, [name]: value });
    }
  };

  const onSubmit = async (data) => {
    console.log('Submitting form data', data);
  };

  return (
    <div className="mx-auto flex flex-col ">
      {formStep === 'Render form' && (
        <div className="mx-auto flex w-full flex-col space-y-2  rounded-lg  bg-white p-3 shadow-md border">
          {/* Render the selected form */}
          <h3 className="font-DmSans text-xl font-bold text-slate-800 md:text-3xl">Register new patient</h3>
          <form className="grid gap-4  sm:grid-cols-2 md:grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-span-full flex flex-col">
              <label htmlFor="regDateTime" className="w-full font-semibold text-[#181C32]">
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
                className="h-[41.02px] w-full rounded border p-2"
                // type="text"

                {...register('AyushmanBharatNo', {
                  required: 'Required',
                })}

                // onChange={handleInputChange}
              />
              <span className="text-red-500">{errors?.AyushmanBharatNo?.message}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="ABHAadress" className="text-[#181C32]">
                ABHA address
              </label>
              <input
                className="h-[41.02px] w-full rounded border p-2"
                type="text"
                {...register('ABHAadress', {
                  required: 'Required',
                })}
              />
              <span className="text-red-500">{errors?.ABHAadress?.message}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="UIDproof.label" className="text-[#181C32]">
                <select className="border" {...register('UIDproof.label')}>
                  <option value="AADHAR">AADHAR</option>
                  <option value="PAN">PAN</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </label>
              <input className="h-[41.02px] w-full rounded border p-2" {...register('UIDproof.value')} />
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
                  className={`rounded border p-2  ${formErrors.nameTitle && 'border-red-500 focus:outline-red-500'}`}
                  onChange={handleInputChange}
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Fr.">Fr.</option>
                  <option value="Er.">Er.</option>
                  <option value="Boy">Boy</option>
                  <option value="Ar">Ar</option>
                  <option value="Lt.">Lt.</option>
                  <option value="Prof.">Prof.</option>
                </select>
                <input
                  type="text"
                  id="patientFirstName"
                  name="patientFirstName"
                  className={`h-[41.02px] w-full rounded border p-2 ${
                    formErrors.patientFirstName && 'border-red-500 focus:outline-red-500'
                  }`}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="patientLastName"
                  name="patientLastName"
                  className={`h-[41.02px] w-full rounded border p-2 ${
                    formErrors.patientLastName && 'border-red-500 focus:outline-red-500'
                  }`}
                  onChange={handleInputChange}
                />
              </div>
              <span className="text-red-500">{formErrors.patientFirstName || formErrors.patientLastName}</span>
            </div>
            {/* Gender and date of birth*/}
            <div className="flex flex-col">
              <label htmlFor="gender" className="text-[#181C32] ">
                Gender <span className="font-bold  text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                className={`rounded border p-2  ${formErrors.gender && 'border-red-500 focus:outline-red-500'}`}
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
                Marital Status <span className="font-bold  text-red-500">*</span>
              </label>
              <select
                id="maritalStatus"
                name="maritalStatus"
                className={`rounded border p-2  ${formErrors.maritalStatus && 'border-red-500 focus:outline-red-500'}`}
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

              <Controller
                control={control}
                name="dateOfBirth"
                rules={{
                  required: 'Required',
                }}
                render={({ field }) => (
                  <DatePicker
                    placeholderText="select date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    className={`h-[41.02px] w-full rounded border p-2 ${
                      errors?.dateOfBirth?.message && 'border-red-500 focus:outline-red-500'
                    }`}
                  />
                )}
              />
              <span className="text-red-500">{errors?.dateOfBirth?.message}</span>
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
                  formErrors.phone && 'border-red-500 focus:outline-red-500'
                }`}
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.phone}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="regDepartment" className="text-[#181C32] ">
                Department <span className="font-bold  text-red-500">*</span>
              </label>
              <RegSelect options={departmentDropdown} name={'regDepartment'} onChange={handleInputChange} />
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
                  formErrors.address && 'border-red-500 focus:outline-red-500'
                } `}
                onChange={handleInputChange}
              />
              <span className="text-red-500">{formErrors.address}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="text-[#181C32]">
                Country
                <span className="font-bold  text-red-500">*</span> :
              </label>

              <select name="country" onChange={handleInputChange} className="h-[41.02px] w-full rounded border p-2">
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
                <select name="state" onChange={handleInputChange} className="h-[41.02px] w-full rounded border p-2">
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
                <select name="city" onChange={handleInputChange} className="h-[41.02px] w-full rounded border p-2">
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
            <div className="flex flex-col">
              <label htmlFor="doctor" className="text-[#181C32] ">
                Doctor <span className="font-bold  text-red-500">*</span>
              </label>
              <RegSelect options={hospitalDoctors} name={'doctor'} onChange={handleInputChange} />
              <span className="text-red-500">{formErrors.doctor}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="refferedBy" className="text-[#181C32] ">
                Reffered By
              </label>
              <RegSelect options={referredDoctorDropdown} name={'refferedBy'} onChange={handleInputChange} />
              <span className="text-red-500">{formErrors.refferedBy}</span>
            </div>

            <hr className="col-span-full" />
            <div className="flex">
              <label htmlFor="isHobbies">isHobbies</label>
              <input type="checkbox" {...register('isHobbies')} value={watch('isHobbies')} />
            </div>

            {getValues('subscribe') && (
              <div>
                <label>Referral Source</label>
                <input
                  {...register('referral', {
                    required: 'Referral source is required if subscribing',
                  })}
                  placeholder="How did you hear about us?"
                />
                {errors.referral && <p style={{ color: 'orangered' }}>{errors.referral.message}</p>}
              </div>
            )}

            <div>
              <label htmlFor="sub">Subscribe to Newsletter</label>
              <input type="checkbox" id="sub" {...register('subscribe')} />
            </div>

            {getValues('subscribe') && (
              <div>
                <label>Referral Source</label>
                <input
                  {...register('referral', {
                    required: 'Referral source is required if subscribing',
                  })}
                  placeholder="How did you hear about us?"
                />
                {errors.referral && <p style={{ color: 'orangered' }}>{errors.referral.message}</p>}
              </div>
            )}

            {getValues('isHobbies') && (
              <div className="flex flex-col">
                <label htmlFor="refferedBy" className="text-[#181C32] ">
                  Hobbies
                </label>

                {fields.map((item, index) => (
                  <div className="flex" key={item.id}>
                    <input
                      key={item.id}
                      className={`h-[41.02px] w-full rounded border p-2 ${
                        errors?.hobbies?.[index]?.name?.message && 'border-red-500 focus:outline-red-500'
                      }`}
                      {...register(`hobbies.${index}.name`, {
                        required: 'Required',
                      })}
                    />

                    {errors?.hobbies?.[index]?.message && (
                      <span className="text-red-500">{errors?.hobbies?.[index]?.message}</span>
                    )}

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    append({
                      name: '',
                    })
                  }
                >
                  Add
                </button>
              </div>
            )}
            <hr className="col-span-full" />
            {/* Phone Number */}
            <div className="col-span-full flex justify-end">
              <button
                className={` flex h-[43px] items-center gap-2 rounded bg-slate-700  p-2 text-white
               disabled:cursor-not-allowed disabled:bg-[#bbbec4]
              `}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LabNewRegistrationPage;
