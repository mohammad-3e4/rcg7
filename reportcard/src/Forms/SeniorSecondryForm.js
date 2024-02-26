import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios"; // Removed unused import
import { useSelector } from "react-redux";
import {URL} from '../URL'
const SeniorSecondaryForm = () => {
  const selectedVal = useSelector(
    (state) => state.selectedValues.selectedValues
  );
  const selectedClass = selectedVal[0];
  const selectedSection = selectedVal[1];
  const selectedSubject = selectedVal[2];


  console.log(selectedVal);
  const [selected, setSelected] = useState();
  const [dataone, setDataone] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [message, setMessage] = useState("");
  const [examtype, setExamType] = useState("");
  const [error, setError] = useState();

  const initialValues = {
    class_name: "",
    student_name: "",
    subject: "",
    examtype: examtype,
    adm_no: 0,
    section: "",
    theory_max: 0,
    theory_obtain: 0,
    practical_max: 0,
    practical_obtain: 0,
    overall: 0,
    overall_grade: "",
    t1_scholastic_computer: "",
    t1_scholastic_drawing: "",
    t1_scholastic_deciplin: "",
    t1_scholastic_gk: "",
    t1_scholastic_remark: "",
    t1_scholastic_entery: "",
  };

  const validationSchema = Yup.object().shape({
    class_name: Yup.string().required("Please Select the Class"),
    section: Yup.string().required("Please Select the Section"),
    subject: Yup.string().required("Please Select the Subject"),
    // examtype: Yup.string().required("Please Select the Exam type"),

    student_name: Yup.string().required(
      "Please Select from suggestion the Subject"
    ),
    adm_no: Yup.string().required("Please Enter Admission number"),
  });

  const handleStudent = (studentdata) => {
    setSelected(studentdata);
    formik.setFieldValue("adm_no", studentdata.adm_no);
    formik.setFieldValue("student_name", studentdata.student_name);
    setFiltered([]);
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
    
      try {
        const response = await axios.post(
         `${URL}/admin/subject-sensecondary-info`,
          values
        );
        console.log(response);
        if (response.data.success) {
          setMessage(response.data.message);
          setTimeout(() => {
            setMessage("");
            resetForm(); // Reset the form after successful submission
          }, 2000);
        } else {
          console.error("Error submitting form:", response.data.message);
        }
      } catch (error) {
        setTimeout(() => {
          setError("");
        }, 2000);
        console.error("Error submitting form:", error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("class_name", selectedClass.toLowerCase());
    formik.setFieldValue("section", selectedSection);
    formik.setFieldValue("subject", selectedSubject);
    const fetchBiodata = async () => {
      if (selectedClass && selectedSection) {
        const tableName = `${selectedClass}_${selectedSection.toLowerCase()}_biodata`;
        try {
          const response = await axios.get(
            `${URL}/studentdata/${tableName}`
          );

  
          setDataone(response.data.results);
        } catch (error) {
          setError("No data found for this className");
          setTimeout(() => {
            setError("");
          }, 3000);
          console.error("Error fetching biodata:", error);
        }
      }
    };
    if (dataone.length === 0) {
      fetchBiodata();
    }

    if (formik.values.adm_no && dataone && !formik.values.student_name) {
      const newFiltered = dataone.filter((item) =>
        item.adm_no.includes(formik.values.adm_no.toString())
      );

      setFiltered(newFiltered);
    } else {
      setFiltered([]);
    }

    const calculateGrade = (totalMarks) => {
      if (totalMarks >= 91 && totalMarks <= 100) {
        return "A1";
      } else if (totalMarks >= 81 && totalMarks <= 90) {
        return "A2";
      } else if (totalMarks >= 71 && totalMarks <= 80) {
        return "B1";
      } else if (totalMarks >= 61 && totalMarks <= 70) {
        return "B2";
      } else if (totalMarks >= 51 && totalMarks <= 60) {
        return "C1";
      } else if (totalMarks >= 41 && totalMarks <= 50) {
        return "C2";
      } else if (totalMarks >= 33 && totalMarks <= 40) {
        return "D";
      } else {
        return "E";
      }
    };

    if (
      formik.values.practical_obtain &&
      formik.values.theory_obtain
    ) {
      const total =
        formik.values.practical_obtain +
        formik.values.theory_obtain;

      console.log(total);
      formik.setFieldValue("overall", total);
      const grade = calculateGrade(total);
      console.log(grade);
      formik.setFieldValue("overall_grade", grade);
    }
  }, [formik.values, selectedVal]);

  return (
    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
      {null && (
        <div
          className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md my-3"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p className="text-sm">{error?.message}</p>
            </div>
          </div>
        </div>
      )}
      {message && (
        <div
          className="bg-teal-100 border-t-4 border-teal-500 rounded-b my-3 text-teal-900 px-4 py-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </div>
      )}
      <form className="py-3" onSubmit={formik.handleSubmit}>
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase text-start">
          Student Information
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="adm_no"
              >
                Addmission Number
              </label>
              <input
                id="adm_no"
                type="text"
                value={formik.values.adm_no}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                  formik.touched.adm_no && formik.errors.adm_no
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>
            {filtered.length > 0 && (
              <div className="bg-white p-3 shadow-lg absolute z-50 w-[43%] cursor-pointer">
                {filtered.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white mt-2 p-2 border-b-2 flex justify-between items-center"
                    onClick={() => handleStudent(item)}
                  >
                    <span className="text-xs rounded-full bg-green-100 px-3 py-2 font-semibold text-green-900 ">
                      Ad no. {item.adm_no}
                    </span>
                    <span className="uppercase text-xs rounded-full bg-green-100 px-3 py-2 font-semibold  text-green-900">
                      {" "}
                      {item.student_name}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {formik.touched.adm_no && formik.errors.adm_no && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.adm_no}
              </p>
            )}
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="student_name"
              >
                Student Name
              </label>
              <input
                type="text"
                id="student_name"
                value={formik.values.student_name}
                onChange={formik.handleChange}
                disabled
                className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                  formik.touched.student_name && formik.errors.student_name
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>
            {formik.touched.student_name && formik.errors.student_name && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.student_name}
              </p>
            )}
          </div>
        </div>
        <hr className="mt-6 border-b-1 border-blueGray-300 pb-6" />
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="overall"
              >
                Over All
              </label>
              <input
                id="overall"
                type="number"
                disabled
                value={formik.values.overall}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                  formik.touched.overall && formik.errors.overall
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="overall_grade"
              >
                Overall Grade
              </label>
              <input
                id="overall_grade"
                type="text"
                value={formik.values.overall_grade}
                onChange={formik.handleChange}
                disabled
                onBlur={formik.handleBlur}
                className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                  formik.touched.overall_grade && formik.errors.overall_grade
                    ? "border-red-500"
                    : ""
                }`}
              />
            </div>
          </div>
        </div>
        <hr className="my-6 border-b-1 border-blueGray-300" />

        <hr className="my-6 border-b-1 border-blueGray-300" />
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase text-start">
          Theory
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-4/12 px-2">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-2">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="theory_max"
                  >
                    max
                  </label>
                  <input
                    id="theory_max"
                    type="number"
                    value={formik.values.theory_max}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                      formik.touched.theory_max && formik.errors.theory_max
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formik.touched.theory_max && formik.errors.theory_max && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.theory_max}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-2">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-2">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="theory_obtain"
                  >
                    Obtains
                  </label>
                  <input
                    id="theory_obtain"
                    type="number"
                    value={formik.values.theory_obtain}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                      formik.touched.theory_obtain &&
                      formik.errors.theory_obtain
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formik.touched.theory_obtain &&
                  formik.errors.theory_obtain && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.theory_obtain}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-b-1 border-blueGray-300" />
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase text-start">
          Practical
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-4/12 px-2">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-2">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="practical_max"
                  >
                    max
                  </label>
                  <input
                    id="practical_max"
                    type="number"
                    value={formik.values.practical_max}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                      formik.touched.practical_max &&
                      formik.errors.practical_max
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formik.touched.practical_max &&
                  formik.errors.practical_max && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.practical_max}
                    </p>
                  )}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-2">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-2">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="practical_obtain"
                  >
                    Obtains
                  </label>
                  <input
                    id="practical_obtain"
                    type="number"
                    value={formik.values.practical_obtain}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                      formik.touched.practical_obtain &&
                      formik.errors.practical_obtain
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                {formik.touched.practical_obtain &&
                  formik.errors.practical_obtain && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.practical_obtain}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-6 border-b-1 border-blueGray-300 pb-6" />

        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          TERM:1 Scholastic
        </h6>

        <div className="flex flex-wrap pb-10">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                htmlFor="t1_scholastic_computer"
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              >
                computer
              </label>
              <select
                id="t1_scholastic_computer"
                value={formik.values.t1_scholastic_computer}
                onChange={formik.handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option selected>choose a Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                htmlFor="t1_scholastic_drawing"
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              >
                drawing
              </label>
              <select
                id="t1_scholastic_drawing"
                value={formik.values.t1_scholastic_drawing}
                onChange={formik.handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option selected>choose a Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                htmlFor="t1_scholastic_deciplin"
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              >
                deciplin
              </label>
              <select
                id="t1_scholastic_deciplin"
                value={formik.values.t1_scholastic_deciplin}
                onChange={formik.handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option selected>choose a Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                htmlFor="t1_scholastic_gk"
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              >
                gk
              </label>
              <select
                id="t1_scholastic_gk"
                value={formik.values.t1_scholastic_gk}
                onChange={formik.handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option selected>choose a Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                htmlFor="t1_scholastic_remark"
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              >
                remark
              </label>
              <select
                id="t1_scholastic_remark"
                value={formik.values.t1_scholastic_remark}
                onChange={formik.handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option selected>choose a Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative w-full mb-3">
              <label
                htmlFor="t1_scholastic_entery"
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              >
                entery
              </label>
              <select
                id="t1_scholastic_entery"
                value={formik.values.t1_scholastic_entery}
                onChange={formik.handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              >
                <option selected>choose a Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mx-3 flex justify-end">
          <button
            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeniorSecondaryForm;
