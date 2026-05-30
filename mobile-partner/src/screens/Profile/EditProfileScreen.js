import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function EditProfileScreen({ navigation }) {
  const { partenaire, setPartenaire } = useAuth();
  const [form, setForm] = useState({
    nom_etablissement: partenaire?.nom_etablissement || '',
    telephone: partenaire?.telephone || '',
    adresse: partenaire?.adresse || '',
    description: partenaire?.description || '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSauvegarder = async () => {
    if (!form.nom_etablissement || !form.telephone || !form.adresse) {
      return Alert.alert('Erreur', 'Remplissez tous les champs obligatoires');
    }
    setLoading(true);
    try {
      const res = await api.put('/partenaires/mon-profil', form);
      setPartenaire(res.data);
      Alert.alert('✅ Succès', 'Profil mis à jour !', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Impossible de mettre à jour');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnRetour}>
          <Text style={styles.btnRetourText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitre}>✏️ Modifier le profil</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nom de l'établissement *</Text>
        <TextInput
          style={styles.input}
          value={form.nom_etablissement}
          onChangeText={v => update('nom_etablissement', v)}
          placeholder="Nom de votre établissement"
        />

        <Text style={styles.label}>Téléphone *</Text>
        <TextInput
          style={styles.input}
          value={form.telephone}
          onChangeText={v => update('telephone', v)}
          placeholder="Votre numéro de téléphone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Adresse *</Text>
        <TextInput
          style={styles.input}
          value={form.adresse}
          onChangeText={v => update('adresse', v)}
          placeholder="Votre adresse"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={form.description}
          onChangeText={v => update('description', v)}
          placeholder="Décrivez votre établissement..."
          multiline
        />

        <TouchableOpacity style={styles.btn} onPress={handleSauvegarder} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>💾 Sauvegarder</Text>}
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#2ecc71', padding: 20, paddingTop: 50 },
  btnRetour: { marginBottom: 8 },
  btnRetourText: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  headerTitre: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  form: { padding: 16, gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginTop: 8 },
  input: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: '#fff' },
  btn: { backgroundColor: '#2ecc71', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});