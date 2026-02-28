CREATE TABLE `feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`diagnosticId` int NOT NULL,
	`accuracy` enum('very_accurate','accurate','neutral','inaccurate','very_inaccurate') NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `analysisVariant` enum('epic','predictive') DEFAULT 'predictive' NOT NULL;