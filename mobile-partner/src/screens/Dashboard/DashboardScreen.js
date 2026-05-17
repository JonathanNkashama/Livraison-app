import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function DashboardScreen({ navigation }) {
  const { partenaire, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [commandes, setCommandes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [estOuvert, setEstOuvert] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  const charger = async () => {
    try {
      const [walletRes, commandesRes] = await Promise.all([
        api.get('/partenaires/wallet/stats'),
        api.get('/commandes/partenaire/recues')
      ]);
      setStats(walletRes.data);
      setCommandes(commandesRes.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
    setRefreshing(false);
  };

  const toggleOuverture = async () => {
    try {
      const res = await api.put('/partenaires/toggle-open');
      setEstOuvert(res.data.est_ouvert);
    } catch (err) {}
  };

  const couleurStatut = (statut) => {
    const couleurs = {
      en_attente: '#f39c12', acceptee: '#3498db',
      en_preparation: '#9b59b6', en_livraison: '#1abc9c',
      livree: '#2ecc71', annulee: '#e74c3c'
    };
    return couleurs[statut] || '#999';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); charger(); }} tintColor="#2ecc71" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBonjour}>Bonjour 👋</Text>
          <Text style={styles.headerNom}>{partenaire?.nom_etablissement}</Text>
        </View>
        <TouchableOpacity
          style={[styles.toggleBtn, estOuvert ? styles.toggleOuvert : styles.toggleFerme]}
          onPress={toggleOuverture}
        >
          <Text style={styles.toggleText}>{estOuvert ? '🟢 Ouvert' : '🔴 Fermé'}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValeur}>{Number(stats.solde || 0).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Solde wallet ($)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValeur}>{stats.total_commandes || 0}</Text>
          <Text style={styles.statLabel}>Total commandes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValeur}>{Number(stats.total_gains || 0).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total gains ($)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValeur}>{Number(stats.gains_ce_mois || 0).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Ce mois ($)</Text>
        </View>
      </View>

      {/* Raccourcis */}
      <View style={styles.raccourcis}>
        <TouchableOpacity style={styles.raccourciBtn} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.raccourciIcon}>📦</Text>
          <Text style={styles.raccourciLabel}>Commandes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.raccourciBtn} onPress={() => navigation.navigate('Catalog')}>
          <Text style={styles.raccourciIcon}>🍽️</Text>
          <Text style={styles.raccourciLabel}>Catalogue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.raccourciBtn} onPress={() => navigation.navigate('Wallet')}>
          <Text style={styles.raccourciIcon}>💰</Text>
          <Text style={styles.raccourciLabel}>Wallet</Text>
        </TouchableOpacity>
      </View>

      {/* Dernières commandes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Dernières commandes</Text>
        {commandes.length === 0 ? (
          <Text style={styles.vide}>Aucune commande pour l'instant</Text>
        ) : (
          commandes.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.commandeCard}
              onPress={() => navigation.navigate('Orders')}
            >
              <View>
                <Text style={styles.commandeClient}>{c.nom_client}</Text>
                <Text style={styles.commandeMontant}>{Number(c.montant_total).toLocaleString()} {c.devise_locale || '$'}</Text>
              </View>
              <View style={[styles.statutBadge, { backgroundColor: couleurStatut(c.statut) + '20' }]}>
                <Text style={[styles.statutText, { color: couleurStatut(c.statut) }]}>{c.statut}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2ecc71', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerBonjour: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  headerNom: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  toggleOuvert: { backgroundColor: 'rgba(255,255,255,0.2)' },
  toggleFerme: { backgroundColor: 'rgba(0,0,0,0.2)' },
  toggleText: { color: '#fff', fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 8 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, minWidth: '45%', elevation: 2, alignItems: 'center' },
  statValeur: { fontSize: 22, fontWeight: 'bold', color: '#2ecc71' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 4, textAlign: 'center' },
  raccourcis: { flexDirection: 'row', padding: 16, gap: 12 },
  raccourciBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 2 },
  raccourciIcon: { fontSize: 28 },
  raccourciLabel: { fontSize: 12, color: '#666', marginTop: 4, fontWeight: '600' },
  section: { margin: 16 },
  sectionTitre: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  commandeCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  commandeClient: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  commandeMontant: { fontSize: 13, color: '#666', marginTop: 2 },
  statutBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statutText: { fontSize: 12, fontWeight: '600' },
  vide: { textAlign: 'center', color: '#999', marginTop: 20 }
});