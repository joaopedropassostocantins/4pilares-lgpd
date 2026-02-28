CREATE TABLE `diagnostics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(32) NOT NULL,
	`consultantName` varchar(128),
	`birthDate` varchar(20) NOT NULL,
	`birthTime` varchar(10) NOT NULL,
	`birthPlace` varchar(256) NOT NULL,
	`hasDst` int NOT NULL DEFAULT 0,
	`pillarsData` json,
	`tastingAnalysis` text,
	`basicAnalysis` text,
	`fullAnalysis` text,
	`paymentStatus` enum('pending','paid') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `diagnostics_id` PRIMARY KEY(`id`),
	CONSTRAINT `diagnostics_publicId_unique` UNIQUE(`publicId`)
);
