CREATE TABLE `tasks_task` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `priority` varchar(10) NOT NULL,
  `status` varchar(20) NOT NULL,
  `due_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `assigned_to_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_task_assigned_to_id_e8821f61_fk_employees_employee_id` (`assigned_to_id`),
  KEY `tasks_task_priority_cf1cf8bf` (`priority`),
  KEY `tasks_task_status_b001b23f` (`status`),
  CONSTRAINT `tasks_task_assigned_to_id_e8821f61_fk_employees_employee_id` FOREIGN KEY (`assigned_to_id`) REFERENCES `employees_employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

CREATE TABLE `employees_employee` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

