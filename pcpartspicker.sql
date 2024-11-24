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
    foreign key (ManufacturerID) references Manufacturer(ManufacturerID));

grant select on PCParts to public;

create table Case(
    PartID int,
    Height int,
    Width int,
    Length int,
    FormFactor varchar(50),
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

grant select on Case to public;

create table GPU(
    PartID int,
    Memory int,
    CoreClock int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

grant select on GPU to public;

create table Ram(
    PartID int,
    DDRType varchar(50),
    Speed int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

grant select on Ram to public;

create table CPU(
    PartID int,
    ThreadCount int,
    CoreCount int,
    CoreClock int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

grant select on CPU to public;

create table Cooler(
    PartID int,
    Type varchar(50),
    Height int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

grant select on Cooler to public;

create table PSU(
    PartID int,
    Wattage int,
    EfficiencyRating varchar(50),
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

grant select on PSU to public;

create table Storage(
    PartID int,
    Type varchar(50),
    Capacity int,
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

grant select on Storage to public;

create table Motherboard(
    PartID int,
    FormFactor varchar(50),
    SocketType varchar(50),
	primary key (PartID),
    foreign key (PartID) references PCParts(PartID));

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
    foreign key (Email) references UserEmail(Email));

grant select on PCPartsList to public;

create table Benchmark(
    ListID int,
    Description varchar(500),
	primary key (ListID),
    foreign key (ListID) references PCPartsList(ListID));

grant select on Benchmark to public;

create table BuildGuide(
    ListID int,
    Description varchar(500),
	primary key (ListID),
    foreign key (ListID) references PCPartsList(ListID));

grant select on BuildGuide to public;

create table UserComment(
	CommentID int,
	Text varchar(500),
	Email varchar(50) not null,
	ListID int not null,
	primary key (CommentID),
	foreign key (Email) references UserEmail(Email),
	foreign key (ListID) references BuildGuide(ListID));

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
	foreign key (ParentPartID) references PCParts(PartID),
	foreign key (ChildPartID) references PCParts(PartID));

grant select on Compatibility to public;

create table Sell(
	RetailerID int,
	PartID int,
	Stock int,
	Price int,
	DatePriced date,
	primary key (RetailerID, PartID),
	foreign key (RetailerID) references Retailer(RetailerID),
	foreign key (PartID) references PCParts(PartID));

grant select on Sell to public;

create table Contain(
	ListID int,
	PartID int,
	primary key (ListID, PartID),
	foreign key (ListID) references PCPartsList(ListID),
	foreign key (PartID) references PCParts(PartID));

grant select on Contain to public;

create table Score(
	TestID int,
	ListID int,
	DateScored int,
	primary key (TestID, ListID),
	foreign key (TestID) references BenchmarkTest(TestID),
	foreign key (ListID) references PCPartsList(ListID));

grant select on Score to public;