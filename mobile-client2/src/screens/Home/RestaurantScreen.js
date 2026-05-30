import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import api from '../../api';

export default function RestaurantScreen({ route, navigation }) {
  const { id, nom } = route.params;
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panier, setPanier] = useState([]);

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    try {
      const res = await api.get(`/produits/partenaire/${id}`);
      setProduits(res.data);
    } catch (err) {}
    setLoading(false);
  };

  const ajouterAuPanier = (produit) => {
    setPanier(prev => {
      const existe = prev.find(p => p.id === produit.id);
      if (existe) {
        return prev.map(p => p.id === produit.id ? { ...p, quantite: p.quantite + 1 } : p);
      }
      return [...prev, { ...produit, quantite: 1 }];
    });
    Alert.alert('✅', `${produit.nom} ajouté au panier !`);
  };

  const totalPanier = panier.reduce((sum, p) => sum + (p.prix * p.quantite), 0);

  const renderProduit = ({ item }) => (
    <View style={styles.card}>
      {item.photo_url ? (
        <Image source={{ uri: item.photo_url }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={styles.photoEmoji}>🍽️</Text>
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.cardNom}>{item.nom}</Text>
        <Text style={styles.cardCategorie}>{item.categorie}</Text>
        {item.description && <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>}
        <Text style={styles.cardPrix}>{Number(item.prix).toLocaleString()} $</Text>
      </View>
      <TouchableOpacity
        style={[styles.btnAjouter, !item.est_disponible && styles.btnDesactive]}
        onPress={() => item.est_disponible && ajouterAuPanier(item)}
        disabled={!item.est_disponible}
      >
        <Text style={styles.btnAjouterText}>{item.est_disponible ? '+' : '❌'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnRetour}>
          <Text style={styles.btnRetourText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitre}>{nom}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : (
        <FlatList
          data={produits}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduit}
          contentContainerStyle={styles.liste}
          ListEmptyComponent={
            <View style={styles.vide}>
              <Text style={styles.videEmoji}>🍽️</Text>
              <Text style={styles.videTitre}>Aucun produit disponible</Text>
            </View>
          }
        />
      )}

      {panier.length > 0 && (
        <TouchableOpacity
          style={styles.btnPanier}
          onPress={() => navigation.navigate('Cart', { panier, partenaire_id: id })}
        >
          <Text style={styles.btnPanierText}>
            🛒 Voir le panier ({panier.length}) — {totalPanier.toLocaleString()} $
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#FF6B35', padding: 20, paddingTop: 50 },
  btnRetour: { marginBottom: 8 },
  btnRetourText: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  headerTitre: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  loader: { marginTop: 60 },
  liste: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 2, alignItems: 'center' },
  photo: { width: 90, height: 90 },
  photoPlaceholder: { backgroundColor: '#FFF3EE', alignItems: 'center', justifyContent: 'center' },
  photoEmoji: { fontSize: 30 },
  cardInfo: { flex: 1, padding: 12 },
  cardNom: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  cardCategorie: { fontSize: 12, color: '#999', marginTop: 2 },
  cardDesc: { fontSize: 12, color: '#666', marginTop: 4 },
  cardPrix: { fontSize: 15, fontWeight: '700', color: '#FF6B35', marginTop: 4 },
  btnAjouter: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B35', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  btnDesactive: { backgroundColor: '#e0e0e0' },
  btnAjouterText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  vide: { alignItems: 'center', marginTop: 80 },
  videEmoji: { fontSize: 60, marginBottom: 16 },
  videTitre: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e' },
  btnPanier: { backgroundColor: '#FF6B35', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  btnPanierText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});