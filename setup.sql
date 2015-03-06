CREATE TABLE `lists` (
	`id` int(12) not null auto_increment,
	`name` varchar(255) not null default '',
	`created_on` datetime not null default CURRENT_TIMESTAMP,
	`read_key` varchar(32) not null default '',
	`rw_key` varchar(32) not null default '',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `items` (
	`id` int(12) not null auto_increment,
	`list_id` int(12) not null,
	`item` varchar(255) not null default '',
	`b` int(3) not null default 0,
	`d` int(3) not null default 0,
	`c` int(3) not null default 0,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB;