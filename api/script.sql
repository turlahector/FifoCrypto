CREATE TABLE user
(
id int NOT NULL AUTO_INCREMENT,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
EmailAddress varchar(255),
PublicAddress varchar(255),
PrivateAddress varchar(255),
password varchar(255),
PRIMARY KEY (id)
)


CREATE TABLE wallet
(
id int NOT NULL AUTO_INCREMENT,
walletName varchar(255) NOT NULL,
walletType varchar(255),
publicAddress varchar(255),
privateAddress varchar(255),
balance varchar(255),
symbol varchar(255),
email varchar(255)
PRIMARY KEY (id)
)


