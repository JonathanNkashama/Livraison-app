import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, Image, ActivityIndicator, RefreshControl, ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import api from '../../api';

const CATEGORIES = [
  { id: null, label: 'Tous', icon: '🏪' },
  { id: 'restaurant', label: 'Resto', icon: '🍽️' },
  { id: 'epicerie', label: 'Épicerie', icon: '🛒' },
  { id: 'boissons', label: 'Boissons', icon: '🥤' },
  { id: 'boulangerie', label: 'Boulangerie', icon: '🥐' },
];

export default function HomeScreen({ navigation }) {
  const [etablissements, setEtablissements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => { obtenirLocalisation(); }, []);
  useEffect(() => { if (coords) chargerEtablissements(); }, [coords, categorie]);

  const obtenirLocalisation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCoords({ lat: -4.3276, lng: 15.3136 });
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCoords({ lat: location.coords.latitude, lng: location.coords.longitude });
    } catch (e) {
      setCoords({ lat: -4.3276, lng: 15.3136 });
    }
  };

  const chargerEtablissements = async () => {
    try {
      const params = { lat: coords.lat, lng: coords.lng, rayon: 20 };
      if (categorie) params.categorie = categorie;
      const res = await api.get('/partenaires/nearby', { params });
      setEtablissements(res.data);
    } catch (err) {
      const res = await api.get('/partenaires');
      setEtablissements(res.data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const etablissementsFiltres = etablissements.filter(e =>
    e.nom_etablissement.toLowerCase().includes(search.toLowerCase())
  );

  const renderEtablissement = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Restaurant', { id: item.id, nom: item.nom_etablissement })}
    >
      {item.logo_url ? (
        <Image source={{ uri: item.logo_url }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Text style={styles.cardEmoji}>🍽️</Text>
        </View>
      )}
      <View style={styles.cardInfo}>
        <Text style={styles.cardNom}>{item.nom_etablissement}</Text>
        <Text style={styles.cardCategorie}>{item.categorie}</Text>
        <View style={styles.cardRow}>
          {item.distance_km && <Text style={styles.cardDistance}>📍 {item.distance_km} km</Text>}
          {item.note_moyenne > 0 && <Text style={styles.cardNote}>⭐ {item.note_moyenne}</Text>}
          <View style={[styles.badge, item.est_ouvert ? styles.badgeOuvert : styles.badgeFerme]}>
            <Text style={styles.badgeText}>{item.est_ouvert ? 'Ouvert' : 'Fermé'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitre}>🛵 Livraison</Text>
        <Text style={styles.headerSousTitre}>Que voulez-vous manger ?</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Rechercher..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories} contentContainerStyle={styles.categoriesContent}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id || 'tous'}
            style={[styles.catBtn, categorie === cat.id && styles.catBtnActif]}
            onPress={() => setCategorie(cat.id)}
          >
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <Text style={[styles.catLabel, categorie === cat.id && styles.catLabelActif]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B35" style={styles.loader} />
      ) : (
        <FlatList
          data={etablissementsFiltres}
          keyExtractor={item => item.id.toString()}
          renderItem={renderEtablissement}
          contentContainerStyle={styles.liste}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); chargerEtablissements(); }} tintColor="#FF6B35" />}
          ListEmptyComponent={<Text style={styles.vide}>Aucun établissement trouvé</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#FF6B35', padding: 20, paddingTop: 50 },
  headerTitre: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSousTitre: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 12 },
  searchInput: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 15 },
  categories: { backgroundColor: '#fff', maxHeight: 90 },
  categoriesContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  catBtn: { alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#e0e0e0', backgroundColor: '#f8f9fa' },
  catBtnActif: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  catIcon: { fontSize: 18 },
  catLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  catLabelActif: { color: '#fff', fontWeight: '700' },
  liste: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', overflow: 'hidden', elevation: 2 },
  cardImage: { width: 100, height: 100 },
  cardImagePlaceholder: { backgroundColor: '#FFF3EE', justifyContent: 'center', alignItems: 'center' },
  cardEmoji: { fontSize: 36 },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardNom: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  cardCategorie: { fontSize: 13, color: '#999', textTransform: 'capitalize' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardDistance: { fontSize: 12, color: '#666' },
  cardNote: { fontSize: 12, color: '#666' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeOuvert: { backgroundColor: '#e8f5e9' },
  badgeFerme: { backgroundColor: '#fce4e4' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#1a1a2e' },
  loader: { marginTop: 60 },
  vide: { textAlign: 'center', color: '#999', marginTop: 60, fontSize: 15 }
});