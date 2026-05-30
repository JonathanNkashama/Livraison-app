import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api';

const CATEGORIES_PRODUIT = [
  'Entrées', 'Plats principaux', 'Desserts', 'Boissons',
  'Sandwichs', 'Pizzas', 'Salades', 'Petit déjeuner', 'Autres'
];

export default function AddProductScreen({ navigation }) {
  const [form, setForm] = useState({
    nom: '', description: '', prix: '', categorie: 'Plats principaux'
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCategorie, setShowCategorie] = useState(false);

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const choisirPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setPhoto(result.assets[0]);
  };

  const handleAjouter = async () => {
    if (!form.nom || !form.prix) {
      return Alert.alert('Erreur', 'Le nom et le prix sont obligatoires');
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nom', form.nom);
      formData.append('description', form.description);
      formData.append('prix', form.prix);
      formData.append('categorie', form.categorie);
      if (photo) {
        formData.append('photo', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'photo.jpg'
        });
      }
      await api.post('/produits', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Alert.alert('✅ Succès', 'Produit ajouté !', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Impossible d\'ajouter');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnRetour}>
          <Text style={styles.btnRetourText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitre}>Ajouter un produit</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Photo du produit</Text>
        <TouchableOpacity style={styles.photoPicker} onPress={choisirPhoto}>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoEmoji}>📷</Text>
              <Text style={styles.photoTexte}>Ajouter une photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nom du produit *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Poulet braisé"
          value={form.nom}
          onChangeText={v => update('nom', v)}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Décrivez votre produit..."
          multiline
          value={form.description}
          onChangeText={v => update('description', v)}
        />

        <Text style={styles.label}>Prix ($) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 5.99"
          keyboardType="decimal-pad"
          value={form.prix}
          onChangeText={v => update('prix', v)}
        />

        <Text style={styles.label}>Catégorie</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowCategorie(!showCategorie)}
        >
          <Text style={styles.selectorText}>{form.categorie}</Text>
          <Text>▼</Text>
        </TouchableOpacity>

        {showCategorie && (
          <View style={styles.dropdown}>
            {CATEGORIES_PRODUIT.map(cat => (
              <TouchableOpacity
                key={cat}
                style={styles.dropdownItem}
                onPress={() => { update('categorie', cat); setShowCategorie(false); }}
              >
                <Text style={[styles.dropdownItemText, form.categorie === cat && styles.dropdownItemActif]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.btn} onPress={handleAjouter} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>✅ Ajouter le produit</Text>}
        </TouchableOpacity>
      </View>
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
  photoPicker: { borderRadius: 12, overflow: 'hidden', marginTop: 4 },
  photoPreview: { width: '100%', height: 200, borderRadius: 12 },
  photoPlaceholder: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, height: 150, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
  photoEmoji: { fontSize: 40 },
  photoTexte: { color: '#999', marginTop: 8, fontSize: 14 },
  selector: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between' },
  selectorText: { fontSize: 15, color: '#1a1a2e' },
  dropdown: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#e0e0e0', overflow: 'hidden' },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 14, color: '#1a1a2e' },
  dropdownItemActif: { color: '#2ecc71', fontWeight: '700' },
  btn: { backgroundColor: '#2ecc71', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});