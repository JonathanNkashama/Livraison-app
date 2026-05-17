import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Alert, Image
} from 'react-native';
import api from '../../api';

export default function CatalogScreen({ navigation }) {
  const [produits, setProduits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    try {
      const res = await api.get('/produits/mes-produits');
      setProduits(res.data);
    } catch (err) {}
    setRefreshing(false);
  };

  const toggleDisponibilite = async (id) => {
    try {
      await api.put(`/produits/${id}/toggle`);
      charger();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier');
    }
  };

  const supprimerProduit = async (id) => {
    Alert.alert('Supprimer', 'Supprimer ce produit ?', [
      { text: 'Annuler' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/produits/${id}`);
          charger();
        } catch (err) {}
      }}
    ]);
  };

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
        <Text style={styles.cardPrix}>{Number(item.prix).toLocaleString()} $</Text>
        {item.description && <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text>}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.toggleStock, item.est_disponible ? styles.stockDispo : styles.stockEpuise]}
          onPress={() => toggleDisponibilite(item.id)}
        >
          <Text style={styles.toggleStockText}>{item.est_disponible ? '✅' : '❌'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSupprimer} onPress={() => supprimerProduit(item.id)}>
          <Text style={styles.btnSupprimerText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitre}>🍽️ Mon Catalogue</Text>
        <TouchableOpacity
          style={styles.btnAjouter}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.btnAjouterText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={produits}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduit}
        contentContainerStyle={styles.liste}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); charger(); }} tintColor="#2ecc71" />}
        ListEmptyComponent={
          <View style={styles.vide}>
            <Text style={styles.videEmoji}>🍽️</Text>
            <Text style={styles.videTitre}>Aucun produit</Text>
            <Text style={styles.videDesc}>Ajoutez votre premier produit</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2ecc71', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitre: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  btnAjouter: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  btnAjouterText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  liste: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 2 },
  photo: { width: 90, height: 90 },
  photoPlaceholder: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  photoEmoji: { fontSize: 30 },
  cardInfo: { flex: 1, padding: 12 },
  cardNom: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  cardCategorie: { fontSize: 12, color: '#999', marginTop: 2 },
  cardPrix: { fontSize: 15, fontWeight: '700', color: '#2ecc71', marginTop: 4 },
  cardDesc: { fontSize: 12, color: '#999', marginTop: 2 },
  cardActions: { padding: 12, justifyContent: 'space-between', alignItems: 'center' },
  toggleStock: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stockDispo: { backgroundColor: '#e8f5e9' },
  stockEpuise: { backgroundColor: '#fce4e4' },
  toggleStockText: { fontSize: 18 },
  btnSupprimer: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fce4e4', alignItems: 'center', justifyContent: 'center' },
  btnSupprimerText: { fontSize: 16 },
  vide: { alignItems: 'center', marginTop: 80 },
  videEmoji: { fontSize: 60, marginBottom: 16 },
  videTitre: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  videDesc: { fontSize: 14, color: '#999', marginTop: 8 }
});