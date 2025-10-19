import { tool } from "@langchain/core/tools";
import z from "zod";
import { calendar } from "./server.ts";
import {
  createEventSchema,
  getEventSchema,
  UpdatedEventSchema,
  type EventData,
  type PARAMS,
  type UpdatedEventData,
} from "./types/type.ts";


export const getEventTool = tool(
  async (params) => {
    console.log("params", params);
    const { q, timeMin, timeMax } = params as PARAMS;
    //Google calendar logic
    /*data send to llm
     timeMin
     timeMax
     q
    */
    try {
      const response = await calendar.events.list({
        calendarId: "primary",
        q,
        timeMin,
        timeMax,
        // maxResults: 10,
        // singleEvents: true,
        // orderBy: 'startTime',
      });
      console.log("response", response.data.items);
      const result = response.data.items?.map((event) => {
        return {
          id: event.id,
          summary: event.summary,
          status: event.status,
          organizer: event.organizer,
          start: event.start,
          end: event.end,
          description: event.description,
          meetingLink: event.hangoutLink,
          attendees: event.attendees,
          eventType: event.eventType,
        };
      });
      return JSON.stringify(result);
    } catch (error) {
      console.error("error", error);
    }

    return "Failed to connect to the calendar.";
  },
  {
    name: "get_events",
    description:
      "Useful for finding existing calendar events and their IDs. You can search by title, date range, etc.",
    schema: getEventSchema,
  }
);

export const createEventTool = tool(
  async (eventData) => {
    console.log("toolCalling createEventTool");
    const { summary, start, end, description, attendees } =
      eventData as EventData;
    console.log("eventData", eventData);
    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        sendUpdates: "all",
        conferenceDataVersion: 1,
        requestBody: {
          summary,
          start,
          end,
          description,
          attendees,
          conferenceData: {
            createRequest: {
              requestId: crypto.randomUUID(),
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          },
        },
      });
      console.log("response", response);
      // return JSON.stringify(response.data);
      if (response.status === 200) {
        return "The meeting has been successfully created in your calendar.";
      }
    } catch (error) {
      console.error("error", error);
      return "Failed to connect to the calendar.";
    }
  },
  {
    name: "create_event",
    description: "Useful for when you need to create a google calendar event.",
    schema: createEventSchema,
  }
);

type RequestBody = {} & {
  summary?: string;
  start?: any;
  end?: any;
  description?: string;
  attendees?: any;
};

export const updateEventTool = tool(
  async (eventData) => {
    console.log("calling updateEventTool", eventData);
    try {
      const { eventId, summary, start, end, description, attendees } =
        eventData as UpdatedEventData;
      const requestBody: RequestBody = {};
      if (summary !== undefined) requestBody.summary = summary;
      if (start !== undefined) requestBody.start = start;
      if (end !== undefined) requestBody.end = end;
      if (description !== undefined) requestBody.description = description;
      if (attendees !== undefined) requestBody.attendees = attendees;

      const response = await calendar.events.patch({
        calendarId: "primary",
        eventId: eventId,
        //sendUpdates: "all",
        requestBody: requestBody,
      });
      console.log("updated response:", response?.data);
      if (response.ok) {
        return "The event has been successfully updated in your calendar.";
      } else {
        return `Failed to update the event. Status: ${response.status}`;
      }
    } catch (error) {
      console.error("Error updating event:", error);
      return "Failed to update the calendar event. Please check if the event ID is valid.";
    }
  },
  {
    name: "update_event",
    description:
      "Useful for when you need to update an existing Google Calendar event. Requires the event ID and the fields you want to update.",
    schema: UpdatedEventSchema,
  }
);

type DeleteEventData = {
  eventId: string;
};

export const deleteEventTool = tool(
  async (eventData) => {
    console.log("calling delete event tool");
    const { eventId } = eventData as DeleteEventData;
    try {
      const response = await calendar.events.delete({
        calendarId: "primary",
        eventId: eventId,
      });
    } catch (error: any) {
      console.error("error deleting event", error?.message);
      ("Failed to delete the calendar event. Please check if the event ID is valid.");
    }
  },
  {
    name: "delete_event",
    description:
      "Useful for when you need to delete or cancel an existing Google Calendar event. Requires the event ID of event.",
    schema: z.object({
      eventId: z.string().describe("the ID of the event to delete."),
    }),
  }
);

type CONTACT = {
   name: string;
}

// export const getContactTool = tool(
//   async (params) => {
//      const {name} = params as CONTACT;
//      const contactListData = contactList.contactList;
//     try {
//       const foundContact = contactListData.find(contact => contact.name.toLowerCase().includes(name.toLowerCase()));

//       if(foundContact){
//         return `Found contact: ${foundContact.name} -- ${foundContact.email}`
//       }else{
//         return `Sorry No contact Found for ${name}`
//       }
     
//     } catch (error) {
//       console.error("bsdk skill issue");
//       return "skill issue"
//     }
//   },
//   {
//     name: "get_contact_email",
//     description:
//       "Get contact email by name. Returns structured data for use in other tools.",
//     schema: z.object({
//       name: z.string().describe("Name of the person to find email for"),
//     }),
//   }
// );


