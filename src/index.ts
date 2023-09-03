import 'dotenv/config';

import { Logger } from "Logger";
import { HTTPServer } from "./bin/HTTPServer";
import { CoinbaseScraper } from './tasks/CoinbaseScraper';

Logger.setName("CryptoPricingAPI");

// Start the HTTP server
(new HTTPServer()).start();

// Start the synchronizer
(new CoinbaseScraper()).start();