# Moderniser un Monolithe ASP.NET MVC 4.8

--

## Séparer par domaine avant de parler microservices

Note:
Objectif : proposer un plan actionnable immédiatement.
Contrainte : run + change, pas de chantier full refonte.
On parle trajectoire réaliste, pas théorie idéale.

---

# Contexte

--
## Situation actuelle

- Monolithe ASP.NET MVC .NET 4.8
- Code spaghetti ultra imbriqué
- Multiples projets et dépendances croisées
- Beaucoup d’interfaces… mal découpées
- Run + Change permanent

Note:
Insister sur la contrainte principale : on doit continuer à livrer.
Le problème n’est pas l’absence d’interfaces, mais l’absence de frontières stables.

--
## Problèmes observés

- Couplage fort entre domaines
- Base de données partagée
- Dépendances circulaires
- Interfaces instables ou fourre-tout
- Effet domino lors des évolutions

Note:
Montrer que le vrai risque est le couplage invisible.
Ce n’est pas un problème “technologique”, c’est structurel.

---

# Pourquoi pas des microservices tout de suite ?

--
## Risque d’extraction immédiate

- On distribue le spaghetti
- La base reste le point de couplage
- Complexité opérationnelle ×10
- Debug plus difficile
- Incidents plus fréquents

Note:
Phrase clé : un spaghetti distribué reste un spaghetti.
Sans frontières stables, on amplifie le problème.

--
## Microservices ≠ solution magique

Les microservices ajoutent :

- Réseau
- Résilience
- Versioning
- Observabilité
- DevOps avancé
- Gestion multi-dépôts

Note:
Les microservices sont un multiplicateur de maturité.
Si on n’est pas bon en monolithe, on sera mauvais en distribué.

---

# Stratégie réaliste

--
## Objectif

Rendre le monolithe **extractable**

Pas parfait.
Pas académique.
Mais structuré par domaines.

Note:
Bien distinguer “extractable” de “microservices”.
Les microservices sont une conséquence.

--
## Principe

Moderniser en livrant.

Chaque évolution métier devient une opportunité de :

- Réduire le couplage
- Structurer par domaine
- Ajouter un filet de sécurité

Note:
Pas de big bang.
Pas de freeze du delivery.

---

# Séparer par domaine (dans le monolithe)

--
## Étape 1 — Identifier 4 à 8 domaines

Méthode simple :

- Partir des features / écrans
- Lister les use cases majeurs
- Identifier les tables principales
- Repérer les dépendances externes

Livrable : 1 slide de cartographie métier.

Note:
Pas besoin de DDD académique.
On cherche des frontières pragmatiques.

--
## Étape 2 — Créer un module par domaine

Structure cible :

Modules/
  Orders/
  Billing/
  Customers/

Objectif :

- Regrouper par responsabilité métier
- Déplacer progressivement le code
- Pas de refactor massif initial

Note:
C’est du “move + encapsulation”, pas du redesign complet.

--
## Étape 3 — Introduire une façade de domaine

Exemple :

IOrdersModule
  - CreateOrder()
  - CancelOrder()

Règle :

Tout appel inter-domaine passe par la façade.

Note:
C’est la frontière architecturale clé.
C’est ce qui rend l’extraction future possible.

--
## Étape 4 — Slice vertical à chaque feature

Pour chaque nouvelle demande :

- Déplacer le code touché dans le module
- Passer par la façade
- Ajouter 1 test filet
- Supprimer 1 dépendance toxique si possible

Budget : 10–20% de capacité par feature.

Note:
Sans budget explicite, rien ne change.
La modernisation doit être intégrée au delivery.

---

# Gérer les interfaces existantes

--
## Constat

- Interfaces techniques partout
- IOrderService avec 25 méthodes
- Helpers globaux
- Interfaces qui masquent le couplage

Note:
Le problème n’est pas le nombre d’interfaces.
C’est leur rôle mal défini.

--
## Classification actionnable

A — Façades métier  
B — Ports techniques  
C — Interfaces de confort

Objectif :

✅ Remonter A  
✅ Encapsuler B  
🧯 Déprécier C progressivement  

Note:
Donner un exemple oral pour chaque catégorie.
C’est concret et immédiatement applicable.

--
## Nouvelle règle d’équipe

- 1 façade par domaine
- Pas d’accès direct à la DB d’un autre domaine
- Pas de nouvelle dépendance transversale
- 1 test filet par feature

Note:
Transformer cela en Definition of Done.
C’est ce qui empêche de recréer du spaghetti.

---

# Timeline réaliste

--
## 8 semaines

S1 : Cartographie + domaine pilote  
S2–4 : Structuration opportuniste  
S5–8 : Domaine stabilisé  
Mois 3 : Extraction possible

Note:
Ne pas promettre transformation complète.
Promettre réduction mesurable du couplage.

---

## Microservices : pertinents ou prématurés ?

| ✅ Pertinents | ⛔ Prématurés |
|---|---|
| Domaines réellement autonomes | Frontières floues |
| Scalabilité différenciée | Base partagée fortement couplée |
| Plusieurs équipes | CI/CD immature |
| Déploiements indépendants requis | Observabilité faible |
| Forte exigence d'isolation | Équipe unique |

Note:
Les microservices répondent à des contraintes organisationnelles et opérationnelles.
Sans maturité DevOps, microservices = augmentation du risque.

--
## Impact : Développement & Source

| | Monolithe | Modulaire | Microservices |
|---|---|---|---|
| **Dev** | Simple, effet domino | Refactor localisé | Autonomie, complexité distribuée |
| **Source** | 1 repo, collisions | Ownership par module | Repo par service, fragmentation |

Note:
Le monolithe modulaire apporte déjà beaucoup de bénéfices sans complexité distribuée.
Attention aux librairies partagées qui recréent le couplage.

--
## Impact : CI/CD & Base de données

| | Monolithe | Modulaire | Microservices |
|---|---|---|---|
| **CI/CD** | Pipeline unique, déploiement risqué | Pipeline fiable, artefact global | Déploiement indépendant, coût DevOps élevé |
| **DB** ⚠️ | Transactions simples, couplage maximal | BD encore partagée | DB par service, cohérence éventuelle, reporting distribué |

Note:
La plateforme DevOps est un prérequis fort pour les microservices.
Sans stratégie data claire, ne pas faire de microservices.

---

# Recommandation

--
## Trajectoire pragmatique

1. Monolithe modulaire par domaines
2. Façades stables
3. Réduction du couplage
4. Tests filet
5. Extraction ciblée quand prêt

Note:
Les microservices sont une récompense.
La condition : frontières stables.

--
# Message clé final

On ne migre pas vers des microservices.

On rend le monolithe extractable.

Les microservices sont une conséquence,
pas un point de départ.

Note:
Pause.
Laisser la phrase résonner.

---

## Questions

Note:
Ouvrir la discussion.
Recueillir les réactions et résistances de l'équipe.