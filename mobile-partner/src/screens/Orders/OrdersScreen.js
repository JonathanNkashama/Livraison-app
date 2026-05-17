import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, RefreshControl, Alert
} from 'react-native';
import api from '../../api';

export default function OrdersScreen() {
  const [commandes, setCommandes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filtre, setFiltre] = useState('en_attente');

  useEffect(() => { charger(); }, [filtre]);

  const charger = async () => {
    try {
      const res = await api.get(`/commandes/partenaire/recues?statut=${filtre}`);
      setCommandes(res.data);
    } catch (err) {}
    setRefreshing(false);
  };

  const changerStatut = async (id, statut) => {
    try {
      await api.put(`/commandes/${id}/statut`, { statut });
      Alert.alert('✅ Succès', 'Statut mis à jour !');
      charger();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de mettre à jour');
    }
  };

  const couleurStatut = (statut) => {
    const couleurs = {
      en_attente: '#f39c12', acceptee: '#3498db',
      en_preparation: '#9b59b6', en_livraison: '#1abc9c',
      livree: '#2ecc71', annulee: '#e74c3c', refusee: '#e74c3c'
    };
    return couleurs[statut] || '#999';
  };

  const renderCommande = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardClient}>👤 {item.nom_client}</Text>
          <Text style={styles.cardTel}>📞 {item.tel_client}</Text>
          <Text style={styles.cardAdresse}>📍 {item.adresse_livraison}</Text>
        </View>
        <View>
          <Text style={styles.cardMontant}>{Number(item.montant_total).toLocaleString()} $</Text>
          <View style={[styles.badge, { backgroundColor: couleurStatut(item.statut) + '20' }]}>
            <Text style={[styles.badgeText, { color: couleurStatut(item.statut) }]}>{item.statut}</Text>
          </View>
        </View>
      </View>

      {/* Items commandés */}
      <View style={styles.items}>
        {item.items?.map((i, index) => (
          <Text key={index} style={styles.itemText}>• {i.nom} x{i.quantite} — {Number(i.prix).toLocaleString()} $</Text>
        ))}
      </View>

      {/* Boutons d'action */}
      <View style={styles.actions}>
        {item.statut === 'en_attente' && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnAccepter]}
              onPress={() => changerStatut(item.id, 'acceptee')}
            >
              <Text style={styles.actionBtnText}>✅ Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnRefuser]}
              onPress={() => Alert.alert('Refuser', 'Refuser cette commande ?', [
                { text: 'Annuler' },
                { text: 'Refuser', style: 'destructive', onPress: () => changerStatut(item.id, 'refusee') }
              ])}
            >
              <Text style={styles.actionBtnText}>❌ Refuser</Text>
            </TouchableOpacity>
          </>
        )}
        {item.statut === 'acceptee' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnPreparer]}
            onPress={() => changerStatut(item.id, 'en_preparation')}
          >
            <Text style={styles.actionBtnText}>👨‍🍳 En préparation</Text>
          </TouchableOpacity>
        )}
        {item.statut === 'en_preparation' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnPrete]}
            onPress={() => changerStatut(item.id, 'en_livraison')}
          >
            <Text style={styles.actionBtnText}>🛵 Lancer la livraison</Text>
          </TouchableOpacity>
        )}
        {item.statut === 'en_livraison' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.btnLivree]}
            onPress={() => changerStatut(item.id, 'livree')}
          >
            <Text style={styles.actionBtnText}>✅ Marquer comme livrée</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitre}>📦 Commandes</Text>
      </View>

      {/* Filtres */}
      <View style={styles.filtres}>
        {['en_attente', 'acceptee', 'en_preparation', 'en_livraison', 'livree'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filtreBtn, filtre === f && styles.filtreBtnActif]}
            onPress={() => setFiltre(f)}
          >
            <Text style={[styles.filtreBtnText, filtre === f && styles.filtreBtnTextActif]}>
              {f.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={commandes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCommande}
        contentContainerStyle={styles.liste}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); charger(); }} tintColor="#2ecc71" />}
        ListEmptyComponent={<Text style={styles.vide}>Aucune commande {filtre.replace('_', ' ')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2ecc71', padding: 20, paddingTop: 50 },
  headerTitre: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  filtres: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 8, gap: 6, flexWrap: 'wrap' },
  filtreBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0' },
  filtreBtnActif: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  filtreBtnText: { fontSize: 11, color: '#666' },
  filtreBtnTextActif: { color: '#fff', fontWeight: '700' },
  liste: { padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardClient: { fontSize: 15, fontWeight: '700', color: '#1a1a2e' },
  cardTel: { fontSize: 13, color: '#666', marginTop: 2 },
  cardAdresse: { fontSize: 13, color: '#666', marginTop: 2, maxWidth: 200 },
  cardMontant: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71', textAlign: 'right' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginTop: 4 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  items: { backgroundColor: '#f8f9fa', borderRadius: 8, padding: 10, marginBottom: 12 },
  itemText: { fontSize: 13, color: '#444', marginBottom: 2 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  btnAccepter: { backgroundColor: '#e8f5e9' },
  btnRefuser: { backgroundColor: '#fce4e4' },
  btnPreparer: { backgroundColor: '#e8eaf6' },
  btnPrete: { backgroundColor: '#e0f7fa' },
  btnLivree: { backgroundColor: '#e8f5e9' },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  vide: { textAlign: 'center', color: '#999', marginTop: 60, fontSize: 15 }
});