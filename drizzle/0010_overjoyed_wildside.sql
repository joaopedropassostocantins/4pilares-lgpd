ALTER TABLE `diagnostics` ADD `referralCode` varchar(32);--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `referredBy` varchar(32);--> statement-breakpoint
ALTER TABLE `diagnostics` ADD CONSTRAINT `diagnostics_referralCode_unique` UNIQUE(`referralCode`);