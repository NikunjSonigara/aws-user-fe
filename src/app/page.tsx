"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

interface User {
  first_name: string;
  last_name: string;
  address?: string;
  phone?: string;
  email: string;
}

const UserSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string(),
  phone: Yup.string().matches(/^[0-9]+$/, "Phone number must be digits"),
});

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (values: User, { resetForm }: any) => {
    try {
      await axios.post(API_URL, values);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 animate-gradient"></div>
      <div className="relative z-10 flex space-x-8 p-8 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg w-full max-w-4xl">
        {/* Form Section */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">
            User Management
          </h1>

          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              email: "",
              address: "",
              phone: "",
            }}
            validationSchema={UserSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, isValid }) => (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block font-semibold text-white"
                  >
                    First Name
                  </label>
                  <Field
                    name="first_name"
                    className="border border-gray-300 p-3 w-full rounded-md bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.first_name && touched.first_name && (
                    <div className="text-red-500">{errors.first_name}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block font-semibold text-white"
                  >
                    Last Name
                  </label>
                  <Field
                    name="last_name"
                    className="border border-gray-300 p-3 w-full rounded-md bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.last_name && touched.last_name && (
                    <div className="text-red-500">{errors.last_name}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-semibold text-white"
                  >
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="border border-gray-300 p-3 w-full rounded-md bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500">{errors.email}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block font-semibold text-white"
                  >
                    Address
                  </label>
                  <Field
                    name="address"
                    className="border border-gray-300 p-3 w-full rounded-md bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block font-semibold text-white"
                  >
                    Phone
                  </label>
                  <Field
                    name="phone"
                    className="border border-gray-300 p-3 w-full rounded-md bg-white bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  disabled={isSubmitting || !isValid}
                  type="submit"
                  className={`bg-blue-600 text-white p-3 rounded-md transition duration-200 ${
                    !isValid || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* User List Section */}
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center m-2">
            <h2 className="text-xl font-bold text-white">Users List</h2>
            <button
              onClick={fetchUsers}
              className={`bg-green-500 text-white p-2 rounded`}
            >
              Fetch Users
            </button>
          </div>
          <div className="overflow-y-scroll max-h-[calc(100vh-200px)] hide-scrollbar">
            {users.length > 0 ? (
              users.map((user, index) => (
                <div
                  key={index}
                  className="border border-gray-300 p-4 mb-4 bg-white bg-opacity-30 backdrop-blur-md rounded-md shadow-sm"
                >
                  <p>
                    <strong>Name:</strong> {user.first_name} {user.last_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  {user.address && (
                    <p>
                      <strong>Address:</strong> {user.address}
                    </p>
                  )}
                  {user.phone && (
                    <p>
                      <strong>Phone:</strong> {user.phone}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
