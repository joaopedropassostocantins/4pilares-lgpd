CREATE TABLE `capabilities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`status` enum('enabled','disabled','beta') NOT NULL DEFAULT 'enabled',
	`version` varchar(32) NOT NULL DEFAULT '1.0.0',
	`metadata` json,
	`enabledAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `capabilities_id` PRIMARY KEY(`id`),
	CONSTRAINT `capabilities_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `coupon_redemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`couponId` int NOT NULL,
	`diagnosticId` int NOT NULL,
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupon_redemptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`fixedPrice` decimal(10,2) NOT NULL,
	`maxRedemptions` int NOT NULL,
	`redeemedCount` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `paymentMethod` enum('pix','card');--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `pixPayload` text;--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `pixTxid` varchar(64);--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `amountPaid` decimal(10,2);--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `couponApplied` varchar(64);