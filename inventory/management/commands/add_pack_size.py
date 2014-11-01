# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute,Patient
from django.db.models import Sum

class Command(BaseCommand):
    items = [[556,60],[558,60],[559,60],[693,60],[557,30],[560,60],[562,60],[561,60],[673,1],[663,30],[563,90],[564,30],[565,30],[566,120],[567,60],[568,30],[569,30],[687,1],[273,1],[275,1],[274,1],[276,1],[278,1],[277,1],[279,1],[280,1],[650,1],[570,1],[572,1],[573,10],[574,10],[575,1],[571,1],[577,100],[576,144],[711,28],[578,28],[674,28],[676,35],[579,28],[580,1],[317,1],[318,1],[321,25],[319,10],[315,1],[316,1],[320,25],[322,1],[323,1],[324,10],[633,1],[638,1],[632,1],[634,1],[635,1],[636,1],[640,1],[639,1],[637,1],[552,1],[551,1],[553,1],[554,1],[555,1],[549,1],[550,1],[50,1],[51,1],[724,1],[52,1],[53,1],[54,1],[55,1],[56,1],[57,1],[58,1],[59,1],[60,1],[61,1],[62,1],[63,1],[65,1],[64,1],[66,1],[67,1],[68,1],[69,1],[75,1],[74,1],[71,1],[72,1],[70,1],[692,1],[73,1],[76,1],[77,1],[78,1],[79,1],[707,1],[80,1],[81,1],[82,1],[83,1],[85,1],[86,1],[87,1],[88,1],[89,1],[708,1],[90,1],[91,1],[92,1],[93,1],[94,1],[95,1],[96,1],[97,1],[98,1],[99,1],[103,1],[104,1],[105,1],[106,1],[107,1],[108,1],[109,1],[110,1],[111,1],[112,1],[113,1],[114,1],[115,1],[100,1],[101,1],[102,1],[116,1],[117,1],[118,1],[119,1],[120,1],[121,1],[122,1],[723,1],[328,1],[331,1],[330,1],[329,1],[335,1],[327,1],[326,1],[325,1],[332,1],[336,1],[337,1],[338,1],[339,1],[340,1],[341,1],[342,1],[343,1],[344,1],[333,1],[345,1],[346,1],[347,1],[348,1],[668,1],[669,1],[349,1],[728,1],[683,1],[350,1],[353,1],[352,1],[351,1],[354,1],[355,1],[356,1],[357,1],[358,1],[359,1],[360,1],[362,1],[363,1],[393,1],[364,1],[365,1],[366,1],[702,1],[703,1],[671,1],[672,1],[367,1],[368,1],[370,1],[371,1],[373,100],[372,100],[375,100],[374,100],[377,100],[376,100],[667,1],[378,1],[383,1],[384,1],[379,1],[380,1],[381,1],[382,1],[385,1],[387,12],[386,12],[389,12],[388,12],[390,12],[391,12],[394,1],[392,12],[395,100],[396,25],[397,1],[398,1],[399,1],[400,1],[401,1],[334,1],[402,1],[403,1],[405,1],[406,1],[661,1],[407,1],[408,1],[409,1],[410,1],[411,1],[690,1],[412,1],[413,1],[414,1],[415,1],[416,1],[417,1],[418,1],[419,1],[420,1],[421,1],[422,1],[423,1],[424,1],[425,1],[426,1],[427,1],[428,1],[429,1],[430,1],[431,1],[432,1],[433,50],[436,1],[434,1],[435,50],[437,1],[438,1],[439,1],[440,1],[441,1],[442,1],[443,1],[444,1],[445,1],[446,1],[447,1],[448,1],[449,1],[450,1],[451,10],[452,1],[453,1],[454,1],[455,1],[456,1],[457,1],[458,1],[459,1],[460,1],[461,1],[462,1],[463,1],[464,1],[465,1],[466,1],[467,1],[468,1],[470,1],[471,1],[469,1],[472,1],[473,1],[474,1],[475,1],[476,1],[477,1],[478,1],[479,1],[480,100],[481,100],[482,100],[483,100],[484,100],[485,100],[486,1],[487,1],[489,1],[682,1],[490,1],[491,1],[493,1],[492,1],[488,1],[494,50],[495,1],[499,1],[500,1],[501,1],[496,1],[502,1],[497,1],[498,1],[503,1],[504,1],[505,1],[506,1],[507,1],[508,1],[509,1],[510,1],[511,12],[729,1],[513,1],[512,50],[514,1],[641,1],[404,1],[515,1],[516,1],[517,1],[518,1],[519,1],[520,1],[521,1],[722,1],[522,1],[523,1],[524,100],[525,100],[527,1],[528,1],[529,1],[526,100],[532,1],[533,1],[530,1],[531,1],[730,1],[581,1],[582,1],[583,1],[586,1],[584,1],[585,1],[712,1],[588,1],[589,1],[713,1],[590,1],[657,1],[714,1],[591,1],[592,1],[715,1],[716,1],[717,1],[718,1],[621,1],[593,1],[695,1],[594,1],[696,1],[604,1],[630,1],[595,1],[631,100],[596,1],[719,1],[597,1],[656,1],[599,1],[600,1],[603,1],[601,1],[602,1],[670,1],[720,1],[605,1],[697,1],[587,1],[694,1],[607,1],[606,1],[608,1],[609,1],[721,1],[660,100],[610,100],[611,100],[612,1],[613,1],[614,1],[698,1],[699,1],[617,1],[618,1],[619,1],[675,1],[662,1],[620,1],[622,1],[624,1],[623,1],[626,1],[625,1],[628,1],[655,1],[627,1],[654,1],[629,1],[598,1],[536,1],[537,1],[534,1],[535,1],[538,1],[539,1],[540,1],[541,1],[542,1],[543,1],[544,1],[545,1],[546,1],[547,1],[548,1],[642,1],[684,1],[685,1],[1,1],[3,1],[4,1],[6,1],[7,1],[659,1],[12,1],[10,1],[11,1],[726,1],[727,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],[22,1],[8,1],[23,1],[24,1],[25,1],[27,1],[26,1],[28,1],[29,1],[704,1],[30,1],[31,1],[32,1],[33,1],[649,1],[34,1],[35,1],[644,1],[36,1],[37,1],[38,1],[39,1],[40,1],[41,1],[689,1],[42,1],[43,1],[44,1],[46,1],[45,1],[680,1],[47,1],[48,1],[49,1],[140,1],[124,1],[125,1],[123,1],[126,1],[127,1],[128,1],[129,1],[130,1],[131,1],[133,1],[132,1],[136,1],[688,1],[134,1],[135,1],[137,1],[138,1],[139,1],[141,1],[142,1],[144,1],[143,1],[145,1],[146,1],[147,1],[148,1],[149,1],[647,1],[150,1],[151,1],[152,1],[153,1],[154,1],[155,1],[157,1],[156,1],[158,1],[159,1],[160,1],[677,1],[161,1],[162,1],[163,1],[164,1],[165,1],[166,1],[167,1],[168,1],[169,1],[170,1],[171,1],[172,1],[173,1],[175,1],[174,1],[176,1],[177,1],[178,1],[700,1],[179,1],[180,1],[182,1],[645,1],[184,1],[183,1],[185,1],[186,1],[188,1],[187,1],[189,1],[190,1],[192,1],[191,1],[193,1],[194,1],[197,1],[195,1],[196,1],[268,1],[198,1],[199,1],[200,1],[643,1],[705,1],[706,1],[201,1],[202,1],[203,1],[646,1],[204,1],[205,1],[207,1],[206,1],[208,1],[209,1],[210,1],[211,1],[213,1],[212,1],[214,1],[215,1],[216,1],[701,1],[217,1],[218,1],[219,1],[220,1],[222,1],[221,1],[224,1],[223,1],[225,1],[226,1],[227,1],[229,1],[230,1],[228,1],[231,1],[233,1],[234,1],[232,1],[235,1],[236,1],[709,1],[237,1],[238,1],[239,1],[240,1],[241,1],[242,1],[243,1],[244,1],[681,1],[245,1],[246,1],[691,1],[678,1],[247,1],[248,1],[249,1],[250,1],[251,1],[252,1],[253,1],[254,1],[255,1],[652,1],[686,1],[256,1],[257,1],[259,1],[258,1],[260,1],[664,1],[261,1],[262,1],[263,1],[264,1],[665,1],[267,1],[266,1],[265,1],[270,1],[269,1],[271,1],[272,1],[281,1],[282,15],[283,1],[284,15],[285,1],[286,1],[287,1],[288,1],[289,15],[290,1],[291,1],[725,15],[292,1],[293,15],[294,1],[295,15],[296,1],[297,1],[298,15],[300,1],[299,1],[301,15],[302,1],[303,1],[305,1],[304,15],[666,1],[306,1],[307,1],[308,15],[309,15],[648,1],[310,1],[311,1],[314,1],[312,15],[313,15]]
    for pair in items:
        try:
            item = Item.objects.get(id=pair[0])
            item.dispense_size = pair[1]
            item.save()
        except:
            print pair[0]

