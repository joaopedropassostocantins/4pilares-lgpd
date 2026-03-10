CREATE TABLE `webhook_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`request_id` varchar(255) NOT NULL,
	`payment_id` varchar(255) NOT NULL,
	`event_type` varchar(50) NOT NULL,
	`status` enum('pending','processed','failed') DEFAULT 'pending',
	`event_data` json,
	`result` text,
	`error` text,
	`received_at` timestamp NOT NULL DEFAULT (now()),
	`processed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webhook_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `webhook_events_request_id_unique` UNIQUE(`request_id`)
);
