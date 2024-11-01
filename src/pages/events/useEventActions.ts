import { useCallback, useState } from "react";
import { message } from "antd";
import { EventInfo, EventRequest } from "../../api/api.types"; // Adjust the path as needed
import { CreateEvent, DeleteEvents, GetEvent, UpdateEvent } from "../../api/events";


export function useEventActions(eventId?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [event, setEvent] = useState<EventInfo | null>(null);

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const response = await GetEvent(eventId);
      setEvent(response.data);
    } catch (error) {
      message.error("Failed to fetch event details.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Create a new event
  const createEvent = useCallback(async (eventData: EventRequest) => {
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

  // Update an event
  const updateEvent = useCallback(async (id: string, updatedData: EventRequest) => {
    if (!eventId) return;
    setLoading(true);
    try {
      await UpdateEvent(id, updatedData);
      message.success("Event updated successfully.");
      return true;
    } catch (error) {
      message.error("Failed to update event.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const deleteEvent = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      await DeleteEvents(eventId);
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  return { event, loading, fetchEvent, createEvent, deleteEvent, updateEvent };
}