import { useState, useRef } from "react";

const DB = [
  { name:"Sodium Lauryl Sulfate", aliases:["sodium lauryl sulfate","sls"], category:"Irritante confirmado", level:"alto", score:-20, description:"Tensioactivo agresivo con evidencia sólida de irritación del cuero cabelludo.", tip:"Busca alternativas como Sodium Cocoyl Glutamate o Decyl Glucoside." },
  { name:"Formaldehyde / Liberadores", aliases:["formaldehyde","formalin","dmdm hydantoin","dmdm","imidazolidinyl urea"], category:"Irritante confirmado", level:"alto", score:-30, description:"Conservante y liberadores con evidencia sólida de sensibilización cutánea.", tip:"Clasificado como carcinógeno grupo 1 por la IARC." },
  { name:"Methylisothiazolinone (MIT)", aliases:["methylisothiazolinone","mit"], category:"Irritante confirmado", level:"alto", score:-20, description:"Conservante con evidencia sólida de alergia de contacto. Restringido en la UE en productos sin aclarado.", tip:"La SCCS europea concluye que no hay concentración segura en productos sin aclarado." },
  { name:"Methylchloroisothiazolinone (CMIT)", aliases:["methylchloroisothiazolinone","cmit"], category:"Irritante confirmado", level:"alto", score:-20, description:"Conservante con evidencia sólida de alergia de contacto.", tip:"Prohibido en productos sin aclarado en la UE desde 2017." },
  { name:"Cocamide DEA", aliases:["cocamide dea"], category:"Irritante confirmado", level:"medio", score:-15, description:"Agente espumante clasificado como posible carcinógeno por la IARC (grupo 2B).", tip:"Evitable en todo tipo de champú." },
  { name:"Fragrance / Parfum", aliases:["fragrance","parfum"], category:"Alérgeno UE", level:"medio", score:-8, description:"Puede englobar cientos de compuestos. Asociado a dermatitis de contacto alérgica.", tip:"En cuero cabelludo reactivo busca productos fragrance-free." },
  { name:"Linalool", aliases:["linalool"], category:"Alérgeno UE", level:"bajo", score:-4, description:"Alérgeno de fragancia de declaración obligatoria en la UE.", tip:"Relevante en pieles sensibilizadas o con historial de alergia a fragancias." },
  { name:"Limonene", aliases:["limonene","limoneno"], category:"Alérgeno UE", level:"bajo", score:-4, description:"Alérgeno de fragancia de declaración obligatoria en la UE.", tip:"Su potencial sensibilizante aumenta en productos mal conservados." },
  { name:"Geraniol", aliases:["geraniol"], category:"Alérgeno UE", level:"bajo", score:-4, description:"Alérgeno de fragancia de declaración obligatoria en la UE.", tip:"Declaración obligatoria por encima de 0,001% en productos sin aclarado." },
  { name:"Citronellol", aliases:["citronellol"], category:"Alérgeno UE", level:"bajo", score:-4, description:"Alérgeno de fragancia de declaración obligatoria en la UE.", tip:"Frecuente en productos con aroma floral." },
  { name:"Eugenol", aliases:["eugenol"], category:"Alérgeno UE", level:"bajo", score:-5, description:"Alérgeno de fragancia de declaración obligatoria en la UE.", tip:"Uno de los alérgenos de contacto más frecuentes en cosméticos." },
  { name:"Sodium Laureth Sulfate", aliases:["sodium laureth sulfate","sles"], category:"A vigilar", level:"bajo", score:-5, description:"Más suave que el SLS pero puede irritar cueros cabelludos reactivos con uso prolongado.", tip:"En cuero cabelludo sensible mejor buscar alternativas." },
  { name:"Methylparaben", aliases:["methylparaben","metilparabeno"], category:"A vigilar", level:"bajo", score:-6, description:"La evidencia sobre posible actividad hormonal en concentraciones cosméticas no es concluyente según la SCCS europea.", tip:"La UE permite su uso a concentraciones reguladas." },
  { name:"Propylparaben", aliases:["propylparaben","propilparabeno"], category:"A vigilar", level:"bajo", score:-6, description:"Parabeno con estudios preliminares sobre actividad estrogénica, no concluyentes en concentraciones cosméticas.", tip:"Restringido en productos para bebés menores de 3 años." },
  { name:"Butylparaben", aliases:["butylparaben","butilparabeno"], category:"A vigilar", level:"bajo", score:-6, description:"Mayor potencia estrogénica relativa según estudios in vitro, aunque la relevancia clínica no está establecida.", tip:"Si prefieres evitar parabenos busca conservantes alternativos." },
  { name:"Benzophenone-3", aliases:["benzophenone-3","oxybenzone"], category:"A vigilar", level:"bajo", score:-6, description:"Filtro UV con estudios preliminares sobre posible actividad hormonal, no concluyentes a concentraciones reguladas.", tip:"Los filtros minerales como el óxido de zinc son una alternativa bien tolerada." },
  { name:"Triclosan", aliases:["triclosan"], category:"A vigilar", level:"medio", score:-10, description:"Prohibido en cosméticos de enjuague en la UE desde 2017.", tip:"Puede aparecer en productos importados fuera de la UE." },
  { name:"Alcohol Denat", aliases:["alcohol denat","sd alcohol","isopropyl alcohol"], category:"A vigilar", level:"bajo", score:-8, description:"Puede resecar el cuero cabelludo con uso frecuente.", tip:"Distinto del alcohol cetílico que es un emoliente." },
  { name:"Dimethicone", aliases:["dimethicone","dimeticona","cyclopentasiloxane"], category:"A vigilar", level:"bajo", score:-5, description:"Silicona que puede acumularse con uso continuado, reduciendo la absorción de activos.", tip:"Alterna con productos libres de siliconas." },
  { name:"Mineral Oil", aliases:["mineral oil","paraffinum liquidum"], category:"A vigilar", level:"bajo", score:-6, description:"Puede crear película oclusiva en el cuero cabelludo.", tip:"Bien tolerado en el tallo capilar pero mejor evitarlo en cuero cabelludo." },
  { name:"Octocrylene", aliases:["octocrylene","octocrileno"], category:"A vigilar", level:"bajo", score:-5, description:"Filtro UV con estudios sobre posible bioacumulación. Evidencia no concluyente.", tip:"En aplicaciones repetidas sobre cuero cabelludo, valorar alternativas minerales." },
  { name:"Caffeine", aliases:["caffeine","cafeína"], category:"Beneficioso", level:"positivo", score:+15, description:"Estimula el folículo capilar y prolonga la fase anágena. Evidencia in vitro e in vivo sólida.", tip:"Necesita 2 minutos de contacto para penetrar el folículo." },
  { name:"Zinc Pyrithione", aliases:["zinc pyrithione","piritionato de zinc","zinc pca"], category:"Beneficioso", level:"positivo", score:+15, description:"Antifúngico y seborregulador con evidencia clínica sólida en caspa y dermatitis seborreica.", tip:"Eficaz desde la primera aplicación." },
  { name:"Niacinamide", aliases:["niacinamide","niacinamida","nicotinamide"], category:"Beneficioso", level:"positivo", score:+15, description:"Vitamina B3 con evidencia de mejora de la microcirculación y reducción de la inflamación folicular.", tip:"Efecto sinérgico con cafeína y zinc." },
  { name:"Panthenol", aliases:["panthenol","pantenol","dexpanthenol"], category:"Beneficioso", level:"positivo", score:+10, description:"Provitamina B5 con evidencia de hidratación y acción calmante.", tip:"Bien tolerado en todo tipo de cuero cabelludo." },
  { name:"Salicylic Acid", aliases:["salicylic acid","acido salicilico"], category:"Beneficioso", level:"positivo", score:+12, description:"Queratolítico con evidencia sólida de eliminación de escamas del cuero cabelludo.", tip:"Usar 2-3 veces por semana, no a diario." },
  { name:"Piroctone Olamine", aliases:["piroctone olamine","octopirox"], category:"Beneficioso", level:"positivo", score:+12, description:"Antifúngico con eficacia demostrada contra Malassezia furfur.", tip:"Alternativa bien tolerada en pieles sensibles." },
  { name:"Rosemary Extract", aliases:["rosmarinus officinalis","rosemary extract"], category:"Beneficioso", level:"positivo", score:+12, description:"Evidencia emergente de mejora de la microcirculación folicular.", tip:"Complemento útil, no sustituto de tratamientos médicos." },
  { name:"Sodium Hyaluronate", aliases:["sodium hyaluronate","hyaluronic acid"], category:"Beneficioso", level:"positivo", score:+10, description:"Hialuronato sódico con evidencia de hidratación y reducción de la inflamación.", tip:"Especialmente útil en cuero cabelludo seco o con eccema." },
  { name:"Biotin", aliases:["biotin","biotina"], category:"Beneficioso", level:"positivo", score:+10, description:"Vitamina B7 esencial para el metabolismo de la queratina. Mayor efectividad oral.", tip:"No perjudica en formulación tópica." },
  { name:"Zinc Oxide", aliases:["zinc oxide","oxido de zinc"], category:"Beneficioso", level:"positivo", score:+15, description:"Filtro mineral físico con evidencia sólida de seguridad.", tip:"La mejor opción en protectores capilares." },
  { name:"Aminexil", aliases:["aminexil","diaminopyrimidine oxide"], category:"Beneficioso", level:"positivo", score:+15, description:"Molécula anticaída con evidencia clínica sólida. Combate la rigidificación de la vaina de colágeno perifolicular.", tip:"Ingrediente de referencia en champús anticaída de farmacia." },
  { name:"Selenium Sulfide", aliases:["selenium sulfide","sulfuro de selenio"], category:"Beneficioso", level:"positivo", score:+14, description:"Antifúngico con evidencia sólida contra Malassezia.", tip:"Muy eficaz en caspa persistente y dermatitis seborreica." },
];

