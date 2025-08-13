import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";
import { FaMapMarkerAlt } from "react-icons/fa";
import loading_gif from "../../../../../assets/gif/loading-gif.gif";

const CustomCalendar = () => {
  const API_BASE_URL = "https://auth-backend-2-k3ph.onrender.com/api";
  const adminId = "ADM007";

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [events, setEvents] = useState({});
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/events/admin/${adminId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
            email: localStorage.getItem("email"),
            id: localStorage.getItem("id"),
          },
        }
      );

      const formattedEvents = {};
      response.data.forEach((event) => {
        const dateKey = dayjs(event.date).format("YYYY-MM-DD");
        if (!formattedEvents[dateKey]) {
          formattedEvents[dateKey] = [];
        }
        formattedEvents[dateKey].push({
          id: event.id,
          name: event.title,
          location: event.location,
          date: event.date,
          description: event.description,
        });
      });

      setEvents(formattedEvents);
    } catch (err) {
      toast.error("Failed to fetch events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Reset form inputs
  const resetForm = () => {
    setEventText("");
    setEventLocation("");
    setEditingEventId(null);
    setEventDescription("");
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = async () => {
    if (!eventText.trim()) {
      toast.error("Event name is required");
      return;
    }

    setLoading(true);
    try {
      const eventData = {
        title: eventText,
        adminId: adminId,
        date: selectedDate.format("YYYY-MM-DD"),
        location: eventLocation,
        description: eventDescription,
      };

      if (editingEventId) {
        await axios.put(`${API_BASE_URL}/events/${editingEventId}`, eventData, {
          headers: {
            token: localStorage.getItem("token"),
            email: localStorage.getItem("email"),
            id: localStorage.getItem("id"),
          },
        });
        toast.success("Event updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/events`, eventData, {
          headers: {
            token: localStorage.getItem("token"),
            email: localStorage.getItem("email"),
            id: localStorage.getItem("id"),
          },
        });
        toast.success("Event created successfully!");
      }

      await fetchEvents();
      resetForm();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelectedEvent = async () => {
    if (!selectedEventDetails) return;

    setLoading(true);
    try {
      const eventId =
        selectedEventDetails.events[selectedEventDetails.selectedIndex].id;
      await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("email"),
          id: localStorage.getItem("id"),
        },
      });

      await fetchEvents();
      setSelectedEventDetails(null);
      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete event");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEventDetails = (dateKey, index) => {
    setSelectedEventDetails({
      date: dateKey,
      events: events[dateKey],
      selectedIndex: index,
    });
    setShowModal(false);
  };

  const openEditModalFromDetails = () => {
    if (!selectedEventDetails) return;

    const { events, selectedIndex } = selectedEventDetails;
    const event = events[selectedIndex];

    setSelectedDate(dayjs(event.date));
    setEventText(event.name);
    setEventLocation(event.location || "");
    setEditingEventId(event.id);
    setEventDescription(event.description || "");

    setShowModal(true);
    setSelectedEventDetails(null);
  };

  // Generate calendar dates
  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
  const daysInMonth = currentDate.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(dayjs(currentDate).date(i));

  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  if (loading && !showModal && !selectedEventDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      {/* Month navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white hover:bg-indigo-700"
          disabled={loading}
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white hover:bg-indigo-700"
          disabled={loading}
        >
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const dateKey = date?.format("YYYY-MM-DD");
          return (
            <div
              key={idx}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              {date ? (
                <button
                  onClick={() => handleDateClick(date)}
                  className={`h-10 w-10 rounded-full transition-all duration-200 ${
                    date.isSame(selectedDate, "day")
                      ? "bg-indigo-600 text-white"
                      : "text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
                  }`}
                  disabled={loading}
                >
                  {date.date()}
                </button>
              ) : (
                <div />
              )}

              {/* Event dots */}
              {events[dateKey]?.length > 0 &&
                events[dateKey].map((event, i) => (
                  <button
                    key={i}
                    onClick={() => openEventDetails(dateKey, i)}
                    className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border border-white bg-green-500 dark:border-gray-800"
                    title={event.name}
                    disabled={loading}
                  ></button>
                ))}
            </div>
          );
        })}
      </div>

      {/* Add Event button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          disabled={loading}
        >
          + Add Event
        </button>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="relative max-h-[90vh] w-96 overflow-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 animate-modalDrop">

            {/* Loading Overlay inside modal */}
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl">
                <img
                  src={loading_gif}
                  alt="Loading..."
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
              </div>
            )}

            {/* Close Icon */}
            <button
              onClick={() => {
                if (loading) return;
                resetForm();
                setShowModal(false);
              }}
              disabled={loading}
              className={`absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors duration-200 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              ✕
            </button>

            {/* Heading */}
            <h3 className="mb-5 text-xl font-bold text-gray-800 dark:text-white text-center border-b pb-3">
              {editingEventId
                ? `Edit Event on ${selectedDate.format("DD MMM YYYY")}`
                : `Add Event on ${selectedDate.format("DD MMM YYYY")}`}
            </h3>

            {/* Event Name */}
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="Enter event name"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all"
              required
              disabled={loading}
            />

            {/* Location */}
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Enter location"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all"
              disabled={loading}
            />

            {/* Description */}
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows="3"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Add a short description"
              className="mb-6 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all"
              disabled={loading}
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  if (loading) return;
                  resetForm();
                  setShowModal(false);
                }}
                disabled={loading}
                className={`rounded-lg border border-gray-300 bg-white px-5 py-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (loading) return;
                  handleAddEvent();
                }}
                disabled={loading}
                className={`rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-white font-medium shadow-md hover:opacity-90 transition-all ${
                  loading ? "cursor-not-allowed opacity-50 hover:opacity-50" : ""
                }`}
              >
                {loading ? (editingEventId ? "Updating..." : "Adding...") : editingEventId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEventDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="relative max-h-[80vh] w-96 overflow-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 animate-modalDrop">

            {/* Loading Overlay inside modal */}
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl">
                <img
                  src={loading_gif}
                  alt="Loading..."
                  className="w-12 h-12 sm:w-16 sm:h-16"
                />
              </div>
            )}

            {/* Close Icon */}
            <button
              onClick={() => {
                if (loading) return;
                setSelectedEventDetails(null);
              }}
              disabled={loading}
              className={`absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors duration-200 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              ✕
            </button>

            {/* Heading */}
            <h3 className="mb-5 text-xl font-bold text-gray-800 dark:text-white text-center border-b pb-3">
              Events on {dayjs(selectedEventDetails.date).format("DD MMM YYYY")}
            </h3>

            {/* Event List */}
            <div className="mb-5 max-h-32 overflow-y-auto rounded-lg border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700">
              {selectedEventDetails.events.map((ev, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedEventDetails((prev) => ({
                      ...prev,
                      selectedIndex: idx,
                    }))
                  }
                  disabled={loading}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-all ${
                    idx === selectedEventDetails.selectedIndex
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                      : "hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {ev.name}
                </button>
              ))}
            </div>

            {/* Selected Event Details */}
            {selectedEventDetails.events[selectedEventDetails.selectedIndex] && (
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 space-y-2">

                {/* Name */}
                <p className="flex items-center gap-2">
                  <span className="flex items-center gap-2 font-semibold dark:text-white">
                    📌 Name:
                  </span>
                  <span>
                    {selectedEventDetails.events[selectedEventDetails.selectedIndex].name}
                  </span>
                </p>

                {/* Location */}
                {selectedEventDetails.events[selectedEventDetails.selectedIndex].location && (
                  <p className="flex items-center gap-2">
                    <span className="flex items-center gap-2 font-semibold dark:text-white">
                      <FaMapMarkerAlt className="text-red-500" />
                      Location:
                    </span>
                    <span>
                      {selectedEventDetails.events[selectedEventDetails.selectedIndex].location}
                    </span>
                  </p>
                )}

                {/* Description */}
                {selectedEventDetails.events[selectedEventDetails.selectedIndex].description && (
                  <p className="flex items-center gap-2">
                    <span className="flex items-center gap-2 font-semibold dark:text-white">
                      📝 Description:
                    </span>
                    <span>
                      {selectedEventDetails.events[selectedEventDetails.selectedIndex].description}
                    </span>
                  </p>
                )}

              </div>
            )}

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={openEditModalFromDetails}
                disabled={loading}
                className={`rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 text-white font-medium shadow-md hover:opacity-90 transition-all ${
                  loading ? "cursor-not-allowed opacity-50 hover:opacity-50" : ""
                }`}
              >
                Edit
              </button>
              <button
                onClick={handleDeleteSelectedEvent}
                disabled={loading}
                className={`rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-5 py-2 text-white font-medium shadow-md hover:opacity-90 transition-all ${
                  loading ? "cursor-not-allowed opacity-50 hover:opacity-50" : ""
                }`}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  if (loading) return;
                  setSelectedEventDetails(null);
                }}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
