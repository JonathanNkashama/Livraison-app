import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [showChangeMdp, setShowChangeMdp] = useState(false);
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [confirmerMdp, setConfirmerMdp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
  if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
    await logout();
  }
};

  const handleChangerMotDePasse = async () => {
    if (!ancienMdp || !nouveauMdp || !confirmerMdp) {
      return Alert.alert('Erreur', 'Remplissez tous les champs');
    }
    if (nouveauMdp !== confirmerMdp) {
      return Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
    }
    if (nouveauMdp.length < 6) {
      return Alert.alert('Erreur', 'Le mot de passe doit avoir au moins 6 caractères');
    }
    setLoading(true);
    try {
      await api.put('/auth/client/change-password', {
        ancien_mot_de_passe: ancienMdp,
        nouveau_mot_de_passe: nouveauMdp
      });
      Alert.alert('✅ Succès', 'Mot de passe modifié avec succès !');
      setShowChangeMdp(false);
      setAncienMdp('');
      setNouveauMdp('');
      setConfirmerMdp('');
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Impossible de modifier le mot de passe');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={styles.nom}>{user?.nom}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Informations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Mes informations</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoLigne}>
            <Text style={styles.infoIcon}>👤</Text>
            <View style={styles.infoTexte}>
              <Text style={styles.infoLabel}>Nom complet</Text>
              <Text style={styles.infoValeur}>{user?.nom || 'Non renseigné'}</Text>
            </View>
          </View>

          <View style={styles.separateur} />

          <View style={styles.infoLigne}>
            <Text style={styles.infoIcon}>📧</Text>
            <View style={styles.infoTexte}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValeur}>{user?.email || 'Non renseigné'}</Text>
            </View>
          </View>

          <View style={styles.separateur} />

          <View style={styles.infoLigne}>
            <Text style={styles.infoIcon}>📞</Text>
            <View style={styles.infoTexte}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValeur}>{user?.telephone || 'Non renseigné'}</Text>
            </View>
          </View>

          <View style={styles.separateur} />

          <View style={styles.infoLigne}>
            <Text style={styles.infoIcon}>🌍</Text>
            <View style={styles.infoTexte}>
              <Text style={styles.infoLabel}>Pays</Text>
              <Text style={styles.infoValeur}>{user?.pays || 'Non renseigné'}</Text>
            </View>
          </View>

          <View style={styles.separateur} />

          <View style={styles.infoLigne}>
            <Text style={styles.infoIcon}>💰</Text>
            <View style={styles.infoTexte}>
              <Text style={styles.infoLabel}>Devise</Text>
              <Text style={styles.infoValeur}>{user?.devise || 'USD'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Changer mot de passe */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.btnChangerMdp}
          onPress={() => setShowChangeMdp(!showChangeMdp)}
        >
          <Text style={styles.btnChangerMdpText}>
            🔒 {showChangeMdp ? 'Annuler' : 'Changer mon mot de passe'}
          </Text>
        </TouchableOpacity>

        {showChangeMdp && (
          <View style={styles.mdpForm}>
            <Text style={styles.mdpLabel}>Ancien mot de passe</Text>
            <TextInput
              style={styles.mdpInput}
              placeholder="••••••••"
              secureTextEntry
              value={ancienMdp}
              onChangeText={setAncienMdp}
            />

            <Text style={styles.mdpLabel}>Nouveau mot de passe</Text>
            <TextInput
              style={styles.mdpInput}
              placeholder="••••••••"
              secureTextEntry
              value={nouveauMdp}
              onChangeText={setNouveauMdp}
            />

            <Text style={styles.mdpLabel}>Confirmer le nouveau mot de passe</Text>
            <TextInput
              style={styles.mdpInput}
              placeholder="••••••••"
              secureTextEntry
              value={confirmerMdp}
              onChangeText={setConfirmerMdp}
            />

            <TouchableOpacity
              style={styles.btnConfirmerMdp}
              onPress={handleChangerMotDePasse}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnConfirmerMdpText}>Confirmer le changement</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Déconnexion */}
      <TouchableOpacity style={styles.btnDeconnexion} onPress={handleLogout}>
        <Text style={styles.btnDeconnexionText}>🚪 Se déconnecter</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#FF6B35', padding: 30, alignItems: 'center', paddingTop: 50 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 40 },
  nom: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  section: { margin: 16, marginBottom: 0 },
  sectionTitre: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 8, elevation: 2 },
  infoLigne: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoTexte: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#999' },
  infoValeur: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginTop: 2 },
  separateur: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 12 },
  btnChangerMdp: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 2, borderWidth: 1.5, borderColor: '#FF6B35' },
  btnChangerMdpText: { color: '#FF6B35', fontWeight: '700', fontSize: 15 },
  mdpForm: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 8, elevation: 2 },
  mdpLabel: { fontSize: 13, fontWeight: '600', color: '#1a1a2e', marginBottom: 4, marginTop: 8 },
  mdpInput: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10, padding: 12, fontSize: 15, backgroundColor: '#f8f9fa' },
  btnConfirmerMdp: { backgroundColor: '#FF6B35', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 16 },
  btnConfirmerMdpText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnDeconnexion: { backgroundColor: '#fce4e4', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  btnDeconnexionText: { color: '#e74c3c', fontWeight: '700', fontSize: 16 }
});