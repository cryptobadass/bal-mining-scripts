# Balancer Mining Scripts

Set of scripts to calculate weekly BAL liquidity mining distributions.

###### tags: `Balancer`

## Requirements

-   Python 3
-   Mysql8

## 1. Database

```sql=
// 1. pull mysql image
docker pull mysql:latest

// 2. run mysql container, username: root  password: your password here
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=your-password-here mysql

// 3. enter container
docker exec -it mysql bash

// 4. login mysql, enter password: your-password-here
mysql -u root -p

// 5. create database
create database balancer_db charset=utf8;

// 6. use database
use balancer_db;

/// 7. create tables
 CREATE TABLE `pool_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chain_id` int DEFAULT '0' COMMENT 'blockchian id',
  `pool_id` varchar(255) DEFAULT '' COMMENT 'pool id',
  `pool_address` varchar(255) DEFAULT '' COMMENT 'pool address',
  `pool_type` varchar(255) DEFAULT '' COMMENT 'pool type',
  `factory` varchar(255) DEFAULT '' COMMENT 'pool factory address',
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'time stamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pool_address` (`pool_address`) USING BTREE COMMENT 'unique pool address'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Pool info table';

CREATE TABLE `pool_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pool_address` varchar(255) DEFAULT '' COMMENT 'pool address',
  `address` varchar(255) DEFAULT '' COMMENT 'user address',
  `timestamp` datetime DEFAULT NULL COMMENT 'time stamp',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_poolAddress_userAddress` (`pool_address`,`address`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Pool user table';

CREATE TABLE `balance_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pool_address` varchar(255) DEFAULT '' COMMENT 'pool address',
  `user_address` varchar(255) DEFAULT '' COMMENT 'user_address',
  `user_balance` varchar(300) DEFAULT '0' COMMENT 'user balance',
  `total_supply` varchar(300) DEFAULT '0' COMMENT 'total supply',
  `decimals` int DEFAULT '18' COMMENT 'token decimals',
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'time stamp',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Pool balance snapshot';

CREATE TABLE `every_week_need_reward_user_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chain_id` int DEFAULT '0' COMMENT 'blockchian id',
  `pool_address` varchar(255) DEFAULT '' COMMENT 'pool address',
  `token_address` varchar(255) DEFAULT '' COMMENT 'token address',
  `user_address` varchar(255) DEFAULT '' COMMENT 'user address',
  `current_estimate` varchar(300) DEFAULT '0' COMMENT 'current estimate',
  `velocity` varchar(255) DEFAULT '0' COMMENT 'velocity',
  `week` int DEFAULT '0' COMMENT 'week',
  `snapshot_timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'snapshot timestamp',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='every week need reward user snapshot';
```

## 2. Config .env

Copy .env.example file and rename it to .env. Then fill values in .env file.

```javascript=
FLEEK_API_KEY=your fleek api key here
FLEEK_API_SECRET=your fleek api secret here
FLEEK_BUCKET=your fleek bucket here
# only fuji, avalanche
NETWORK=fuji/avalanche here
MYSQL_HOST=localhost
MYSQL_USER=your mysql user
MYSQL_PASSWORD=your mysql password
MYSQL_DATABASE=your mysql database
MYSQL_CHARSET=utf8
OUTLOOK_EMAIL_USER=your email sender
OUTLOOK_EMAIL_PASS=your email sender password
# Multiple mail recipients can be separated by ,
EMAIL_RECEIVER=
```

## 3. Run the project

### 3.1. Clone the code

```bash=
git clone this-project-code
```

### 3.2. Install python packages

```bash=
pip3 install -r requirements.txt
```

### 3.3. Install nodejs packages

```bash=
yarn

npm install -g pm2
```

### 3.4. Run auto-task

Run task to get balance snapshot.

```bash=
yarn auto-task
```

### 3.5. Create reports

Every Monday, 8:00 UTC.

Before run the command, config MultiTokenLiquidityMining in frontend-v2 project. https://raw.githubusercontent.com/cryptobadass/frontend-v2/develop/src/lib/utils/liquidityMining/MultiTokenLiquidityMining.json.

```bash=
python3 run.py
```

### 3.6. Compute roots and publish ipfs

Compute roots and publish ipfs after reports created.

```bash=
NETWORK=avalanche yarn merkle-roots --outfile ./reports/_roots-avalanche.json

NETWORK=avalanche yarn ipfs-publish
```

## Attention

### 1. Modify config/const/constants.py

```python=
modify NETWORKS, config token address

43113: {
        'network': 'fuji',
        'token': '0xE00Bf4d40670FCC1DcB3A757ebccBe579f372fbc'
    },
43114: {
        'network': 'avalanche',
        'token': 'todo official token address here'
    }
```
