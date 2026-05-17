import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [partenaire, setPartenaire] = useState(null);

  const ajouterAuPanier = (produit, partenaire_info) => {
    if (partenaire && partenaire.id !== partenaire_info.id) {
      return { erreur: 'Vous ne pouvez commander que chez un seul établissement à la fois' };
    }
    if (!partenaire) setPartenaire(partenaire_info);
    setItems(prev => {
      const existant = prev.find(i => i.id === produit.id);
      if (existant) {
        return prev.map(i => i.id === produit.id ? { ...i, quantite: i.quantite + 1 } : i);
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
    return { success: true };
  };

  const retirerDuPanier = (produit_id) => {
    setItems(prev => {
      const existant = prev.find(i => i.id === produit_id);
      if (existant && existant.quantite > 1) {
        return prev.map(i => i.id === produit_id ? { ...i, quantite: i.quantite - 1 } : i);
      }
      const newItems = prev.filter(i => i.id !== produit_id);
      if (newItems.length === 0) setPartenaire(null);
      return newItems;
    });
  };

  const viderPanier = () => {
    setItems([]);
    setPartenaire(null);
  };

  const total = items.reduce((sum, i) => sum + parseFloat(i.prix) * i.quantite, 0);
  const nbItems = items.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <CartContext.Provider value={{ items, partenaire, total, nbItems, ajouterAuPanier, retirerDuPanier, viderPanier }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);