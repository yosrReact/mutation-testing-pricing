// Tests « générés par une IA ».
// Ils passent tous et couvrent 100 % des lignes... mais protègent-ils vraiment le code ?

import { describe, it, expect } from 'vitest';
import { calculerPrix, sousTotal } from '../src/pricing.js';

describe('sousTotal', () => {
  it('calcule un sous-total', () => {
    const resultat = sousTotal([{ nom: 'Stylo', prix: 2, quantite: 3 }]);
    expect(resultat).toBeDefined();
    expect(typeof resultat).toBe('number');
  });

  it('refuse une quantité invalide', () => {
    expect(() => sousTotal([{ nom: 'Stylo', prix: 2, quantite: 0 }])).toThrow();
  });
});

describe('calculerPrix', () => {
  it('retourne un prix', () => {
    const prix = calculerPrix([{ nom: 'Livre', prix: 20, quantite: 1 }]);
    expect(prix).toHaveProperty('total');
    expect(prix.total).toBeGreaterThan(0);
  });

  it('applique la remise sur une grosse commande', () => {
    const prix = calculerPrix([{ nom: 'Casque', prix: 200, quantite: 1 }]);
    expect(prix.total).toBeLessThan(200);
  });

  it('accepte un code promo', () => {
    const prix = calculerPrix([{ nom: 'Livre', prix: 30, quantite: 1 }], 'bienvenue');
    expect(prix.produits).toBeLessThan(30);
  });

  it('refuse un code promo inconnu', () => {
    expect(() => calculerPrix([{ nom: 'Livre', prix: 30, quantite: 1 }], 'FAUX')).toThrow();
  });

  it('refuse un panier vide', () => {
    expect(() => calculerPrix([])).toThrow();
  });

  it('gère une petite commande', () => {
    const prix = calculerPrix([{ nom: 'Gomme', prix: 1, quantite: 1 }], 'FIDELE');
    expect(prix).toBeTruthy();
  });
});
