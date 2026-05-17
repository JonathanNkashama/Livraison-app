import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, Modal, FlatList
} from 'react-native';
import api from '../../api';
import PAYS_AFRIQUE from '../../data/countries';

const CATEGORIES = [
  { id: 'restaurant', label: '🍽️ Restaurant' },
  { id: 'epicerie', label: '🛒 Épicerie' },
  { id: 'boulangerie', label: '🥐 Boulangerie' },
  { id: 'boissons', label: '🥤 Boissons' },
  { id: 'pharmacie', label: '💊 Pharmacie' },
];

export default function RegisterScreen({ navigation }) {
  const [etape, setEtape] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPays, setShowPays] = useState(false);
  const [showCategorie, setShowCategorie] = useState(false);
  const [form, setForm] = useState({
    nom_etablissement: '', email: '', mot_de_passe: '',
    telephone: '', adresse: '', description: '',
    pays: 'CD', devise: 'USD', categorie: 'restaurant', code: ''
  });

  const paysSelectionne = PAYS_AFRIQUE.find(p => p.code === form.pays) || PAYS_AFRIQUE[0];
  const prefixe = paysSelectionne?.prefixe || '+243';
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const envoyerCode = async () => {
    if (!form.nom_etablissement || !form.email || !form.mot_de_passe || !form.adresse) {
      return Alert.alert('Erreur', 'Remplissez tous les champs obligatoires');
    }
    setLoading(true);
    try {
      await api.post('/auth/partenaire/send-code', {
        email: form.email,
        nom_etablissement: form.nom_etablissement
      });
      Alert.alert('✅ Code envoyé !', `Un code a été envoyé à ${form.email}`);
      setEtape(2);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Impossible d\'envoyer le code');
    }
    setLoading(false);
  };

  const finaliserInscription = async () => {
    if (!form.code) return Alert.alert('Erreur', 'Entrez le code de confirmation');
    setLoading(true);
    try {
      await api.post('/auth/partenaire/register', {
        nom_etablissement: form.nom_etablissement,
        email: form.email,
        mot_de_passe: form.mot_de_passe,
        telephone: `${prefixe}${form.telephone}`,
        adresse: form.adresse,
        description: form.description,
        categorie: form.categorie,
        pays: form.pays,
        devise: form.devise,
        code: form.code
      });
      Alert.alert(
        '🎉 Inscription envoyée !',
        'Votre dossier est en cours de validation. Vous recevrez un email dès que votre compte sera activé.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Inscription impossible');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.titre}>Devenir Partenaire</Text>
        <View style={styles.etapes}>
          <View style={[styles.etape, etape >= 1 && styles.etapeActive]}>
            <Text style={styles.etapeText}>1</Text>
          </View>
          <View style={styles.etapeLigne} />
          <View style={[styles.etape, etape >= 2 && styles.etapeActive]}>
            <Text style={styles.etapeText}>2</Text>
          </View>
        </View>
      </View>

      {etape === 1 && (
        <View style={styles.form}>
          <Text style={styles.label}>Nom de l'établissement *</Text>
          <TextInput style={styles.input} placeholder="Ex: Restaurant Chez Mama" value={form.nom_etablissement} onChangeText={v => update('nom_etablissement', v)} />

          <Text style={styles.label}>Email *</Text>
          <TextInput style={styles.input} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={v => update('email', v)} />

          <Text style={styles.label}>Mot de passe *</Text>
          <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={form.mot_de_passe} onChangeText={v => update('mot_de_passe', v)} />

          <Text style={styles.label}>Catégorie *</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowCategorie(true)}>
            <Text style={styles.selectorText}>{CATEGORIES.find(c => c.id === form.categorie)?.label || 'Choisir'}</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Pays *</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowPays(true)}>
            <Text style={styles.selectorText}>{paysSelectionne ? `${paysSelectionne.drapeau} ${paysSelectionne.nom}` : 'Choisir'}</Text>
            <Text>▼</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Téléphone *</Text>
          <View style={styles.telRow}>
            <View style={styles.prefixe}><Text style={styles.prefixeText}>{prefixe}</Text></View>
            <TextInput style={[styles.input, { flex: 1 }]} placeholder="0XXXXXXXXX" keyboardType="phone-pad" value={form.telephone} onChangeText={v => update('telephone', v)} />
          </View>

          <Text style={styles.label}>Adresse *</Text>
          <TextInput style={styles.input} placeholder="Ex: Avenue du Commerce, Kinshasa" value={form.adresse} onChangeText={v => update('adresse', v)} />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, { height: 80 }]} placeholder="Décrivez votre établissement..." multiline value={form.description} onChangeText={v => update('description', v)} />

          <TouchableOpacity style={styles.btn} onPress={envoyerCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Recevoir le code →</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.lien}>
            <Text style={styles.lienText}>Déjà partenaire ? <Text style={styles.lienGras}>Se connecter</Text></Text>
          </TouchableOpacity>
        </View>
      )}

      {etape === 2 && (
        <View style={styles.form}>
          <Text style={styles.codeInfo}>📧 Code envoyé à :</Text>
          <Text style={styles.codeEmail}>{form.email}</Text>
          <Text style={styles.label}>Code de confirmation *</Text>
          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={form.code}
            onChangeText={v => update('code', v)}
          />
          <TouchableOpacity style={styles.btn} onPress={finaliserInscription} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Confirmer l'inscription</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEtape(1)} style={styles.lien}>
            <Text style={styles.lienText}>← Modifier mes informations</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Pays */}
      <Modal visible={showPays} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitre}>Choisir un pays</Text>
          <FlatList
            data={PAYS_AFRIQUE}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => {
                update('pays', item.code);
                update('devise', item.devises?.[0]?.code || 'USD');
                setShowPays(false);
              }}>
                <Text style={styles.modalItemText}>{item.drapeau} {item.nom}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalFermer} onPress={() => setShowPays(false)}>
            <Text style={styles.modalFermerText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal Catégorie */}
      <Modal visible={showCategorie} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitre}>Choisir une catégorie</Text>
          <FlatList
            data={CATEGORIES}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => {
                update('categorie', item.id);
                setShowCategorie(false);
              }}>
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalFermer} onPress={() => setShowCategorie(false)}>
            <Text style={styles.modalFermerText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 40 },
  logo: { fontSize: 50, marginBottom: 12 },
  titre: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  etapes: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  etape: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  etapeActive: { backgroundColor: '#2ecc71' },
  etapeText: { color: '#fff', fontWeight: 'bold' },
  etapeLigne: { width: 40, height: 2, backgroundColor: '#e0e0e0' },
  form: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginTop: 8 },
  input: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: '#f8f9fa' },
  selector: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, backgroundColor: '#f8f9fa', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectorText: { fontSize: 15, color: '#1a1a2e' },
  telRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  prefixe: { backgroundColor: '#2ecc71', borderRadius: 12, padding: 14 },
  prefixeText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btn: { backgroundColor: '#2ecc71', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  lien: { alignItems: 'center', marginTop: 12 },
  lienText: { color: '#666', fontSize: 14 },
  lienGras: { color: '#2ecc71', fontWeight: '700' },
  codeInfo: { textAlign: 'center', color: '#666', fontSize: 15 },
  codeEmail: { textAlign: 'center', color: '#1a1a2e', fontWeight: 'bold', fontSize: 16, marginBottom: 16 },
  codeInput: { textAlign: 'center', fontSize: 32, fontWeight: 'bold', letterSpacing: 8 },
  modal: { flex: 1, padding: 20, paddingTop: 50 },
  modalTitre: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 16 },
  modalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalItemText: { fontSize: 16, color: '#1a1a2e' },
  modalFermer: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 12, alignItems: 'center', margin: 16 },
  modalFermerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});