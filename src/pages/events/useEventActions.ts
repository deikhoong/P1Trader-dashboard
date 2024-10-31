import { useCallback, useState } from "react";
import { message } from "antd";
import { CreateEventRequest, EventInfo } from "../../api/api.types"; // Adjust the path as needed
import { CreateEvent, DeleteEvents, GetEvent } from "../../api/events";


export function useEventActions(eventId?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<EventInfo | null>(null);

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const data = await GetEvent(eventId);
      setEvent(data);
    } catch (error) {
      message.error("Failed to fetch event details.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Create a new event
  const createEvent = useCallback(async (eventData: CreateEventRequest) => {
    setLoading(true);
    try {
      const response = await CreateEvent(eventData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // // Update an event
  // const updateEvent = useCallback(async (updatedData: EventInfo) => {
  //   if (!eventId) return;
  //   setLoading(true);
  //   try {
  //     await updateEventAPI(eventId, updatedData);
  //     message.success("Event updated successfully.");
  //   } catch (error) {
  //     message.error("Failed to update event.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [eventId]);

  // Delete an event
  const deleteEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      await DeleteEvents(eventId);
      message.success("Event deleted successfully.");
    } catch (error) {
      message.error("Failed to delete event.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  return { event, loading, fetchEvent, createEvent, deleteEvent };
}