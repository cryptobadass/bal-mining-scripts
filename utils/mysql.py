import pymysql
import os


def get_mysql_connect():  # get mysql connect

    return pymysql.connect(
        host=os.getenv('MYSQL_HOST'),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE'),
        charset=os.getenv('MYSQL_CHARSET'))
