ALTER TABLE `diagnostics` DROP INDEX `diagnostics_referralCode_unique`;--> statement-breakpoint
ALTER TABLE `diagnostics` DROP COLUMN `referralCode`;--> statement-breakpoint
ALTER TABLE `diagnostics` DROP COLUMN `referredBy`;