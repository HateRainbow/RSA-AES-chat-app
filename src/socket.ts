"use client";

import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/socketInterface";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
