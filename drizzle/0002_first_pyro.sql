ALTER TABLE `subscriptions` MODIFY COLUMN `discount` decimal(5,2);--> statement-breakpoint
ALTER TABLE `tastings` MODIFY COLUMN `demandas` json;--> statement-breakpoint
ALTER TABLE `tastings` MODIFY COLUMN `riscos` json;--> statement-breakpoint
ALTER TABLE `tastings` MODIFY COLUMN `status_lei` int NOT NULL;--> statement-breakpoint
ALTER TABLE `tastings` MODIFY COLUMN `status_regras` int NOT NULL;--> statement-breakpoint
ALTER TABLE `tastings` MODIFY COLUMN `status_conformidade` int NOT NULL;--> statement-breakpoint
ALTER TABLE `tastings` MODIFY COLUMN `status_titular` int NOT NULL;