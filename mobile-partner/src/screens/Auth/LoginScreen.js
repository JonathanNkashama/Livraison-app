import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !motDePasse) return Alert.alert('Erreur', 'Remplissez tous les champs');
    setLoading(true);
    try {
      await login(email.trim(), motDePasse);
    } catch (err) {
      Alert.alert('Erreur', err.response?.data?.error || 'Connexion impossible');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.titre}>Espace Partenaire</Text>
        <Text style={styles.sousTitre}>Gérez votre établissement</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="votre@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry
          value={motDePasse}
          onChangeText={setMotDePasse}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Se connecter</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.lien}>
          <Text style={styles.lienText}>Pas encore partenaire ? <Text style={styles.lienGras}>S'inscrire</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 16 },
  titre: { fontSize: 26, fontWeight: 'bold', color: '#1a1a2e' },
  sousTitre: { fontSize: 14, color: '#666', marginTop: 4 },
  form: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginTop: 8 },
  input: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 15, backgroundColor: '#f8f9fa' },
  btn: { backgroundColor: '#2ecc71', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  lien: { alignItems: 'center', marginTop: 16 },
  lienText: { color: '#666', fontSize: 14 },
  lienGras: { color: '#2ecc71', fontWeight: '700' }
});