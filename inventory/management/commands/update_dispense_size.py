# This Python file uses the following encoding: utf-8
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from django.db.models import Q
from datetime import datetime,timedelta
import pytz
from django.utils.dateparse import parse_datetime
from django.db.models import Sum
from django.contrib.auth.models import User
from inventory.models import Item, ItemLot, StockChange, Shipment, Location, ItemAttribute
from tempfile import mkstemp
from shutil import move
from os import remove, close

class Command(BaseCommand):
    # for item in Item.objects.all():
    #   print str(item.id) +'\t'+ item.name + "\t" + item.category.name
    d = """1	Alcophyllex 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
3	Alcophyllex 200ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
4	"Amoxicillin 125mg/5ml susp, 100ml"	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
6	Ampi-Clox. Mixture 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
7	Beclomethasone 50mcg inhaler	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
8	"Hyoscine 5mg/5ml syrup, 100ml"	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
10	Chlorpheniramine 2mg/5ml syrup 50ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
11	Chlorpheniramine 2mg/5ml syrup 60ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
12	Chlorpheniramine 2mg/5ml syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
13	Cloxacillin 125mg/5ml syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
14	Co-trimoxazole 240mg/5ml susp. 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
15	Co-trimoxazole 240mg/5ml susp. 60ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
16	"Dextromethorphan 15mg/5ml,syrup 100ml"	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
17	Dextromethorphan+Guafenesine + chlorpheniramin 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
18	Diphenhydramin 14.1mg/ml syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
19	"Erythromycin 125mg/5ml susp,100ml"	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
20	Ferrous Sulfate 100ml syrup	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
21	Flusin 100ml syrup	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
22	Halothain 250ml Inhalation 	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
23	Lactulose 3.3g solution 200ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
24	Liquid paraffin 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
25	Liquid paraffin 2.5 littre	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
26	Magnesium Trisilicate 200ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
27	Magnesium Trisilicate 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
28	Mebendazole 100mg/5ml Susp. 30ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
29	Mefenamic Acid 50mg/5ml susp. 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
30	Metronidazole 125mg/5ml susp. 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
31	Miconazole 2% oral gel 40g	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
32	Mist Tussi Infans 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
33	Multivitamin syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
34	Nystatin 100000/5ml oral susp. 30ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
35	Oral Rehydration salts 100 sachet	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
36	"Paracetamol 120mg/5ml syrup, 100ml"	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
37	Penicillin vk 125mg/5ml syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
38	Phenobarbiton 3mg/ml syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
39	Pholcodine syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
40	Pholcodine syrup 2.5 littre	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
41	Plumpy nut 29.9 mg sachet	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
42	Potasium citrate 30% mixture 200ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
43	Promethazine 5mg/ 5ml syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
44	"Salbutamol 100mcg inhaler,200 doses"	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
45	Salbutamol 5mg/ml Respiratory solution 20ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
46	Salbutamol 2mg/5ml syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
47	Sodium valproate 200mg/5ml solution 300ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
48	Vit. Bco malt & Iron 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
49	Vit. Bco syrup 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
50	Adrenaline 1mg/1ml 1 amp	INJECTIONS & IV INFUSIONS	1
51	Aminophyllin 250mg/10ml inj. 1amps	INJECTIONS & IV INFUSIONS	1
52	Ampicillin 250mg inj 1Vial	INJECTIONS & IV INFUSIONS	1
53	Ampicillin 500mg inj 1Vial	INJECTIONS & IV INFUSIONS	1
54	Atropine 0.5mg/1ml inj amps	INJECTIONS & IV INFUSIONS	1
55	Benzathine penicillin 2.4mu vial	INJECTIONS & IV INFUSIONS	1
56	Benzylpenicillin 5M IU vial	INJECTIONS & IV INFUSIONS	1
57	Biperiden lactate 5mg/ml inj 5amps	INJECTIONS & IV INFUSIONS	1
58	"Bupivacain+ dextrose 5mg/80mg, 1ml, 10 amp"	INJECTIONS & IV INFUSIONS	1
59	Calcium Chloride 10% 10 amps	INJECTIONS & IV INFUSIONS	1
60	Calcium Gluconate 10% inj 10amps	INJECTIONS & IV INFUSIONS	1
61	Cefotaxime 1000mg inj 1 vial	INJECTIONS & IV INFUSIONS	1
62	Cefotaxime 500mg inj 1 vial	INJECTIONS & IV INFUSIONS	1
63	Ceftriaxone 1000mg inj 1 vial	INJECTIONS & IV INFUSIONS	1
64	Ceftriaxone 500mg inj 1 vial	INJECTIONS & IV INFUSIONS	1
65	Ceftriaxone 250mg inj 1 vial	INJECTIONS & IV INFUSIONS	1
66	Chlopromazine 50mg/2ml inj amps	INJECTIONS & IV INFUSIONS	1
67	Chloramphenicol 250mg vial	INJECTIONS & IV INFUSIONS	1
68	Cimetidine 200mg /1ml inj amps	INJECTIONS & IV INFUSIONS	1
69	Cloxacillin 250mg inj. 1vial	INJECTIONS & IV INFUSIONS	1
70	Dextrose 5% 200ml	INJECTIONS & IV INFUSIONS	1
71	Dextrose 5% + sodium chloride 0.9% 1000ml	INJECTIONS & IV INFUSIONS	1
72	Dextrose 5% 1000ml	INJECTIONS & IV INFUSIONS	1
73	Dextrose 50% 50ml	INJECTIONS & IV INFUSIONS	1
74	Dextrose 10% 1000ml	INJECTIONS & IV INFUSIONS	1
75	Dexamethasone 4mg/ml inj. Amp	INJECTIONS & IV INFUSIONS	1
76	Diazepam 10mg/ml 10amps	INJECTIONS & IV INFUSIONS	1
77	Diclofenac 75mg/3ml inj. 1amp	INJECTIONS & IV INFUSIONS	1
78	Digoxin 0.5mmg/2ml 5Amp	INJECTIONS & IV INFUSIONS	1
79	Dopamine 200mg/5ml 1vial	INJECTIONS & IV INFUSIONS	1
80	Fluconazole 2mg/ml iv 100ml	INJECTIONS & IV INFUSIONS	1
81	Fluphenazine 25mg/ml inj 5amps	INJECTIONS & IV INFUSIONS	1
82	Furosemide 20mg/2ml inj. Amp	INJECTIONS & IV INFUSIONS	1
83	Gentamycin 80mg/2ml inj. Amp	INJECTIONS & IV INFUSIONS	1
85	Haemaccel 3.5 % 500ml	INJECTIONS & IV INFUSIONS	1
86	Haloperidol 5mg/1ml inj 10amps	INJECTIONS & IV INFUSIONS	1
87	Hydrallazine 20mg/2ml inj. 5amps	INJECTIONS & IV INFUSIONS	1
88	Hydrocortisone 100mg inj 1vial	INJECTIONS & IV INFUSIONS	1
89	Hyoscine 20mg/ml inj.10amps	INJECTIONS & IV INFUSIONS	1
90	Lignocain Hcl 1% 20ml Inj. 1 vial	INJECTIONS & IV INFUSIONS	1
91	Lignocain Hcl 10% 50ml spray	INJECTIONS & IV INFUSIONS	1
92	Lignocain Hcl 2% 20ml inj. 1 vial	INJECTIONS & IV INFUSIONS	1
93	Lignocain Hcl 2% 50ml Inj. 1 vial	INJECTIONS & IV INFUSIONS	1
94	Magnesium Sulphate 25% inj amps	INJECTIONS & IV INFUSIONS	1
95	Magnesium Sulphate 50% inj amps	INJECTIONS & IV INFUSIONS	1
96	Mannithol 20% of 500ml	INJECTIONS & IV INFUSIONS	1
97	Metoclopramide 10mg/2ml inj. 10amps	INJECTIONS & IV INFUSIONS	1
98	Metoprolol inj 5amps	INJECTIONS & IV INFUSIONS	1
99	"Metronidazole 500mg,100ml IV inj."	INJECTIONS & IV INFUSIONS	1
100	Sodium chloride 0.45% 1000ml	INJECTIONS & IV INFUSIONS	1
101	Sodium chloride 0.9% 1000ml	INJECTIONS & IV INFUSIONS	1
102	Sodium chloride 0.9% 200ml 	INJECTIONS & IV INFUSIONS	1
103	Naloxon 0.4mg/ml inj.amp	INJECTIONS & IV INFUSIONS	1
104	Neostigmine 2.5mg/ml 10Amps	INJECTIONS & IV INFUSIONS	1
105	Pancronium 4mg/2ml inj 1amp	INJECTIONS & IV INFUSIONS	1
106	Phenobarbiton 130mg/ml inj amp	INJECTIONS & IV INFUSIONS	1
107	Potassium Chloride 15% amps	INJECTIONS & IV INFUSIONS	1
108	Procaine penicillin 3miu inj. Vial	INJECTIONS & IV INFUSIONS	1
109	Prochlorperazine 12.5mg/ml inj amps	INJECTIONS & IV INFUSIONS	1
110	Promethazine 25mg/1ml 10amps	INJECTIONS & IV INFUSIONS	1
111	Propofol 200mg/20ml 5 amp	INJECTIONS & IV INFUSIONS	1
112	Ringer Lactate 1000ml	INJECTIONS & IV INFUSIONS	1
113	Ringer Lactate 200ml	INJECTIONS & IV INFUSIONS	1
114	Salbutamol 0.5mg/ml 1amps	INJECTIONS & IV INFUSIONS	1
115	"Sodium Bicarbonate 8.5% , 50ml"	INJECTIONS & IV INFUSIONS	1
116	Thiopentone 500mg inj 1 amp	INJECTIONS & IV INFUSIONS	1
117	Vit. B12 10 Amps	INJECTIONS & IV INFUSIONS	1
118	Vit. B12 1vial	INJECTIONS & IV INFUSIONS	1
119	Vitamin B-complex inj vial	INJECTIONS & IV INFUSIONS	1
120	Vitamin K 10mg/ml inj. 1amps	INJECTIONS & IV INFUSIONS	1
121	vitamin k 2mg/0.2ml inj. 1amps	INJECTIONS & IV INFUSIONS	1
122	Water for inj. 10 ml 100	INJECTIONS & IV INFUSIONS	100
123	Aciclovir 200mg 25	TABLETS & CAPSULES	25
124	Aciclovir 200mg  30	TABLETS & CAPSULES	30
125	Aciclovir 200mg 100	TABLETS & CAPSULES	100
126	Aciclovir 800mg  10	TABLETS & CAPSULES	10
127	Activated charcoal 500g	TABLETS & CAPSULES	1
128	Albendazole  200mg   1000	TABLETS & CAPSULES	1000
129	Aminophyllin 100mg 1000	TABLETS & CAPSULES	1000
130	Amitriptyline 10mg 500	TABLETS & CAPSULES	500
131	Amitriptyline 25mg 1000	TABLETS & CAPSULES	1000
132	Amoxicillin 250mg 500	TABLETS & CAPSULES	500
133	Amoxicillin 250mg 1000	TABLETS & CAPSULES	1000
134	Amoxi-clav 375mg 15	TABLETS & CAPSULES	15
135	Amoxi-clav 625mg 15	TABLETS & CAPSULES	15
136	Amoxi-clav 1g	TABLETS & CAPSULES	1
137	Anti- Haemorrhodal 100	TABLETS & CAPSULES	100
138	Anusol Suppository 10	TABLETS & CAPSULES	10
139	Artane 2mg 100	TABLETS & CAPSULES	100
140	Acetyl-salicylic acid(A.S.A) 300mg 1000	TABLETS & CAPSULES	1000
141	Ascorbic acid 250mg 1000-Chewable	TABLETS & CAPSULES	1
142	Atenolol 100mg 100	TABLETS & CAPSULES	100
143	Atenolol 50mg 1000	TABLETS & CAPSULES	1000
144	Atenolol 50mg 100	TABLETS & CAPSULES	100
145	Bisacodyl 1000	TABLETS & CAPSULES	1000
146	Bisacodyl 5mg 100	TABLETS & CAPSULES	100
147	Calcium Gluconate 300mg 1000	TABLETS & CAPSULES	1000
148	Captopril 25mg 100	TABLETS & CAPSULES	100
149	Captopril 25mg 60	TABLETS & CAPSULES	60
150	Captopril 50mg 60	TABLETS & CAPSULES	60
151	Carbamazipine 200mg 1000	TABLETS & CAPSULES	1000
152	Child Growth Vitamins 360	TABLETS & CAPSULES	360
153	Chloramphenicol 250mg  1000	TABLETS & CAPSULES	1000
154	Chlordiazepoxide 10mg 1000	TABLETS & CAPSULES	1000
155	Chlorpheniramine 4mg 1000	TABLETS & CAPSULES	1000
156	Chlorpromazine 25mg 1000	TABLETS & CAPSULES	1000
157	Chlorpromazine 100mg 1000	TABLETS & CAPSULES	1000
158	Cimetidine 200mg 1000	TABLETS & CAPSULES	1000
159	Cimetidine 400mg 500	TABLETS & CAPSULES	500
160	Ciprofloxacin 500mg 10	TABLETS & CAPSULES	10
161	Clidinium/ Chlordiazepoxide 2.5/5mg	TABLETS & CAPSULES	1
162	Clomiphen 5tab	TABLETS & CAPSULES	1
163	Clotrimazole 100mg vaginal tablets 6	TABLETS & CAPSULES	6
164	Cloxacillin 250mg 1000	TABLETS & CAPSULES	1000
165	Co-trimoxazole 480mg 100	TABLETS & CAPSULES	100
166	Co-trimoxazole 480mg 1000	TABLETS & CAPSULES	1000
167	Co-trimoxazole 960mg  1000	TABLETS & CAPSULES	1000
168	Co-Trimoxazole 960mg  500	TABLETS & CAPSULES	500
169	Dapsone 100mg  100	TABLETS & CAPSULES	1
170	Dapsone 100mg  1000	TABLETS & CAPSULES	1
171	Diazepam 5mg 1000	TABLETS & CAPSULES	1
172	Diclofenac 25mg 1000	TABLETS & CAPSULES	1
173	Diclofenac 25mg 500	TABLETS & CAPSULES	1
174	Diclofenac 50mg 500	TABLETS & CAPSULES	1
175	Diclofenac 50 mg 1000	TABLETS & CAPSULES	1
176	Digoxin 0.25mg 1000	TABLETS & CAPSULES	1
177	Diphenoxylate- Atropine 2.5mg/0.25mg of 10	TABLETS & CAPSULES	1
178	Doxycycline 100mg 1000	TABLETS & CAPSULES	1
179	Ensure 400mg	TABLETS & CAPSULES	1
180	Erythromycin 250mg  1000	TABLETS & CAPSULES	1
182	Ferrous Salphate 75mg 1000	TABLETS & CAPSULES	1
183	Fluoxetine 20mg 14	TABLETS & CAPSULES	1
184	Fluoxetine 20mg  30	TABLETS & CAPSULES	1
185	Folic acid 5mg 1000	TABLETS & CAPSULES	1
186	Furosemide 40mg 1000	TABLETS & CAPSULES	1
187	Glibenclamide 5mg 500	TABLETS & CAPSULES	1
188	Glibenclamide 5mg 1000	TABLETS & CAPSULES	1
189	Griseofulvin 125mg 1000	TABLETS & CAPSULES	1
190	Griseofulvin 500mg 1000	TABLETS & CAPSULES	1
191	Haloperidol 1.5mg 60	TABLETS & CAPSULES	1
192	Haloperidol 1.5mg 100	TABLETS & CAPSULES	1
193	Haloperidol 5mg 100	TABLETS & CAPSULES	1
194	Haloperidol 5mg 30	TABLETS & CAPSULES	1
195	Hydrochlorthiazide 25mg 1000	TABLETS & CAPSULES	1
196	Hydrochlorthiazide 50mg + Amiloride 5mg 1000	TABLETS & CAPSULES	1
197	Hydrallazine 10mg 100	TABLETS & CAPSULES	1
198	Hyoscine 10mg 1000	TABLETS & CAPSULES	1
199	Ibuprofen 200mg 1000	TABLETS & CAPSULES	1
200	Ibuprofen 400mg 1000	TABLETS & CAPSULES	1
201	Indomethacin 100mg suppositrory 10	TABLETS & CAPSULES	1
202	Iodized throat lozenges  1000	TABLETS & CAPSULES	1
203	Isoniazid 100mg   60	TABLETS & CAPSULES	1
204	Itraconazole 100mg 28	TABLETS & CAPSULES	1
205	Ketoconazole 200mg 100	TABLETS & CAPSULES	1
206	Loperamide 2mg 6	TABLETS & CAPSULES	1
207	Loperamide 2mg 1000	TABLETS & CAPSULES	1
208	Magnesium Gluconate 550mg 100	TABLETS & CAPSULES	1
209	Magnesium Trisicate 1000	TABLETS & CAPSULES	1
210	Mebendazole 100mg 6	TABLETS & CAPSULES	1
211	Mebendazole 500mg 150	TABLETS & CAPSULES	1
212	Mefenamic Acid 250mg 250	TABLETS & CAPSULES	1
213	Mefenamic Acid 250mg 100	TABLETS & CAPSULES	1
214	Metformin 500mg 1000	TABLETS & CAPSULES	1
215	Metformin 500mg 500	TABLETS & CAPSULES	1
216	Metformin 850mg 100	TABLETS & CAPSULES	1
217	Metformin 850mg 500	TABLETS & CAPSULES	1
218	Methyldopa 250mg 1000	TABLETS & CAPSULES	1
219	Metochlopramide 10mg 1000	TABLETS & CAPSULES	1
220	Metochlopramide 10mg 500	TABLETS & CAPSULES	1
221	Metronidazole 200mg 500	TABLETS & CAPSULES	1
222	Metronidazole 200mg 1000	TABLETS & CAPSULES	1
223	Metronidazole 400mg 500	TABLETS & CAPSULES	1
224	Metronidazole 400mg  1000	TABLETS & CAPSULES	1
225	Multivitamin 1000	TABLETS & CAPSULES	1
226	Neurobion 50	TABLETS & CAPSULES	1
227	Nicotinamide 250mg  1000	TABLETS & CAPSULES	1
228	Nifedipine 5mg 100	TABLETS & CAPSULES	1
229	Nifedipine 10mg 100	TABLETS & CAPSULES	1
230	Nifedipine 10mg 1000	TABLETS & CAPSULES	1
231	Nitrofurantoin 100mg  1000	TABLETS & CAPSULES	1
232	"Nystatin 500,000IU oral tablets 100"	TABLETS & CAPSULES	1
233	"Nystatin 100,000IU vaginal tablets 100"	TABLETS & CAPSULES	1
234	"Nystatin 100,000IU vaginal tablets 14"	TABLETS & CAPSULES	1
235	Omeprazole 20mg 100	TABLETS & CAPSULES	1
236	Omeprazole 20mg 28	TABLETS & CAPSULES	1
237	Orphenadrine 50mg 100	TABLETS & CAPSULES	1
238	Paracetamol 500mg 100	TABLETS & CAPSULES	1
239	Paracetamol 500mg 1000	TABLETS & CAPSULES	1
240	Paracetomol + codeine 500mg/8mg 1000	TABLETS & CAPSULES	1
241	Paracetomol + codeine 500mg/8mg 500	TABLETS & CAPSULES	1
242	Phenobarbital 30mg 1000	TABLETS & CAPSULES	1
243	Phenobarbital 60mg 1000	TABLETS & CAPSULES	1
244	Phenoxymethyl penicillin 250mg 1000	TABLETS & CAPSULES	1
245	Phenytoin 100mg 100	TABLETS & CAPSULES	1
246	Phenytoin 100mg 1000	TABLETS & CAPSULES	1
247	Potassium chloride 600mg 500	TABLETS & CAPSULES	1
248	Prednisone 5mg 1000	TABLETS & CAPSULES	1
249	Prenatal tabs 360	TABLETS & CAPSULES	1
250	Prochlorperazine 5mg 250	TABLETS & CAPSULES	1
251	Prochlorperazine 5mg 500	TABLETS & CAPSULES	1
252	Promethazine 25mg 1000	TABLETS & CAPSULES	1
253	Propranolol 40mg 1000	TABLETS & CAPSULES	1
254	pyridoxine 25mg 1000	TABLETS & CAPSULES	1
255	Pyridoxine 50mg 1000	TABLETS & CAPSULES	1
256	Rifampicin 150mg  100	TABLETS & CAPSULES	1
257	Salbutamol 4mg 1000	TABLETS & CAPSULES	1
258	Sodium Valproate 200mg 40	TABLETS & CAPSULES	1
259	Sodium valproate 200mg 100	TABLETS & CAPSULES	1
260	Sodium valproate 500mg 100	TABLETS & CAPSULES	1
261	Spironolactone 25mg 200	TABLETS & CAPSULES	1
262	Spironolactone 25mg 30	TABLETS & CAPSULES	1
263	Thiamine 100mg 100	TABLETS & CAPSULES	1
264	Thioridazine  25mg 500	TABLETS & CAPSULES	1
265	Trifluperazine 5 mg 1000	TABLETS & CAPSULES	1
266	Thyroxine 50 mcg 100	TABLETS & CAPSULES	1
267	Thyroxine 100 mcg 100	TABLETS & CAPSULES	1
268	Hydrochlorthiazide 50mg + Potassium chloride 300mg 1000	TABLETS & CAPSULES	1
269	Vitamin A 500 000	TABLETS & CAPSULES	1
270	Vitamin A 200 000	TABLETS & CAPSULES	1
271	Vitamin Bcomplex 1000	TABLETS & CAPSULES	1
272	Warfarin 5mg 100	TABLETS & CAPSULES	1
273	Arachis Oil 20ml	EYE & EAR PREPARATIONS	1
274	Chloramphenicol 5% ear drops 10ml	EYE & EAR PREPARATIONS	1
275	Chloramphenicol 0.5% eye drops 10ml	EYE & EAR PREPARATIONS	1
276	FML-Neo eye drops  5ml	EYE & EAR PREPARATIONS	1
277	Oxymetazoline 0.05% nasal drops 20ml	EYE & EAR PREPARATIONS	1
278	Oxymetazoline 0.025% nasal drops 10ml	EYE & EAR PREPARATIONS	1
279	Spesallerge eye drops 15ml	EYE & EAR PREPARATIONS	1
280	Tetracycline 1% eye ointment 5gm	EYE & EAR PREPARATIONS	1
281	Aciclovir 5% cream 10g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
282	Aqueous cream  500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
283	Benzyl benzoate lotion  100ml	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
284	Betamethasone 0.1% cream 500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
285	Calamine Lotion 100ml	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
286	Cidex solution   5L	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
287	Clotrimazole 1% topical cream 20g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
288	Clotrimazole 1% vaginal cream 50g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
289	Emulsifying ointment  500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
290	Eusol solution 2.5l	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
291	Gentian violet paint solution  20ml	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
292	Hand Sanitizer 5l	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
293	Hydrocortisone 1% cream 500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
294	Hydrogen per oxide 2.5 L	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
295	Ichthamol 10% ointment 500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
296	K-Y lubricating jelly  100g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
297	Mercurochrome solution  20ml	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
298	Methyl salicylate 10% ointment 500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
299	Methylated spirit  5L	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
300	Methylated spirit  2.5 L	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
301	Nitrofurazone 0.2% ointment 500gm	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
302	Nystatin 100000 IU ointment 30g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
303	Podophyllin paint solution 15ml	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
304	Povidone iodine 10mg/ml ointment 500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
305	Povidone iodine 10% solution 500ml	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
306	Remicaine jelly  20ml	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
307	Savlon solution  5L	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
308	Silver sulphadiazine 1% cream 500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
309	Sulphur ointment  500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
310	Tetracycline 3% Ointment 25g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
311	Ultra sound gel  5L	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
312	Whitefield's ointment 500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
313	Zinc oxide cream  500g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
314	Ultracide 5L	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
315	Insulin Actraphane 100IU/ml inj. 1 vial	FRIDGE-LINE PREPARATIONS	1
316	Insulin Actrapid inj. 1 vial	FRIDGE-LINE PREPARATIONS	1
317	Anti-D inj amp	FRIDGE-LINE PREPARATIONS	1
318	Anti-rabbies 2.5IU vaccine vial	FRIDGE-LINE PREPARATIONS	1
319	Ergometrine 0.5mg/ml inj 10 amp	FRIDGE-LINE PREPARATIONS	1
320	I-stat chem 8 + cartriage 25	FRIDGE-LINE PREPARATIONS	1
321	Chem8+ cartriage 25	FRIDGE-LINE PREPARATIONS	1
322	Oxytocin 10IU/ml inj.amps	FRIDGE-LINE PREPARATIONS	1
323	Protaphane inj. 1 vial	FRIDGE-LINE PREPARATIONS	1
324	Suxamethonium 100mg/2ml inj of 10	FRIDGE-LINE PREPARATIONS	1
325	Ambubag neonate	MEDICAL SUPPLIES	1
326	Ambubag child	MEDICAL SUPPLIES	1
327	Ambubag adult	MEDICAL SUPPLIES	1
328	Abdominal Swab 25	MEDICAL SUPPLIES	1
329	Adult weight scale	MEDICAL SUPPLIES	1
330	Adult Air way tube	MEDICAL SUPPLIES	1
331	Adjustable stiff neck collar	MEDICAL SUPPLIES	1
332	Anti-microbial Large roll dress	MEDICAL SUPPLIES	1
333	Burretrol 150ml infusion 	MEDICAL SUPPLIES	1
334	Indicator tape roll 12mm	MEDICAL SUPPLIES	1
335	Alcohol swab 200	MEDICAL SUPPLIES	1
336	Baby Scale hanging	MEDICAL SUPPLIES	1
337	Baby Scale holder	MEDICAL SUPPLIES	1
338	Blood Administration Set 10 drops	MEDICAL SUPPLIES	1
339	Blood Administration Set 20 drops	MEDICAL SUPPLIES	1
340	Bp Cuff Adult	MEDICAL SUPPLIES	1
341	Bp Cuff Child	MEDICAL SUPPLIES	1
342	BSN Elastoplaster 10cm 12	MEDICAL SUPPLIES	1
343	BSN Elastoplaster 5cm 12	MEDICAL SUPPLIES	1
344	BSN Elastoplaster 7.5cm 12	MEDICAL SUPPLIES	1
345	Cather 2 way FG12 10	MEDICAL SUPPLIES	1
346	Cather 2 way FG14 10	MEDICAL SUPPLIES	1
347	Cather 2 way FG16 10	MEDICAL SUPPLIES	1
348	Cather 2 way FG18 10	MEDICAL SUPPLIES	1
349	Chest Drainage kit	MEDICAL SUPPLIES	1
350	Colostomy bag 30	MEDICAL SUPPLIES	1
351	Cotton Bandage 7.5cm*5m 12's	MEDICAL SUPPLIES	1
352	Condom catheter Medium	MEDICAL SUPPLIES	1
353	Condom catheter large	MEDICAL SUPPLIES	1
354	Cotton wool 500g roll	MEDICAL SUPPLIES	1
355	Counting Tray	MEDICAL SUPPLIES	1
356	Crepe bandage  50mm 12	MEDICAL SUPPLIES	1
357	Crepe bandage  75mm 12	MEDICAL SUPPLIES	1
358	Crepe bandage 100mm 12	MEDICAL SUPPLIES	1
359	Crepe bandage 150mm 12	MEDICAL SUPPLIES	1
360	Delivery pack	MEDICAL SUPPLIES	1
362	Digital Blood presure machine	MEDICAL SUPPLIES	1
363	Digital Thermometer	MEDICAL SUPPLIES	1
364	Disposable solid adult return electrode	MEDICAL SUPPLIES	1
365	Dust musks 20	MEDICAL SUPPLIES	1
366	ECG Electrodes	MEDICAL SUPPLIES	1
367	Endotracheal tube size 6	MEDICAL SUPPLIES	1
368	Endotracheal tube size 6.5	MEDICAL SUPPLIES	1
370	Endotracheal tube size 7	MEDICAL SUPPLIES	1
371	Endotracheal tube size 7.5	MEDICAL SUPPLIES	1
372	Examination glove large 100 powdered	MEDICAL SUPPLIES	1
373	Examination glove large 100 non powdered	MEDICAL SUPPLIES	1
374	Examination glove medium 100 powdered	MEDICAL SUPPLIES	1
375	Examination glove medium 100 non powdered	MEDICAL SUPPLIES	1
376	Examination glove small 100 powdered	MEDICAL SUPPLIES	1
377	Examination glove small 100 non powdered	MEDICAL SUPPLIES	1
378	Fabric plaster strips 30	MEDICAL SUPPLIES	1
379	Feeding tube 2fr	MEDICAL SUPPLIES	1
380	Feeding tube 5fr	MEDICAL SUPPLIES	1
381	Feeding tube 6fr	MEDICAL SUPPLIES	1
382	Feeding tube 8fr	MEDICAL SUPPLIES	1
383	Feeding tube 10fr	MEDICAL SUPPLIES	1
384	Feeding tube 16fr	MEDICAL SUPPLIES	1
385	Fetal Stetescope	MEDICAL SUPPLIES	1
386	Gauze Bandage 10cm*4cm 12	MEDICAL SUPPLIES	1
387	Gauze Bandage 10cm*4.5m 12	MEDICAL SUPPLIES	1
388	Gauze Bandage 15cm*4cm 12	MEDICAL SUPPLIES	1
389	Gauze Bandage 15cm 12	MEDICAL SUPPLIES	1
390	Gauze Bandage 5cm*4cm 12	MEDICAL SUPPLIES	1
391	Gauze Bandage 7.5cm*2.7m * 12	MEDICAL SUPPLIES	1
392	Gauze swab 5cm of 12	MEDICAL SUPPLIES	1
393	Dispersion wound dressing 	MEDICAL SUPPLIES	1
394	Gauze roll 90cm* 100m	MEDICAL SUPPLIES	1
395	Gauze swabs 100*100*8ply 100	MEDICAL SUPPLIES	1
396	Hcg test strips 25	MEDICAL SUPPLIES	1
397	I.v cannulae 16G 	MEDICAL SUPPLIES	1
398	I.v cannulae 18G	MEDICAL SUPPLIES	1
399	I.v cannulae 20G	MEDICAL SUPPLIES	1
400	I.v cannulae 22G	MEDICAL SUPPLIES	1
401	I.v cannulae 24G	MEDICAL SUPPLIES	1
402	Infrared Forheaad thermometer	MEDICAL SUPPLIES	1
403	Insulin syringe 1ml 100	MEDICAL SUPPLIES	1
404	Under cast pedding  5cm	MEDICAL SUPPLIES	1
405	Linen Saver 1.5m*1m 8ply 100	MEDICAL SUPPLIES	1
406	Linen Saver 1.5m*1m 8ply 200	MEDICAL SUPPLIES	1
407	Manual Blood Pressure machine child	MEDICAL SUPPLIES	1
408	Medicine Bottle 100ml 	MEDICAL SUPPLIES	1
409	Medicine Cups	MEDICAL SUPPLIES	1
410	Medicine labels roll	MEDICAL SUPPLIES	1
411	Micro Volume extension Set 	MEDICAL SUPPLIES	1
412	Molicare nappy Disposible Large 30	MEDICAL SUPPLIES	1
413	Molicare nappy Disposible medium 30	MEDICAL SUPPLIES	1
414	N100 masks Medium	MEDICAL SUPPLIES	1
415	N100 masks Small	MEDICAL SUPPLIES	1
416	N95 Masks  20	MEDICAL SUPPLIES	1
417	Needle 15G  100	MEDICAL SUPPLIES	1
418	Needle 18G  100	MEDICAL SUPPLIES	1
419	Needle 20G  100	MEDICAL SUPPLIES	1
420	Needle 21G 100	MEDICAL SUPPLIES	1
421	Needle 23G 100	MEDICAL SUPPLIES	1
422	Needle 27G	MEDICAL SUPPLIES	1
423	Neubulizer Machine	MEDICAL SUPPLIES	1
424	Neubulizer masks (adult)	MEDICAL SUPPLIES	1
425	Neubulizer masks (peads)	MEDICAL SUPPLIES	1
426	NG tubes 10fr	MEDICAL SUPPLIES	1
427	NG tubes 12fr	MEDICAL SUPPLIES	1
428	NG Tubes 14Fr	MEDICAL SUPPLIES	1
429	NG tubes 16fr	MEDICAL SUPPLIES	1
430	Ointment jars  15gm 100	MEDICAL SUPPLIES	1
431	Ointment jars 30gm 200	MEDICAL SUPPLIES	1
432	Ointments label 1roll	MEDICAL SUPPLIES	1
433	One Touch Select strips 50	MEDICAL SUPPLIES	1
434	optium exceed free style Glucometer machine	MEDICAL SUPPLIES	1
435	Optium exceed free style Glucometermachine of 50 strip	MEDICAL SUPPLIES	1
436	Ophtalmoscope 	MEDICAL SUPPLIES	1
437	OrthoPaedic Padding 10cm 12	MEDICAL SUPPLIES	1
438	OrthoPaedic Padding 15cm 12	MEDICAL SUPPLIES	1
439	OrthoPaedic Padding 20cm 12	MEDICAL SUPPLIES	1
440	OrthoPaedic Padding 5cm 12	MEDICAL SUPPLIES	1
441	OrthoPaedic Padding 7.5cm 12	MEDICAL SUPPLIES	1
442	Otoscope	MEDICAL SUPPLIES	1
443	Oxygen finger sensor	MEDICAL SUPPLIES	1
444	Oxygen masks adult	MEDICAL SUPPLIES	1
445	Oxygen masks paeds	MEDICAL SUPPLIES	1
446	P.O.P Bandage 100mm roll	MEDICAL SUPPLIES	1
447	P.O.P Bandage 150mm roll	MEDICAL SUPPLIES	1
448	P.O.P Bandage 200mm roll	MEDICAL SUPPLIES	1
449	P.O.P Bandage 50mm roll	MEDICAL SUPPLIES	1
450	P.O.P Bandage 75mm roll	MEDICAL SUPPLIES	1
451	Paraffin Gauze Dressing 10's	MEDICAL SUPPLIES	1
452	Patients Cooler Bags	MEDICAL SUPPLIES	1
453	Peak flow meter	MEDICAL SUPPLIES	1
454	Pill bags large  1000	MEDICAL SUPPLIES	1
455	Pill bags medium  1000	MEDICAL SUPPLIES	1
456	pill bags small 1000	MEDICAL SUPPLIES	1
457	Plain  Labels  roll	MEDICAL SUPPLIES	1
458	Sanitary pads 12	MEDICAL SUPPLIES	1
459	Sharp Container  10l	MEDICAL SUPPLIES	1
460	shrouds large	MEDICAL SUPPLIES	1
461	Shrouds medium	MEDICAL SUPPLIES	1
462	Silcon birth vaccume cup	MEDICAL SUPPLIES	1
463	Solo Shot 1ml 200's	MEDICAL SUPPLIES	1
464	Solution Admin set 20drops	MEDICAL SUPPLIES	1
465	Solution Admin set 60drops	MEDICAL SUPPLIES	1
466	Spinal needle 22fg 50	MEDICAL SUPPLIES	1
467	Sterile dressing pack	MEDICAL SUPPLIES	1
468	Sterile foil baby bunting	MEDICAL SUPPLIES	1
469	"Sterilizing bag size 9, 1000"	MEDICAL SUPPLIES	1
470	Sterilizing bag size 11 500	MEDICAL SUPPLIES	1
471	Sterilizing bag size 13 1000	MEDICAL SUPPLIES	1
472	stockinet tubular size 3	MEDICAL SUPPLIES	1
473	stockinet tubular size 4	MEDICAL SUPPLIES	1
474	stockinet tubular size 6	MEDICAL SUPPLIES	1
475	Stomach tubes 10 FR	MEDICAL SUPPLIES	1
476	Stomach tubes 14 FR	MEDICAL SUPPLIES	1
477	Stomach tubes 16 FR	MEDICAL SUPPLIES	1
478	Stomach tubes 18FR	MEDICAL SUPPLIES	1
479	Suction Vaccume Pump	MEDICAL SUPPLIES	1
480	surgical Blade 15 100	MEDICAL SUPPLIES	1
481	Surgical Blade 18 100	MEDICAL SUPPLIES	1
482	Surgical Blade 20 100	MEDICAL SUPPLIES	1
483	Surgical Blade 21 100	MEDICAL SUPPLIES	1
484	Surgical Blade 22 100	MEDICAL SUPPLIES	1
485	Surgical Blade 24 100	MEDICAL SUPPLIES	1
486	Surgical glove size 6 powdered pairs	MEDICAL SUPPLIES	1
487	Surgical glove size 6.5 powder free pairs	MEDICAL SUPPLIES	1
488	Surgical Glove size 8.5 powdered pairs	MEDICAL SUPPLIES	1
489	Surgical glove size 7 powder free pairs	MEDICAL SUPPLIES	1
490	Surgical glove size 7.5 powder free pairs	MEDICAL SUPPLIES	1
491	Surgical glove size 7.5 powdered pairs	MEDICAL SUPPLIES	1
492	Surgical glove size 8 powdered pairs	MEDICAL SUPPLIES	1
493	Surgical glove size 8 powder free pairs	MEDICAL SUPPLIES	1
494	Surgical mask 50 pcs	MEDICAL SUPPLIES	1
495	Surgical paper Tape 75mm roll	MEDICAL SUPPLIES	1
496	Syringe 2ml 100	MEDICAL SUPPLIES	1
497	Syringe 3ml 100	MEDICAL SUPPLIES	1
498	Syringe 5ml 100	MEDICAL SUPPLIES	1
499	Syringe 10ml 100	MEDICAL SUPPLIES	1
500	Syringe 12ml 80	MEDICAL SUPPLIES	1
501	Syringe 20ml 50	MEDICAL SUPPLIES	1
502	Syringe 30ml 10	MEDICAL SUPPLIES	1
503	Syringe 60ml 25	MEDICAL SUPPLIES	1
504	Syringe with whook	MEDICAL SUPPLIES	1
505	Tablet Vial 100ml	MEDICAL SUPPLIES	1
506	Thoracic Catheter FG 26	MEDICAL SUPPLIES	1
507	Thoracic Catheter FG 27	MEDICAL SUPPLIES	1
508	Thoracic Catheter FG 28	MEDICAL SUPPLIES	1
509	Torniquoate 	MEDICAL SUPPLIES	1
510	Tounge Depressor wooden 100	MEDICAL SUPPLIES	1
511	Trianguler Bandage 12's	MEDICAL SUPPLIES	1
512	"True Red test strip, 50"	MEDICAL SUPPLIES	1
513	True Red Machine	MEDICAL SUPPLIES	1
514	Umblical cord clamps 	MEDICAL SUPPLIES	1
515	Urine bag 2 littre	MEDICAL SUPPLIES	1
516	Vaginal specular large Disposable	MEDICAL SUPPLIES	1
517	Vaginal specular large Metalic	MEDICAL SUPPLIES	1
518	Vaginal Specular medium Disposable	MEDICAL SUPPLIES	1
519	Vaginal specular medium metalic	MEDICAL SUPPLIES	1
520	Vaginal Specular small disposable	MEDICAL SUPPLIES	1
521	Vaginal specular small metalic	MEDICAL SUPPLIES	1
522	X-  Ray casette  35*35cm   1	MEDICAL SUPPLIES	1
523	X- Ray casette 35*43cm   1	MEDICAL SUPPLIES	1
524	X- Ray film 24*30cm  100	MEDICAL SUPPLIES	1
525	X- Ray film 35*43cm  100	MEDICAL SUPPLIES	1
526	x-Ray film 18*24cm 100	MEDICAL SUPPLIES	1
527	X- Ray fixer 1 box	MEDICAL SUPPLIES	1
528	X-Ray Developer 1box	MEDICAL SUPPLIES	1
529	X-Ray Envelop large	MEDICAL SUPPLIES	1
530	Zinc oxide Tape 2.5 cm roll	MEDICAL SUPPLIES	1
531	Zinc oxide tape 5cm roll	MEDICAL SUPPLIES	1
532	Zinc oxide Plaster 75mm roll	MEDICAL SUPPLIES	1
533	Zinc Oxide Tape 10cm 1roll	MEDICAL SUPPLIES	1
534	Chromic cut gut Reverse cuttting 2/0 12	SUTURES	1
535	Chromic cut gut Reverse cuttting 3/0 12	SUTURES	1
536	Chromic cut gut Reverse cutting 1 12	SUTURES	1
537	Chromic cut gut Reverse cutting 2 12	SUTURES	1
538	Nylon reverse cut 1 12	SUTURES	1
539	Nylon reverse cut 1/0   12	SUTURES	1
540	Nylon reverse cut 2/0   12	SUTURES	1
541	Polyswab 6/0  36	SUTURES	1
542	Silk conventional cutting 0 12	SUTURES	1
543	Silk conventional cutting 1  12	SUTURES	1
544	Silk conventional cutting 2/0 12	SUTURES	1
545	Vicryl  1   12	SUTURES	1
546	Vicryl  2  12	SUTURES	1
547	Vicryl  3/0   12	SUTURES	1
548	Vicryl 2/0   12	SUTURES	1
549	Pethidine 100mg/2ml 10	HABIT FORMING itemS	1
550	Pethidine 50mg/2ml 1	HABIT FORMING itemS	1
551	Fentanyl 100mcg/2ml of 10	HABIT FORMING itemS	1
552	Ephedrine 50mg/ml of 10	HABIT FORMING itemS	1
553	ketamine 10mg/ml inj. 10	HABIT FORMING itemS	1
554	ketamine 50mg/ml inj. vial	HABIT FORMING itemS	1
555	Morphin 30mg of 30 tabs	HABIT FORMING itemS	1
556	3TC 150mg   60	ARV'S PREPARATIONS	1
557	ABC/3TC 600/300 mg	ARV'S PREPARATIONS	1
558	ABC 300mg 60	ARV'S PREPARATIONS	1
559	ABC 60mg 60	ARV'S PREPARATIONS	1
560	AZT/3TC 300mg/150mg 60	ARV'S PREPARATIONS	1
561	AZT/3TC/NVP 300mg/150mg/200mg 60	ARV'S PREPARATIONS	1
562	AZT/3TC 30mg/60 mg 60	ARV'S PREPARATIONS	1
563	EFV 200MG 90	ARV'S PREPARATIONS	1
564	EFV 50mg 30	ARV'S PREPARATIONS	1
565	EFV 600mg  30	ARV'S PREPARATIONS	1
566	KALTRA 200/50mg  120	ARV'S PREPARATIONS	1
567	NVP 200mg   60	ARV'S PREPARATIONS	1
568	TDF/3TC 300/300mg   30	ARV'S PREPARATIONS	1
569	TDF/3TC/EFV 300/300/600mg  30	ARV'S PREPARATIONS	1
570	Depo provera 150mg inj. 1 vial	FAMILY PLANING PREPARATIONS	1
571	Levonorgestrel (Emergency pill) 0.75mg 2	FAMILY PLANING PREPARATIONS	1
572	Female condoms	FAMILY PLANING PREPARATIONS	1
573	Jadelle Implant 10	FAMILY PLANING PREPARATIONS	1
574	Jadelle insertion set 10	FAMILY PLANING PREPARATIONS	1
575	Levonogestrel IUCD	FAMILY PLANING PREPARATIONS	1
576	Male condoms 144	FAMILY PLANING PREPARATIONS	1
577	Male condoms 100	FAMILY PLANING PREPARATIONS	1
578	Microgynone 3*28	FAMILY PLANING PREPARATIONS	1
579	Microval 1*28	FAMILY PLANING PREPARATIONS	1
580	Noristerate 200mg/ml inj 1amp	FAMILY PLANING PREPARATIONS	1
581	Aciclovir 200 mg 100 	NTP consignment 	1
582	Alcohol swab 200	NTP consignment 	1
583	Aminophyllin 100mg 1000	NTP consignment 	1
584	Amoxi-clav 375mg 15	NTP consignment 	1
585	Amoxi-clav 625mg 15	NTP consignment 	1
586	Amoxicillin 250 mg 1000	NTP consignment 	1
587	Magnesium Trisilicate 100ml	NTP consignment 	1
588	Beclomethasone 50mcg inhaler	NTP consignment 	1
589	Captopril 25mg 60	NTP consignment 	1
590	Cefotaxime 1000mg inj 1 vial	NTP consignment 	1
591	Chlorpheniramine 4mg 1000	NTP consignment 	1
592	Chlorpromazine 50mg/2ml of 10 amp	NTP consignment 	1
593	Diclofenac 25mg 500	NTP consignment 	1
594	Diclofenac 50mg 500	NTP consignment 	1
595	Doxycycline 100mg 1000	NTP consignment 	1
596	Ferrous Sulfate 75mg 1000	NTP consignment 	1
597	Fluoxetine 20mg 30	NTP consignment 	1
598	Water for inj. 10 ml 100	NTP consignment 	1
599	Hydrochlorthiazide 25mg 1000	NTP consignment 	1
600	Hydrocortisone 100mg inj 1 vial	NTP consignment 	1
601	Ibuprofen 400mg 1000	NTP consignment 	1
602	Isoniazid 100mg   1000	NTP consignment 	1
603	I.v cannulae 20G	NTP consignment 	1
604	Diphenoxylate- Atropine 2.5mg/0.25mg of 10	NTP consignment 	1
605	Linen Saver 1.5m*1m 8ply 200	NTP consignment 	1
606	Metformin 850 mg 500	NTP consignment 	1
607	Metformin 850 mg  100	NTP consignment 	1
608	Metoclopramide 10mg of 500	NTP consignment 	1
609	"Metronidazole 500mg,100ml IV inj."	NTP consignment 	1
610	Needle 21G 100	NTP consignment 	1
611	Needle 23G 100	NTP consignment 	1
612	Nifedipine 10mg 100	NTP consignment 	1
613	Omeperazole 20mg 28	NTP consignment 	1
614	Paracetamol 500mg 1000	NTP consignment 	1
617	Potassium chloride 600mg 500	NTP consignment 	1
618	Promethazine 25mg 1000	NTP consignment 	1
619	Promethazine 25mg 1000	NTP consignment 	1
620	Pyridoxine 50mg 1000	NTP consignment 	1
621	Dextrose 5% 1000ml	NTP consignment 	1
622	Ringers Lactate 1000ml	NTP consignment 	1
623	Salbutamol 4mg 1000	NTP consignment 	1
624	"Salbutamol 100mcg inhaler,200 doses"	NTP consignment 	1
625	Sodium chloride 0.9% 1000ml	NTP consignment 	1
626	"Sodium Bicarbonate 8.5% , 50ml"	NTP consignment 	1
627	Syringe 5ml 100	NTP consignment 	1
628	Syringe 10ml 100	NTP consignment 	1
629	Urine bag 2 littre	NTP consignment 	1
630	Disposable nappies large of 14	NTP consignment 	1
631	Examination glove medium 100 powdered	NTP consignment 	1
632	Kanamycin 1g/4ml injection	GLC	1
633	Capriomycin1g injection	GLC	1
634	Levofloxacin 250mg tab	GLC	1
635	Levofloxacin 500mg tabs	GLC	1
636	Moxifloxacin 400mg	GLC	1
637	Prothionamide 250mg tabs	GLC	1
638	Cycloserine 250mg	GLC	1
639	Paser 4mg Granules	GLC	1
640	Parazinamide 400mg	GLC	1
641	Under Buttock drape with pouch	MEDICAL SUPPLIES	1
642	Vicryl Taper Heavy 1 of 12	SUTURES	1
643	Imipramine 25mg 1000	TABLETS & CAPSULES	1
644	Oral Rehydration salts 200 sacchet	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
645	Fluconazole 200mg 28	TABLETS & CAPSULES	1
646	Isosorbide 30mg Tablet 50	TABLETS & CAPSULES	1
647	Captopril 50mg 30	TABLETS & CAPSULES	1
648	Tetracycline 3% 15g	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
649	"Nystatin 100,000 IU/ml oral susp. 20ml"	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
650	Copper T	FAMILY PLANING PREPARATIONS	1
652	Resperidone 1mg 30	TABLETS & CAPSULES	1
654	Thyroxine 100 mcg 100	NTP consignment 	1
655	Syringe 3ml 100	NTP consignment 	1
656	Folic acid 5mg 1000	NTP consignment 	1
657	Ceftriaxone 1000mg inj 1 vial	NTP consignment 	1
658	Ceftriaxone 1000mg inj 1 vial	NTP consignment 	1
659	Chlorhexidine 0.2% mouth wash 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
660	Needle 18G 100	NTP consignment 	1
661	Manual Blood Pressure machine adult	MEDICAL SUPPLIES	1
662	Pyridoxine 25mg 1000	NTP consignment 	1
663	EFV 200mg 30	ARV'S PREPARATIONS	1
664	Spironolactone 25mg 100	TABLETS & CAPSULES	1
665	Thioridazine 25mg 100	TABLETS & CAPSULES	1
666	"Povidone Iodine 10mg/ml Solution, 1000ML"	"TOPICAL CREAM,LOTION,OINTMENT & SOLUTION PREPARATIONS"	1
667	Fabric plaster 10	MEDICAL SUPPLIES	1
668	Catheter 2 way FG 16 30ml 10	MEDICAL SUPPLIES	1
669	Catheter 2 way FG 16 5ml 10	MEDICAL SUPPLIES	1
670	Isoniazide 300mg 1000	NTP consignment 	1
671	Elbow length surgical glove size 6.5 pairs 	MEDICAL SUPPLIES	1
672	Elbow length surgical glove size 8.5 pairs 	MEDICAL SUPPLIES	1
673	Co-trimoxazole 240mg/5ml susp. 100ml	ARV'S PREPARATIONS	1
674	Microlut 1*28	FAMILY PLANING PREPARATIONS	1
675	Promethazine 25mg/ml inj 10	NTP consignment 	1
676	Microlut 3*35	FAMILY PLANING PREPARATIONS	1
677	Ciprofloxacin 500mg 100	TABLETS & CAPSULES	1
678	potassium chloride 600mg 1000	TABLETS & CAPSULES	1
680	Sodium valporate200mg/5ml 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
681	Phenoxymethylpenicillin 250mg 100	TABLETS & CAPSULES	1
682	Surgical glove size 7 powdered pairs	MEDICAL SUPPLIES	1
683	Chromic cutgut 1 TH 40mm 12 	MEDICAL SUPPLIES	1
684	Vicryl TH 1 40mm 12	SUTURES	1
685	Vicryl TH 2 40mm 12	SUTURES	1
686	Resperidone 1mg 50	TABLETS & CAPSULES	1
687	Tdf/3tc/Nvp 300/300/200mg 30/60	ARV'S PREPARATIONS	1
688	Amoxi-clav 1g 10	TABLETS & CAPSULES	1
689	Potasium citrate 30% mixture 100ml	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
690	Molicar nappy disposable large 14	MEDICAL SUPPLIES	1
691	Potassium chloride 600mg 100	TABLETS & CAPSULES	1
692	Dextrose 50% 20ml inj Amp	INJECTIONS & IV INFUSIONS	1
693	ABC/3TC 60/30mg 60	ARV'S PREPARATIONS	1
694	Magnisium Tricillicate  200ml 	NTP consignment 	1
695	Diclofenac 50mg 1000	NTP consignment 	1
696	Diclofenac 75mg/3ml	NTP consignment 	1
697	Magnesium sulphate 50% 10 1g/2ml	NTP consignment 	1
698	Paracitamol 500mg 100	NTP consignment 	1
699	Potasium chlorite 600mg 100	NTP consignment 	1
700	Enalapril 10mg 100	TABLETS & CAPSULES	1
701	Metformin 850mg 1000	TABLETS & CAPSULES	1
702	Elbow length 7.5 powderfree surgical glove	MEDICAL SUPPLIES	1
703	Elbow length 7.5 powderfree surgical glove	MEDICAL SUPPLIES	1
704	Metoclopramide 5mg/5ml 50ml syrup	"SYRUPS, MIXTURE, SUSPENSIONS ETC"	1
705	Imipramine 25mg 50	TABLETS & CAPSULES	1
706	Imipramine 25mg 50	TABLETS & CAPSULES	1
707	Ferrimed Iron injection 100mg/2ml 1amps	INJECTIONS & IV INFUSIONS	1
708	Iron Ferrimed injection 100mg/2ml 1amps	INJECTIONS & IV INFUSIONS	1
709	Omeprazole 20mg 80 NTP	TABLETS & CAPSULES	1"""

    # for line in d.split('\n'):
    #   e = line.split('\t')
    #   i = Item.objects.get(id=int(e[0]))
    #   i.dispense_size = int(e[3])
    #   i.save()

    for sc in StockChange.objects.filter(location__location_type="D"):
      sc.qty = sc.itemlot.item.dispense_size * sc.qty 
      sc.save()