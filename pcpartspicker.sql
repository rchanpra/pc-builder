alter session set nls_date_format = 'YYYY-MM-DD';

drop table Compatibility;
drop table Sell;
drop table Contain;
drop table Score;
drop table UserComment;
drop table BuildGuide;
drop table Benchmark;
drop table BenchmarkTest;
drop table PCPartsList;
drop table UserEmail;
drop table Case;
drop table GPU;
drop table Ram;
drop table CPU;
drop table Cooler;
drop table PSU;
drop table Storage;
drop table Motherboard;
drop table PCParts;
drop table Retailer;
drop table Manufacturer;

create table Manufacturer(
    ManufacturerID int,
    Name varchar(50),
    Website varchar(50),
    Contact varchar(50),
	primary key (ManufacturerID));

grant select on Manufacturer to public;

create table Retailer(
    RetailerID int,
    Name varchar(50),
    Website varchar(50),
	primary key (RetailerID));

grant select on Retailer to public;

create table PCParts(
    PartID int,
    Name varchar(50),
    Model varchar(50),
    Rating int,
    ManufacturerID int not null,
	primary key (PartID),
    foreign key (ManufacturerID) references Manufacturer(ManufacturerID) on delete cascade);

grant select on PCParts to public;

create table Case(
    PartID int,
    Height int,
    Width int,
    Length int,
    FormFactor varchar(50),
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on Case to public;

create table GPU(
    PartID int,
    Memory int,
    CoreClock int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on GPU to public;

create table Ram(
    PartID int,
    DDRType varchar(50),
    Speed int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on Ram to public;

create table CPU(
    PartID int,
    ThreadCount int,
    CoreCount int,
    CoreClock int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on CPU to public;

create table Cooler(
    PartID int,
    Type varchar(50),
    Height int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on Cooler to public;

create table PSU(
    PartID int,
    Wattage int,
    EfficiencyRating varchar(50),
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on PSU to public;

create table Storage(
    PartID int,
    Type varchar(50),
    Capacity int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on Storage to public;

create table Motherboard(
    PartID int,
    FormFactor varchar(50),
    SocketType varchar(50),
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on Motherboard to public;

create table UserEmail(
    Email varchar(50),
    Username varchar(50),
    Password varchar(50),
	primary key (Email));

grant select on UserEmail to public;

create table PCPartsList(
    ListID int,
    ListName varchar(50),
    Email varchar(50) not null,
	primary key (ListID),
    foreign key (Email) references UserEmail(Email) on delete cascade);

grant select on PCPartsList to public;

create table Benchmark(
    ListID int,
    Description varchar(500),
	primary key (ListID),
    foreign key (ListID) references PCPartsList(ListID) on delete cascade);

grant select on Benchmark to public;

create table BuildGuide(
    ListID int,
    Description varchar(500),
	primary key (ListID),
    foreign key (ListID) references PCPartsList(ListID) on delete cascade);

grant select on BuildGuide to public;

create table UserComment(
	CommentID int,
	Text varchar(500),
	Email varchar(50) not null,
	ListID int not null,
	primary key (CommentID),
	foreign key (Email) references UserEmail(Email) on delete cascade,
	foreign key (ListID) references BuildGuide(ListID) on delete cascade);

grant select on UserComment to public;

create table BenchmarkTest(
    TestID int,
    TestName varchar(50),
    Type varchar(50),
    DateTested date,
	primary key (TestID));

grant select on BenchmarkTest to public;

create table Compatibility(
	ParentPartID int,
	ChildPartID int,
	primary key (ParentPartID, ChildPartID),
	foreign key (ParentPartID) references PCParts(PartID) on delete cascade,
	foreign key (ChildPartID) references PCParts(PartID) on delete cascade);

grant select on Compatibility to public;

create table Sell(
	RetailerID int,
	PartID int,
	Stock int,
	Price int,
	DatePriced date,
	primary key (RetailerID, PartID),
	foreign key (RetailerID) references Retailer(RetailerID) on delete cascade,
	foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on Sell to public;

create table Contain(
	ListID int,
	PartID int,
	primary key (ListID, PartID),
	foreign key (ListID) references PCPartsList(ListID) on delete cascade,
	foreign key (PartID) references PCParts(PartID) on delete cascade);

grant select on Contain to public;

create table Score(
	TestID int,
	ListID int,
	TestScore int,
	primary key (TestID, ListID),
	foreign key (TestID) references BenchmarkTest(TestID) on delete cascade,
	foreign key (ListID) references Benchmark(ListID) on delete cascade);

grant select on Score to public;


insert into Manufacturer (ManufacturerID, Name, Website, Contact) values
(1, 'TechCorp', 'www.techcorp.com', 'contact@techcorp.com');
insert into Manufacturer (ManufacturerID, Name, Website, Contact) values
(2, 'NextGen', 'www.nextgen.com', 'info@nextgen.com');
insert into Manufacturer (ManufacturerID, Name, Website, Contact) values
(3, 'CyberWorks', 'www.cyberworks.com', 'support@cyberworks.com');

insert into Retailer (RetailerID, Name, Website) values
(1, 'Amazon', 'www.amazon.com');
insert into Retailer (RetailerID, Name, Website) values
(2, 'Best Buy', 'www.bestbuy.com');
insert into Retailer (RetailerID, Name, Website) values
(3, 'Newegg', 'www.newegg.com');
insert into Retailer (RetailerID, Name, Website) values
(4, 'Micro Center', 'www.microcenter.com');
insert into Retailer (RetailerID, Name, Website) values
(5, 'BH', 'www.bhphotovideo.com');

insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(1, 'Gaming Case', 'GC-5000', 7, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(2, 'Power Supply', 'PS-750W', 8, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(3, 'Graphics Card', 'RTX-3070', 9, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(4, 'Motherboard', 'MB-ATX123', 7, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(5, 'Memory Module', 'RAM-16GB-DDR4', 7, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(6, 'Storage Drive', 'SSD-1TB', 9, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(7, 'Processor', 'CPU-i5-12600K', 9, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(8, 'Cooler', 'AirCool-X200', 7, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(9, 'Graphics Card', 'RX-6800', 10, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(10, 'Motherboard', 'MB-MicroATX100', 8, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(11, 'Memory Module', 'RAM-32GB-DDR5', 10, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(12, 'Storage Drive', 'HDD-2TB', 7, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(13, 'Processor', 'CPU-Ryzen5-7600', 8, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(14, 'Cooler', 'LiquidCool-500', 9, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(15, 'Gaming Case', 'Mini-Case-MTX', 6, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(16, 'Power Supply', 'PS-550W', 8, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(17, 'Graphics Card', 'RTX-3080', 9, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(18, 'Motherboard', 'MB-ATX-Elite', 9, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(19, 'Memory Module', 'RAM-8GB-DDR4', 6, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(20, 'Storage Drive', 'SSD-512GB', 8, 3);

insert into Case (PartID, Height, Width, Length, FormFactor) values
(1, 450, 210, 460, 'ATX');
insert into Case (PartID, Height, Width, Length, FormFactor) values
(15, 400, 200, 450, 'Micro-ATX');

insert into GPU (PartID, Memory, CoreClock) values
(3, 10, 1440);
insert into GPU (PartID, Memory, CoreClock) values
(9, 8, 1600);
insert into GPU (PartID, Memory, CoreClock) values
(17, 24, 1800);

insert into Ram (PartID, DDRType, Speed) values
(5, 'DDR4', 3200);
insert into Ram (PartID, DDRType, Speed) values
(11, 'DDR5', 4800);
insert into Ram (PartID, DDRType, Speed) values
(19, 'DDR4', 3600);

insert into CPU (PartID, ThreadCount, CoreCount, CoreClock) values
(7, 12, 6, 3800);
insert into CPU (PartID, ThreadCount, CoreCount, CoreClock) values
(13, 24, 12, 4000);

insert into Cooler (PartID, Type, Height) values
(8, 'Air', 158);
insert into Cooler (PartID, Type, Height) values
(14, 'Liquid', 240);

insert into PSU (PartID, Wattage, EfficiencyRating) values
(2, 850, 'Gold');
insert into PSU (PartID, Wattage, EfficiencyRating) values
(16, 750, 'Platinum');

insert into Storage (PartID, Type, Capacity) values
(6, 'SSD', 1024);
insert into Storage (PartID, Type, Capacity) values
(12, 'HDD', 2000);
insert into Storage (PartID, Type, Capacity) values
(20, 'HDD', 1000);

insert into Motherboard (PartID, FormFactor, SocketType) values
(4, 'ATX', 'AM4');
insert into Motherboard (PartID, FormFactor, SocketType) values
(10, 'Micro-ATX', 'LGA1200');
insert into Motherboard (PartID, FormFactor, SocketType) values
(18, 'Mini-ITX', 'AM5');

insert into UserEmail (Email, Username, Password) values
('alice@gmail.com', 'alice', 'pass1234');
insert into UserEmail (Email, Username, Password) values
('bob@gmail.com', 'bobster', 'password');
insert into UserEmail (Email, Username, Password) values
('eve@gmail.com', 'evee', 'hunter2');
insert into UserEmail (Email, Username, Password) values
('mallory@gmail.com', 'mal', 'qwerty');
insert into UserEmail (Email, Username, Password) values
('trent@gmail.com', 'trent22', 'asdf1234');

insert into PCPartsList (ListID, ListName, Email) values
(1, 'Gaming Build', 'alice@gmail.com');
insert into PCPartsList (ListID, ListName, Email) values
(2, 'Workstation Build', 'bob@gmail.com');
insert into PCPartsList (ListID, ListName, Email) values
(3, 'Streaming Build', 'eve@gmail.com');
insert into PCPartsList (ListID, ListName, Email) values
(4, 'Budget Build', 'mallory@gmail.com');
insert into PCPartsList (ListID, ListName, Email) values
(5, 'High-End Build', 'trent@gmail.com');

insert into Benchmark (ListID, Description) values
(1, 'Gaming benchmark using 3DMark and Cyberpunk 2077.');
insert into Benchmark (ListID, Description) values
(2, 'Workstation build tested with Blender rendering.');

insert into BuildGuide (ListID, Description) values
(3, 'Steps for setting up a streaming PC.');
insert into BuildGuide (ListID, Description) values
(4, 'Affordable build guide for casual gamers.');

insert into UserComment (CommentID, Text, Email, ListID) values
(1, 'awesome build', 'alice@gmail.com', 4);
insert into UserComment (CommentID, Text, Email, ListID) values
(2, 'smh this build is not it', 'bob@gmail.com', 3);

insert into BenchmarkTest (TestID, TestName, Type, DateTested) values
(1, 'Cinebench R23', 'CPU', '2024-01-01');
insert into BenchmarkTest (TestID, TestName, Type, DateTested) values
(2, '3DMark', 'GPU', '2024-01-02');
insert into BenchmarkTest (TestID, TestName, Type, DateTested) values
(3, 'Prime95', 'CPU', '2024-01-03');
insert into BenchmarkTest (TestID, TestName, Type, DateTested) values
(4, 'CrystalDiskMark', 'Storage', '2024-01-04');
insert into BenchmarkTest (TestID, TestName, Type, DateTested) values
(5, 'UserBenchmark', 'Overall', '2024-01-05');

insert into Compatibility (ParentPartID, ChildPartID) values
(1, 2);
insert into Compatibility (ParentPartID, ChildPartID) values 
(2, 3);
insert into Compatibility (ParentPartID, ChildPartID) values
(3, 4);
insert into Compatibility (ParentPartID, ChildPartID) values
(4, 5);
insert into Compatibility (ParentPartID, ChildPartID) values
(5, 1);

insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(1, 1, 100, 699, '01-Oct-23');
-- (1, 1, 100, 699, '2023-10-01');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(2, 2, 50, 299, '2023-10-02');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 3, 75, 49, '2023-10-03');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(4, 4, 30, 129, '2023-10-04');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(5, 5, 200, 99, '2023-10-05');

insert into Contain (ListID, PartID) values
(1, 2);
insert into Contain (ListID, PartID) values 
(2, 3);
insert into Contain (ListID, PartID) values
(3, 4);
insert into Contain (ListID, PartID) values
(4, 5);
insert into Contain (ListID, PartID) values
(5, 1);

insert into Score (TestID, ListID, TestScore) values
(1, 2, 99);
insert into Score (TestID, ListID, TestScore) values 
(2, 2, 54);
insert into Score (TestID, ListID, TestScore) values
(3, 1, 86);
insert into Score (TestID, ListID, TestScore) values
(4, 2, 18);
insert into Score (TestID, ListID, TestScore) values
(5, 1, 88);

