"use client";
import { io } from "socket.io-client";
import { PORT } from "../../server";

export const socket = io(`http://localhost:${PORT}`);
