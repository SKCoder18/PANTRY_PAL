export const addEventToGoogleCalendar = async (itemName, expiryDate, accessToken) => {
  if (!accessToken) {
    console.error('No access token available for Calendar API');
    return false;
  }

  // expiryDate is in YYYY-MM-DD format.
  // Google Calendar all-day events require a start date and an end date (exclusive).
  const startDate = new Date(expiryDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const event = {
    summary: `PantryPal Expiry: ${itemName}`,
    description: `Your pantry item "${itemName}" is expiring today!`,
    start: {
      date: formatDate(startDate),
    },
    end: {
      date: formatDate(endDate),
    },
    reminders: {
      useDefault: true,
    },
  };

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Calendar API Error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network Error calling Google Calendar API:', error);
    return false;
  }
};
