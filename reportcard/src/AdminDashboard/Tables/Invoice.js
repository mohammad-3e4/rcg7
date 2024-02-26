import React, { useState, useEffect } from "react";
import { URL} from '../../URL.js'
const Invoice = () => {
  const [teachers, setTeachers] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [filteredMonth, setFilteredMonth ] = useState([])

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${URL}/staff/teachers`);
      const result = await response.json();
      setTeachers(result);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchSalaries = async () => {
    try {
      const response = await fetch(`${URL}/staff/salaries`);
      const result = await response.json();
      setSalaries(result);
      setFilteredMonth(result)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSalaries();
  }, []);
  const handleMonth = (e) => {
    if(!e.target.value){
     fetchSalaries()
    }
    const selectedMonth = e.target.value;
    const filteredSalaries = salaries.filter((salary) =>
      salary.pay_month.includes(selectedMonth)
    );

    setFilteredMonth(filteredSalaries);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 flex justify-between">
        <h2 className=" text-gray-700 uppercase text-xl font-semibold ">
          paid Invoice
        </h2>
        <select
          onChange={(e) => handleMonth(e)}
          
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-1/4 ease-linear transition-all duration-150"
        >
          <option value="">All</option>
          <option value="jan">Jan</option>
          <option value="feb">Feb</option>
          <option value="mar">Mar</option>
          <option value="apr">Apr</option>
          <option value="may">May</option>
          <option value="jun">Jun</option>
          <option value="jul">Jul</option>
          <option value="aug">Aug</option>
          <option value="sep">Sep</option>
          <option value="oct">Oct</option>
          <option value="nov">Nov</option>
          <option value="dec">Dec</option>
        </select>
      </div>

      <table className="w-full text-sm text-left rtl:text-right text-gray-900  dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              employee name
            </th>
            <th scope="col" className="px-6 py-3">
              employee id
            </th>
            <th scope="col" className="px-6 py-3">
              Bank Details
            </th>
            <th scope="col" className="px-6 py-3">
              Contact
            </th>
            <th scope="col" className="px-6 py-3">
              Salary
            </th>
            <th scope="col" className="px-6 py-3">
              bonus
            </th>
            <th scope="col" className="px-6 py-3">
              deductions
            </th>
            <th scope="col" className="px-6 py-3">
              Net Salary
            </th>
            <th scope="col" className="px-6 py-3">
              Pay Month
            </th>
            <th scope="col" className="px-6 py-3">
              date
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredMonth.length > 0 &&
            filteredMonth.map((salary, index) => (
              <tr
                className={`text-xs capitalize tracking-widest bg-white border-b-2`}
                key={salary.bank_details}
              >
                <td className=" border-0">
                  <span className="bg-yellow-100 py-2 text-orange-900 rounded-full px-3">
                    {salary.name}
                  </span>
                </td>
                <td className=" py-3 px-4 border-0">{salary.employee_id}</td>
                <td className=" py-3 px-4 border-0">{salary.bank_details}</td>
                <td className=" py-3 px-4 border-0">{salary.contact}</td>
                <td className="border-0 text-center">
                  <span className="bg-green-100 py-2 text-green-900 rounded-full px-3">
                    ₹ {salary.salary}
                  </span>
                </td>
                <td className=" py-3 px-4 border-0">₹ {salary.bonus}</td>
                <td className="border-0 text-center">
                  <span className="bg-red-100 py-2 text-red-900 rounded-full px-3">
                    ₹ {salary.deductions}
                  </span>
                </td>
                <td className="  border-0 text-center">
                  <span className="bg-blue-100 py-2 text-blue-900 rounded-full px-3">
                    ₹ {salary.net_salary}
                  </span>
                </td>
                <td className=" py-3 px-4 border-0">{salary.pay_month}</td>
                <td className=" py-3 px-4 border-0">
                  {new Date(salary.payment_date).toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;
