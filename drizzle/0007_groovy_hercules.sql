ALTER TABLE `diagnostics` ADD `abTestVariant` enum('A','B') DEFAULT 'A' NOT NULL;--> statement-breakpoint
ALTER TABLE `diagnostics` ADD `selectedPlan` enum('promo','normal','lifetime');