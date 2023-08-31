import { Logger } from "Logger";
import { HTTPServer } from "./bin/HTTPServer";

Logger.setName("CryptoPricingAPI");

Logger.getLogger()?.info("Testing");

const server = new HTTPServer();
server.start();