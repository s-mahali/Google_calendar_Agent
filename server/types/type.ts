import z from "zod";

export const getEventSchema = z.object({
  q: z
    .string()
    .describe(
      "The query to be used to get the events, task from google calendar. It can be one of these values: summary, description, location, attendees display name, attendees email, organizer's name, organizer's email."
    ),
  timeMin: z.string().describe("The from datetime to get events"),
  timeMax: z.string().describe("The to datetime to get events"),
});

export type PARAMS = z.infer<typeof getEventSchema>;

export const createEventSchema = z.object({
  summary: z.string().describe("The title of the event"),
  description: z.string().describe("The description of the event"),
  start: z.object({
    dateTime: z.string().describe("The start date time of the event"),
    timeZone: z.string().describe("Current IANA timezone string"),
  }),
  end: z.object({
    dateTime: z.string().describe("The end date time of the event "),
    timeZone: z.string().describe("Current IANA timezone string"),
  }),
  attendees: z.array(
    z.object({
      displayName: z.string("The display name of the attendee"),
      email: z.string("The email of the attendee"),
    })
  ),
});

export type EventData = z.infer<typeof createEventSchema>;

export const UpdatedEventSchema = z.object({
  eventId: z.string().describe("The ID of the event to update"),  
  summary: z.string().describe("Updated title of the event").optional(),
  description: z.string().describe("The updated description of the event").optional(),
  start: z.object({
    dateTime: z.string().describe("The updated start date time of the event"),
    timeZone: z.string().describe("Current IANA timezone string"),
  }).optional(),
  end: z.object({
    dateTime: z.string().describe("The updated end date time of the event "),
    timeZone: z.string().describe("Current IANA timezone string"),
  }).optional(),
  attendees: z.array(
    z.object({
      displayName: z.string("The updated display name of the attendee").optional(),
      email: z.string("The updated email of the attendee").optional()
    }).optional()
  ).optional()
});

export type UpdatedEventData = z.infer<typeof UpdatedEventSchema>





