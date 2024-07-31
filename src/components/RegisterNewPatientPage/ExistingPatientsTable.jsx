import { Button } from '@/components/ui/button';

const ExistingPatientsTable = ({
  existingPatients,
  headers,
  appointmentDetails,
  handleBookAppointmentExistingPatient,
}) => (
  <div className="max-h-[300px] w-full overflow-auto sm:flex-1">
    <table className="relative w-full min-w-max border border-slate-800 bg-white text-center sm:min-w-full">
      <thead className="sticky top-0">
        <tr className="z-10 divide-x-[1px] divide-gray-400 border border-gray-400 bg-sky-100">
          {headers.map((header, index) => (
            <th key={index} className="py-1 text-sm font-bold uppercase md:px-4 md:py-2">
              {header.label}
            </th>
          ))}

          <th className="   py-1 text-sm font-bold uppercase md:border-r md:px-4 md:py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {existingPatients.length > 0 ? (
          existingPatients.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <td key={cellIndex} className="border-b border-l border-r border-gray-400 py-1 md:px-4 md:py-2">
                  {row[header.value] ?? '-'}
                </td>
              ))}

              <td className="border-b border-l border-r border-gray-400 py-1 text-center md:px-4 md:py-0.5 ">
                <Button
                  onClick={() => {
                    handleBookAppointmentExistingPatient({
                      _id: row._id,
                      appointmentDetails,
                    });
                  }}
                  className="m-1"
                >
                  Book Appointment
                </Button>
              </td>
            </tr>
          ))
        ) : (
          // Added No Record text in the Daycare chart
          <tr>
            <td className="border-b border-l border-r border-gray-400 py-1 text-center md:px-4 md:py-0.5">
              No Records
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ExistingPatientsTable;
