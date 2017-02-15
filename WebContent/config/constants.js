var devices = {
	"n20-1"     : "N5200", //n20-1-02-iusacell
	"n25-1"     : "N7700", //n25-1-01-iusacell
	"n25-4"		: "N7703",  //n25-4-01-iusacell
	"n27-1"		: "N7800"  //n25-4-01-iusacell
};

var sections_id = {
	"menu"     		: "1",  //Menu Item
	"channel"  		: "2",  //Interactive Channels
	"mosaic"		: "3",  //Mosaic Banner
	"programInfo"	: "4",  //Program Info Recommendation
	"programDetail"	: "5",  //Program Detail
	"vodHome"		: "6",  //VOD Home
	"vodDetail"		: "7",  //VOD Detail
	"popUp"			: "8",	//Notification Pop Up	
	"notification"	: "9",	//1280x720 Notification
	"goToBar"		: "10", //Numeric Channel Bar (Go To Bar)
	"advertising"	: "11",  //Advertising Channel Info
	"promos"		: "12",  //Promotions 
	"inbox"			: "13", // notification inbox,
	"epg"			: "14",
	"remote_control": "15" 
};
 
var short_months = ["ene","feb","mar","abr","may","jun","jul","ago", "sep","oct","nov","dic"];
var full_months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
var short_days = ["dom","lun","mar","mi�","jue","vie","sab"];
var full_days = ["domingo","lunes","martes","mi�rcoles","jueves","viernes","s�bado"]; 

var hrs = ["00:00 am","00:30 am","01:00 am","01:30 am","02:00 am","02:30 am","03:00 am","03:30 am","04:00 am","04:30 am","05:00 am","05:30 am",
"06:00 am","06:30 am","07:00 am","07:30 am","08:00 am","08:30 am","09:00 am","09:30 am","10:00 am", "10:30 am", "11:00 am","11:30 am", "12:00 pm",
"12:30 pm", "0	1:00 pm","01:30 pm","02:00 pm","02:30 pm","03:00 pm","03:30 pm","04:00 pm","04:30 pm","05:00 pm","05:30 pm",
"06:00 pm","06:30 pm","07:00 pm","07:30 pm","08:00 pm","08:30 pm","09:00 pm","09:30 pm","10:00 pm", "10:30 pm", "11:00 pm","11:30 pm"];

var noPlayerSections = ["vodHomeC","lists","epg","help","unlockProgram","vodWizzard","vodAZ","login","vodPlayer","startOverPlayer","vodDetail","anytimePlayer","promotions_template_1", "suscription", "welcomeAddOns","anytimetv","confirm","nipValidator","mosaic","promotions_template_1","promotions_template_2","promotions_template_3","vodTest","welcome","servers", "checklist","wifiHome"];
var noChangePlayerSections = ["timeline","miniGuide","menu","tweetFeed"];
var miniPlayerSections = ["vodHome","vodSeasons", "search", "addOns", "addOnsInter", "anytimetv", "anytimetvChapters", "recordingsHome","myChannels"];
var miniPlayerSectionsB = ["vodHomeB"];

var cleanBgSections = ["vodHome","addOns", "search", "addOnsInter", "anytimetv", "anytimetvChapters", "vodHomeB", "recordingsHome", "suscription"];

var programRatingsSTB = {
	"MEX00" : { "level": 0, "value": "AA",  "id":1, "clasif": "AA",	"clasif2": "AA", "descrip": "Infantil"},
	"MEX04" : { "level": 1, "value": "A",   "id":2, "clasif": "A", 	"clasif2": "A", 	"descrip": "Todo el p�blico" },
	"MEX09" : { "level": 2, "value": "B",   "id":3, "clasif": "B", 	"clasif2": "B", 	"descrip": "12 a�os en adelante"},
	"MEX0C" : { "level": 3, "value": "B-15","id":4, "clasif": "B15", 	"clasif2": "B-15", 	"descrip": "15 a�os en adelante"},
	"MEX0E" : { "level": 4, "value": "C",   "id":5, "clasif": "C", 	"clasif2": "C", 	"descrip": "18 a�os en adelante"},
	"MEX0F" : { "level": 5, "value": "D",   "id":6, "clasif": "D",		"clasif2": "D", 	"descrip": "Er�tico"}
};

var programRatingsBE = {
	"AA" 	: { "level": 0, "value": "AA",  "id":1, "clasif": "AA",	"clasif2": "AA", "descrip": "Infantil"},
	"A" 	: { "level": 1, "value": "A",   "id":2, "clasif": "A", 	"clasif2": "A", 	"descrip": "Todo el p�blico" },
	"B" 	: { "level": 2, "value": "B",   "id":3, "clasif": "B", 	"clasif2": "B", 	"descrip": "12 a�os en adelante"},
	"B-15" 	: { "level": 3, "value": "B-15","id":4, "clasif": "B15", 	"clasif2": "B-15", 	"descrip": "15 a�os en adelante"},
	"C" 	: { "level": 4, "value": "C",   "id":5, "clasif": "C", 	"clasif2": "C", 	"descrip": "18 a�os en adelante"},
	"D" 	: { "level": 5, "value": "D",   "id":6, "clasif": "D",		"clasif2": "D", 	"descrip": "Er�tico"}
};

var userRatings = {
	"AA" : 0,
	"A" : 1,
	"B" : 2,
	"B-15" : 3,
	"C" : 4,
	"D" : 5
}; 


