
## FAQ
### 插入中文失败

解决方法：创建数据库的时候指定缺省字符集。
```sql
CREATE DATABASE octopus DEFAULT CHARACTER SET utf8;
```