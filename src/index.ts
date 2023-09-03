import 'dotenv/config';

import { Logger } from "Logger";
import { HTTPServer } from "./bin/HTTPServer";

Logger.setName("CryptoPricingAPI");

const server = new HTTPServer();
server.start();