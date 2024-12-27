CREATE TABLE `boards` (
	`boardId` text PRIMARY KEY NOT NULL,
	`ownerId` text NOT NULL,
	`title` text NOT NULL,
	`publicPerms` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `deps` (
	`source` text NOT NULL,
	`dest` text NOT NULL,
	PRIMARY KEY(`source`, `dest`),
	FOREIGN KEY (`source`) REFERENCES `tasks`(`taskId`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`dest`) REFERENCES `tasks`(`taskId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`taskId` text PRIMARY KEY NOT NULL,
	`boardId` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`numDeps` integer NOT NULL,
	`isComplete` integer NOT NULL,
	FOREIGN KEY (`boardId`) REFERENCES `boards`(`boardId`) ON UPDATE no action ON DELETE cascade
);
