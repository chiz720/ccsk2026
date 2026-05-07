const CCSK_SESSIONS = [
  // ── PRE-CONFERENCE: Wednesday 13 May 2026 ──────────────────────────────
  { id:1,  date:'2026-05-13', startTime:'08:00', endTime:'08:30', title:'Registration', speaker:'', track:'all', type:'Registration', room:'Main Lobby' },

  { id:2,  date:'2026-05-13', startTime:'08:30', endTime:'10:00', title:'Airway Management (AM) Workshop', speaker:'Dr Kevin Umani & Dr Charles Kabetu', track:'A', type:'Workshop', room:'Victoria Hall 1' },
  { id:3,  date:'2026-05-13', startTime:'08:30', endTime:'10:00', title:'Point of Care Ultrasound (POCUS) Workshop', speaker:'Dr Susan Mutahi & Dr Romeo Wahome', track:'B', type:'Workshop', room:'Victoria Hall 2' },
  { id:4,  date:'2026-05-13', startTime:'08:30', endTime:'10:00', title:'Advanced Mechanical Ventilation (AMV) Workshop', speaker:'Dr Idris Chikophe & Dr Sally Getugi', track:'C', type:'Workshop', room:'Victoria Hall 3' },

  { id:5,  date:'2026-05-13', startTime:'10:00', endTime:'10:30', title:'Tea Break', speaker:'', track:'all', type:'Coffee', room:'' },

  { id:6,  date:'2026-05-13', startTime:'10:30', endTime:'13:00', title:'Airway Management (AM) Workshop (continued)', speaker:'Dr Kevin Umani & Dr Charles Kabetu', track:'A', type:'Workshop', room:'Victoria Hall 1' },
  { id:7,  date:'2026-05-13', startTime:'10:30', endTime:'13:00', title:'Point of Care Ultrasound (POCUS) Workshop (continued)', speaker:'Dr Susan Mutahi & Dr Romeo Wahome', track:'B', type:'Workshop', room:'Victoria Hall 2' },
  { id:8,  date:'2026-05-13', startTime:'10:30', endTime:'13:00', title:'Advanced Mechanical Ventilation (AMV) Workshop (continued)', speaker:'Dr Idris Chikophe & Dr Sally Getugi', track:'C', type:'Workshop', room:'Victoria Hall 3' },

  { id:9,  date:'2026-05-13', startTime:'13:00', endTime:'14:00', title:'Lunch', speaker:'', track:'all', type:'Meal', room:'Dining Hall' },

  { id:10, date:'2026-05-13', startTime:'14:00', endTime:'15:30', title:'Airway Management (AM) Workshop (afternoon)', speaker:'Dr Kevin Umani & Dr Charles Kabetu', track:'A', type:'Workshop', room:'Victoria Hall 1' },
  { id:11, date:'2026-05-13', startTime:'14:00', endTime:'15:30', title:'Point of Care Ultrasound (POCUS) Workshop (afternoon)', speaker:'Dr Susan Mutahi & Dr Romeo Wahome', track:'B', type:'Workshop', room:'Victoria Hall 2' },
  { id:12, date:'2026-05-13', startTime:'14:00', endTime:'15:30', title:'Advanced Mechanical Ventilation (AMV) Workshop (afternoon)', speaker:'Dr Idris Chikophe & Dr Sally Getugi', track:'C', type:'Workshop', room:'Victoria Hall 3' },

  { id:13, date:'2026-05-13', startTime:'15:30', endTime:'16:00', title:'Tea Break', speaker:'', track:'all', type:'Coffee', room:'' },

  { id:14, date:'2026-05-13', startTime:'16:00', endTime:'18:00', title:'Symposium: Parenteral Nutrition — Smarter Lipids for Critical Care', speaker:'Thandolethu Maboso', track:'A', type:'Lecture', room:'Victoria Hall 1' },

  // ── CONFERENCE DAY 1: Thursday 14 May 2026 ────────────────────────────
  // Session: Deriving Cardiac Output — Victoria Hall 1
  { id:20, date:'2026-05-14', startTime:'08:30', endTime:'08:55', title:'The "Poor Man\'s" Cardiac Output Monitor: Mastering the PCO₂ Gap', speaker:'Dr Salim Hassanali', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Deriving Cardiac Output' },
  { id:21, date:'2026-05-14', startTime:'08:55', endTime:'09:20', title:'Central Venous Oxygen Saturation: The Global Perfusion Monitor', speaker:'Dr Mark Gacii', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Deriving Cardiac Output' },
  { id:22, date:'2026-05-14', startTime:'09:20', endTime:'09:45', title:'The Diastolic Shock Index (DSI): Predicting Vasopressor Response', speaker:'Dr Susan Mutahi', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Deriving Cardiac Output' },
  { id:23, date:'2026-05-14', startTime:'09:45', endTime:'10:10', title:'Post Cardiac Surgery Care', speaker:'Dr Kevin Umani', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Deriving Cardiac Output' },
  { id:24, date:'2026-05-14', startTime:'10:10', endTime:'10:20', title:'Discussion', speaker:'', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Deriving Cardiac Output' },

  // Session: The Digital ICU — Victoria Hall 3
  { id:25, date:'2026-05-14', startTime:'08:30', endTime:'08:55', title:'Intraoperative Blood Pressure Patterns Predict ICU Admission: A Machine Learning Analysis of the VitalDB Dataset', speaker:'Dr Daniel Owambo', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'The Digital ICU' },
  { id:26, date:'2026-05-14', startTime:'08:55', endTime:'09:20', title:'Large Language Models in the ICU', speaker:'Dr Wangui Manguyu', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'The Digital ICU' },
  { id:27, date:'2026-05-14', startTime:'09:20', endTime:'09:45', title:'Automating Antimicrobial Stewardship with R', speaker:'Dr Fredrick Mutisya', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'The Digital ICU' },
  { id:28, date:'2026-05-14', startTime:'09:45', endTime:'10:10', title:'Digital Baby Lung: 3D Volumetry and Quantification in ARDS', speaker:'Dr Idris Chikophe', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'The Digital ICU' },
  { id:29, date:'2026-05-14', startTime:'10:10', endTime:'10:20', title:'Discussion', speaker:'', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'The Digital ICU' },

  { id:30, date:'2026-05-14', startTime:'10:20', endTime:'10:50', title:'Tea Break', speaker:'', track:'all', type:'Coffee', room:'' },
  { id:31, date:'2026-05-14', startTime:'10:50', endTime:'11:10', title:'Opening Ceremony', speaker:'', track:'all', type:'Plenary', room:'Victoria Hall 1' },
  { id:32, date:'2026-05-14', startTime:'11:10', endTime:'11:55', title:'Plenary 1: Workforce in Critical Care', speaker:'Dr Andrew Toro', track:'all', type:'Plenary', room:'Victoria Hall 1' },

  // Session: Physics Based Resuscitation — Victoria Hall 1
  { id:33, date:'2026-05-14', startTime:'11:55', endTime:'12:20', title:'The Echo-Hemodynamic Interface: VTI and the Passive Leg Raise', speaker:'Dr Romeo Wahome', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Physics Based Resuscitation' },
  { id:34, date:'2026-05-14', startTime:'12:20', endTime:'12:45', title:'Venous Congestion: The Silent Killer in Shock (The VExUS Protocol)', speaker:'Dr Daniel Gakuo', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Physics Based Resuscitation' },
  { id:35, date:'2026-05-14', startTime:'12:45', endTime:'13:10', title:'The Tidal Volume Challenge: Unmasking Fluid Responsiveness in ARDS', speaker:'Dr David Odaba', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Physics Based Resuscitation' },
  { id:36, date:'2026-05-14', startTime:'13:10', endTime:'13:20', title:'Discussion', speaker:'', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Physics Based Resuscitation' },

  // Session: Simulation and Training — Victoria Hall 3
  { id:37, date:'2026-05-14', startTime:'11:55', endTime:'12:20', title:'Evaluation of Critical Care Fellowship', speaker:'Dr Demet Sulemanji', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Simulation & Training' },
  { id:38, date:'2026-05-14', startTime:'12:20', endTime:'12:45', title:'Evaluation of Pediatric Emergency & Critical Program Training', speaker:'Dr Rheel Bhupi', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Simulation & Training' },
  { id:39, date:'2026-05-14', startTime:'12:45', endTime:'13:10', title:'From Haptics to Holograms: A Scoping Review of Simulation Technology in Critical Care Pedagogy', speaker:'Joash Kiptanui', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Simulation & Training' },
  { id:40, date:'2026-05-14', startTime:'13:10', endTime:'13:20', title:'Discussion', speaker:'', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Simulation & Training' },

  { id:41, date:'2026-05-14', startTime:'13:20', endTime:'14:20', title:'Lunch', speaker:'', track:'all', type:'Meal', room:'Dining Hall' },

  // Session: Trauma and the Red Cell — Victoria Hall 1
  { id:42, date:'2026-05-14', startTime:'14:20', endTime:'14:45', title:'Managing Massive Blood Transfusion and Coagulopathy', speaker:'Dr Anne-Marie Githaiga', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Trauma and the Red Cell' },
  { id:43, date:'2026-05-14', startTime:'14:45', endTime:'15:10', title:'Transfusion Triggers in Critical Care', speaker:'Prof Marcus Lance', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Trauma and the Red Cell' },
  { id:44, date:'2026-05-14', startTime:'15:10', endTime:'15:35', title:'Can We Predict the Need for Blood? A Statistical Model for the ICU', speaker:'Dr Kenan Nyalile', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Trauma and the Red Cell' },
  { id:45, date:'2026-05-14', startTime:'15:35', endTime:'15:45', title:'Discussion', speaker:'', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Trauma and the Red Cell' },

  // Session: Critical Care Within and Without — Victoria Hall 3
  { id:46, date:'2026-05-14', startTime:'14:20', endTime:'14:45', title:'Rural vs. Urban Critical Care: Are the Needs Truly Different? (A Back-to-Basics Approach)', speaker:'Dr Violet Kemunto', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Critical Care Within and Without' },
  { id:47, date:'2026-05-14', startTime:'14:45', endTime:'15:10', title:'Critical Care After the Medical Equipment Scheme: Results of the ICU Landscaping Study', speaker:'Dr Wambui Mwangi', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Critical Care Within and Without' },
  { id:48, date:'2026-05-14', startTime:'15:10', endTime:'15:35', title:'Critical Care Without Walls', speaker:'Prof Jana Macleod', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Critical Care Within and Without' },
  { id:49, date:'2026-05-14', startTime:'15:35', endTime:'15:45', title:'Discussion', speaker:'', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Critical Care Within and Without' },

  { id:50, date:'2026-05-14', startTime:'15:45', endTime:'16:15', title:'Tea Break & Poster Presentations', speaker:'', track:'all', type:'Coffee', room:'Exhibition Area' },
  { id:51, date:'2026-05-14', startTime:'16:15', endTime:'17:30', title:'Annual General Meeting (AGM)', speaker:'', track:'all', type:'Plenary', room:'Victoria Hall 1' },

  // ── CONFERENCE DAY 2: Friday 15 May 2026 ─────────────────────────────
  // Session: Renal Salvation — Victoria Hall 1
  { id:60, date:'2026-05-15', startTime:'08:30', endTime:'08:55', title:'SLED vs. CRRT: The Evidence for Hybrid Therapies', speaker:'Dr Hussein Bagha', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Renal Salvation' },
  { id:61, date:'2026-05-15', startTime:'08:55', endTime:'09:20', title:'Hyponatremia in the Intensive Care Unit: Challenges, Pitfalls, and Practical Management', speaker:'Prof Ahmed Sokwala', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Renal Salvation' },
  { id:62, date:'2026-05-15', startTime:'09:20', endTime:'09:45', title:'Peritoneal Dialysis in Pediatric Resource-Poor Settings', speaker:'Dr Daisy Odundo', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Renal Salvation' },
  { id:63, date:'2026-05-15', startTime:'09:45', endTime:'10:10', title:'To Dialyze or Not: Clinical Vignettes', speaker:'Dr George Moturi', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Renal Salvation' },
  { id:64, date:'2026-05-15', startTime:'10:10', endTime:'10:20', title:'Discussion', speaker:'', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Renal Salvation' },

  // Session: Ventilation and Liberation — Victoria Hall 3
  { id:65, date:'2026-05-15', startTime:'08:30', endTime:'08:55', title:'Lung Protective Ventilation: Beyond Plateau Pressure', speaker:'Dr Demet Sulemanji', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Ventilation and Liberation' },
  { id:66, date:'2026-05-15', startTime:'08:55', endTime:'09:20', title:'Predicting Weaning Success', speaker:'Dr Leah Opere', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Ventilation and Liberation' },
  { id:67, date:'2026-05-15', startTime:'09:20', endTime:'09:45', title:'Percutaneous Tracheostomy', speaker:'Dr Reuben Okioma', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Ventilation and Liberation' },
  { id:68, date:'2026-05-15', startTime:'09:45', endTime:'10:10', title:'Early vs. Late Tracheostomy in ICU', speaker:'Dr Mark Ndara', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Ventilation and Liberation' },
  { id:69, date:'2026-05-15', startTime:'10:10', endTime:'10:20', title:'Discussion', speaker:'', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Ventilation and Liberation' },

  { id:70, date:'2026-05-15', startTime:'10:20', endTime:'10:50', title:'Tea Break', speaker:'', track:'all', type:'Coffee', room:'' },
  { id:71, date:'2026-05-15', startTime:'10:50', endTime:'11:30', title:'Plenary 2: Obstetric Critical Care', speaker:"Dr Patrick Olang'", track:'all', type:'Plenary', room:'Victoria Hall 1' },

  // Session: Tiny Tots — Pediatric Critical Care — Victoria Hall 1
  { id:72, date:'2026-05-15', startTime:'11:30', endTime:'11:55', title:'Safety of Peripheral Vaso-actives', speaker:'Dr Abdirahman Farah', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Tiny Tots: Pediatric Critical Care' },
  { id:73, date:'2026-05-15', startTime:'11:55', endTime:'12:20', title:'Going Tubeless: High Flow Nasal Cannula', speaker:'Dr Brenda Kunga', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Tiny Tots: Pediatric Critical Care' },
  { id:74, date:'2026-05-15', startTime:'12:20', endTime:'12:45', title:'Bubble CPAP: Why Oscillations Matter', speaker:'Dr Brian Maugo', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Tiny Tots: Pediatric Critical Care' },
  { id:75, date:'2026-05-15', startTime:'12:45', endTime:'12:55', title:'Discussion', speaker:'', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'Tiny Tots: Pediatric Critical Care' },

  // Session: Shock & Hemodynamics — Victoria Hall 3
  { id:76, date:'2026-05-15', startTime:'11:30', endTime:'11:55', title:'Recognizing Right Heart Failure in the ICU', speaker:'Dr Barbara Karau', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Shock & Hemodynamics' },
  { id:77, date:'2026-05-15', startTime:'11:55', endTime:'12:20', title:'Midodrine in the ICU: Liberating the Bed', speaker:'Dr Mbatha Wambua', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Shock & Hemodynamics' },
  { id:78, date:'2026-05-15', startTime:'12:20', endTime:'12:45', title:'Arterial Lines for All?', speaker:'Dr Betty Sirera', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Shock & Hemodynamics' },
  { id:79, date:'2026-05-15', startTime:'12:45', endTime:'12:55', title:'Discussion', speaker:'', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Shock & Hemodynamics' },

  { id:80, date:'2026-05-15', startTime:'12:55', endTime:'13:55', title:'Lunch', speaker:'', track:'all', type:'Meal', room:'Dining Hall' },

  // Session: End of Life — Victoria Hall 1
  { id:81, date:'2026-05-15', startTime:'13:55', endTime:'14:20', title:'Are We Creating Survivors or Victims? Goals of Care for the Frail', speaker:'Dr Esther Nafula', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'End of Life' },
  { id:82, date:'2026-05-15', startTime:'14:20', endTime:'14:45', title:'Low-Cost Comfort Care: Nurse-Initiated Interventions that Improve Dying with Dignity in Kenyan Hospitals', speaker:'Lilian Karanja', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'End of Life' },
  { id:83, date:'2026-05-15', startTime:'14:45', endTime:'15:10', title:'Ethical Dilemmas in ICU: Case Based Discussion', speaker:'Prof Sayed Karar', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'End of Life' },
  { id:84, date:'2026-05-15', startTime:'15:10', endTime:'15:20', title:'Discussion', speaker:'', track:'A', type:'Lecture', room:'Victoria Hall 1', session:'End of Life' },

  // Session: Hot Topics in Critical Care — Victoria Hall 3
  { id:85, date:'2026-05-15', startTime:'13:55', endTime:'14:20', title:'RSI Trial: Etomidate vs. Ketamine (2025)', speaker:'Dr Mohamed Billow', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Hot Topics in Critical Care' },
  { id:86, date:'2026-05-15', startTime:'14:20', endTime:'14:45', title:'Difficult Airway Society: 2025 Guidelines in the ICU', speaker:'Dr Charles Kabetu', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Hot Topics in Critical Care' },
  { id:87, date:'2026-05-15', startTime:'14:45', endTime:'15:10', title:'Cardiac Arrest: Manual vs. Mechanical Ventilation', speaker:'Dr Benjamin Wachira', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Hot Topics in Critical Care' },
  { id:88, date:'2026-05-15', startTime:'15:10', endTime:'15:20', title:'Discussion', speaker:'', track:'C', type:'Lecture', room:'Victoria Hall 3', session:'Hot Topics in Critical Care' },

  { id:89, date:'2026-05-15', startTime:'15:20', endTime:'15:50', title:'Evening Tea', speaker:'', track:'all', type:'Coffee', room:'' },
  { id:90, date:'2026-05-15', startTime:'19:00', endTime:'21:00', title:'Closing Ceremony & Gala Dinner', speaker:'', track:'all', type:'Plenary', room:'Main Hall' },
];

const CCSK_SPEAKERS = [
  { id:101, name:'Dr Kevin Umani', title:'Consultant Cardiovascular & Cardiothoracic Anaesthesiologist', org:'Tenwek Hospital' },
  { id:102, name:'Dr Charles Kabetu', title:'Consultant Anaesthesiologist', org:'JKUAT' },
  { id:103, name:'Dr Susan Mutahi', title:'Consultant Anaesthesiologist', org:'Defence Forces Memorial Hospital' },
  { id:104, name:'Dr Romeo Wahome', title:'Emergency Physician', org:'Nairobi' },
  { id:105, name:'Dr Idris Chikophe', title:'Anesthesiologist & Critical Care Practitioner', org:'Aga Khan University Hospital, Nairobi' },
  { id:106, name:'Dr Sally Getugi', title:'Consultant Anesthesiologist', org:'KTRH, Kisii' },
  { id:107, name:'Dr Andrew Toro', title:'Director of Curative and Nursing Services', org:'Ministry of Health, Kenya' },
  { id:108, name:"Dr Patrick Olang'", title:'Consultant Anaesthesiologist & Lecturer', org:'KNH / University of Nairobi' },
  { id:109, name:'Prof Marcus Lance', title:'Consultant Cardiothoracic Anaesthesiologist', org:'Aga Khan University Hospital, Nairobi' },
  { id:110, name:'Dr Salim Hassanali', title:'Consultant Pulmonologist & Critical Care Practitioner', org:'Aga Khan University Hospital, Nairobi' },
  { id:111, name:'Dr Mark Gacii', title:'Consultant Paediatric Anaesthesiologist & Lecturer', org:'KNH / University of Nairobi' },
  { id:112, name:'Dr David Odaba', title:'Assistant Professor & Anaesthesiologist', org:'Aga Khan University Hospital, Nairobi' },
  { id:113, name:'Dr Daniel Gakuo', title:'Anesthesiologist & Critical Care Practitioner', org:'Nairobi' },
  { id:114, name:'Dr Anne-Marie Githaiga', title:'Hepatopancreaticobiliary & Transplant Anaesthesiologist', org:'Aga Khan University Hospital, Nairobi' },
  { id:115, name:'Dr Violet Kemunto', title:'Surgeon', org:'Tenwek Hospital' },
  { id:116, name:'Dr Kenan Nyalile', title:'Resident in Anaesthesia', org:'Aga Khan University Hospital, Nairobi' },
  { id:117, name:'Dr Fredrick Mutisya', title:'Medical Doctor & AI Consultant', org:'Aga Khan University Hospital, Nairobi' },
  { id:118, name:'Dr Daniel Owambo', title:'Anesthesiologist & Critical Care Practitioner', org:'Aga Khan University Hospital, Nairobi' },
  { id:119, name:'Joash Kiptanui', title:'Healthcare Simulation Specialist', org:'Skills Meducation' },
  { id:120, name:'Dr Wangui Manguyu', title:'Consultant Paediatric Anaesthesiologist', org:'KUTRRH' },
  { id:121, name:'Dr Rheel Bhupi', title:'Consultant Pediatrician & Critical Care Specialist', org:'M.P. Shah Hospital' },
  { id:122, name:'Dr Demet Sulemanji', title:'Consultant Anaesthesiologist & Critical Care Specialist', org:'Aga Khan University Hospital, Nairobi' },
  { id:123, name:'Prof Jana Macleod', title:'Consultant Surgeon | Critical Care Intensivist | Researcher', org:'KUTRRH' },
  { id:124, name:'Dr Hussein Bagha', title:'Consultant Physician, Nephrologist & Head of Renal/Transplant Unit', org:'M.P. Shah Hospital' },
  { id:125, name:'Prof Ahmed Sokwala', title:'Clinical Associate Professor & Nephrologist', org:'Aga Khan University Hospital, Nairobi' },
  { id:126, name:'Dr Daisy Odundo', title:'Consultant Pediatrician Nephrologist', org:"Gertrude's Children's Hospital" },
  { id:127, name:'Dr George Moturi', title:'Consultant Physician in Internal Medicine & Nephrologist', org:'Fortis Kidney Center' },
  { id:128, name:'Dr Abdirahman Farah', title:'Consultant Paediatrician', org:'Nairobi' },
  { id:129, name:'Dr Brenda Kunga', title:'Paediatric Emergency and Critical Care', org:'Kenyatta National Hospital' },
  { id:130, name:'Dr Brian Maugo', title:'Neonatologist & Lecturer', org:'University of Nairobi' },
  { id:131, name:'Dr Esther Nafula', title:'Palliative Care Physician', org:'Kenyatta National Hospital' },
  { id:132, name:'Lilian Karanja', title:'Clinical ICU Nurse', org:'Aga Khan University Hospital, Mombasa' },
  { id:133, name:'Prof Sayed Karar', title:'Professor & Section Head, Palliative Care / Internal Medicine', org:'Aga Khan University Hospital, Nairobi' },
  { id:134, name:'Dr Reuben Okioma', title:'Deputy Director Medical Services & General Surgeon, Intensivist', org:'The Nairobi Hospital' },
  { id:135, name:'Dr Leah Opere', title:'Anaesthesiology & Critical Care Medicine', org:'Nairobi' },
  { id:136, name:'Dr Mark Ndara', title:'General Surgery Resident', org:'Aga Khan University Hospital, Nairobi' },
  { id:137, name:'Dr Betty Sirera', title:'Internal Medicine Specialist', org:'Aga Khan University Hospital, Nairobi' },
  { id:138, name:'Dr Barbara Karau', title:'Consultant Cardiologist & Internal Medicine Specialist', org:'Aga Khan University Hospital, Nairobi' },
  { id:139, name:'Dr Mbatha Wambua', title:'Emergency Medicine Physician', org:'Nairobi' },
  { id:140, name:'Dr Mohamed Billow', title:'Consultant Anaesthesiologist', org:'Kenyatta National Hospital' },
  { id:141, name:'Dr Benjamin Wachira', title:'Assistant Professor of Emergency Medicine', org:'Aga Khan University Hospital, Nairobi' },
  { id:142, name:'Thandolethu Maboso', title:'Enteral Nutrition Key Account Manager', org:'Fresenius Kabi, South Africa' },
  { id:143, name:'Dr Wambui Mwangi', title:'Critical Care Physician', org:'Nairobi' },
  { id:144, name:'Dr Carolyne Njoki', title:'Anaesthesiologist & Critical Care', org:'Aga Khan University Hospital, Nairobi' },
];
