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
    DateScored date,
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
insert into Manufacturer (ManufacturerID, Name, Website, Contact) values
(4, 'NVIDIA', 'www.nvidia.com', 'info@nvidia.com');
insert into Manufacturer (ManufacturerID, Name, Website, Contact) values
(5, 'INTEL', 'www.intel.com', 'support@intel.com');

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
(1, 'TC Gaming Case v1', 'GC-5000', 5, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(2, 'NG PS 4', 'PS-750W', 5, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(3, 'TC Graphics Card', 'RTX-3070', 9, 4);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(4, 'CW Motherboard', 'MB-ATX123', 6, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(5, 'Katanta Memory Module', 'RAM-16GB-DDR4', 7, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(6, 'CW Storage Drive', 'SSD-1TB', 9, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(7, 'TC Processor', 'CPU-i5-12600K', 5, 5);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(8, 'NG Cooler', 'AirCool-X200', 7, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(9, ' Faster Card 123', 'RX-6800', 6, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(10, 'TC Motherboard Nitro 5', 'MB-MicroATX100', 7, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(11, 'Memory 45', 'RAM-32GB-DDR5', 7, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(12, 'TC 451 Drive', 'HDD-2TB', 7, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(13, 'NG Processor c2.3', 'CPU-Ryzen5-7600', 7, 5);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(14, 'Cooler 12', 'LiquidCool-500', 6, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(15, 'Gaming 12', 'Mini-Case-MTX', 6, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(16, 'Power Cooler 67', 'PS-550W', 8, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(17, 'Graphics g4.5', 'RTX-3080', 5, 4);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(18, 'CW Motherboard', 'MB-ATX-Elite', 9, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(19, 'NG Memory Module', 'RAM-8GB-DDR4', 3, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(20, ' CW Storage Drive 417', 'SSD-512GB', 8, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(21, 'TC Gaming Case v1', 'GC-5200', 6, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(22, 'NG PS 4', 'PS-751W', 5, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(23, 'TC Graphics Card', 'RTX-4070', 9, 4);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(24, 'CW Motherboard', 'MB-ATX1234', 6, 3);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(25, 'TC Processor', 'CPU-i5-12620K', 4, 5);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(26, 'NG Cooler', 'AirCool-X221', 8, 2);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(27, ' Faster Card 123', 'RX-6850', 6, 4);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(28, 'TC Motherboard Nitro 5', 'MB-MicroATX123', 7, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(29, 'TC Gaming Case v1', 'GC-5220', 5, 1);
insert into PCParts (PartID, Name, Model, Rating, ManufacturerID) values
(30, 'NG Cooler', 'AirCool-X300', 6, 2);

insert into Case (PartID, Height, Width, Length, FormFactor) values
(1, 450, 210, 460, 'ATX');
insert into Case (PartID, Height, Width, Length, FormFactor) values
(15, 400, 200, 450, 'Micro-ATX');
insert into Case (PartID, Height, Width, Length, FormFactor) values
(21, 450, 210, 460, 'ATX');
insert into Case (PartID, Height, Width, Length, FormFactor) values
(29, 450, 210, 460, 'ATX');

insert into GPU (PartID, Memory, CoreClock) values
(3, 10, 1440);
insert into GPU (PartID, Memory, CoreClock) values
(9, 8, 1600);
insert into GPU (PartID, Memory, CoreClock) values
(17, 24, 1800);
insert into GPU (PartID, Memory, CoreClock) values
(23, 10, 1440);
insert into GPU (PartID, Memory, CoreClock) values
(27, 8, 1600);

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
insert into CPU (PartID, ThreadCount, CoreCount, CoreClock) values
(25, 12, 6, 3800);

insert into Cooler (PartID, Type, Height) values
(8, 'Air', 158);
insert into Cooler (PartID, Type, Height) values
(14, 'Liquid', 240);
insert into Cooler (PartID, Type, Height) values
(26, 'Air', 158);
insert into Cooler (PartID, Type, Height) values
(30, 'Liquid', 240);

insert into PSU (PartID, Wattage, EfficiencyRating) values
(2, 850, 'Gold');
insert into PSU (PartID, Wattage, EfficiencyRating) values
(16, 750, 'Platinum');
insert into PSU (PartID, Wattage, EfficiencyRating) values
(22, 850, 'Gold');

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
insert into Motherboard (PartID, FormFactor, SocketType) values
(24, 'ATX', 'AM4');
insert into Motherboard (PartID, FormFactor, SocketType) values
(28, 'Mini-ITX', 'AM5');

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
insert into UserEmail (Email, Username, Password) values
('bruh@gmail.com', 'bruh', '12512asf');
insert into UserEmail (Email, Username, Password) values
('awesome@gmail.com', 'aswersomebruh', 'asdas');

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
insert into PCPartsList (ListID, ListName, Email) values
(6, 'Cool Build', 'bruh@gmail.com');
insert into PCPartsList (ListID, ListName, Email) values
(7, 'Awesome Build', 'awesome@gmail.com');
    
insert into Benchmark (ListID, Description) values
(1, 'Gaming benchmark using 3DMark and Cyberpunk 2077.');
insert into Benchmark (ListID, Description) values
(2, 'Workstation build tested with Blender rendering.');
insert into Benchmark (ListID, Description) values
(6, 'Test against the world tests.');
insert into Benchmark (ListID, Description) values
(7, 'EZ.');

insert into BuildGuide (ListID, Description) values
(3, 'Steps for setting up a streaming PC.');
insert into BuildGuide (ListID, Description) values
(4, 'Affordable build guide for casual gamers.');

insert into UserComment (CommentID, Text, Email, ListID) values
(1, 'awesome build', 'alice@gmail.com', 4);
insert into UserComment (CommentID, Text, Email, ListID) values
(2, 'smh this build is not it', 'bob@gmail.com', 3);
insert into UserComment (CommentID, Text, Email, ListID) values
(3, 'bruh build', 'mallory@gmail.com', 4);
insert into UserComment (CommentID, Text, Email, ListID) values
(4, 'what r u doing', 'awesome@gmail.com', 3);

insert into BenchmarkTest (TestID, TestName, Type) values
(1, 'Cinebench R23', 'CPU');
insert into BenchmarkTest (TestID, TestName, Type) values
(2, '3DMark', 'GPU');
insert into BenchmarkTest (TestID, TestName, Type) values
(3, 'Prime95', 'CPU');
insert into BenchmarkTest (TestID, TestName, Type) values
(4, 'CrystalDiskMark', 'Storage');
insert into BenchmarkTest (TestID, TestName, Type) values
(5, 'UserBenchmark', 'Overall');

insert into Compatibility (ParentPartID, ChildPartID) values
(1, 2);
insert into Compatibility (ParentPartID, ChildPartID) values
(1, 3);
insert into Compatibility (ParentPartID, ChildPartID) values
(1, 4);
insert into Compatibility (ParentPartID, ChildPartID) values 
(1, 5);
insert into Compatibility (ParentPartID, ChildPartID) values 
(1, 12);
insert into Compatibility (ParentPartID, ChildPartID) values 
(1, 16);
insert into Compatibility (ParentPartID, ChildPartID) values 
(1, 17);
insert into Compatibility (ParentPartID, ChildPartID) values 
(4, 5);
insert into Compatibility (ParentPartID, ChildPartID) values 
(4, 12);
insert into Compatibility (ParentPartID, ChildPartID) values 
(4, 16);
insert into Compatibility (ParentPartID, ChildPartID) values 
(4, 17);
insert into Compatibility (ParentPartID, ChildPartID) values 
(5, 12);
insert into Compatibility (ParentPartID, ChildPartID) values 
(5, 16);
insert into Compatibility (ParentPartID, ChildPartID) values 
(5, 17);
insert into Compatibility (ParentPartID, ChildPartID) values 
(12, 16);
insert into Compatibility (ParentPartID, ChildPartID) values 
(12, 17);
insert into Compatibility (ParentPartID, ChildPartID) values 
(16, 17);
insert into Compatibility (ParentPartID, ChildPartID) values
(14, 19);
insert into Compatibility (ParentPartID, ChildPartID) values
(5, 1);

insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(1, 1, 100, 650, '2023-10-01');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(2, 1, 2, 600, '2023-10-11');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 1, 45, 699, '2023-03-01');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(4, 1, 12, 768, '2023-10-15');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(5, 1, 76, 699, '2023-05-01');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(1, 2, 50, 299, '2023-10-02');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(2, 2, 50, 299, '2023-10-02');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 3, 75, 49, '2023-10-13');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(4, 4, 30, 129, '2023-12-04');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(5, 4, 25, 119, '2023-12-04');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(5, 5, 200, 99, '2023-11-14');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 7, 122, 45, '2023-10-27');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 9, 45, 12, '2023-10-09');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(1, 10, 23, 99, '2023-01-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(2, 10, 200, 99, '2023-10-21');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 10, 54, 101, '2022-11-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(1, 12, 67, 79, '2023-01-30');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(2, 13, 12, 89, '2023-08-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(1, 15, 12, 111, '2023-10-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(2, 15, 200, 109, '2023-07-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 15, 54, 90, '2023-08-15');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(4, 15, 23, 95, '2023-08-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(5, 15, 16, 99, '2023-09-30');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(1, 17, 200, 399, '2024-10-15');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(2, 17, 42, 367, '2023-11-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(3, 17, 78, 350, '2023-10-22');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(4, 17, 154, 455, '2021-10-25');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(5, 17, 12, 400, '2023-10-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(4, 19, 76, 69, '2024-11-05');
insert into Sell (RetailerID, PartID, Stock, Price, DatePriced) values
(5, 20, 45, 50, '2023-12-05');

insert into Contain (ListID, PartID) values
(1, 1);
insert into Contain (ListID, PartID) values 
(1, 2);
insert into Contain (ListID, PartID) values
(1, 3);
insert into Contain (ListID, PartID) values
(1, 4);
insert into Contain (ListID, PartID) values
(2, 1);
insert into Contain (ListID, PartID) values
(2, 12);
insert into Contain (ListID, PartID) values
(2, 17);
insert into Contain (ListID, PartID) values
(2, 5);
insert into Contain (ListID, PartID) values
(2, 16);
insert into Contain (ListID, PartID) values
(2, 4);
insert into Contain (ListID, PartID) values
(3, 14);
insert into Contain (ListID, PartID) values
(3, 19);
insert into Contain (ListID, PartID) values
(4, 13);

insert into Score (TestID, ListID, TestScore, DateScored) values
(1, 2, 99, '2024-01-01');
insert into Score (TestID, ListID, TestScore, DateScored) values
(1, 6, 89, '2024-01-01');
insert into Score (TestID, ListID, TestScore, DateScored) values
(1, 7, 69, '2024-01-01');
insert into Score (TestID, ListID, TestScore, DateScored) values 
(2, 2, 54, '2024-01-02');
insert into Score (TestID, ListID, TestScore, DateScored) values 
(2, 6, 54, '2024-01-02');
insert into Score (TestID, ListID, TestScore, DateScored) values
(3, 1, 86, '2024-01-03');
insert into Score (TestID, ListID, TestScore, DateScored) values
(4, 2, 18, '2024-01-04');

commit work;