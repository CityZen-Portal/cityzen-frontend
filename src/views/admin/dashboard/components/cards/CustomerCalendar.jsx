import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import toast from "react-hot-toast";
const CustomCalendar = () => {
  const API_BASE_URL = "https://auth-backend-2-k3ph.onrender.com/api";
  const adminId = "ADM007";

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [fromHour, setFromHour] = useState("");
  const [fromMinute, setFromMinute] = useState("");
  const [fromPeriod, setFromPeriod] = useState("AM");
  const [toHour, setToHour] = useState("");
  const [toMinute, setToMinute] = useState("");
  const [toPeriod, setToPeriod] = useState("AM");
  const [events, setEvents] = useState({});
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeReminders, setActiveReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [reminderTime, setReminderTime] = useState("none");
  const [eventDescription, setEventDescription] = useState("");

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
          startTime: event.startTime,
          endTime: event.endTime,
          date: event.date,
          description: event.description,
          reminderTime: event.reminderTime,
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
    setFromHour("");
    setFromMinute("");
    setFromPeriod("AM");
    setToHour("");
    setToMinute("");
    setToPeriod("AM");
    setEditingEventId(null);
    setReminderTime("none");
    setEventDescription("");
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const checkReminders = () => {
      const now = dayjs();
      const upcomingReminders = [];

      // Check all events for reminders
      Object.entries(events).forEach(([date, eventList]) => {
        eventList.forEach((event) => {
          if (event.reminderTime && event.reminderTime !== "none") {
            // Calculate reminder time based on event start time and reminder setting
            const [startTime, period] = event.startTime.split(" ");
            let [hours, minutes] = startTime.split(":").map(Number);

            // Convert to 24-hour format
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            const eventDateTime = dayjs(
              `${date}T${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:00`
            );

            // Calculate reminder time based on reminder setting
            let reminderDateTime;
            switch (event.reminderTime) {
              case "5min":
                reminderDateTime = eventDateTime.subtract(5, "minute");
                break;
              case "10min":
                reminderDateTime = eventDateTime.subtract(10, "minute");
                break;
              case "30min":
                reminderDateTime = eventDateTime.subtract(30, "minute");
                break;
              default:
                return;
            }

            if (reminderDateTime.isAfter(now.subtract(1, "minute"))) {
              upcomingReminders.push({
                ...event,
                date,
                reminderTime: event.reminderTime,
              });
            }
          }
        });
      });

      if (upcomingReminders.length > 0) {
        setActiveReminders(upcomingReminders);
        setCurrentReminder(upcomingReminders[0]);
        setShowReminderModal(true);
      }
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [events]);

  const handleAddEvent = async () => {
    if (!eventText) {
      toast.error("Event name is required");
      return;
    }

    if (!fromHour || !fromMinute || !toHour || !toMinute) {
      toast.error("Please enter valid start and end times");
      return;
    }

    try {
      const eventData = {
        title: eventText,
        adminId: adminId,
        date: selectedDate.format("YYYY-MM-DD"),
        startTime: `${fromHour}:${fromMinute} ${fromPeriod}`,
        endTime: `${toHour}:${toMinute} ${toPeriod}`,
        location: eventLocation,
        reminderTime: reminderTime,
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
    }
  };

  const ReminderModal = () => (
    <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
      <div className="w-96 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold dark:text-white">Reminder</h3>
        {currentReminder && (
          <div className="dark:text-gray-200">
            <p>
              <strong className="dark:text-white">Event:</strong>{" "}
              {currentReminder.name}
            </p>
            <p>
              <strong className="dark:text-white">Time:</strong>{" "}
              {currentReminder.startTime}
            </p>
            <p>
              <strong className="dark:text-white">Location:</strong>{" "}
              {currentReminder.location || "None"}
            </p>
          </div>
        )}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => {
              const nextReminders = activeReminders.slice(1);
              setActiveReminders(nextReminders);
              setCurrentReminder(nextReminders[0] || null);
              if (nextReminders.length === 0) setShowReminderModal(false);
            }}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Dismiss
          </button>
          <button
            onClick={() => setShowReminderModal(false)}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
          >
            Snooze (10 min)
          </button>
        </div>
      </div>
    </div>
  );

  const handleDeleteSelectedEvent = async () => {
    if (!selectedEventDetails) return;

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

      // Refresh events after deletion
      await fetchEvents();
      setSelectedEventDetails(null);
      toast.success("Event deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete event");
      console.error(err);
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

    // Parse time from existing event
    const [startTime, startPeriod] = event.startTime.split(" ");
    const [startHour, startMinute] = startTime.split(":");

    const [endTime, endPeriod] = event.endTime.split(" ");
    const [endHour, endMinute] = endTime.split(":");

    setSelectedDate(dayjs(event.date));
    setEventText(event.name);
    setEventLocation(event.location || "");
    setFromHour(startHour);
    setFromMinute(startMinute);
    setFromPeriod(startPeriod);
    setToHour(endHour);
    setToMinute(endMinute);
    setToPeriod(endPeriod);
    setEditingEventId(event.id);
    setReminderTime(event.reminderTime || "none");
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white hover:bg-indigo-700"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white hover:bg-indigo-700"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

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
        >
          + Add Event
        </button>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && <ReminderModal />}

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="max-h-[90vh] w-96 overflow-auto rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              {editingEventId
                ? `Edit Event on ${selectedDate.format("DD MMM YYYY")}`
                : `Add Event on ${selectedDate.format("DD MMM YYYY")}`}
            </h3>

            <input
              type="text"
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="Enter event name"
              className="mb-3 w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />

            {/* From and To Time */}
            <div className="mb-3 flex gap-2">
              {/* From Time */}
              <div className="w-1/2">
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                  From
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="HH"
                    value={fromHour}
                    onChange={(e) => setFromHour(e.target.value)}
                    className="w-1/3 rounded-l border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <span className="px-1 py-2 dark:text-gray-300">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={fromMinute}
                    onChange={(e) => setFromMinute(e.target.value)}
                    className="w-1/3 border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    value={fromPeriod}
                    onChange={(e) => setFromPeriod(e.target.value)}
                    className="w-1/3 rounded-r border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {/* To Time */}
              <div className="w-1/2">
                <label className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
                  To
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="HH"
                    value={toHour}
                    onChange={(e) => setToHour(e.target.value)}
                    className="w-1/3 rounded-l border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <span className="px-1 py-2 dark:text-gray-300">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={toMinute}
                    onChange={(e) => setToMinute(e.target.value)}
                    className="w-1/3 border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    value={toPeriod}
                    onChange={(e) => setToPeriod(e.target.value)}
                    className="w-1/3 rounded-r border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Enter location"
              className="mb-3 w-full rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />

            {/* Reminder */}
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mb-3 w-full rounded border px-3 py-2 text-gray-500 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="none">No reminder</option>
              <option value="5min">5 minutes before</option>
              <option value="10min">10 minutes before</option>
              <option value="30min">30 minutes before</option>
            </select>

            {/* Description */}
            <textarea
              rows="2"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Add a short description"
              className="mb-3 w-full resize-none rounded border px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                {editingEventId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Event Details Modal with list */}
      {selectedEventDetails && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="max-h-[80vh] w-96 overflow-auto rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold dark:text-white">
              Events on {dayjs(selectedEventDetails.date).format("DD MMM YYYY")}
            </h3>

            {/* Event list */}
            <div className="mb-4 max-h-32 overflow-y-auto rounded border p-2 dark:border-gray-600">
              {selectedEventDetails.events.map((ev, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedEventDetails((prev) => ({
                      ...prev,
                      selectedIndex: idx,
                    }))
                  }
                  className={`block w-full rounded px-2 py-1 text-left ${
                    idx === selectedEventDetails.selectedIndex
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-indigo-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {ev.name} ({ev.startTime})
                </button>
              ))}
            </div>

            {/* Selected event details */}
            {selectedEventDetails.events[
              selectedEventDetails.selectedIndex
            ] && (
              <div className="dark:text-gray-200">
                <p className="mb-2">
                  <strong className="dark:text-white">Name:</strong>{" "}
                  {
                    selectedEventDetails.events[
                      selectedEventDetails.selectedIndex
                    ].name
                  }
                </p>
                <p className="mb-2">
                  <strong className="dark:text-white">Time:</strong>{" "}
                  {
                    selectedEventDetails.events[
                      selectedEventDetails.selectedIndex
                    ].startTime
                  }{" "}
                  -{" "}
                  {
                    selectedEventDetails.events[
                      selectedEventDetails.selectedIndex
                    ].endTime
                  }
                </p>
                {selectedEventDetails.events[selectedEventDetails.selectedIndex]
                  .location && (
                  <p className="mb-2">
                    <strong className="dark:text-white">Location:</strong>{" "}
                    {
                      selectedEventDetails.events[
                        selectedEventDetails.selectedIndex
                      ].location
                    }
                  </p>
                )}
                {selectedEventDetails.events[selectedEventDetails.selectedIndex]
                  .description && (
                  <p className="mb-2">
                    <strong className="dark:text-white">Description:</strong>{" "}
                    {
                      selectedEventDetails.events[
                        selectedEventDetails.selectedIndex
                      ].description
                    }
                  </p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={openEditModalFromDetails}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteSelectedEvent();
                }}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
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
