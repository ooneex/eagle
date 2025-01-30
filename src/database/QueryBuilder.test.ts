import { beforeEach, describe, expect, it } from 'bun:test';
import { QueryBuilder } from './QueryBuilder';

describe('QueryBuilder', () => {
  describe('select', () => {
    it('should create a basic select query', () => {
      class TestEntity {
        id: string;
        age: number;
        createdAt: Date;
      }

      const builder = new QueryBuilder<TestEntity>('user');
      builder.select('id', 'age', 'createdAt');
      expect(builder.getSql()).toEqual('SELECT id, age, created_at FROM user;');
    });

    it('should create a select query with table alias', () => {
      class TestEntity {
        id: number;
        age: number;
        createdAt: Date;
      }

      const builder = new QueryBuilder<TestEntity>('user');
      builder.select('id', 'user.age', 'user.createdAt');
      expect(builder.getSql()).toEqual(
        'SELECT id, user.age, user.created_at FROM user;',
      );
    });

    it('should create a select query with fields alias', () => {
      class TestEntity {
        id: number;
        price: number;
        createdAt: Date;
      }

      const builder = new QueryBuilder<TestEntity>('user');
      builder.select(
        'id',
        'COUNT(price) AS total_price',
        'COUNT(user.createdAt) AS total_created',
      );
      expect(builder.getSql()).toEqual(
        'SELECT id, COUNT(price) AS total_price, COUNT(user.created_at) AS total_created FROM user;',
      );
    });
  });
  it('should create a select query with wildcard', () => {
    class TestEntity {
      id: number;
      age: number;
      createdAt: Date;
    }

    const builder = new QueryBuilder<TestEntity>('user');
    builder.select('*');
    expect(builder.getSql()).toEqual('SELECT * FROM user;');
  });

  describe('where clause with operators', () => {
    class TestEntity {
      id: number;
      age: number;
      name: string;
    }

    it('should create queries with all comparison operators', () => {
      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').where('age', '<', 25);
      expect(builder.getSql()).toEqual('SELECT * FROM user WHERE age < 25;');

      builder.select('*').where('age', '<=', 25);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE age < 25 OR age <= 25;',
      );

      builder.select('*').where('age', '>', 25);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE age < 25 OR age <= 25 OR age > 25;',
      );

      builder.select('*').where('age', '>=', 25);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE age < 25 OR age <= 25 OR age > 25 OR age >= 25;',
      );

      builder.select('*').where('name', '=', 'John');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE age < 25 OR age <= 25 OR age > 25 OR age >= 25 OR name = "John";',
      );

      builder.select('*').where('age', '!=', 25);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE age < 25 OR age <= 25 OR age > 25 OR age >= 25 OR name = "John" OR age != 25;',
      );
    });

    it('should create queries with BETWEEN and NOT BETWEEN operators', () => {
      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').where('name', 'BETWEEN', ['John', 'Jane']);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name BETWEEN "John" AND "Jane";`,
      );

      builder.select('*').where('age', 'NOT BETWEEN', [20, 30]);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name BETWEEN "John" AND "Jane" OR age NOT BETWEEN 20 AND 30;`,
      );

      builder.select('*').where('id', 'BETWEEN', [1, 100]);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name BETWEEN "John" AND "Jane" OR age NOT BETWEEN 20 AND 30 OR id BETWEEN 1 AND 100;`,
      );

      builder.select('*').where('id', 'NOT BETWEEN', [1, 100]);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name BETWEEN "John" AND "Jane" OR age NOT BETWEEN 20 AND 30 OR id BETWEEN 1 AND 100 OR id NOT BETWEEN 1 AND 100;`,
      );
    });

    it('should create queries with IN and NOT IN operators', () => {
      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').where('name', 'IN', ['John', 'Jane', 'Bob']);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name IN ("John", "Jane", "Bob");`,
      );

      builder.select('*').where('age', 'NOT IN', [20, 30, 40]);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name IN ("John", "Jane", "Bob") OR age NOT IN (20, 30, 40);`,
      );

      builder.select('*').where('id', 'IN', [1, 2, 3]);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name IN ("John", "Jane", "Bob") OR age NOT IN (20, 30, 40) OR id IN (1, 2, 3);`,
      );

      builder.select('*').where('id', 'NOT IN', [4, 5, 6]);
      expect(builder.getSql()).toEqual(
        `SELECT * FROM user WHERE name IN ("John", "Jane", "Bob") OR age NOT IN (20, 30, 40) OR id IN (1, 2, 3) OR id NOT IN (4, 5, 6);`,
      );
    });

    it('should create queries with IS NULL and IS NOT NULL operators', () => {
      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').where('name', 'IS NULL');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name IS NULL;',
      );

      builder.select('*').where('age', 'IS NOT NULL');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name IS NULL OR age IS NOT NULL;',
      );

      builder.select('*').where('id', 'IS NULL');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name IS NULL OR age IS NOT NULL OR id IS NULL;',
      );
    });

    it('should create queries with LIKE and NOT LIKE operators', () => {
      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').where('name', 'LIKE', '%John%');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name LIKE "%John%";',
      );

      builder.select('*').where('name', 'NOT LIKE', '%Jane%');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name LIKE "%John%" OR name NOT LIKE "%Jane%";',
      );

      builder.select('*').where('name', 'LIKE', 'Bob%');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name LIKE "%John%" OR name NOT LIKE "%Jane%" OR name LIKE "Bob%";',
      );

      builder.select('*').where('name', 'NOT LIKE', '%Smith');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name LIKE "%John%" OR name NOT LIKE "%Jane%" OR name LIKE "Bob%" OR name NOT LIKE "%Smith";',
      );
    });
  });

  describe('andWhere', () => {
    it('should create queries with AND operator', () => {
      class TestEntity {
        id: number;
        age: number;
        name: string;
      }

      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').where('name', '=', 'John').andWhere('age', '>', 25);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name = "John" AND age > 25;',
      );

      builder.andWhere('id', 'IN', [1, 2, 3]);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name = "John" AND age > 25 AND id IN (1, 2, 3);',
      );

      builder.andWhere('name', 'LIKE', '%Smith%');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name = "John" AND age > 25 AND id IN (1, 2, 3) AND name LIKE "%Smith%";',
      );

      builder.andWhere('age', 'BETWEEN', [20, 30]);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user WHERE name = "John" AND age > 25 AND id IN (1, 2, 3) AND name LIKE "%Smith%" AND age BETWEEN 20 AND 30;',
      );
    });
  });

  describe('selectDistinct', () => {
    it('should create queries with DISTINCT keyword', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }

      const builder = new QueryBuilder<TestEntity>('user');

      builder.selectDistinct('*');
      expect(builder.getSql()).toEqual('SELECT DISTINCT * FROM user;');

      builder.selectDistinct('name', 'age');
      expect(builder.getSql()).toEqual('SELECT DISTINCT name, age FROM user;');

      builder.selectDistinct('name AS full_name', 'age AS user_age');
      expect(builder.getSql()).toEqual(
        'SELECT DISTINCT name AS full_name, age AS user_age FROM user;',
      );

      builder.selectDistinct('COUNT(*) AS total', 'age');
      expect(builder.getSql()).toEqual(
        'SELECT DISTINCT COUNT(*) AS total, age FROM user;',
      );
    });
  });

  describe('groupBy', () => {
    it('should create queries with GROUP BY clause', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }

      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').groupBy('age');
      expect(builder.getSql()).toEqual('SELECT * FROM user GROUP BY age;');

      builder.select('name', 'COUNT(*) AS count').groupBy('name');
      expect(builder.getSql()).toEqual(
        'SELECT name, COUNT(*) AS count FROM user GROUP BY name;',
      );

      builder
        .select('age', 'COUNT(*) AS total', 'AVG(id) AS avg_id')
        .groupBy('user.age');
      expect(builder.getSql()).toEqual(
        'SELECT age, COUNT(*) AS total, AVG(id) AS avg_id FROM user GROUP BY user.age;',
      );
    });
  });

  describe('having', () => {
    it('should create queries with HAVING clause', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }

      const builder = new QueryBuilder<TestEntity>('user');

      builder
        .select('age', 'COUNT(*) AS count')
        .groupBy('age')
        .having('COUNT(*)', '>', 5);
      expect(builder.getSql()).toEqual(
        'SELECT age, COUNT(*) AS count FROM user GROUP BY age HAVING COUNT(*) > 5;',
      );

      builder
        .select('name', 'AVG(age) AS avg_age')
        .groupBy('name')
        .having('AVG(age)', '>', 25);
      expect(builder.getSql()).toEqual(
        'SELECT name, AVG(age) AS avg_age FROM user GROUP BY name HAVING COUNT(*) > 5 OR AVG(age) > 25;',
      );

      builder
        .select('age', 'COUNT(*) AS total')
        .groupBy('age')
        .having('COUNT(*)', '>', 10)
        .having('user.age', '<', 30);
      expect(builder.getSql()).toEqual(
        'SELECT age, COUNT(*) AS total FROM user GROUP BY age HAVING COUNT(*) > 5 OR AVG(age) > 25 OR COUNT(*) > 10 OR user.age < 30;',
      );
    });
  });

  describe('orderBy', () => {
    it('should create queries with ORDER BY clause', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
        createdAt: Date;
        price: number;
      }

      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').orderBy('id');
      expect(builder.getSql()).toEqual('SELECT * FROM user ORDER BY id ASC;');

      builder.select('*').orderBy('name', 'DESC');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user ORDER BY id ASC, name DESC;',
      );

      builder
        .select('*')
        .orderBy('user.createdAt', 'ASC')
        .orderBy('SUM(user.price)', 'DESC');
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user ORDER BY id ASC, name DESC, user.created_at ASC, SUM(user.price) DESC;',
      );
    });
  });

  describe('limit and offset', () => {
    it('should create queries with LIMIT and OFFSET clauses', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }

      const builder = new QueryBuilder<TestEntity>('user');

      builder.select('*').limit(10);
      expect(builder.getSql()).toEqual('SELECT * FROM user LIMIT 10;');

      builder.select('*').limit(10).offset(20);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user LIMIT 10 OFFSET 20;',
      );

      builder.select('*').orderBy('id').limit(5).offset(15);
      expect(builder.getSql()).toEqual(
        'SELECT * FROM user ORDER BY id ASC LIMIT 5 OFFSET 15;',
      );
    });
  });

  describe('join', () => {
    it('should create queries with INNER JOIN', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }
      interface PostEntity {
        id: number;
        title: string;
        userId: number;
      }

      const builder = new QueryBuilder<
        TestEntity & PostEntity,
        'user' | 'post'
      >('user');

      builder
        .select('user.id', 'user.name', 'post.title')
        .join('post', 'user.id', 'post.userId');
      expect(builder.getSql()).toEqual(
        'SELECT user.id, user.name, post.title FROM user INNER JOIN post ON user.id = post.user_id;',
      );
    });

    it('should create queries with LEFT JOIN', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }
      interface PostEntity {
        id: number;
        title: string;
        userId: number;
      }

      const builder = new QueryBuilder<
        TestEntity & PostEntity,
        'user' | 'post'
      >('user');

      builder
        .select('user.id', 'user.name', 'post.title')
        .leftJoin('post', 'user.id', 'post.userId');
      expect(builder.getSql()).toEqual(
        'SELECT user.id, user.name, post.title FROM user LEFT JOIN post ON user.id = post.user_id;',
      );
    });

    it('should create queries with RIGHT JOIN', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }
      interface PostEntity {
        id: number;
        title: string;
        userId: number;
      }

      const builder = new QueryBuilder<
        TestEntity & PostEntity,
        'user' | 'post'
      >('user');

      builder
        .select('user.id', 'user.name', 'post.title')
        .rightJoin('post', 'user.id', 'post.userId');
      expect(builder.getSql()).toEqual(
        'SELECT user.id, user.name, post.title FROM user RIGHT JOIN post ON user.id = post.user_id;',
      );
    });

    it('should create queries with FULL JOIN', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }
      interface PostEntity {
        id: number;
        title: string;
        userId: number;
      }

      const builder = new QueryBuilder<
        TestEntity & PostEntity,
        'user' | 'post'
      >('user');

      builder
        .select('user.id', 'user.name', 'post.title')
        .fullJoin('post', 'user.id', 'post.userId');
      expect(builder.getSql()).toEqual(
        'SELECT user.id, user.name, post.title FROM user FULL JOIN post ON user.id = post.user_id;',
      );
    });
  });

  describe('insert', () => {
    it('should create basic insert queries', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }

      const builder = new QueryBuilder<TestEntity>('users');
      builder.insert('name', 'John');
      builder.insert('age', 25);
      expect(builder.getSql()).toEqual(
        'INSERT INTO users (name, age) VALUES ("John", 25);',
      );
    });

    it('should create insert queries with multiple rows', () => {
      class TestEntity {
        id: number;
        name: string;
        age: number;
      }

      const builder = new QueryBuilder<TestEntity>('users');
      builder.insert('name', 'John');
      builder.insert('age', 25);
      builder.insert('name', 'Jane');
      builder.insert('age', 30);
      expect(builder.getSql()).toEqual(
        'INSERT INTO users (name, age) VALUES ("John", 25), ("Jane", 30);',
      );
    });
  });

  describe('QueryBuilder - Delete Operations', () => {
    interface TestEntity {
      id: number;
      name: string;
      age: number;
    }

    let queryBuilder: QueryBuilder<TestEntity>;

    beforeEach(() => {
      queryBuilder = new QueryBuilder<TestEntity>('users');
    });

    describe('delete', () => {
      it('should build a basic DELETE query without conditions', () => {
        const query = queryBuilder.delete().getSql();

        expect(query).toBe('DELETE FROM users;');
      });

      it('should build a basic DELETE query with a single condition', () => {
        const query = queryBuilder.delete().where('id', '=', 1).getSql();

        expect(query).toBe('DELETE FROM users WHERE id = 1;');
      });

      it('should build a DELETE query with multiple AND conditions', () => {
        const query = queryBuilder
          .delete()
          .where('id', '=', 1)
          .andWhere('age', '>', 18)
          .getSql();

        expect(query).toBe('DELETE FROM users WHERE id = 1 AND age > 18;');
      });

      it('should handle multiple delete conditions combined with AND', () => {
        const query = queryBuilder
          .delete()
          .where('name', '=', 'John')
          .andWhere('age', '<', 30)
          .getSql();

        expect(query).toBe(
          'DELETE FROM users WHERE name = "John" AND age < 30;',
        );
      });
    });

    describe('delete with complex conditions', () => {
      it('should handle null values in delete conditions', () => {
        const query = queryBuilder.delete().where('name', 'IS NULL').getSql();

        expect(query).toBe('DELETE FROM users WHERE name IS NULL;');
      });

      it('should handle IN operator in delete conditions', () => {
        const query = queryBuilder
          .delete()
          .where('id', 'IN', [1, 2, 3])
          .getSql();

        expect(query).toBe('DELETE FROM users WHERE id IN (1, 2, 3);');
      });

      it('should handle BETWEEN operator in delete conditions', () => {
        const query = queryBuilder
          .delete()
          .where('age', 'BETWEEN', [20, 30])
          .getSql();

        expect(query).toBe('DELETE FROM users WHERE age BETWEEN 20 AND 30;');
      });
    });

    describe('QueryBuilder - update', () => {
      interface TestEntity {
        id: number;
        name: string;
        email: string;
        created_at: Date;
      }

      it('should build a basic UPDATE query with a single field', () => {
        const query = new QueryBuilder<TestEntity>('users')
          .update('name', 'John Doe')
          .where('id', '=', 1)
          .getSql();

        expect(query).toBe('UPDATE users SET name = "John Doe" WHERE id = 1;');
      });

      it('should build an UPDATE query with multiple fields', () => {
        const query = new QueryBuilder<TestEntity>('users')
          .update('name', 'John Doe')
          .update('email', 'john@example.com')
          .where('id', '=', 1)
          .getSql();

        expect(query).toBe(
          'UPDATE users SET name = "John Doe", email = "john@example.com" WHERE id = 1;',
        );
      });

      it('should build an UPDATE query with different value types', () => {
        const date = new Date('2024-01-01');
        const query = new QueryBuilder<TestEntity>('users')
          .update('name', 'John Doe')
          .update('created_at', date)
          .update('id', 100)
          .where('id', '=', 1)
          .getSql();

        expect(query).toBe(
          `UPDATE users SET name = "John Doe", created_at = "${date.toISOString()}", id = 100 WHERE id = 1;`,
        );
      });

      it('should build an UPDATE query with complex WHERE conditions', () => {
        const query = new QueryBuilder<TestEntity>('users')
          .update('name', 'John Doe')
          .where('id', '>', 10)
          .andWhere('email', 'LIKE', '%@example.com')
          .getSql();

        expect(query).toBe(
          'UPDATE users SET name = "John Doe" WHERE id > 10 AND email LIKE "%@example.com";',
        );
      });

      it('should handle updating with null values', () => {
        const query = new QueryBuilder<TestEntity>('users')
          .update('email', null)
          .where('id', '=', 1)
          .getSql();

        expect(query).toBe('UPDATE users SET email = NULL WHERE id = 1;');
      });

      it('should throw error when updating without WHERE clause', () => {
        const query = new QueryBuilder<TestEntity>('users')
          .update('name', 'John Doe')
          .getSql();

        expect(query).toBe('UPDATE users SET name = "John Doe";');
      });
    });
  });
});
