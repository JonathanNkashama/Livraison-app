import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, ActivityIndicator
} from 'react-native';
import api from '../../api';

export default function WalletScreen() {
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    try {
      const res = await api.get('/partenaires/wallet/stats');
      setStats(res.data);
      setTransactions(res.data.transactions || []);
    } catch (err) {}
    setLoading(false);
    setRefreshing(false);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2ecc71" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitre}>💰 Mon Wallet</Text>
        <Text style={styles.headerSolde}>{Number(stats.solde || 0).toLocaleString()} $</Text>
        <Text style={styles.headerLabel}>Solde disponible</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValeur}>{stats.total_commandes || 0}</Text>
          <Text style={styles.statLabel}>Commandes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValeur}>{Number(stats.total_gains || 0).toLocaleString()} $</Text>
          <Text style={styles.statLabel}>Total gains</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValeur}>{Number(stats.gains_ce_mois || 0).toLocaleString()} $</Text>
          <Text style={styles.statLabel}>Ce mois</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Historique des transactions</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.liste}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); charger(); }} tintColor="#2ecc71" />}
        renderItem={({ item }) => (
          <View style={styles.transCard}>
            <View>
              <Text style={styles.transType}>{item.type === 'vente' ? '💰 Vente' : '📤 Reversement'}</Text>
              <Text style={styles.transDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.transMontant, { color: item.type === 'vente' ? '#2ecc71' : '#e74c3c' }]}>
              {item.type === 'vente' ? '+' : '-'}{Number(item.montant).toLocaleString()} $
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vide}>Aucune transaction</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2ecc71', padding: 30, paddingTop: 50, alignItems: 'center' },
  headerTitre: { fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 8 },
  headerSolde: { fontSize: 42, fontWeight: 'bold', color: '#fff' },
  headerLabel: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 8 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2 },
  statValeur: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  statLabel: { fontSize: 11, color: '#999', marginTop: 4, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginBottom: 8 },
  sectionTitre: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  liste: { paddingHorizontal: 16, gap: 8 },
  transCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 1 },
  transType: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  transDate: { fontSize: 12, color: '#999', marginTop: 2 },
  transMontant: { fontSize: 16, fontWeight: 'bold' },
  vide: { textAlign: 'center', color: '#999', marginTop: 40 }
});