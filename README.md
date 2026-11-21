# Mutation testing : tester des tests générés par IA

## Objectif

Un code de calcul de prix de commande (`src/pricing.js`) est accompagné de tests « générés par une IA » qui passent tous et couvrent 100 % des lignes. Question de l'exercice : **ces tests protègent-ils vraiment le code ?**

On y répond avec le **mutation testing** (Stryker) : on introduit automatiquement de petits bugs (mutants) dans le code, et on vérifie que les tests échouent. Un mutant qui survit révèle un test trop faible.

## Démarche

1. **Intention** : [INTENTION.md](INTENTION.md) décrit le besoin (pourquoi, règles métier, exemples/oracles, hors périmètre). C'est la référence.
2. **Tests initiaux** : [tests/pricing.test.js](tests/pricing.test.js). Ils ne vérifient que des assertions vagues (`toBeDefined`, `toBeLessThan`...). La couverture est de 100 %, mais beaucoup de mutants survivent.
3. **Mesure** : `npm run test:mutation` lance Stryker et produit le score de mutation.
4. **Tests renforcés** : [tests/pricingAfterStryker.test.js](tests/pricingAfterStryker.test.js) est écrit à partir de l'intention. Valeurs exactes, cas limites (99,99 / 100 €, 49,99 / 50 €), messages d'erreur, ordre remise puis code promo, plancher à 0 €, arrondi, et les 9 oracles du tableau.
5. **Nouvelle mesure** : relancer Stryker et comparer le score avant/après.

## Règles métier (résumé)

- Sous-total = Σ prix × quantité. Quantité ≤ 0 ou panier vide : erreur.
- Remise de 10 % si sous-total ≥ 100 €.
- Codes promo (insensibles à la casse), appliqués après la remise : `BIENVENUE` −5 €, `FIDELE` −15 €, autre code : erreur. Produits jamais sous 0 €.
- Livraison gratuite si produits ≥ 50 € (après remise et code), sinon 4,90 €.
- Montants arrondis au centime.

Détail complet dans [INTENTION.md](INTENTION.md).

## Structure

```
src/pricing.js                    Code à tester
tests/pricing.test.js             Tests initiaux (faibles)
tests/pricingAfterStryker.test.js Tests renforcés
INTENTION.md                      Spécification
server.js, public/                Petite appli web utilisant le calcul
stryker.config.json               Config mutation testing
vitest.config.js                  Config des tests et de la couverture
playwright.config.js              Config des tests e2e
```

## Commandes

```bash
npm install
npm start                  # lance l'appli web
npm test                   # tests unitaires (Vitest)
npm run test:coverage      # couverture
npm run test:mutation      # mutation testing (Stryker), rapport HTML généré
npm run test:e2e           # tests de bout en bout (Playwright)
```

## À retenir

La couverture de code dit quelles lignes sont **exécutées**, pas si elles sont **vérifiées**. Le score de mutation mesure la vraie qualité des tests, d'où l'intérêt de le mettre en quality gate (voir le seuil `break` dans `stryker.config.json`, actuellement à `null`).
