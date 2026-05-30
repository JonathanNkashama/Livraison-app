import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { partenaire, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler' },
      { text: 'Déconnecter', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🏪</Text>
        <Text style={styles.nom}>{partenaire?.nom_etablissement}</Text>
        <Text style={styles.email}>{partenaire?.email}</Text>
        <View style={[styles.badge, partenaire?.est_valide ? styles.badgeValide : styles.badgeAttente]}>
          <Text style={styles.badgeText}>{partenaire?.est_valide ? '✅ Compte validé' : '⏳ En attente de validation'}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        {[
          { icon: '🏪', label: 'Établissement', valeur: partenaire?.nom_etablissement },
          { icon: '📧', label: 'Email', valeur: partenaire?.email },
          { icon: '📞', label: 'Téléphone', valeur: partenaire?.telephone },
          { icon: '📍', label: 'Adresse', valeur: partenaire?.adresse },
          { icon: '🍽️', label: 'Catégorie', valeur: partenaire?.categorie },
          { icon: '🌍', label: 'Pays', valeur: partenaire?.pays },
          { icon: '💰', label: 'Devise', valeur: partenaire?.devise },
        ].map((info, index) => (
          <View key={index}>
            <View style={styles.infoLigne}>
              <Text style={styles.infoIcon}>{info.icon}</Text>
              <View style={styles.infoTexte}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValeur}>{info.valeur || 'Non renseigné'}</Text>
              </View>
            </View>
            {index < 6 && <View style={styles.separateur} />}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.btnModifier}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.btnModifierText}>✏️ Modifier mon profil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnDeconnexion} onPress={handleLogout}>
        <Text style={styles.btnDeconnexionText}>🚪 Se déconnecter</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2ecc71', padding: 30, alignItems: 'center', paddingTop: 50 },
  avatar: { fontSize: 60, marginBottom: 12 },
  nom: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  badge: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  badgeValide: { backgroundColor: 'rgba(255,255,255,0.3)' },
  badgeAttente: { backgroundColor: 'rgba(255,165,0,0.3)' },
  badgeText: { color: '#fff', fontWeight: '700' },
  infoCard: { backgroundColor: '#fff', margin: 16, borderRadius: 12, padding: 8, elevation: 2 },
  infoLigne: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoTexte: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#999' },
  infoValeur: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginTop: 2 },
  separateur: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 12 },
  btnModifier: { backgroundColor: '#e8f5e9', margin: 16, marginBottom: 8, padding: 16, borderRadius: 12, alignItems: 'center' },
  btnModifierText: { color: '#2ecc71', fontWeight: '700', fontSize: 16 },
  btnDeconnexion: { backgroundColor: '#fce4e4', margin: 16, marginTop: 8, padding: 16, borderRadius: 12, alignItems: 'center' },
  btnDeconnexionText: { color: '#e74c3c', fontWeight: '700', fontSize: 16 }
});