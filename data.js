
const LEVELS = [
  {k:'D', label:'À découvrir'},
  {k:'A', label:'En acquisition'},
  {k:'M', label:'Maîtrisé'}
];

const CATEGORIES = [
  {
    id:'baby', label:'Baby Hand', full:'Baby Hand (dès 3 ans)',
    objectif:"Découvrir le plaisir du mouvement, du ballon, de l'espace et de l'opposition.",
    sections:[
      {t:'Motricité / coordination', i:["Courir et s'arrêter","Sauter à pieds joints","Changer de direction","Ramper / grimper / franchir","Tenir son équilibre","Coordonner bras et jambes"]},
      {t:'Ballon / manipulation', i:["Tenir un ballon correctement","Lancer à deux mains","Rattraper un ballon","Faire rouler le ballon vers une cible","Lancer vers une cible","Commencer à faire rebondir le ballon"]},
      {t:'Passe / réception', i:["Faire une passe courte","Rattraper un ballon lancé doucement","Identifier un partenaire","Se déplacer vers le partenaire"]},
      {t:'Tir / cible', i:["Viser une cible","Lancer fort vers une cible","Tirer depuis une zone proche"]},
      {t:'Dribble', i:["Faire rebondir le ballon","Dribbler quelques fois sans perdre le ballon","Se déplacer avec le ballon"]},
      {t:'Attaque / 1c1', i:["Courir vers un espace libre","Oser aller vers le but","Découvrir le duel","Changer de direction pour éviter un adversaire"]},
      {t:'Défense', i:["Identifier son adversaire","Se placer entre adversaire et cible","Essayer de récupérer le ballon","Revenir vers sa zone"]},
      {t:'Jeu collectif', i:["Partager le ballon","Comprendre partenaire/adversaire","Participer à un mini-match","Respecter une règle simple"]},
      {t:'Gardien', i:["Découvrir le rôle du gardien","Arrêter un ballon avec les mains","Relancer simplement"]},
      {t:'Comportement / autonomie', i:["Écouter une consigne courte","Respecter les autres","Ranger le matériel avec aide","Oser essayer","Accepter l'erreur"]}
    ],
    themes:["Courir avec coordination","Sauter / changer de direction","Lancer et rattraper","Dribbler librement","Viser une cible","Reconnaître partenaire/adversaire","Respecter les règles simples"]
  },
  {
    id:'mini7', label:'-7', full:'Mini Hand (-7 ans)',
    objectif:"Construire les fondamentaux moteurs et les premières compétences handball.",
    sections:[
      {t:'Motricité / coordination', i:["Courir avec ballon","Changer de rythme","Changer de direction","Sauter et retomber en équilibre","Coordonner course et lancer"]},
      {t:'Ballon / manipulation', i:["Maîtriser le ballon à deux mains","Maîtriser le rebond","Protéger le ballon","Changer de main"]},
      {t:'Passe / réception', i:["Faire une passe précise à deux mains","Réceptionner à deux mains","Faire une passe à un partenaire en mouvement","Regarder avant de passer"]},
      {t:'Tir', i:["Tirer vers une cible","Tirer après une course","Choisir une zone de tir","Doser la force"]},
      {t:'Dribble', i:["Maîtriser le dribble de base","Dribbler en avançant","Changer de direction en dribble","Reprendre le contrôle après un rebond"]},
      {t:'Attaque / 1c1', i:["Attaquer un espace libre","Découvrir le 1c1","Changer de direction face au défenseur","Aller vers le but après avoir dépassé"]},
      {t:'Défense', i:["Se placer entre joueur et but","Suivre son adversaire","Se déplacer latéralement","Essayer d'intercepter","Revenir en défense"]},
      {t:'Jeu collectif', i:["Se démarquer","Écarter le jeu","Passer et bouger","Comprendre attaque/défense"]},
      {t:'Gardien', i:["Se placer face au but","Arrêter un tir simple","Relancer vers un partenaire"]},
      {t:'Comportement / autonomie', i:["Respecter les règles","Écouter une consigne","Accepter l'alternance attaque/défense","Encourager un partenaire","Prendre soin du matériel"]}
    ],
    themes:["Maîtriser le dribble de base","Faire une passe à deux mains","Réceptionner un ballon","Tirer vers une cible","Se déplacer vers l'espace libre","Se placer entre son adversaire et le but","Découvrir le 1c1"]
  },
  {
    id:'m9', label:'-9', full:'-9',
    objectif:"Maîtriser les fondamentaux individuels et commencer à lire les situations de jeu.",
    sections:[
      {t:'Motricité / coordination', i:["Coordonner course, saut et tir","Changer de rythme","Changer de direction rapidement","S'arrêter et repartir efficacement"]},
      {t:'Ballon / manipulation', i:["Protéger le ballon","Changer de main","Manipuler sous pression","Garder la tête relevée"]},
      {t:'Passe / réception', i:["Passe à une main","Passe en mouvement","Réception en course","Regarder avant réception","Varier la force et la trajectoire"]},
      {t:'Tir', i:["Tir en course","Tir en appui","Tirer après réception","Viser une zone libre"]},
      {t:'Dribble', i:["Maîtriser le dribble en déplacement","Changer de main","Changer de direction","Changer de rythme","Dribbler en protégeant son ballon"]},
      {t:'Attaque / 1c1', i:["Attaquer l'intervalle","Réaliser une feinte simple","Battre un défenseur en 1c1","Enchaîner duel et tir/passe"]},
      {t:'Défense', i:["Défendre son duel","Se placer sur la trajectoire","Se déplacer latéralement","Intercepter","Aider puis revenir"]},
      {t:'Jeu collectif', i:["Se démarquer","Occuper largeur et profondeur","Passer et se déplacer","Fixer puis passer sur situation simple"]},
      {t:'Transition', i:["Réagir après perte de balle","Revenir rapidement","Se projeter après récupération"]},
      {t:'Gardien', i:["Se placer","Se déplacer sur sa ligne","Arrêter des tirs variés","Relancer rapidement"]},
      {t:'Comportement / autonomie', i:["Prendre une décision","Accepter l'erreur","Communiquer","Respecter partenaire et adversaire"]}
    ],
    themes:["Maîtriser le dribble en déplacement","Faire une passe en mouvement","Réceptionner en courant","Réaliser un tir en course","Réaliser une feinte simple","Attaquer un espace","Défendre en 1c1","Se démarquer","Comprendre largeur/profondeur"]
  },
  {
    id:'m11', label:'-11', full:'-11',
    objectif:"Passer du jeu spontané au jeu collectif organisé et développer l'efficacité individuelle.",
    sections:[
      {t:'Motricité / coordination', i:["Coordonner course et suspension","Changer de direction sous pression","Être équilibré après réception","Répéter les efforts courts"]},
      {t:'Passe / réception', i:["Passe en mouvement","Passe après fixation","Réception orientée","Passe sous pression","Varier les types de passe"]},
      {t:'Tir', i:["Maîtriser le tir en course","Découvrir / maîtriser le tir en suspension","Tirer sous pression","Choisir une zone de tir","Observer le gardien"]},
      {t:'Dribble', i:["Maîtriser le dribble à vitesse élevée","Changement de main","Changement de rythme","Dribble de protection","Dribbler pour créer un avantage"]},
      {t:'Attaque / 1c1', i:["Feinte de corps","Battre un défenseur","Attaquer un intervalle","Enchaîner 1c1 et passe","Enchaîner 1c1 et tir"]},
      {t:'Défense', i:["Défendre son duel","Orienter l'attaquant","Aider un partenaire","Intercepter","Se replacer"]},
      {t:'Jeu collectif', i:["Fixer-décaler","Se démarquer","Croisé simple","Relation avec partenaire","Comprendre largeur/profondeur"]},
      {t:'Transition', i:["Première passe rapide","Monter la balle","Repli collectif","Changer immédiatement de statut"]},
      {t:'Gardien', i:["Placement","Déplacement","Lecture de trajectoire","Relance vers partenaire"]},
      {t:'Mental / autonomie', i:["Oser prendre une initiative","Communiquer en défense","Gérer une erreur","Respecter les rôles","Commencer à s'auto-évaluer"]}
    ],
    themes:["Maîtriser passe/réception sous pression","Dribbler en changement de direction","Réaliser un tir en suspension","Réaliser une feinte de corps","Battre un défenseur en 1c1","Se démarquer efficacement","Fixer puis passer","Intercepter","Replier rapidement","Comprendre le jeu collectif"]
  },
  {
    id:'m13', label:'-13', full:'-13',
    objectif:"Structurer le joueur, développer la lecture du jeu et introduire les principes collectifs.",
    sections:[
      {t:'Technique générale', i:["Maîtriser passe/réception à vitesse élevée","Réception orientée","Passe sous pression","Utiliser plusieurs types de passe"]},
      {t:'Tir', i:["Tir en course","Tir en suspension","Tir après duel","Tir avec opposition","Lire le gardien"]},
      {t:'Dribble', i:["Dribble de vitesse","Dribble de protection","Changement de main","Changement de rythme","Utiliser le dribble pour créer un avantage"]},
      {t:'1c1 offensif', i:["Feinte de corps","Feinte de tir","Attaquer extérieur/intérieur","Créer un surnombre","Jouer après le duel"]},
      {t:'1c1 défensif', i:["Défendre sans faute","Orienter l'attaquant","Fermer un intervalle","Aider","Intercepter"]},
      {t:'Jeu collectif', i:["Fixer-décaler","Croisé simple","Relation arrière-pivot","Jeu avec ailier","Occupation des espaces","Comprendre plusieurs postes"]},
      {t:'Transition', i:["Monter vite","Choisir la première passe","Se projeter sans ballon","Replier rapidement","Réagir à la perte"]},
      {t:'Tactique / lecture', i:["Prendre l'information avant réception","Identifier un espace libre","Identifier un surnombre","Adapter son choix"]},
      {t:'Physique / prévention', i:["Coordination","Vitesse","Gainage dynamique","Mobilité","Prévention des blessures"]},
      {t:'Gardien', i:["Placement","Déplacement","Lecture du tireur","Relance","Communication avec la défense"]},
      {t:'Mental / autonomie', i:["Être responsable de son matériel","Savoir se préparer","Accepter le feedback","Encourager","Oser décider"]}
    ],
    themes:["Maîtriser les différents types de passes","Tirer en course et en suspension","Maîtriser les feintes","Créer un avantage en 1c1","Défendre son duel","Fixer/décaler","Jouer avec un pivot","Faire un croisé simple","Monter la balle rapidement","Se replacer en défense","Prendre l'information avant de recevoir"]
  },
  {
    id:'m15', label:'-15', full:'-15',
    objectif:"Accélérer l'exécution, renforcer les duels et développer la lecture tactique.",
    sections:[
      {t:'Technique', i:["Passe à haute vitesse","Réception sous pression","Passe après fixation","Utiliser la bonne passe selon la situation"]},
      {t:'Tir', i:["Tir en course efficace","Tir en suspension","Tir sous contact/pression","Varier hauteur et zone","Lire le gardien"]},
      {t:'Dribble', i:["Dribbler à haute vitesse","Changer de rythme","Changer de direction","Protéger le ballon","Utiliser le dribble avec intention"]},
      {t:'1c1 offensif', i:["Créer un avantage","Exploiter un intervalle","Feinter","Jouer après le duel","Provoquer une faute sans la rechercher"]},
      {t:'1c1 défensif', i:["Défendre fort sans faute","Orienter","Aider","Dissuader","Intercepter","Se replacer"]},
      {t:'Jeu collectif', i:["Fixer-décaler","Relation à deux","Relation avec pivot","Croisé","Renversement","Exploiter un surnombre"]},
      {t:'Défense collective', i:["Communiquer","Aider","Changer de système","Se déplacer ensemble","Gérer le pivot"]},
      {t:'Transition', i:["Montée de balle rapide","Repli immédiat","Première passe","Projection des joueurs sans ballon"]},
      {t:'Lecture tactique', i:["Identifier les forces/faiblesses adverses","Lire le système défensif","Adapter son choix","Comprendre les temps forts/faibles"]},
      {t:'Physique / prévention', i:["Vitesse","Explosivité","Répétition d'efforts","Mobilité","Gainage","Prévention"]},
      {t:'Mental / autonomie', i:["Responsabilité","Exigence","Gestion de l'erreur","Communication","Récupération","Préparation individuelle"]}
    ],
    themes:["Maîtriser la passe sous pression","Tirer malgré la pression défensive","Varier rythme et direction","Créer un surnombre","Exploiter un intervalle","Fixer/décaler","Jouer à deux avec pivot/partenaire","Défendre en aide","Intercepter","Monter et replier efficacement","Comprendre plusieurs systèmes défensifs"]
  },
  {
    id:'m18', label:'-18', full:'-18',
    objectif:"Préparer progressivement le joueur aux exigences du niveau senior : autonomie, intensité, lecture et adaptation.",
    sections:[
      {t:'Technique à haute intensité', i:["Passe/réception à haute vitesse","Passe sous pression","Réception orientée","Enchaîner geste technique et décision","Être efficace sous fatigue"]},
      {t:'Tir', i:["Tir en course","Tir en suspension","Tir après duel","Tir sous pression","Varier les solutions","Lire le gardien","Choisir la meilleure zone"]},
      {t:'Dribble', i:["Maîtriser tous les dribbles utiles","Dribbler sous pression","Créer un avantage","Changer rythme/direction","Dribbler avec intention tactique"]},
      {t:'1c1 offensif', i:["Créer un avantage","Exploiter un intervalle","Fixer un défenseur","Jouer après le duel","Créer un surnombre","Prendre une décision rapide"]},
      {t:'1c1 défensif', i:["Défendre son duel","Orienter","Dissuader","Aider","Intercepter","Gérer le contact légalement","Se replacer immédiatement"]},
      {t:'Jeu collectif', i:["Maîtriser relations à 2","Maîtriser relations à 3","Jouer avec pivot","Fixer-décaler","Croisés","Renversements","Exploiter surnombre/sous-nombre"]},
      {t:'Défense collective', i:["Communiquer","Coordonner les aides","Changer d'organisation","Adapter la défense à l'adversaire","Gérer les relations avec pivot"]},
      {t:'Transition', i:["Première passe","Montée de balle","Projection","Repli","Changement de statut immédiat"]},
      {t:'Tactique / analyse', i:["Lire une défense","Identifier les espaces","Adapter le projet de jeu","Analyser un adversaire","Comprendre son rôle dans le projet collectif"]},
      {t:'Physique / prévention', i:["Vitesse","Puissance","Explosivité","Répétition d'efforts","Mobilité","Gainage","Prévention","Récupération"]},
      {t:'Gardien', i:["Placement avancé","Lecture du tireur","Gestion des angles","Relance rapide","Communication avec la défense","Adaptation au contexte"]},
      {t:'Mental / autonomie', i:["Être autonome à l'échauffement","Gérer récupération et préparation","Prendre des responsabilités","Leadership positif","Gérer les émotions","Accepter l'exigence","Être capable de s'auto-évaluer"]}
    ],
    themes:["Maîtriser les fondamentaux à haute intensité","Être efficace en 1c1","Créer et exploiter un avantage","Maîtriser les relations à 2 et à 3","Jouer avec le pivot","Lire une défense","Adapter son attaque","Maîtriser plusieurs organisations défensives","Communiquer en défense","Lire le jeu rapidement","Être autonome dans sa préparation","Être prêt progressivement aux exigences seniors"]
  }
];

const SYNTH_DOMAINS = ["Motricité / coordination","Passe / réception","Tir","Dribble","1c1 offensif","1c1 défensif","Jeu sans ballon","Jeu collectif","Défense collective","Transition","Lecture du jeu","Gardien","Physique / prévention","Mental / autonomie"];

const LEVEL_LEGEND = [
  {k:'D', label:"À découvrir", desc:"la compétence n'est pas encore installée."},
  {k:'A', label:"En acquisition", desc:"la compétence est réalisée mais reste irrégulière ou dépend du contexte."},
  {k:'M', label:"Maîtrisé", desc:"la compétence est réalisée régulièrement, avec prise d'information et efficacité."}
];

const BILAN_FIELDS = [
  {k:'pointsForts', label:'Points forts'},
  {k:'priorites', label:'Priorités de progression'},
  {k:'competencesRetravailler', label:'Compétences à retravailler'},
  {k:'objectifsIndividuels', label:'Objectifs individuels'},
  {k:'passage', label:'Passage vers la catégorie suivante'},
  {k:'commentaires', label:'Commentaires divers'}
];

const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';