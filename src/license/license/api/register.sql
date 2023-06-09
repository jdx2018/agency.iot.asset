DROP TABLE IF EXISTS `register`;
CREATE TABLE `register`  (
  `register_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL AUTO_INCREMENT COMMENT '注册ID',  
  `timestamp` BIGINT COMMENT '到期时间戳',
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`record_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

SET FOREIGN_KEY_CHECKS = 1;