const P = [
  { id:1,  marca:"Nuggela & Sulé", nombre:"Champú Premium Nº1 Cebolla Roja 250ml", precio:17.90, cats:["champu_especifico"], perfs:["difusa","androgenetica","postparto","estres"], nota:"Estudio clínico: -69,9% caída en 60 días. Sin parabenos ni siliconas." },
  { id:2,  marca:"Nuggela & Sulé", nombre:"SuprAcondicionador Imperial Cebolla Roja 250ml", precio:16.95, cats:["acondicionador"], perfs:["difusa","androgenetica","postparto","estres"], nota:"Protege fibras de queratina. Para cabellos finos o con tendencia grasa." },
  { id:4,  marca:"Nuggela & Sulé", nombre:"Martinn Complemento Alimenticio 60 comp.", precio:23.92, cats:["suplemento"], perfs:["difusa","androgenetica","postparto","estres","medicamentos"], nota:"Con zinc, biotina, hierro, selenio y vitaminas B." },
  { id:34, marca:"Nuggela & Sulé", nombre:"Mascarilla South Beach / Tucuma 250ml", precio:19.54, cats:["acondicionador"], perfs:["difusa","androgenetica","postparto","estres","sensible","caspa","medicamentos"], nota:"Manteca de Tucuma — alternativa natural a las siliconas. Vegana." },
  { id:5,  marca:"Moncho Moreno", nombre:"Coffee Smoothie Champú Anticaída 250ml", precio:19.90, cats:["champu_especifico"], perfs:["difusa","androgenetica","postparto","estres","medicamentos"], nota:"Sin sulfatos, siliconas ni parabenos. Con cafeína, Capixyl™ y romero." },
  { id:6,  marca:"Moncho Moreno", nombre:"Healthy Smoothie Champú Anticaspa 250ml", precio:23.17, cats:["champu_especifico"], perfs:["caspa","sensible"], nota:"Champú ayurvédico seborregulador. Sin sulfatos ni parabenos." },
  { id:7,  marca:"Moncho Moreno", nombre:"Gorgeous Hair Champú Hidratante 250ml", precio:19.90, cats:["champu_corriente"], perfs:["sensible","postparto","tricotilomania"], nota:"Ultranutritivo e hidratante." },
  { id:35, marca:"Moncho Moreno", nombre:"Mascarilla One Minute Wonder 250ml", precio:19.90, cats:["acondicionador"], perfs:["difusa","postparto","estres","sensible","tricotilomania","medicamentos"], nota:"Mascarilla reparadora de 1 minuto. Con aceite de Camelia Japónica." },
  { id:8,  marca:"Vichy Dercos", nombre:"Champú Energy+ Aminexil 200ml", precio:14.90, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","medicamentos"], nota:"Con Aminexil + niacinamida. Relación calidad-precio muy buena." },
  { id:9,  marca:"Vichy Dercos", nombre:"Champú Energy+ Aminexil 400ml", precio:20.10, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","medicamentos"], nota:"Formato ahorro. El más accesible con evidencia clínica." },
  { id:19, marca:"Vichy Dercos", nombre:"Champú Anticaspa DS Normal-Graso 200ml", precio:17.92, cats:["champu_especifico"], perfs:["caspa"], nota:"Con Sulfuro de Selenio. Elimina el 100% de la caspa visible." },
  { id:20, marca:"Vichy Dercos", nombre:"Champú Anticaspa DS Cabello Seco 200ml", precio:17.92, cats:["champu_especifico"], perfs:["caspa","sensible"], nota:"Fórmula DS para cuero cabelludo seco o sensible." },
  { id:24, marca:"Alpecin", nombre:"Caffeine Shampoo C1 250ml", precio:10.45, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Sin siliconas. Dejar actuar 2 minutos." },
  { id:25, marca:"Alpecin", nombre:"Caffeine Shampoo C1 375ml", precio:12.65, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Formato ahorro. Cafeína + zinc + niacina." },
  { id:26, marca:"Alpecin", nombre:"Caffeine Liquid Tónico 200ml", precio:11.70, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Tónico sin aclarado para días sin lavado." },
  { id:27, marca:"Alpecin", nombre:"Hybrid Champú Cuero Cabelludo Sensible 250ml", precio:9.90, cats:["champu_especifico"], perfs:["sensible","difusa"], nota:"Cafeína suave para cueros cabelludos sensibles." },
  { id:28, marca:"Pharma Hermetic", nombre:"Champú Anticaída SP55 200ml", precio:22.00, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","postparto","medicamentos"], nota:"Sin sulfatos ni parabenos. Avalado por la World Trichology Society." },
  { id:29, marca:"Pharma Hermetic", nombre:"Loción Capilar SP55 50ml", precio:35.00, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Sin aclarado. Aplicar con masaje de 3 minutos." },
  { id:30, marca:"Genové Pilopeptan", nombre:"Champú Anticaída Mujer 250ml", precio:16.50, cats:["champu_especifico"], perfs:["difusa","postparto","estres","medicamentos"], nota:"Con vitaminas B, oligoelementos y ácido hialurónico. Sin sulfatos." },
  { id:31, marca:"Genové Pilopeptan", nombre:"Champú Anticaída Hombre 250ml", precio:24.49, cats:["champu_especifico"], perfs:["androgenetica","difusa","estres"], nota:"Con Vital Hair & Scalp Complex y queratina hidrolizada." },
  { id:32, marca:"Genové Pilopeptan", nombre:"Cápsulas Anticaída 60 caps", precio:22.00, cats:["suplemento"], perfs:["difusa","androgenetica","postparto","estres","medicamentos"], nota:"Vitaminas B, minerales, aminoácidos azufrados." },
  { id:47, marca:"Genové Pilopeptan", nombre:"Pilopeptan Woman 60 comp. — Efluvio", precio:33.55, cats:["suplemento"], perfs:["difusa","postparto","estres","medicamentos"], nota:"Sin Serenoa repens. Con L-cistina, biotina, zinc y selenio. Para efluvio telógeno." },
  { id:48, marca:"Genové Pilopeptan", nombre:"Pilopeptan Woman 5αR 60 comp. — AGA femenina", precio:34.09, cats:["suplemento"], perfs:["androgenetica","difusa"], nota:"Con Serenoa repens + Cucurbita pepo + Granada. Para AGA femenina leve." },
  { id:33, marca:"Genové Pilopeptan", nombre:"Loción Anticaída 100ml", precio:28.00, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Con Pygeum africanum, ginseng y hamamelis. Sin aclarado." },
  { id:21, marca:"ISDIN Lambdapil", nombre:"Champú Anticaída 200ml", precio:13.00, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","postparto","medicamentos"], nota:"Con Serenoa Repens y complejo Trichogen." },
  { id:22, marca:"ISDIN Lambdapil", nombre:"Loción Anticaída 20 Monodosis", precio:40.53, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Con melatonina y Ginkgo Biloba. Eficacia clínica con TrichoScan." },
  { id:23, marca:"ISDIN Lambdapil", nombre:"Cápsulas 5α Plus 60 caps", precio:34.20, cats:["suplemento"], perfs:["difusa","androgenetica","estres"], nota:"Triple 5α complex + biotina y zinc. Mínimo 3 meses." },
  { id:10, marca:"Biotricología", nombre:"Champú Uso Frecuente 250ml", precio:18.90, cats:["champu_corriente"], perfs:["difusa","androgenetica","postparto","estres","sensible","areata","tricotilomania","medicamentos"], nota:"Fórmula suave para uso diario." },
  { id:11, marca:"Biotricología", nombre:"Champú Anticaída Cabellos Grasos 250ml", precio:19.90, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Regula la glándula sebácea. Avalado por clínicas de trasplante." },
  { id:12, marca:"Biotricología", nombre:"Champú Anticaída Cabellos Secos 250ml", precio:18.90, cats:["champu_especifico"], perfs:["difusa","postparto","estres","sensible","medicamentos"], nota:"Para caída con tendencia seca." },
  { id:13, marca:"Biotricología", nombre:"Champú Hidratante Radiance 250ml", precio:19.90, cats:["champu_corriente"], perfs:["sensible","postparto","tricotilomania","areata"], nota:"Para cueros cabelludos delicados o sensibles." },
  { id:14, marca:"Biotricología", nombre:"Champú Caspa Cabellos Grasos 250ml", precio:18.90, cats:["champu_especifico"], perfs:["caspa"], nota:"Elimina la caspa en cuero cabelludo graso." },
  { id:15, marca:"Biotricología", nombre:"Champú Caspa Cabellos Secos 250ml", precio:18.90, cats:["champu_especifico"], perfs:["caspa","sensible"], nota:"Anticaspa para cueros cabelludos secos o sensibles." },
  { id:16, marca:"Biotricología", nombre:"Acondicionador Tricofásico 125ml", precio:19.90, cats:["acondicionador"], perfs:["difusa","androgenetica","postparto","estres","sensible","areata","tricotilomania"], nota:"Para cabellos finos y largos." },
  { id:17, marca:"Biotricología", nombre:"Loción Anticaída GR-8 50ml", precio:27.90, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","medicamentos"], nota:"Concentrado sin aclarado. Tratamiento estrella de la marca." },
  { id:18, marca:"Biotricología", nombre:"Loción Base Esencial Calmante 50ml", precio:15.90, cats:["champu_especifico"], perfs:["sensible","caspa","areata"], nota:"Calmante para cueros cabelludos sensibles." },
  { id:36, marca:"Cantabria Labs Iraltone", nombre:"Champú Fortificante 400ml", precio:15.68, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","postparto","medicamentos"], nota:"Estimula el crecimiento. Avalado por dermatólogos." },
  { id:37, marca:"Cantabria Labs Iraltone", nombre:"Loción Anticaída 100ml", precio:28.00, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres"], nota:"Triple acción anticaída. Textura ultra ligera sin aclarado." },
  { id:38, marca:"Cantabria Labs Iraltone", nombre:"Cápsulas Forte 60 caps — Caída aguda", precio:21.21, cats:["suplemento"], perfs:["difusa","postparto","estres","medicamentos"], nota:"Con L-Cistina, Glutatión y vitaminas B. Para efluvio y caída estacional." },
  { id:39, marca:"Cantabria Labs Iraltone", nombre:"Cápsulas AGA 60 caps — Caída crónica", precio:21.21, cats:["suplemento"], perfs:["androgenetica","difusa"], nota:"Para caída crónica de origen hormonal." },
  { id:40, marca:"Cantabria Labs Iraltone", nombre:"Cápsulas 5Alfa Supreme 60 caps", precio:33.96, cats:["suplemento"], perfs:["androgenetica"], nota:"Frena la caída hormonal en AGA masculina y femenina." },
  { id:41, marca:"Pilexil", nombre:"Champú Anticaída 500ml", precio:16.95, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","postparto","medicamentos"], nota:"Con Serenoa serrulata + Zinc PCA + vitaminas B. 20 años de referencia." },
  { id:42, marca:"Pilexil", nombre:"Champú Anticaída 900ml", precio:22.90, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","postparto","medicamentos"], nota:"Formato ahorro. Mejor relación calidad-precio de la gama." },
  { id:43, marca:"Pilexil", nombre:"Cápsulas Anticaída 100 caps", precio:31.99, cats:["suplemento"], perfs:["difusa","androgenetica","postparto","estres","medicamentos"], nota:"Con L-cistina, hierro, magnesio, zinc y biotina." },
  { id:44, marca:"Ducray", nombre:"Anaphase+ Champú Anticaída 400ml", precio:18.00, cats:["champu_especifico"], perfs:["difusa","postparto","estres","medicamentos"], nota:"Con biotina, pantenol y ácido salicílico. Apto embarazo y lactancia. Contiene SLES." },
  { id:45, marca:"Ducray", nombre:"Neoptide Loción Anticaída 3x30ml", precio:39.10, cats:["champu_especifico"], perfs:["difusa","postparto","estres"], nota:"Para caída crónica femenina. Con niacinamida. Sin aclarado." },
  { id:50, marca:"Ducray Anacaps", nombre:"Anacaps Reactiv 90 caps — Caída aguda", precio:28.90, cats:["suplemento"], perfs:["difusa","postparto","estres","medicamentos"], nota:"Con hierro, biotina y L-cistina. Apto embarazo y lactancia. Vegano." },
  { id:51, marca:"Ducray Anacaps", nombre:"Anacaps Expert 90 caps — Caída crónica", precio:32.90, cats:["suplemento"], perfs:["androgenetica","difusa"], nota:"Para caída crónica hormonal. No apto en embarazo ni lactancia." },
  { id:46, marca:"Klorane", nombre:"Champú Quinina + Edelweiss Bio 400ml", precio:13.00, cats:["champu_especifico"], perfs:["difusa","estres","postparto"], nota:"Con quinina (vasodilatador natural) y Edelweiss Bio antioxidante." },
  { id:49, marca:"Vipelín", nombre:"Vipelin Forte 60 cáps.", precio:29.90, cats:["suplemento"], perfs:["androgenetica","difusa","estres"], nota:"Con Saw Palmetto 340mg + Pygeum africanum + L-cisteína + zinc. Vegano." },
  { id:52, marca:"René Furterer", nombre:"Triphasic Champú Estimulante 250ml", precio:18.30, cats:["champu_especifico"], perfs:["difusa","androgenetica","estres","postparto"], nota:"Con ATP y extracto de Pfaffia. Sin siliconas. 96% origen natural." },
  { id:53, marca:"René Furterer", nombre:"Triphasic Reactional Ampollas 12x5ml", precio:47.95, cats:["champu_especifico"], perfs:["difusa","postparto","estres","medicamentos"], nota:"Para caída reaccional. Sin aclarado. 1 ampolla por semana 3 meses." },
  { id:54, marca:"René Furterer", nombre:"Vitalfan Cápsulas Caída Progresiva 3x30 caps", precio:37.95, cats:["suplemento"], perfs:["androgenetica","difusa","estres"], nota:"Con extracto de grosella negra, biotina, vitamina E y zinc." },
];

const RUTINAS = {
  difusa:{ label:"Caída difusa", icon:"🌿", preguntas:[{id:"tiempo",texto:"¿Cuánto tiempo llevas con la caída?",opciones:["Menos de 3 meses","3-6 meses","Más de 6 meses"]},{id:"causa",texto:"¿Crees saber la causa?",opciones:["Estrés o cambio vital","Dieta o déficit nutricional","No lo sé"]},{id:"cuero",texto:"¿Cómo es tu cuero cabelludo?",opciones:["Normal","Graso","Seco o sensible"]}],
    getRutina:(r)=>({ aviso:"La caída difusa suele tener una causa interna. La rutina capilar ayuda pero investiga el origen.", champu_corriente:{buscar:["Tensioactivos suaves (Sodium Cocoyl Glutamate, Decyl Glucoside)","Pantenol","Glicerina"],evitar:["SLS","Parabenos","MIT/CMIT"]}, champu_especifico:{buscar:["Cafeína","Extracto de romero","Niacinamida","Zinc"],evitar:["Alcohol Denat","Fragancias artificiales"],nota:"Úsalo 3-4 veces por semana"}, acondicionador:{buscar:["Pantenol","Queratina hidrolizada","Aceite de argán"],evitar:["Siliconas pesadas en raíz","Parabenos"]}, minoxidil:{incluir:false}, suplementos:r.causa==="Dieta o déficit nutricional"?["Hierro + vitamina C","Biotina","Zinc","Vitamina D"]:["Zinc","Biotina","Vitamina D","Complejo B"], medicacion:"Para este tipo de caída puede existir medicación específica. Consulta con tu médico o enfermero capilar.", habitos:["🌡️ Agua tibia, nunca caliente","💨 Seca el pelo antes de dormir","⏱️ Lava 2-3 veces por semana","🎀 Evita recogidos tensos",r.tiempo==="Más de 6 meses"?"⚠️ Más de 6 meses — consulta con un profesional":"📅 Si en 3 meses no mejora, pide una analítica"] })
  },
  androgenetica:{ label:"Alopecia androgénica", icon:"🧬", preguntas:[{id:"patron",texto:"¿Cómo se produce la caída?",opciones:["Entradas y coronilla","Ensanchamiento de la raya central","No estoy seguro/a"]},{id:"tiempo",texto:"¿Desde cuándo notas pérdida de densidad?",opciones:["Menos de 1 año","1-3 años","Más de 3 años"]},{id:"tratamiento",texto:"¿Sigues algún tratamiento?",opciones:["Sí, con seguimiento profesional","Solo cosméticos","Ninguno"]}],
    getRutina:(r)=>({ aviso:"La alopecia androgénica tiene base genética y hormonal. Los cosméticos son un complemento — el tratamiento requiere valoración profesional.", champu_corriente:{buscar:["Tensioactivos suaves","Pantenol","Niacinamida"],evitar:["SLS","Parabenos"]}, champu_especifico:{buscar:["Cafeína","Zinc Piritionato","Saw Palmetto","Extracto de romero"],evitar:["Fragancias artificiales","Alcohol Denat"],nota:"2-3 veces por semana, no a diario"}, acondicionador:{buscar:["Biotina","Niacinamida","Proteínas de trigo","Pantenol"],evitar:["Siliconas en cuero cabelludo"]}, minoxidil:{incluir:true,nota:"El minoxidil tópico al 5% es de venta libre y cuenta con evidencia sólida en AGA. Consúltalo con tu enfermero o médico capilar."}, suplementos:["Saw Palmetto oral","Zinc","Vitamina D","Omega 3"], medicacion:"Para la AGA existe medicación específica con alta evidencia. Consulta con tu médico o enfermero capilar.", habitos:["☀️ Protege el cuero cabelludo del sol","💨 Seca el pelo antes de dormir","🌡️ Agua tibia",r.tratamiento==="Ninguno"?"👨‍⚕️ Consulta con un profesional":"⏳ Mínimo 6 meses para ver resultados"] })
  },
  postparto:{ label:"Caída postparto", icon:"👶", preguntas:[{id:"meses",texto:"¿Cuántos meses tiene tu bebé?",opciones:["Menos de 2 meses","2-6 meses","Más de 6 meses"]},{id:"lactancia",texto:"¿Estás dando el pecho?",opciones:["Sí","No"]},{id:"intensidad",texto:"¿Cómo describes la caída?",opciones:["Moderada","Intensa, me preocupa","Muy intensa con entradas visibles"]}],
    getRutina:(r)=>({ aviso:"La caída postparto es fisiológica y reversible. Se resuelve sola entre los 9-12 meses.", champu_corriente:{buscar:["Tensioactivos muy suaves","Pantenol","Aloe vera"],evitar:r.lactancia==="Sí"?["SLS","Parabenos","MIT/CMIT"]:["SLS","Parabenos"]}, champu_especifico:{buscar:["Cafeína","Extracto de romero","Biotina","Niacinamida"],evitar:["Alcohol Denat","Fragancias fuertes"]}, acondicionador:{buscar:["Pantenol","Queratina","Aceites naturales ligeros"],evitar:["Siliconas en raíz"]}, minoxidil:{incluir:false}, suplementos:r.lactancia==="Sí"?["Complejo vitamínico prenatal (continúa)","Hierro si hay déficit","Omega 3","Vitamina D — consulta dosis"]:["Hierro + vitamina C","Complejo vitamínico postnatal","Omega 3","Vitamina D"], medicacion:null, habitos:["🎀 Evita recogidos tensos","💨 Seca el pelo antes de dormir","🌡️ Agua tibia",r.intensidad==="Muy intensa con entradas visibles"?"⚠️ Con entradas visibles consulta con un profesional":"📅 Si no mejora en 9 meses, pide una analítica"] })
  },
  estres:{ label:"Caída por estrés", icon:"🧠", preguntas:[{id:"nivel",texto:"¿Cómo está tu nivel de estrés ahora?",opciones:["Sigue siendo alto","Ha bajado bastante","Ya estoy bien"]},{id:"sueno",texto:"¿Cómo duermes?",opciones:["Bien","Regular","Mal, pocas horas o mala calidad"]},{id:"inicio",texto:"¿La caída empezó tras un evento concreto?",opciones:["Sí, claramente","Puede que sí","No lo relaciono con nada"]}],
    getRutina:(r)=>({ aviso:"El estrés crónico eleva el cortisol, que altera el ciclo folicular. Sin reducir el estrés el tratamiento capilar tiene efecto muy limitado.", champu_corriente:{buscar:["Tensioactivos suaves","Pantenol","Glicerina"],evitar:["SLS","Fragancias artificiales"]}, champu_especifico:{buscar:["Cafeína","Extracto de romero","Niacinamida","Ginseng"],evitar:["MIT/CMIT","Parabenos"]}, acondicionador:{buscar:["Pantenol","Proteínas hidrolizadas","Aloe vera"],evitar:["Siliconas pesadas","Alcohol Denat"]}, minoxidil:{incluir:false}, suplementos:["Magnesio","Complejo B","Zinc","Vitamina D",r.sueno!=="Bien"?"Melatonina para el sueño":"Ashwagandha (adaptógeno natural)"], medicacion:null, habitos:["🧘 Masaje capilar de 5 minutos diarios","💨 Seca el pelo antes de dormir","🌡️ Agua tibia",r.sueno!=="Bien"?"😴 Prioriza el sueño":"✅ Mantén tus buenos hábitos de sueño",r.nivel==="Sigue siendo alto"?"⚠️ Sin reducir el estrés el tratamiento tiene efecto muy limitado":"⏳ El pelo tarda 3-6 meses en recuperarse"].filter(Boolean) })
  },
  caspa:{ label:"Caspa / dermatitis seborreica", icon:"❄️", preguntas:[{id:"tipo",texto:"¿Cómo es tu caspa?",opciones:["Escamas blancas finas (caspa seca)","Escamas amarillentas adheridas (caspa grasa)","Picor intenso sin muchas escamas"]},{id:"zona",texto:"¿Dónde se concentra?",opciones:["Solo cuero cabelludo","Cuero cabelludo y cejas/cara","Por todo el cuero cabelludo y nuca"]},{id:"grasa",texto:"¿Tu cuero cabelludo tiende a engrasarse?",opciones:["Sí, mucho","Normal","No, es más bien seco"]}],
    getRutina:(r)=>({ aviso:"La caspa y la dermatitis seborreica tienen un componente fúngico e inflamatorio. Requieren activos específicos y constancia.", champu_corriente:{buscar:["Tensioactivos suaves","Zinc PCA","Pantenol"],evitar:["Aceites pesados en cuero cabelludo","SLS si hay inflamación"]}, champu_especifico:{buscar:r.tipo==="Escamas amarillentas adheridas (caspa grasa)"?["Zinc Piritionato (1-2%)","Piroctona Olamina","Ácido salicílico"]:["Zinc Piritionato","Piroctona Olamina","Pantenol","Ácido salicílico"],evitar:["Fragancias intensas","Alcohol Denat"],nota:"Alterna con champú suave — el anticaspa no debe usarse todos los días"}, acondicionador:{buscar:["Pantenol","Alantoína","Aloe vera"],evitar:["Aceites pesados en raíz","Siliconas oclusivas"]}, minoxidil:{incluir:false}, suplementos:["Zinc","Probióticos","Omega 3","Vitamina D"], medicacion:"Para dermatitis seborreica moderada-severa existe medicación específica. Consulta con tu médico o enfermero capilar.", habitos:["🚫 No rascarse","💨 Seca el pelo antes de dormir","🌡️ Agua tibia",r.grasa==="Sí, mucho"?"🧴 Lava cada 2-3 días":"⚖️ No laves en exceso",r.zona==="Cuero cabelludo y cejas/cara"?"⚠️ Si afecta la cara, consulta con un dermatólogo":"📅 Si no mejora en 4-6 semanas, consulta"] })
  },
  sensible:{ label:"Cuero cabelludo sensible", icon:"🌸", preguntas:[{id:"sintoma",texto:"¿Cuál es tu síntoma principal?",opciones:["Picor o ardor frecuente","Enrojecimiento o irritación visible","Sensación de tensión o tirantez"]},{id:"reacciones",texto:"¿Reaccionas a muchos productos?",opciones:["Sí, a casi todos","A algunos","Solo a los muy agresivos"]},{id:"caida",texto:"¿Tienes también caída asociada?",opciones:["Sí, bastante","Un poco","No, solo sensibilidad"]}],
    getRutina:(r)=>({ aviso:"El cuero cabelludo sensible necesita rutinas simples. Menos ingredientes, mejor.", champu_corriente:{buscar:["Tensioactivos ultrasuaves (Sodium Cocoyl Glutamate)","Pantenol","Glicerina","Alantoína"],evitar:["SLS","MIT/CMIT","Fragancias artificiales","Alcohol Denat","Parabenos"]}, champu_especifico:{buscar:["Centella Asiática","Ácido hialurónico","Pantenol","Bisabolol"],evitar:["Fragancias","Alcohol Denat","Colorantes artificiales"]}, acondicionador:{buscar:["Pantenol","Alantoína","Aloe vera","Aceites ligeros"],evitar:["Fragancias artificiales","Siliconas pesadas"]}, minoxidil:{incluir:false}, suplementos:["Omega 3","Vitamina D","Probióticos",r.caida==="Sí, bastante"?"Biotina + Zinc":"Vitamina E"], medicacion:null, habitos:["🌡️ Agua fría o muy tibia","💨 Seca el pelo antes de dormir","🔥 Secador en frío",r.reacciones==="Sí, a casi todos"?"🧪 Introduce productos de uno en uno":"⏳ Espera 1 semana antes de evaluar","💧 1.5-2 litros de agua al día"] })
  },
  areata:{ label:"Alopecia areata", icon:"🔵", preguntas:[{id:"extension",texto:"¿Cómo es la pérdida de cabello?",opciones:["Una o pocas placas pequeñas","Varias placas o zonas amplias","Pérdida total o casi total"]},{id:"tiempo",texto:"¿Cuánto tiempo llevas con la alopecia areata?",opciones:["Menos de 3 meses","3-12 meses","Más de 1 año"]},{id:"estres",texto:"¿Notas relación con el estrés?",opciones:["Sí, claramente","Puede que sí","No lo relaciono"]}],
    getRutina:(r)=>({ aviso:"La alopecia areata es una enfermedad autoinmune. Requiere seguimiento médico obligatorio. La rutina cosmética es un apoyo, no un tratamiento.", champu_corriente:{buscar:["Tensioactivos ultrasuaves","Pantenol","Alantoína","Aloe vera"],evitar:["SLS","MIT/CMIT","Fragancias artificiales"]}, champu_especifico:{buscar:["Niacinamida","Zinc PCA","Pantenol","Centella asiática"],evitar:["Fragancias","Colorantes artificiales"],nota:"Prioriza la suavidad sobre la acción anticaída"}, acondicionador:{buscar:["Pantenol","Alantoína","Proteínas hidrolizadas"],evitar:["Siliconas pesadas","Fragancias"]}, minoxidil:{incluir:false}, suplementos:["Zinc (inmunomodulador)","Vitamina D","Omega 3","Probióticos"], medicacion:"La alopecia areata requiere valoración dermatológica obligatoria. Existen tratamientos con alta evidencia.", habitos:["🩺 El seguimiento médico es imprescindible","🧘 Gestión del estrés","💨 Seca el pelo antes de dormir","🚫 Evita masajes agresivos sobre las placas",r.extension==="Pérdida total o casi total"?"⚠️ Valoración especializada urgente":"📅 Fotografía las placas mensualmente"] })
  },
  tricotilomania:{ label:"Tricotilomanía", icon:"🤲", preguntas:[{id:"conciencia",texto:"¿Eres consciente cuando te arrancas el pelo?",opciones:["Sí, soy consciente","A veces, no siempre","No, es automático"]},{id:"zona",texto:"¿Dónde se concentra principalmente?",opciones:["Cuero cabelludo","Cejas o pestañas","Varias zonas"]},{id:"apoyo",texto:"¿Tienes apoyo psicológico actualmente?",opciones:["Sí","No, pero me lo estoy planteando","No"]}],
    getRutina:(r)=>({ aviso:"La tricotilomanía es un trastorno del control de impulsos. El tratamiento principal es psicológico. La rutina capilar cuida el cuero cabelludo afectado.", champu_corriente:{buscar:["Tensioactivos ultrasuaves","Pantenol","Aloe vera","Alantoína"],evitar:["SLS","MIT/CMIT","Fragancias artificiales"]}, champu_especifico:{buscar:["Niacinamida","Pantenol","Ácido hialurónico","Centella asiática"],evitar:["Fragancias","Alcohol Denat"],nota:"El objetivo es cuidar el cuero cabelludo y los folículos"}, acondicionador:{buscar:["Pantenol","Alantoína","Proteínas de seda"],evitar:["Fragancias artificiales","Siliconas pesadas"]}, minoxidil:{incluir:false}, suplementos:["Zinc","Biotina","Magnesio","Vitamina D","Omega 3"], medicacion:"El tratamiento es fundamentalmente psicológico (TCC). Consulta con un profesional de salud mental.", habitos:[r.apoyo==="No"?"🧠 El apoyo psicológico es el tratamiento principal":"✅ Continúa con tu apoyo psicológico","💆 Masaje suave como alternativa al arranque","💨 Seca el pelo antes de dormir","🤲 Mantén las manos ocupadas"] })
  },
  medicamentos:{ label:"Caída por medicamentos o bajada de peso brusca", icon:"💊", preguntas:[{id:"causa",texto:"¿Cuál es la causa principal?",opciones:["Medicamento (anticonceptivos, antidepresivos, retinoides...)","Bajada de peso brusca o dieta restrictiva","Ambas o no estoy seguro/a"]},{id:"fase",texto:"¿En qué momento estás?",opciones:["Aún tomando el medicamento / en la dieta","Acabo de terminar","Hace varios meses que terminé"]},{id:"intensidad",texto:"¿Cómo describes la caída?",opciones:["Moderada","Intensa","Muy intensa, me preocupa mucho"]}],
    getRutina:(r)=>({ aviso:r.causa==="Bajada de peso brusca o dieta restrictiva"?"La caída por restricción calórica es un efluvio telógeno reversible. Requiere restablecer el aporte nutricional.":"La caída asociada a ciertos medicamentos suele ser reversible. Nunca abandones un medicamento prescrito sin consultar a tu médico.", champu_corriente:{buscar:["Tensioactivos muy suaves","Pantenol","Aloe vera"],evitar:["SLS","MIT/CMIT","Parabenos"]}, champu_especifico:{buscar:["Cafeína","Niacinamida","Extracto de romero","Pantenol"],evitar:["Alcohol Denat","Fragancias fuertes"],nota:"3-4 veces por semana"}, acondicionador:{buscar:["Pantenol","Proteínas hidrolizadas","Queratina"],evitar:["Siliconas pesadas en raíz"]}, minoxidil:{incluir:false}, suplementos:r.causa==="Bajada de peso brusca o dieta restrictiva"?["Hierro + vitamina C (fundamental)","Proteínas completas en la dieta","Zinc","Biotina","Vitamina D"]:["Hierro si hay déficit","Zinc","Biotina","Vitamina D","Omega 3"], medicacion:"Nunca abandones un medicamento prescrito por su efecto sobre el cabello. Consulta con tu médico.", habitos:["🥗 Proteínas, hierro y zinc imprescindibles","💨 Seca el pelo antes de dormir","🌡️ Agua tibia","🎀 Evita recogidos tensos",r.fase==="Acabo de terminar"?"⏳ El pelo tarda 3-6 meses en recuperarse":"📅 Si llevas más de 6 meses sin mejorar, consulta",r.intensidad==="Muy intensa, me preocupa mucho"?"⚠️ Solicita una analítica completa":""].filter(Boolean) })
  },
};

const teal="#2a8a8a", tB="rgba(42,138,138,0.35)";
const LCFG={ alto:{color:"#e05555",bg:"rgba(224,85,85,0.08)",border:"rgba(224,85,85,0.25)"}, medio:{color:"#e0a855",bg:"rgba(224,168,85,0.08)",border:"rgba(224,168,85,0.25)"}, bajo:{color:"#8a9aaa",bg:"rgba(138,154,170,0.08)",border:"rgba(138,154,170,0.25)"}, positivo:{color:"#5aaa7a",bg:"rgba(90,170,122,0.08)",border:"rgba(90,170,122,0.25)"} };
const RATINGS=[{min:9,max:10,label:"Excelente",emoji:"⭐⭐⭐⭐⭐",color:"#5aaa7a",desc:"Sin elementos problemáticos destacables."},{min:7,max:8,label:"Bueno",emoji:"⭐⭐⭐⭐",color:"#7acc7a",desc:"Recomendable con pocos elementos a vigilar."},{min:5,max:6,label:"Aceptable",emoji:"⭐⭐⭐",color:"#e0c855",desc:"Tolerable pero con margen de mejora."},{min:3,max:4,label:"Problemático",emoji:"⭐⭐",color:"#e08855",desc:"Varios ingredientes a evitar."},{min:0,max:2,label:"Evitar",emoji:"⭐",color:"#e05555",desc:"Ingredientes claramente problemáticos."}];
const getRating=s=>RATINGS.find(r=>s>=r.min&&s<=r.max)||RATINGS[4];
const calcScore=f=>Math.round(Math.max(0,Math.min(100,f.reduce((a,i)=>a+i.score,100)))/10);
const doAnalyze=text=>{const inp=text.toLowerCase(),found=[],seen=new Set();for(const ing of DB)for(const a of ing.aliases)if(inp.includes(a)&&!seen.has(ing.name)){found.push(ing);seen.add(ing.name);break;}return found;};

const BtnIG=()=>(
  <a href="https://instagram.com/soydanienfermerocapilar" target="_blank" rel="noopener noreferrer"
    style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"14px 18px",background:"linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",borderRadius:12,color:"#fff",fontSize:14,fontFamily:"Georgia,serif",textDecoration:"none",boxSizing:"border-box"}}>
    <span style={{fontSize:22,flexShrink:0}}>📲</span>
    <div><div style={{fontWeight:"bold",fontSize:14}}>Consulta online con Daniel</div><div style={{fontSize:12,opacity:0.9,marginTop:2}}>@soydanienfermerocapilar · Enfermero capilar</div></div>
  </a>
);

const Sec=({color,bg,border,title,items})=>!items?.length?null:(
  <div style={{background:bg,border:`1px solid ${border}`,borderRadius:10,padding:"13px 15px",marginBottom:8}}>
    <div style={{fontSize:12,color,marginBottom:8}}>{title}</div>
    {items.map((i,k)=><div key={k} style={{display:"flex",gap:8,marginBottom:5}}><span style={{color,fontSize:10,flexShrink:0,marginTop:3}}>✦</span><span style={{fontSize:12,color:"#9aada8",lineHeight:1.6}}>{i}</span></div>)}
  </div>
);

const ProdBloque=({perfil,cat,titulo,icono})=>{
  const lista=P.filter(p=>p.cats.includes(cat)&&p.perfs.includes(perfil)).sort((a,b)=>a.precio-b.precio);
  if(!lista.length)return null;
  return(
    <div style={{background:"rgba(42,138,138,0.04)",border:`1px solid rgba(42,138,138,0.2)`,borderRadius:10,padding:"13px 15px",marginBottom:8}}>
      <div style={{fontSize:12,color:teal,marginBottom:10}}>{icono} {titulo} — Productos recomendados</div>
      {lista.map((p,k)=>(
        <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:k<lista.length-1?"1px solid rgba(42,138,138,0.1)":"none",paddingBottom:k<lista.length-1?9:0,marginBottom:k<lista.length-1?9:0,gap:12}}>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:"#c0d5d0"}}>{p.marca} — {p.nombre}</div>
            {p.nota&&<div style={{fontSize:11,color:"#5a8a8a",marginTop:2,fontStyle:"italic"}}>{p.nota}</div>}
          </div>
          <div style={{fontSize:13,color:"#5aaa7a",fontWeight:"bold",flexShrink:0}}>{p.precio.toFixed(2)} €</div>
        </div>
      ))}
    </div>
  );
};

const RutinaResult=({r,icono,tipo,perfil,onReset})=>(
  <div>
    <button onClick={onReset} style={{background:"none",border:"none",color:"#3a6a6a",cursor:"pointer",fontSize:12,marginBottom:16,fontFamily:"inherit",padding:0}}>← Nueva consulta</button>
    <div style={{padding:"14px 16px",background:"rgba(42,138,138,0.05)",border:`1px solid ${tB}`,borderRadius:12,marginBottom:14}}>
      <div style={{fontSize:10,letterSpacing:3,color:teal,textTransform:"uppercase",marginBottom:4}}>Tu rutina personalizada</div>
      <div style={{fontSize:17,color:"#f0ede6",marginBottom:6}}>{icono} {tipo}</div>
      <p style={{fontSize:12,color:"#7a9a90",margin:0,lineHeight:1.7,fontStyle:"italic"}}>{r.aviso}</p>
    </div>
    {perfil&&<ProdBloque perfil={perfil} cat="champu_corriente" titulo="Champú uso corriente" icono="🧴"/>}
    {perfil&&<ProdBloque perfil={perfil} cat="champu_especifico" titulo="Champú específico" icono="🔬"/>}
    {perfil&&<ProdBloque perfil={perfil} cat="acondicionador" titulo="Acondicionador / Mascarilla" icono="💆"/>}
    {perfil&&<ProdBloque perfil={perfil} cat="suplemento" titulo="Suplementos" icono="💊"/>}
    {r.minoxidil?.incluir&&<div style={{background:"rgba(90,170,122,0.06)",border:"1px solid rgba(90,170,122,0.2)",borderRadius:10,padding:"13px 15px",marginBottom:8}}><div style={{fontSize:12,color:"#5aaa7a",marginBottom:6}}>💧 Minoxidil tópico 5% — venta libre</div><p style={{fontSize:12,color:"#9aada8",margin:0,lineHeight:1.7}}>{r.minoxidil.nota}</p></div>}
    <Sec color="#5aaa7a" bg="rgba(90,170,122,0.06)" border="rgba(90,170,122,0.2)" title="🧴 Champú corriente — buscar" items={r.champu_corriente?.buscar}/>
    <Sec color="#e05555" bg="rgba(224,85,85,0.06)" border="rgba(224,85,85,0.2)" title="🚫 Champú corriente — evitar" items={r.champu_corriente?.evitar}/>
    <Sec color="#5aaa7a" bg="rgba(90,170,122,0.06)" border="rgba(90,170,122,0.2)" title="🔬 Champú específico — buscar" items={[...(r.champu_especifico?.buscar||[]),r.champu_especifico?.nota&&`ℹ️ ${r.champu_especifico.nota}`].filter(Boolean)}/>
    <Sec color="#e05555" bg="rgba(224,85,85,0.06)" border="rgba(224,85,85,0.2)" title="🚫 Champú específico — evitar" items={r.champu_especifico?.evitar}/>
    <Sec color="#5aaa7a" bg="rgba(90,170,122,0.06)" border="rgba(90,170,122,0.2)" title="💆 Acondicionador — buscar" items={r.acondicionador?.buscar}/>
    <Sec color="#e05555" bg="rgba(224,85,85,0.06)" border="rgba(224,85,85,0.2)" title="🚫 Acondicionador — evitar" items={r.acondicionador?.evitar}/>
    <Sec color="#e0a855" bg="rgba(224,168,85,0.06)" border="rgba(224,168,85,0.2)" title="💊 Suplementación a valorar" items={r.suplementos}/>
    {r.medicacion&&<div style={{background:"rgba(224,85,85,0.04)",border:"1px solid rgba(224,85,85,0.2)",borderRadius:10,padding:"13px 15px",marginBottom:8}}><div style={{fontSize:12,color:"#e05555",marginBottom:6}}>⚕️ Tratamiento médico específico</div><p style={{fontSize:12,color:"#9aada8",margin:0,lineHeight:1.7}}>{r.medicacion}</p></div>}
    <Sec color="#8a9aaa" bg="rgba(138,154,170,0.06)" border="rgba(138,154,170,0.2)" title="📌 Hábitos personalizados" items={r.habitos}/>
    <p style={{fontSize:11,color:"#2a5a5a",textAlign:"center",margin:"12px 0",lineHeight:1.7,fontStyle:"italic"}}>Rutina orientativa elaborada por Daniel Hermosa Pérez, enfermero especialista en salud capilar. No sustituye la valoración clínica individualizada.</p>
    <BtnIG/>
    <button onClick={onReset} style={{width:"100%",marginTop:10,padding:13,background:"none",border:`1px solid ${tB}`,borderRadius:8,color:"#5a8a8a",fontSize:14,fontFamily:"inherit",cursor:"pointer"}}>← Nueva consulta</button>
  </div>
);

function RutinaTab(){
  const [step,setStep]=useState("inicio");
  const [nota,setNota]=useState("");
  const [tipo,setTipo]=useState(null);
  const [resp,setResp]=useState({});
  const [pregIdx,setPregIdx]=useState(0);
  const [iaRutina,setIaRutina]=useState(null);
  const [iaLoading,setIaLoading]=useState(false);
  const [iaError,setIaError]=useState("");
  const reset=()=>{setStep("inicio");setNota("");setTipo(null);setResp({});setPregIdx(0);setIaRutina(null);setIaLoading(false);setIaError("");};
  const generarIA=async()=>{
    if(!nota.trim()||iaLoading)return;
    setIaLoading(true);setIaError("");
    try{
      const nc=nota.replace(/\\/g,"\\\\").replace(/"/g,"'").replace(/\n/g," ").replace(/\r/g,"");
      const body=`{"model":"claude-sonnet-4-20250514","max_tokens":1500,"messages":[{"role":"user","content":"Eres Daniel Hermosa Pérez, enfermero especialista en cuidados capilares. El paciente dice: ${nc}. Dame una rutina en JSON sin markdown: {\\\"tipo\\\":\\\"string\\\",\\\"aviso\\\":\\\"string\\\",\\\"champu_corriente\\\":{\\\"buscar\\\":[\\\"item\\\"],\\\"evitar\\\":[\\\"item\\\"]},\\\"champu_especifico\\\":{\\\"buscar\\\":[\\\"item\\\"],\\\"evitar\\\":[\\\"item\\\"],\\\"nota\\\":\\\"string\\\"},\\\"acondicionador\\\":{\\\"buscar\\\":[\\\"item\\\"],\\\"evitar\\\":[\\\"item\\\"]},\\\"minoxidil\\\":{\\\"incluir\\\":false,\\\"nota\\\":\\\"\\\"},\\\"suplementos\\\":[\\\"item\\\"],\\\"medicacion\\\":null,\\\"habitos\\\":[\\\"h1\\\",\\\"h2\\\",\\\"h3\\\",\\\"h4\\\",\\\"h5\\\"]}"}]}`;
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:body});
      if(!res.ok)throw new Error("api");
      const data=await res.json();
      const txt=(data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      setIaRutina(JSON.parse(txt));setStep("ia_resultado");
    }catch(e){setIaError("No se pudo generar. Usa la opción manual de abajo.");}
    finally{setIaLoading(false);}
  };
  const rutinaDef=tipo?RUTINAS[tipo]:null;
  const preguntas=rutinaDef?.preguntas||[];
  const pregActual=preguntas[pregIdx];
  const resultado=tipo&&step==="resultado"?RUTINAS[tipo].getRutina(resp):null;
  const responder=val=>{const n={...resp,[pregActual.id]:val};setResp(n);if(pregIdx<preguntas.length-1)setPregIdx(pregIdx+1);else setStep("resultado");};
  return(
    <div style={{animation:"fadeUp 0.4s ease"}}>
      {step==="inicio"&&<>
        <p style={{fontSize:13,color:"#5a8a8a",marginBottom:14,fontStyle:"italic"}}>Cuéntame qué te pasa con tu cabello y generaré una rutina personalizada.</p>
        <textarea value={nota} onChange={e=>setNota(e.target.value)} placeholder="Ejemplo: Me pica el cuero cabelludo desde hace un año, empeora con el estrés..." rows={4} style={{width:"100%",padding:"12px 14px",background:"rgba(42,138,138,0.05)",border:`1px solid ${tB}`,borderRadius:10,color:"#f0ede6",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",resize:"vertical",lineHeight:1.7}}/>
        {iaError&&<p style={{fontSize:12,color:"#e05555",margin:"8px 0 0",textAlign:"center"}}>{iaError}</p>}
        <button onClick={generarIA} disabled={!nota.trim()||iaLoading} style={{width:"100%",marginTop:10,padding:14,background:nota.trim()&&!iaLoading?"linear-gradient(135deg,#1a6a6a,#0d4a4a)":"rgba(42,138,138,0.1)",border:`1px solid ${nota.trim()&&!iaLoading?teal:"#1a2e2e"}`,borderRadius:8,color:nota.trim()&&!iaLoading?"#e0f5f5":"#3a6a6a",fontSize:14,fontFamily:"inherit",cursor:nota.trim()&&!iaLoading?"pointer":"not-allowed"}}>
          {iaLoading?"⏳ Generando tu rutina...":"✨ Generar mi rutina"}
        </button>
        <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}><div style={{flex:1,height:1,background:"#1a2e2e"}}/><span style={{fontSize:11,color:"#2a5a5a",whiteSpace:"nowrap"}}>o elige tu perfil</span><div style={{flex:1,height:1,background:"#1a2e2e"}}/></div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {Object.entries(RUTINAS).map(([key,val])=>(
            <button key={key} onClick={()=>{setTipo(key);setStep("preguntas");setPregIdx(0);setResp({});}} style={{background:"rgba(42,138,138,0.04)",border:`1px solid ${tB}`,borderRadius:12,padding:"14px 18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:14,color:"inherit"}}>
              <span style={{fontSize:22}}>{val.icon}</span><span style={{fontSize:14,color:"#c0d5d0"}}>{val.label}</span><span style={{marginLeft:"auto",color:teal,fontSize:18}}>›</span>
            </button>
          ))}
        </div>
        <div style={{marginTop:16}}><BtnIG/></div>
      </>}
      {step==="ia_resultado"&&iaRutina&&<RutinaResult r={iaRutina} icono="✨" tipo={iaRutina.tipo} perfil={null} onReset={reset}/>}
      {step==="preguntas"&&pregActual&&<>
        <button onClick={()=>{setStep("inicio");setPregIdx(0);}} style={{background:"none",border:"none",color:"#3a6a6a",cursor:"pointer",fontSize:12,marginBottom:16,fontFamily:"inherit",padding:0}}>← Volver</button>
        <div style={{marginBottom:20}}>
          <span style={{fontSize:10,color:"#2a5a5a",textTransform:"uppercase",letterSpacing:2}}>Pregunta {pregIdx+1} de {preguntas.length}</span>
          <div style={{height:4,background:"#1a2e2e",borderRadius:2,overflow:"hidden",marginTop:6}}><div style={{height:"100%",width:`${((pregIdx+1)/preguntas.length)*100}%`,background:teal,borderRadius:2,transition:"width 0.3s"}}/></div>
        </div>
        <div style={{background:"rgba(42,138,138,0.05)",border:`1px solid ${tB}`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontSize:11,color:teal,marginBottom:4}}>{rutinaDef.icon} {rutinaDef.label}</div>
          <p style={{fontSize:15,color:"#f0ede6",margin:0,lineHeight:1.5}}>{pregActual.texto}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {pregActual.opciones.map(op=><button key={op} onClick={()=>responder(op)} style={{background:"rgba(42,138,138,0.04)",border:`1px solid ${tB}`,borderRadius:10,padding:"14px 18px",cursor:"pointer",textAlign:"left",fontFamily:"inherit",fontSize:13,color:"#c0d5d0"}}>{op}</button>)}
        </div>
      </>}
      {step==="resultado"&&resultado&&<RutinaResult r={resultado} icono={rutinaDef?.icon} tipo={rutinaDef?.label} perfil={tipo} onReset={reset}/>}
    </div>
  );
}

function AnalizadorTab(){
  const [mode,setMode]=useState(null);
  const [stage,setStage]=useState("idle");
  const [txt,setTxt]=useState("");
  const [results,setResults]=useState(null);
  const [score,setScore]=useState(null);
  const [imgLoading,setImgLoading]=useState(false);
  const [imgError,setImgError]=useState("");
  const fileRef=useRef();
  const reset=()=>{setMode(null);setStage("idle");setTxt("");setResults(null);setScore(null);setImgLoading(false);setImgError("");};
  const finish=text=>{const f=doAnalyze(text);setResults(f);setScore(calcScore(f));setStage("results");};
  const handleFile=async(file)=>{
    if(!file)return;
    setImgLoading(true);setImgError("");
    try{
      const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=()=>rej(new Error("read"));r.readAsDataURL(file);});
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:file.type||"image/jpeg",data:b64}},{type:"text",text:"Extrae ÚNICAMENTE la lista de ingredientes INCI de esta etiqueta, separados por comas, sin añadir nada más."}]}]})});
      if(!res.ok)throw new Error("api");
      const data=await res.json();
      const extracted=(data.content?.[0]?.text||"").trim();
      if(!extracted)throw new Error("empty");
      finish(extracted);
    }catch(e){setImgError("No se pudo leer la imagen. Intenta con mejor iluminación o usa la opción de texto.");}
    finally{setImgLoading(false);}
  };
  const rating=score!==null?getRating(score):null;
  const groups=results?[
    {items:results.filter(r=>r.level==="alto"),title:"🔴 Irritantes confirmados",cfg:LCFG.alto},
    {items:results.filter(r=>r.level==="medio"),title:"🟡 Alérgenos declaración UE",cfg:LCFG.medio},
    {items:results.filter(r=>r.level==="bajo"),title:"🔵 A vigilar con uso continuado",cfg:LCFG.bajo},
    {items:results.filter(r=>r.level==="positivo"),title:"🟢 Ingredientes beneficiosos",cfg:LCFG.positivo},
  ]:[];
  return(
    <div style={{animation:"fadeUp 0.4s ease"}}>
      {stage==="idle"&&!mode&&<>
        <p style={{fontSize:13,color:"#5a8a8a",textAlign:"center",marginBottom:16,fontStyle:"italic"}}>Analiza si un producto es seguro para tu cabello.</p>
        <button onClick={()=>setMode("foto")} style={{width:"100%",padding:16,background:"linear-gradient(135deg,#1a6a6a,#0d4a4a)",border:`1px solid ${teal}`,borderRadius:10,color:"#e0f5f5",fontSize:15,fontFamily:"inherit",cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:22}}>📸</span><div style={{textAlign:"left"}}><div>Fotografiar etiqueta</div><div style={{fontSize:11,color:"#7abaaa",marginTop:2}}>Haz foto o sube imagen desde galería</div></div>
        </button>
        <button onClick={()=>setMode("text")} style={{width:"100%",padding:14,background:"none",border:`1px solid ${tB}`,borderRadius:10,color:"#5a8a8a",fontSize:14,fontFamily:"inherit",cursor:"pointer",marginBottom:18,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <span style={{fontSize:18}}>📋</span> Pegar lista de ingredientes
        </button>
        <div style={{border:"1px solid #1a2e2e",borderRadius:10,padding:14,background:"rgba(42,138,138,0.02)",marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:3,color:"#2a5a5a",textTransform:"uppercase",marginBottom:10,fontWeight:"bold"}}>Qué analiza</div>
          {[["🔴","Irritantes confirmados (SLS, MIT/CMIT, formaldehído...)"],["🟡","Alérgenos de declaración obligatoria UE (linalool, limoneno...)"],["🔵","A vigilar con uso continuado (parabenos, siliconas, alcohol denat...)"],["🟢","Beneficiosos con evidencia (cafeína, zinc, niacinamida, aminexil...)"]].map(([i,t],k)=>(
            <div key={k} style={{display:"flex",gap:10,marginBottom:5}}><span style={{fontSize:12}}>{i}</span><span style={{fontSize:12,color:"#5a8a8a",lineHeight:1.6}}>{t}</span></div>
          ))}
        </div>
        <BtnIG/>
      </>}
      {stage==="idle"&&mode==="foto"&&<div style={{animation:"fadeUp 0.3s ease"}}>
        <button onClick={()=>setMode(null)} style={{background:"none",border:"none",color:"#3a6a6a",cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"inherit",padding:0}}>← Volver</button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handleFile(e.target.files?.[0])}/>
        <div style={{border:`2px dashed ${tB}`,borderRadius:16,padding:"32px 20px",textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:44,marginBottom:10}}>📸</div>
          <p style={{fontSize:14,color:"#5a8a8a",marginBottom:18,lineHeight:1.7}}>Fotografía la lista de ingredientes.<br/><span style={{fontSize:12,color:"#2a5a5a"}}>Texto legible y bien iluminado.</span></p>
          <button onClick={()=>fileRef.current&&fileRef.current.click()} disabled={imgLoading} style={{padding:"13px 0",background:"linear-gradient(135deg,#1a6a6a,#0d4a4a)",border:`1px solid ${teal}`,borderRadius:8,color:"#e0f5f5",fontSize:14,fontFamily:"inherit",cursor:"pointer",width:"100%"}}>
            {imgLoading?"⏳ Leyendo ingredientes...":"📷 Abrir cámara / galería"}
          </button>
        </div>
        {imgError&&<div style={{padding:"11px 14px",background:"rgba(224,85,85,0.08)",border:"1px solid rgba(224,85,85,0.25)",borderRadius:8,marginBottom:12}}><p style={{fontSize:12,color:"#e05555",margin:0}}>{imgError}</p></div>}
        <button onClick={()=>setMode("text")} style={{width:"100%",padding:11,background:"none",border:"1px solid #1a2e2e",borderRadius:8,color:"#3a6a6a",fontSize:13,fontFamily:"inherit",cursor:"pointer"}}>Prefiero pegar el texto</button>
      </div>}
      {stage==="idle"&&mode==="text"&&<div style={{animation:"fadeUp 0.3s ease"}}>
        <button onClick={()=>setMode(null)} style={{background:"none",border:"none",color:"#3a6a6a",cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"inherit",padding:0}}>← Volver</button>
        <div style={{fontSize:10,letterSpacing:3,color:teal,textTransform:"uppercase",marginBottom:8}}>Lista de ingredientes</div>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder={"Pega aquí los ingredientes...\n\nEjemplo: Aqua, Caffeine, Panthenol, Zinc Pyrithione..."} rows={8} style={{width:"100%",padding:"12px 14px",background:"rgba(42,138,138,0.05)",border:`1px solid ${tB}`,borderRadius:10,color:"#f0ede6",fontSize:13,fontFamily:"inherit",boxSizing:"border-box",resize:"vertical",lineHeight:1.7}}/>
        <button onClick={()=>txt.trim()&&finish(txt)} disabled={!txt.trim()} style={{width:"100%",marginTop:10,padding:13,background:txt.trim()?"linear-gradient(135deg,#1a6a6a,#0d4a4a)":"rgba(42,138,138,0.1)",border:`1px solid ${txt.trim()?teal:"#1a2e2e"}`,borderRadius:8,color:txt.trim()?"#e0f5f5":"#3a6a6a",fontSize:14,fontFamily:"inherit",cursor:txt.trim()?"pointer":"not-allowed"}}>
          🔬 Analizar ingredientes
        </button>
      </div>}
      {stage==="results"&&results&&rating&&<div style={{animation:"fadeUp 0.4s ease"}}>
        <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${rating.color}40`,marginBottom:16}}>
          <div style={{background:`linear-gradient(135deg,${rating.color}20,${rating.color}08)`,padding:"18px 16px",display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:64,height:64,flexShrink:0,borderRadius:"50%",border:`3px solid ${rating.color}`,background:`${rating.color}15`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:22,color:rating.color,lineHeight:1,fontWeight:"bold"}}>{score}</span>
              <span style={{fontSize:9,color:`${rating.color}90`}}>/10</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:18,color:rating.color,marginBottom:2}}>{rating.label}</div>
              <div style={{fontSize:14,marginBottom:6}}>{rating.emoji}</div>
              <p style={{fontSize:12,color:"#7a9a90",margin:0,lineHeight:1.5}}>{rating.desc}</p>
            </div>
          </div>
          <div style={{padding:"8px 16px 12px",background:"rgba(0,0,0,0.2)"}}><div style={{height:5,background:"#1a2e2e",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${score*10}%`,background:"linear-gradient(90deg,#e05555,#e0a855,#e0c855,#7acc7a,#5aaa7a)",borderRadius:3}}/></div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderTop:"1px solid #1a2e2e"}}>
            {[["#e05555","Irritante"],["#e0a855","Alérgeno"],["#8a9aaa","A vigilar"],["#5aaa7a","Benef."]].map(([c,l],i)=>(
              <div key={i} style={{padding:"10px 4px",textAlign:"center",borderRight:i<3?"1px solid #1a2e2e":"none"}}>
                <div style={{fontSize:18,color:c}}>{["alto","medio","bajo","positivo"].map(lv=>results.filter(r=>r.level===lv).length)[i]}</div>
                <div style={{fontSize:9,color:"#2a5a5a",textTransform:"uppercase"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {results.length===0&&<div style={{textAlign:"center",padding:24,border:"1px solid #1a2e2e",borderRadius:12,marginBottom:16}}><p style={{fontSize:13,color:"#5a8a8a",margin:0}}>No se detectaron ingredientes. Verifica que el texto sea una lista INCI completa.</p></div>}
        {groups.map(({items,title,cfg})=>items.length>0&&(
          <div key={title} style={{marginBottom:14}}>
            <div style={{fontSize:10,letterSpacing:2,color:cfg.color,textTransform:"uppercase",marginBottom:8}}>{title}</div>
            {items.map(ing=>(
              <div key={ing.name} style={{background:cfg.bg,border:`1px solid ${cfg.border}`,borderRadius:10,padding:"11px 13px",marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3,gap:8}}>
                  <span style={{fontSize:13,color:cfg.color}}>{ing.name}</span>
                  <span style={{fontSize:9,color:cfg.color,background:`${cfg.color}20`,padding:"2px 7px",borderRadius:10,flexShrink:0}}>{ing.category}</span>
                </div>
                <p style={{fontSize:12,color:"#9aada8",margin:"0 0 4px",lineHeight:1.6}}>{ing.description}</p>
                <p style={{fontSize:11,color:"#6a8a80",margin:0,lineHeight:1.5,fontStyle:"italic"}}>💡 {ing.tip}</p>
              </div>
            ))}
          </div>
        ))}
        <p style={{fontSize:11,color:"#2a5a5a",textAlign:"center",margin:"12px 0",lineHeight:1.7,fontStyle:"italic"}}>Herramienta orientativa elaborada por Daniel Hermosa Pérez, enfermero especialista en salud capilar.</p>
        <BtnIG/>
        <button onClick={reset} style={{width:"100%",marginTop:10,padding:13,background:"none",border:`1px solid ${tB}`,borderRadius:8,color:"#5a8a8a",fontSize:14,fontFamily:"inherit",cursor:"pointer"}}>🔬 Analizar otro producto</button>
      </div>}
    </div>
  );
}

export default function App(){
  const [tab,setTab]=useState("rutina");
  return(
    <div style={{minHeight:"100vh",background:"#080c0c",fontFamily:"Georgia,serif",color:"#f0ede6"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} textarea:focus{outline:none;border-color:#2a8a8a!important} textarea::placeholder{color:#2a5a5a;font-size:13px} button:hover{opacity:0.9} a:hover{opacity:0.9}`}</style>
      <div style={{background:"linear-gradient(160deg,#0a1f1f,#080c0c 60%,#0d0a1a)",borderBottom:`1px solid ${tB}`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse at 50% 0%,rgba(42,138,138,0.13),transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:2,background:`linear-gradient(90deg,transparent,${teal},transparent)`}}/>
        <div style={{textAlign:"center",padding:"20px 20px 0"}}>
          <div style={{fontSize:22,fontWeight:"bold",color:"#f0ede6",marginBottom:4}}>@soydanienfermerocapilar</div>
          <div style={{fontSize:12,color:teal,marginBottom:14,letterSpacing:1}}>Enfermero especialista en cuidados capilares</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
          {[["rutina","💆 Mi Rutina"],["analizador","🔬 Analizador INCI"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"11px 8px",background:tab===t?"rgba(42,138,138,0.12)":"none",border:"none",borderBottom:tab===t?`2px solid ${teal}`:"2px solid transparent",color:tab===t?teal:"#3a6a6a",fontSize:13,fontFamily:"inherit",cursor:"pointer"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{maxWidth:620,margin:"0 auto",padding:"20px 16px"}}>
        {tab==="rutina"?<RutinaTab/>:<AnalizadorTab/>}
        <div style={{marginTop:24,textAlign:"center",paddingBottom:18,borderTop:"1px solid #1a2e2e",paddingTop:18}}>
          <div style={{fontSize:16,color:"#f0ede6",marginBottom:3}}>@soydanienfermerocapilar</div>
          <p style={{fontSize:11,color:teal,margin:0,letterSpacing:1}}>Enfermero especialista en cuidados capilares</p>
        </div>
      </div>
    </div>
  );
}
