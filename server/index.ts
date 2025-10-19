import { ChatGroq } from "@langchain/groq";
import {
  createEventTool,
  deleteEventTool,
  getEventTool,
  updateEventTool,
} from "./tools.js";
import { END, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage, type AIMessage } from "@langchain/core/messages";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";
import { connectDB } from "./config/mongodb.js";
import mongoose from "mongoose";

const tools: any = [
  createEventTool,
  getEventTool,
  updateEventTool,
  deleteEventTool,
 
];
const toolNode = new ToolNode(tools);

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 1,
}).bindTools(tools);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", toolNode)
  .addEdge("tools", "agent")
  .addConditionalEdges("agent", shouldContinue);

let app: any;
let checkpointer: MongoDBSaver | null;

//memory
export function initializeAgent() {
  const client = mongoose.connection.getClient();
    checkpointer = new MongoDBSaver({
    client,
    dbName: "calendar",
    checkpointCollectionName: "memory",
    checkpointWritesCollectionName: "memory_writes",
  });
  app = workflow.compile({ checkpointer });
  console.log("LangGraph Agent Initialized with Mongoose connection.");
}

export function getCheckpointer(){
   return checkpointer;
}

const currentDateTime = new Date().toLocaleString("sv-SE").replace(" ", "T");
const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;

export async function calendarService(query: string, thread_id: string) {
  if (!app) {
    throw new Error("Agent is not initialized");
  }
  try {
    const userQuery: string = query;
    if (!userQuery) {
      return;
    }
    const finalState = await app.invoke(
      {
        messages: [
          {
            role: "system",
            content: `
            You are a smart Google Calendar assistant. You can retrieve upcoming events and create new events in the users calendar. 
            Always confirm the details with the user before creating an event, and provide a clear response summarizing what you retrieved or created.
            currentDateTime: ${currentDateTime}
            timeZone: ${timeZoneString}
            `,
          },
          new HumanMessage(userQuery),
        ],
      },
      { configurable: { thread_id: thread_id } }
    );

    console.log(
      "Final State: ",
      finalState.messages[finalState.messages.length - 1]?.content
    );

    return {
      data: finalState.messages[finalState.messages.length - 1]?.content,
    };
  } catch (error) {
    console.log("Agent fata", error);
    return { data: "Sashiburidana Zenitsu" };
  }
}
