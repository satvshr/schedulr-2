import GlobalContext from './GlobalContext';
import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [savedEvents, setSavedEvents] = useState([]);
  const [user, setUser] = useState();
  // Once the data is loaded, proceed with the rest of the code
  // const [savedEvents, dispatchCalEvent] = useReducer(
  //   savedEventsReducer,
  //   [],
  //   initEvents
  // );

  // async function getUserDetails() {
  //   window.location.href = 'http://localhost:8001/login';
  //   const val = await fetch("http://localhost:8001/login");
  //   const data = await val.json();
  //   console.log(data)
  //   setUser(data)
  // } 

  const filteredEvents = useMemo(() => {
    if (!isLoading) {
      return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
    }
  }, [savedEvents, labels, isLoading]);


  useEffect(() => {
    console.log(user)
  }, [user])

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent([]);
    }
  }, [showEventModal]);

  useEffect(() => {
    if(!isLoading) {
      setLabels((prevLabels) => {
        return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
          const currentLabel = prevLabels.find((lbl) => lbl.label === label);
          return {
            label,
            checked: currentLabel ? currentLabel.checked : true,
          };
        });
      });
    }
  }, [savedEvents, isLoading]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }
  async function dispatchCalEvent(type, payload) {
  switch (type) {
    case 'push':
      try {
        const dat = [payload];
        const jsonString = JSON.stringify(dat);

        // Send POST request
        await axios.post('http://localhost:8000/api', jsonString);

        // Make GET request
        const response = await fetch('http://localhost:8000/get');
        const data = await response.json();
        console.log(data)
        console.log("hi")
        // Return the received data
        setSavedEvents(data);
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
      break
    case 'update':
      print("higed")
      const update = [payload];
      const jsonstring = JSON.stringify(update);
      await axios.post('http://localhost:8000/deletion', jsonstring);

      // Send POST request
      await axios.post('http://localhost:8000/api', jsonstring);

      // Make GET request
      const response = await fetch('http://localhost:8000/get');
      const da = await response.json();

      // Return the received data
      setSavedEvents(da);
      break
    case 'delete':
      const del = [payload];
      const Jsonstring = JSON.stringify(del);
      await axios.post('http://localhost:8000/deletion', Jsonstring);
      const re = await fetch('http://localhost:8000/get');
      const d = await re.json();

      // Return the received data
      setSavedEvents(d);
      break
    default:
      throw new Error();
  }
}

useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch('http://localhost:8000/get');
      const data = await response.json();

      setSavedEvents(data);
      setIsLoading(false); // Set loading state to false once the data is loaded
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  fetchData();
}, []);

  // Return a loading indicator if the data is still loading
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        showEventModal,
        setShowEventModal,
        daySelected,
        setDaySelected,
        savedEvents,
        selectedEvent,
        dispatchCalEvent,
        setSelectedEvent,
        setLabels,
        labels,
        filteredEvents,
        updateLabel,
        user,
        setUser,
        // getUserDetails,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}