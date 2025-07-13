import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
function ServiceForm() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  console.log(serviceName);
  return (
    <>
      <form>

        <div class="flex items-center justify-center pt-12 md:p-12">
          <div class="mx-auto w-full max-w-[700px] bg-white">
            <div>
              <div className='flex items-center justify-between px-4 pt-4'>
                <button
                  onClick={() => navigate('/citizen/Services')}
                  className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 mb-2"
                >
                  <span>←</span> Back
                </button>
              </div>
            </div>
            <form>
              <div class="m-8">
                <label
                  for="name"
                  class="m-3 block text-base font-semibold text-[#07074D] sm:text-xl"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Full Name"
                  class="bg-whiten w-full rounded-md border border-[#e0e0e0]  px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div class="m-8">
                <label
                  for="phone"
                  class="m-3 block text-base font-semibold text-[#07074D] sm:text-xl"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter your phone number"
                  class="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div class="m-8">
                <label
                  for="email"
                  class="m-3 block text-base font-semibold text-[#07074D] sm:text-xl"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  class="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div class=" flex flex-wrap">
                <div class="w-full px-3 sm:w-1/2">
                  <div class="m-5">
                    <label
                      for="date"
                      class="mb-3 block text-base font-semibold text-[#07074D] sm:text-xl"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      class="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
                <div class="w-full px-3 sm:w-1/2">
                  <div class="m-5">
                    <label
                      for="time"
                      class="mb-3 block text-base font-semibold text-[#07074D] sm:text-xl"
                    >
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      class="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                  </div>
                </div>
              </div>

              <div class="m-8 pt-3">
                <label class="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                  Address Details
                </label>

                <textarea
                  id="message"
                  rows="4"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Address"
                ></textarea>
                <div class="-mx-3 flex flex-wrap">
                  <div class="w-full px-3 sm:w-1/2">
                    <div class="m-3">
                      <label className=" mb-3 block text-base font-semibold text-[#07074D] sm:text-xl">
                        Enter area
                      </label>
                      <input
                        type="text"
                        name="area"
                        id="area"
                        placeholder="Enter area"
                        class="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>
                  <div class="w-full px-3 sm:w-1/2">
                    <div class="m-3">
                      <label className=" mb-3 block text-base font-semibold text-[#07074D] sm:text-xl">
                        Enter city
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        placeholder="Enter city"
                        class="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>

                  <div class="w-full px-3 sm:w-1/2">
                    <div class="m-3">
                      <label className=" mb-3 block text-base font-semibold text-[#07074D] sm:text-xl">
                        Enter post-code
                      </label>
                      <input
                        type="text"
                        name="post-code"
                        id="post-code"
                        placeholder="Post Code"
                        class="w-full rounded-md border border-[#e0e0e0] bg-white px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-5">
                <button class="hover:shadow-form  rounded-md bg-[#6A64F1] px-4 py-3 text-center text-base font-semibold text-white outline-none">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      </form>
    </>
  );
}

export default ServiceForm