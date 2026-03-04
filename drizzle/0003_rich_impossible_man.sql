ALTER TABLE `diagnostics` MODIFY COLUMN `birthTime` varchar(10);--> statement-breakpoint
ALTER TABLE `diagnostics` MODIFY COLUMN `birthPlace` varchar(256);--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `paymentId` varchar(64);