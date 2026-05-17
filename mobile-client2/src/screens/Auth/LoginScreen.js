import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>🛵</Text>
          <Text style={styles.titre}>Bienvenue !</Text>
          <Text style={styles.sousTitre}>Connectez-vous pour commander</Text>
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
            <Text style={styles.lienText}>Pas encore de compte ? <Text style={styles.lienGras}>S'inscrire</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 16 },
  titre: { fontSize: 28, fontWeight: 'bold', color: '#1a1a2e' },
  sousTitre: { fontSize: 15, color: '#666', marginTop: 4 },
  form: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  input: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12,
    padding: 14, fontSize: 15, backgroundColor: '#f8f9fa', marginBottom: 8
  },
  btn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    padding: 16, alignItems: 'center', marginTop: 8
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  lien: { alignItems: 'center', marginTop: 16 },
  lienText: { color: '#666', fontSize: 14 },
  lienGras: { color: '#FF6B35', fontWeight: '700' }
});